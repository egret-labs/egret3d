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
        /**
         * 
         */
        public source: SkinnedMeshRenderer | null = null;

        private _skinnedDirty: boolean = true;
        private readonly _bones: (Transform | null)[] = [];
        private _rootBone: Transform | null = null;
        /**
         * @internal
         */
        public _retargetBoneNames: string[] | null = null;
        private _mesh: Mesh | null = null;
        private _skinnedVertices: Float32Array | null = null;

        private _skinning(vertexOffset: uint, vertexCount: uint) {
            if (this._skinnedDirty) {
                const mesh = this._mesh!;
                const boneMatrices = this.boneMatrices!;

                const p0 = _helpVector3A;
                const p1 = _helpVector3B;
                const p2 = _helpVector3C;
                const vertices = mesh.getVertices()!;
                const indices = mesh.getIndices()!;
                const joints = mesh.getAttributes(gltf.AttributeSemanticType.JOINTS_0) as Float32Array;
                const weights = mesh.getAttributes(gltf.AttributeSemanticType.WEIGHTS_0) as Float32Array;

                if (!this._skinnedVertices) {
                    this._skinnedVertices = new Float32Array(vertices.length);
                }

                if (vertexCount === 0) {
                    vertexCount = indices.length;
                }
                else {
                    vertexCount += vertexOffset;
                }

                for (let i = vertexOffset; i < vertexCount; ++i) {
                    const index = indices[i];
                    const vertexIndex = index * 3;
                    const jointIndex = index * 4;
                    p0.fromArray(vertices, vertexIndex);
                    p1.clear();

                    for (let i = 0; i < 4; ++i) {
                        const weight = weights![jointIndex + i];
                        if (weight <= 0.01) {
                            continue;
                        }

                        p1.add(p2.applyMatrix(_helpMatrix.fromArray(boneMatrices, joints![jointIndex + i] * 16), p0).multiplyScalar(weight));
                    }

                    p1.toArray(this._skinnedVertices, vertexIndex);
                }

                this._skinnedDirty = false;
            }

            return this._skinnedVertices!;
        }
        /**
         * @internal
         */
        public _update() {
            const boneMatrices = this.boneMatrices;
            if (boneMatrices) {
                // TODO cache 剔除，脏标记。
                // TODO bind to GPU
                const mesh = this._mesh!;
                const bones = this._bones;
                const inverseBindMatrices = mesh.inverseBindMatrices!;

                for (let i = 0, l = bones.length; i < l; ++i) {
                    const offset = i * 16;
                    const bone = bones[i];
                    const matrix = bone ? bone.localToWorldMatrix : Matrix4.IDENTITY;
                    _helpMatrix.fromArray(inverseBindMatrices, offset).premultiply(matrix).toArray(boneMatrices, offset);
                }

                if (this.forceCPUSkin) {
                    // this._skinning(0, 0); TODO
                }

                this._skinnedDirty = true;
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

                if (this._bones.length > renderState.maxBoneCount) {
                    this.forceCPUSkin = true;
                    console.warn("The bone count of this mesh has exceeded the maxBoneCount and will use the forced CPU skin.", this._mesh.name);
                }
                // this._update(); TODO
            }
        }

        public uninitialize() {
            super.uninitialize();

            if (this._mesh) {
                this._mesh.release();
            }

            this.boneMatrices = null;

            this._bones.length = 0;
            this._rootBone = null;
            this._retargetBoneNames = null;
            this._mesh = null;
            this._skinnedVertices = null;
        }

        public recalculateLocalBox() {
            // TODO 蒙皮网格的 aabb 需要能自定义，或者强制更新。
            const mesh = this._mesh;
            if (mesh) {
                this._localBoundingBox.clear();

                const vertices = mesh.getVertices()!; // T pose mesh aabb.
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
        public getTriangle(triangleIndex: uint, out?: Triangle): Triangle {
            if (!out) {
                out = Triangle.create();
            }

            const mesh = this._mesh;
            const boneMatrices = this.boneMatrices;

            if (mesh && boneMatrices) {
                mesh.getTriangle(triangleIndex, out, this._skinning(triangleIndex * 3, 3));
            }

            return out;
        }

        public raycast(p1: Readonly<egret3d.Ray>, p2?: boolean | egret3d.RaycastInfo, p3?: boolean) {
            const mesh = this._mesh;
            const boneMatrices = this.boneMatrices;
            if (!mesh || !boneMatrices) {
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
                if (localBoundingBox.raycast(localRay) && mesh.raycast(p1, raycastInfo, this.forceCPUSkin ? null : this._skinning(0, 0)!)) {
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
        @paper.editor.property(paper.editor.EditType.MESH)
        @paper.serializedField("_mesh")
        public get mesh(): Mesh | null {
            return this._mesh;
        }
        public set mesh(value: Mesh | null) {
            if (value && !value.config.scenes && !value.config.nodes && !value.config.skins) {
                console.warn("Invalid skinned mesh.", value.name);
                return;
            }

            if (this._mesh === value) {
                return;
            }

            if (this._mesh) {
                this._mesh.release();
            }

            this._mesh = value;

            if (this._mesh) {
                this._mesh.retain();
            }

            SkinnedMeshRenderer.onMeshChanged.dispatch(this);
        }
    }
}
