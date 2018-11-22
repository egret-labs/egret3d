namespace egret3d {
    const _helpVector3A = Vector3.create();
    const _helpVector3B = Vector3.create();
    const _helpVector3C = Vector3.create();
    const _helpMatrix = Matrix4.create();

    /**
     * 蒙皮网格渲染组件。
     */
    export class SkinnedMeshRenderer extends MeshRenderer {
        /**
         * 当蒙皮网格渲染组件的网格资源改变时派发事件。
         */
        public static readonly onMeshChanged: signals.Signal = new signals.Signal();
        /**
         * 强制使用 cpu 蒙皮。
         * - 骨骼数超过硬件支持的最大骨骼数量，或顶点权重大于 4 个，需要使用 CPU 蒙皮。
         * - CPU 蒙皮性能较低，仅是兼容方案，应合理的控制骨架的最大骨骼数量。
         */
        public forceCPUSkin: boolean = false;
        /**
         * 
         */
        public boneMatrices: Float32Array | null = null;

        private readonly _bones: (Transform | null)[] = [];
        private _rootBone: Transform | null = null;
        /**
         * @internal
         */
        public _retargetBoneNames: string[] | null = null;
        @paper.serializedField
        private _mesh: Mesh | null = null;
        /**
         * @internal
         */
        public _update() {
            // TODO cache 剔除，脏标记。
            const mesh = this._mesh!;
            const bones = this._bones;
            const inverseBindMatrices = mesh._inverseBindMatrices!;
            const boneMatrices = this.boneMatrices!;

            for (let i = 0, l = bones.length; i < l; ++i) {
                const offset = i * 16;
                const bone = bones[i];
                const matrix = bone ? bone.localToWorldMatrix : Matrix4.IDENTITY;
                _helpMatrix.fromArray(inverseBindMatrices, offset).premultiply(matrix).toArray(boneMatrices, offset);
            }

            if (this.forceCPUSkin) {
                const vA = _helpVector3A;
                const vB = _helpVector3B;
                const vC = _helpVector3C;
                const mA = _helpMatrix;

                const indices = mesh.getIndices()!;
                const vertices = mesh.getVertices()!;
                const joints = mesh.getAttributes(gltf.MeshAttributeType.JOINTS_0)!;
                const weights = mesh.getAttributes(gltf.MeshAttributeType.WEIGHTS_0)!;

                if (!mesh._rawVertices) {
                    mesh._rawVertices = new Float32Array(vertices.length);
                    mesh._rawVertices.set(vertices);
                }

                for (const index of <any>indices as number[]) {
                    const vertexIndex = index * 3;
                    const jointIndex = index * 4;
                    vA.fromArray(mesh._rawVertices, vertexIndex);
                    vB.clear();

                    for (let i = 0; i < 4; ++i) {
                        const weight = weights![jointIndex + i];
                        if (weight <= 0.01) {
                            continue;
                        }

                        vB.add(vC.applyMatrix(mA.fromArray(boneMatrices, joints![jointIndex + i] * 16), vA).multiplyScalar(weight));
                    }

                    vB.toArray(vertices, vertexIndex);
                }

                mesh.uploadVertexBuffer();

            }
        }

        public initialize(reset?: boolean) {
            super.initialize();

            if (!reset) {
                return;
            }

            // TODO cache 剔除，脏标记。
            this._bones.length = 0;
            this._rootBone = null;
            this.boneMatrices = null;

            if (this._mesh) {
                const config = this._mesh.config;
                const skin = config.skins![0];
                const children = this.gameObject.transform.parent!.getAllChildren({}) as { [key: string]: Transform | (Transform[]) };

                if (skin.skeleton !== undefined) {
                    const rootNode = config.nodes![skin.skeleton];
                    if (rootNode.name! in children) {
                        const transforms = children[rootNode.name!];
                        this._rootBone = Array.isArray(transforms) ? transforms[0] : transforms;
                    }
                }

                for (const joint of skin.joints) {
                    const node = config.nodes![joint];

                    if (node.name! in children) {
                        const transforms = children[node.name!];
                        this._bones.push(Array.isArray(transforms) ? transforms[0] : transforms);
                    }
                    else {
                        this._bones.push(null);
                    }
                }

                this.boneMatrices = new Float32Array(this._bones.length * 16);

                if (this._bones.length > SkinnedMeshRendererSystem.maxBoneCount) {
                    this.forceCPUSkin = true;
                    console.warn("The bone count of this mesh has exceeded the maxBoneCount and will use the forced CPU skin.", this._mesh.name);
                }
                // this._update(); TODO
            }
        }

        public uninitialize() {
            super.uninitialize();

            // TODO
            if (this._mesh) {
                // this._mesh.dispose();
            }

            this._bones.length = 0;
            this._rootBone = null;
            this.boneMatrices = null;
            this._retargetBoneNames = null;
            this._mesh = null;
        }

        public recalculateLocalBox() {
            // TODO 蒙皮网格的 aabb 需要能自定义，或者强制更新。
            if (this._mesh) {
                this._localBoundingBox.clear();

                const vertices = this._mesh._rawVertices || this._mesh.getVertices()!; // T pose mesh aabb.
                const position = helpVector3A;

                for (let i = 0, l = vertices.length; i < l; i += 3) {
                    position.set(vertices[i], vertices[i + 1], vertices[i + 2]);
                    this._localBoundingBox.add(position);
                }
            }
        }
        /**
         * 实时获取网格资源的指定三角形顶点位置。
         * - 采用 CPU 蒙皮指定顶点。
         */
        public getTriangle(triangleIndex: uint, triangle?: Triangle): Triangle {
            if (!triangle) {
                triangle = Triangle.create();
            }

            const mesh = this._mesh;
            if (!mesh) {
                return triangle;
            }

            const boneMatrices = this.boneMatrices!;
            const indices = mesh.getIndices()!;
            const vertices = mesh._rawVertices || mesh.getVertices()!;
            const joints = mesh.getAttributes(gltf.MeshAttributeType.JOINTS_0)!;
            const weights = mesh.getAttributes(gltf.MeshAttributeType.WEIGHTS_0)!;

            const vA = _helpVector3A;
            const vB = _helpVector3B;
            const vC = _helpVector3C;

            for (let i = 0; i < 3; ++i) {
                const index = indices[triangleIndex * 3 + i];
                const vertexIndex = index * 3;
                const jointIndex = index * 4;

                vA.fromArray(vertices, vertexIndex);
                vB.clear();

                for (let i = 0; i < 4; ++i) {
                    const weight = weights![jointIndex + i];
                    if (weight <= 0.01) {
                        continue;
                    }

                    vB.add(vC.applyMatrix(_helpMatrix.fromArray(boneMatrices, joints![jointIndex + i] * 16), vA).multiplyScalar(weight));
                }

                switch (i) {
                    case 0:
                        triangle.a.copy(vB);
                        break;

                    case 1:
                        triangle.b.copy(vB);
                        break;

                    case 2:
                        triangle.c.copy(vB);
                        break;
                }
            }

            return triangle;
        }

        public raycast(p1: Readonly<egret3d.Ray>, p2?: boolean | egret3d.RaycastInfo, p3?: boolean) {
            if (!this._mesh) {
                return false;
            }

            let raycastMesh = false;
            let raycastInfo: egret3d.RaycastInfo | undefined = undefined;
            const transform = this.gameObject.transform;
            const localRay = helpRay.applyMatrix(transform.worldToLocalMatrix, p1);
            const localBoundingBox = this.localBoundingBox;

            if (p2) {
                if (p2 === true) {
                    raycastMesh = true;
                }
                else {
                    raycastMesh = p3 || false;
                    raycastInfo = p2;
                }
            }

            if (raycastMesh) {
                if (localBoundingBox.raycast(localRay) && this._mesh.raycast(p1, raycastInfo, this.forceCPUSkin ? null : this.boneMatrices)) {
                    if (raycastInfo) {
                        raycastInfo.transform = transform;
                    }

                    return true;
                }
            }
            else if (localBoundingBox.raycast(localRay, raycastInfo)) {
                if (raycastInfo) { // Update local raycast info to world.
                    raycastInfo.distance = p1.origin.getDistance(raycastInfo.position.applyMatrix(transform.localToWorldMatrix));
                    raycastInfo.transform = transform;
                }

                return true;
            }

            return false;
        }
        /**
         * 该渲染组件的骨骼列表。
         */
        public get bones(): ReadonlyArray<Transform | null> {
            return this._bones;
        }
        /**
         * 该渲染组件的根骨骼。
         */
        public get rootBone() {
            return this._rootBone;
        }
        /**
         * 该渲染组件的网格资源。
         */
        public get mesh() {
            return this._mesh;
        }
        public set mesh(mesh: Mesh | null) {
            if (mesh && !mesh.config.scenes && !mesh.config.nodes && !mesh.config.skins) {
                console.warn("Invalid skinned mesh.", mesh.name);
                return;
            }

            if (this._mesh === mesh) {
                return;
            }

            if (this._mesh) {
                // this._mesh.dispose(); TODO
            }

            this._mesh = mesh;
            SkinnedMeshRenderer.onMeshChanged.dispatch(this);
        }
    }
}
