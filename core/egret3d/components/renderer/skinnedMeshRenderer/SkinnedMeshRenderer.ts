namespace egret3d {
    const _helpVector3A = Vector3.create();
    const _helpVector3B = Vector3.create();
    const _helpVector3C = Vector3.create();
    const _helpMatrix = Matrix4.create();

    /**
     * 蒙皮网格渲染组件。
     */
    @paper.requireComponent(Transform)
    export class SkinnedMeshRenderer extends MeshRenderer {
        /**
         * 当蒙皮网格渲染组件的网格资源改变时派发事件。
         */
        public static readonly onMeshChanged: signals.Signal<SkinnedMeshRenderer> = new signals.Signal();
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
        public boneTexture: Texture | null = null;
        /**
         * 
         */
        public source: SkinnedMeshRenderer | null = null;

        private _skinnedDirty: boolean = true;
        private readonly _bones: (Transform | null)[] = [];
        /**
         * 废弃该属性，改用 MeshFilter 。
         */
        private _mesh: Mesh | null = null;
        private _rootBone: Transform | null = null;
        private _skinnedVertices: Float32Array | null = null;
        /**
         * @internal
         */
        public _retargetBoneNames: string[] | null = null;

        protected _getlocalBoundingBox(): Readonly<Box> | null {
            const mesh = this._mesh;

            return mesh !== null ? mesh.boundingBox : null;
        }

        private _skinning(vertexOffset: uint, vertexCount: uint) {
            if (this._skinnedDirty) {
                const mesh = this._mesh!;
                const boneMatrices = this.boneMatrices!;

                const p0 = _helpVector3A;
                const p1 = _helpVector3B;
                const p2 = _helpVector3C;
                const vertices = mesh.getVertices()!;
                const indices = mesh.getIndices()!;
                const joints = mesh.getAttribute(gltf.AttributeSemantics.JOINTS_0) as Float32Array;
                const weights = mesh.getAttribute(gltf.AttributeSemantics.WEIGHTS_0) as Float32Array;

                if (this._skinnedVertices === null) {
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

                if (vertexCount === indices.length) {
                    this._skinnedDirty = false;
                }
            }

            return this._skinnedVertices!;
        }
        /**
         * @internal
         */
        public _update() {
            const mesh = this._mesh;
            const boneMatrices = this.boneMatrices;

            if (mesh !== null && !mesh.isDisposed && boneMatrices !== null) {
                // TODO cache 剔除，脏标记。
                // TODO bind to GPU
                const bones = this._bones;
                const inverseBindMatrices = mesh.inverseBindMatrices!;

                for (let i = 0, l = bones.length; i < l; ++i) {
                    const offset = i * 16;
                    const bone = bones[i];
                    const matrix = bone !== null ? bone.localToWorldMatrix : Matrix4.IDENTITY;
                    _helpMatrix.fromArray(inverseBindMatrices as any, offset).premultiply(matrix).toArray(boneMatrices, offset);
                }

                if (this.boneTexture !== null) {
                    this.boneTexture.setSource(boneMatrices);
                }

                if (this.forceCPUSkin) {
                    // this._skinning(0, 0); TODO
                }

                this._skinnedDirty = true;

                return true;
            }
        }
        /**
         * @internal
         */
        public initialize(reset?: boolean) {
            super.initialize();

            if (!reset) {
                return;
            }

            // TODO cache 剔除，脏标记。
            this._bones.length = 0;
            this.rootBone = null;
            this.boneMatrices = null;

            const mesh = this._mesh;
            const parent = this.gameObject.transform.parent;
            const bones = this._bones;

            if (mesh !== null && parent !== null) {
                const config = mesh.config;
                const [skin] = config.skins!;
                const children = parent.getChildren({}) as { [key: string]: Transform | (Transform[]) };

                if (skin.skeleton !== undefined) {
                    const rootNode = config.nodes![skin.skeleton];
                    if (rootNode.name! in children) {
                        const transforms = children[rootNode.name!];
                        this.rootBone = Array.isArray(transforms) ? transforms[0] : transforms;
                    }
                }

                for (const joint of skin.joints) {
                    const node = config.nodes![joint];

                    if (node.name! in children) {
                        const transforms = children[node.name!];
                        bones.push(Array.isArray(transforms) ? transforms[0] : transforms);
                    }
                    else {
                        bones.push(null);
                    }
                }

                if (renderState.textureFloatEnabled) {
                    this.boneMatrices = new Float32Array((bones.length + 1) * 16);
                    this.boneTexture = Texture.create({
                        source: this.boneMatrices,
                        width: (bones.length + 1) * 4, height: 1,
                        type: gltf.ComponentType.Float
                    }).retain();
                }
                else {
                    this.boneMatrices = new Float32Array(bones.length * 16);

                    if (bones.length > renderState.maxBoneCount) {
                        this.forceCPUSkin = true;
                        console.warn("The bone count of this mesh has exceeded the maxBoneCount and will use the forced CPU skin.", mesh.name);
                    }
                }

                this._update();
            }
        }
        /**
         * @internal
         */
        public uninitialize() {
            if (this._mesh !== null) {
                this._mesh.release();
            }

            if (this.boneTexture !== null) {
                this.boneTexture.release();
                this.boneTexture.dispose();
            }

            const boundingTransform = this.getBoundingTransform();

            if (boundingTransform !== null) {
                boundingTransform.unregisterObserver(this);
            }

            super.uninitialize();

            this.boneMatrices = null;
            this.boneTexture = null;

            this._bones.length = 0;
            this._mesh = null;
            this._skinnedVertices = null;
            this._rootBone = null;
            this._retargetBoneNames = null;
        }
        /**
         * @internal
         */
        public getBoundingTransform() {
            const rootBone = this._rootBone;

            return rootBone !== null ? rootBone : super.getBoundingTransform();
        }
        /**
         * 实时获取网格资源的指定三角形顶点位置。
         * - 采用 CPU 蒙皮指定顶点。
         */
        public getTriangle(triangleIndex: uint, output: Triangle | null = null): Triangle {
            if (output === null) {
                output = Triangle.create();
            }

            const mesh = this._mesh;

            if (mesh !== null && !mesh.isDisposed && this.boneMatrices !== null) {
                mesh.getTriangle(triangleIndex, output, this._skinning(triangleIndex * 3, 3));
            }

            return output;
        }

        public raycast(ray: Readonly<Ray>, raycastInfo: RaycastInfo | null = null) {
            const mesh = this._mesh;

            if (mesh === null || mesh.isDisposed || this.boneMatrices === null) {
                return false;
            }

            const localRay = helpRay.applyMatrix(this.getBoundingTransform().worldToLocalMatrix, ray);

            if (this.localBoundingBox.raycast(localRay) && mesh.raycast(ray, raycastInfo, this.forceCPUSkin ? null : this._skinning(0, 0)!)) {
                if (raycastInfo !== null) {
                    raycastInfo.transform = this.entity.getComponent(Transform);
                }

                return true;
            }

            return false;
        }
        /**
         * 该组件的骨骼数量。
         */
        @paper.editor.property(paper.editor.EditType.UINT, { readonly: true })
        public get boneCount(): uint {
            return this._bones.length;
        }
        /**
         * 该组件的骨骼列表。
         */
        public get bones(): ReadonlyArray<Transform | null> {
            return this._bones;
        }
        /**
         * 该组件的根骨骼。
         */
        public get rootBone(): Transform | null {
            return this._rootBone;
        }
        public set rootBone(value: Transform | null) {
            if (this._rootBone === value) {
                return;
            }

            this.getBoundingTransform().unregisterObserver(this);
            this._rootBone = value;
            this.getBoundingTransform().registerObserver(this);
        }
        /**
         * 该组件的网格资源。
         */
        @paper.editor.property(paper.editor.EditType.MESH)
        @paper.serializedField("_mesh")
        public get mesh(): Mesh | null {
            return this._mesh;
        }
        public set mesh(value: Mesh | null) {
            if (
                value !== null &&
                (
                    // value.config.scenes === undefined || TODO
                    value.config.nodes === undefined || value.config.skins === undefined
                )
            ) {
                console.warn("Invalid skinned mesh.", value.name);
                return;
            }

            if (this._mesh === value) {
                return;
            }

            if (this._mesh !== null) {
                this._mesh.release();
            }

            if (value !== null) {
                value.retain();

                this.localBoundingBox = value.boundingBox;
            }

            this._mesh = value;

            SkinnedMeshRenderer.onMeshChanged.dispatch(this);
        }
    }
}
