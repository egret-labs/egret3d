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
        private readonly _bones: (Transform | null)[] = [];
        private _rootBone: Transform | null = null;
        private _inverseBindMatrices: Float32Array | null = null;
        /**
         * @internal
         */
        public _boneMatrices: Float32Array | null = null;
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
            const boneMatrices = this._boneMatrices!;

            for (let i = 0, l = bones.length; i < l; ++i) {
                const offset = i * 16;
                const bone = bones[i];
                const matrix = bone ? bone.getWorldMatrix() : Matrix4.IDENTITY;
                _helpMatrix.fromArray(inverseBindMatrices, offset).premultiply(matrix).toArray(boneMatrices, offset);
            }
        }

        public initialize(reset?: boolean) {
            super.initialize(reset);

            if (!reset) {
                return;
            }

            //bindMatrix
            //bindMatrixInverse
            //boneMatrices

            this._bones.length = 0;
            this._rootBone = null;
            this._boneMatrices = null;
            this._inverseBindMatrices = null;

            if (this._mesh) {
                // TODO 
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

                this._boneMatrices = new Float32Array(this._bones.length * 16);

                if (skin.inverseBindMatrices !== undefined) {
                    this._inverseBindMatrices = this._mesh.createTypeArrayFromAccessor(this._mesh.getAccessor(skin.inverseBindMatrices));
                }
                else {
                    let index = 0;
                    this._inverseBindMatrices = new Float32Array(this._bones.length * 16);

                    for (const bone of this._bones) {
                        if (bone) {
                            _helpMatrix.inverse(bone.getWorldMatrix());
                        }
                        else {
                            _helpMatrix.identity();
                        }

                        for (let i = 0; i < 16; ++i) {
                            this._inverseBindMatrices[index++] = _helpMatrix.rawData[i];
                        }
                    }
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
            this._boneMatrices = null;
            this._inverseBindMatrices = null;
            this._retargetBoneNames = null;
            this._mesh = null;
        }

        public recalculateAABB() {
            // TODO
            if (this._mesh) {
                this.aabb.clear();

                const vertices = this._mesh.getVertices()!; // T pose mesh aabb.
                const position = helpVector3A;

                for (let i = 0, l = vertices.length; i < l; i += 3) {
                    position.set(vertices[i], vertices[i + 1], vertices[i + 2]);
                    this.aabb.add(position);
                }
            }
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
