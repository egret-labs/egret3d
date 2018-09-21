namespace egret3d {
    const _helpMatrix = Matrix4.create();
    /**
     * Skinned Mesh Renderer Component
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 蒙皮网格的渲染组件
     * @version paper 1.0
     * @platform Web
     * @language
     */
    export class SkinnedMeshRenderer extends MeshRenderer {
        /**
         * 
         */
        public boneMatrices: Float32Array | null = null;

        private readonly _bones: (Transform | null)[] = [];
        private _rootBone: Transform | null = null;
        private _inverseBindMatrices: Float32Array | null = null;
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
            const bones = this._bones;
            const inverseBindMatrices = this._inverseBindMatrices!;
            const boneMatrices = this.boneMatrices!;

            for (let i = 0, l = bones.length; i < l; ++i) {
                const offset = i * 16;
                const bone = bones[i];
                const matrix = bone ? bone.getWorldMatrix() : Matrix4.IDENTITY;
                _helpMatrix.fromArray(inverseBindMatrices, offset).premultiply(matrix).toArray(boneMatrices, offset);
            }

            // {
            //     const vA = Vector3.create();
            //     const vB = Vector3.create();
            //     const vC = Vector3.create();
            //     const mA = Matrix4.create();

            //     const indices = this._mesh.getIndices()!;
            //     const vertices = this._mesh.getVertices()!;
            //     const joints = this._mesh.getAttributes(gltf.MeshAttributeType.JOINTS_0)! as Float32Array;
            //     const weights = this._mesh.getAttributes(gltf.MeshAttributeType.WEIGHTS_0)! as Float32Array;

            //     if (!this._rawVertices) {
            //         this._rawVertices = new Float32Array(vertices.length);
            //         this._rawVertices.set(vertices);
            //     }

            //     for (const index of <any>indices as number[]) {
            //         vA.fromArray(this._rawVertices, index * 3);
            //         vB.set(0.0, 0.0, 0.0).add(
            //             vC.applyMatrix(mA.fromArray(boneMatrices, joints[index * 4 + 0] * 16), vA).multiplyScalar(weights[index * 4 + 0])
            //         ).add(
            //             vC.applyMatrix(mA.fromArray(boneMatrices, joints[index * 4 + 1] * 16), vA).multiplyScalar(weights[index * 4 + 1])
            //         ).add(
            //             vC.applyMatrix(mA.fromArray(boneMatrices, joints[index * 4 + 2] * 16), vA).multiplyScalar(weights[index * 4 + 2])
            //         ).add(
            //             vC.applyMatrix(mA.fromArray(boneMatrices, joints[index * 4 + 3] * 16), vA).multiplyScalar(weights[index * 4 + 3])
            //         ).toArray(vertices, index * 3);
            //     }

            //     this._mesh.uploadVertexBuffer();
            // }
        }

        public initialize(reset?: boolean) {
            super.initialize(reset);

            if (!reset) {
                return;
            }

            this._bones.length = 0;
            this._rootBone = null;
            this.boneMatrices = null;
            this._inverseBindMatrices = null;

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

                this._inverseBindMatrices = this._mesh.createTypeArrayFromAccessor(this._mesh.getAccessor(skin.inverseBindMatrices!));
                this.boneMatrices = new Float32Array(this._bones.length * 16);

                if (this._bones.length > SkinnedMeshRendererSystem.maxBoneCount) {
                    // TODO
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
            this._inverseBindMatrices = null;
            this._retargetBoneNames = null;
            this._mesh = null;
        }

        public recalculateAABB() {
            // TODO
            if (this._mesh) {
                this._aabb.clear();

                const vertices = this._mesh.getVertices()!; // T pose mesh aabb.
                const position = helpVector3A;

                for (let i = 0, l = vertices.length; i < l; i += 3) {
                    position.set(vertices[i], vertices[i + 1], vertices[i + 2]);
                    this._aabb.add(position);
                }
            }
        }

        public raycast(p1: Readonly<egret3d.Ray>, p2?: boolean | egret3d.RaycastInfo, p3?: boolean) {
            if (!this._mesh) {
                return false;
            }

            let raycastMesh = false;
            let raycastInfo: egret3d.RaycastInfo | undefined = undefined;
            const worldMatrix = this.gameObject.transform.worldMatrix;
            const localRay = MeshRenderer._helpRay.applyMatrix(_helpMatrix.inverse(worldMatrix), p1); // TODO transform inverse world matrix.
            const aabb = this.aabb;

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
                return aabb.raycast(localRay) && this._mesh.raycast(p1, raycastInfo, this.boneMatrices);
            }
            else if (aabb.raycast(localRay, raycastInfo)) {
                if (raycastInfo) { // Update local raycast info to world.
                    raycastInfo.position.applyMatrix(worldMatrix);
                    raycastInfo.distance = p1.origin.getDistance(raycastInfo.position);
                }

                return true;
            }

            return false;
        }

        public get bones(): ReadonlyArray<Transform | null> {
            return this._bones;
        }

        public get rootBone() {
            return this._rootBone;
        }
        /**
         * 
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
            paper.EventPool.dispatchEvent(MeshFilterEventType.Mesh, this);
        }
    }
}
