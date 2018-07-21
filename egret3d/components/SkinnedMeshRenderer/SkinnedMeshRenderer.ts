namespace egret3d {
    const enum ShaderType {
        SQT,
        Matrix,
    }

    const helpVec3_1: Vector3 = new Vector3();
    const helpVec3_2: Vector3 = new Vector3();
    const helpVec3_3: Vector3 = new Vector3();
    const helpVec3_4: Vector3 = new Vector3();
    const helpVec3_5: Vector3 = new Vector3();
    const helpVec3_6: Vector3 = new Vector3();
    const helpVec3_7: Vector3 = new Vector3();
    // const helpVec3_8: Vector3 = new Vector3();

    const helpMat4_1: Matrix = new Matrix();
    const helpMat4_2: Matrix = new Matrix();
    const helpMat4_3: Matrix = new Matrix();
    const helpMat4_4: Matrix = new Matrix();
    const helpMat4_5: Matrix = new Matrix();
    const helpMat4_6: Matrix = new Matrix();

    export const enum SkinnedMeshRendererEventType {
        Mesh = "mesh",
        Bones = "bones",
        Materials = "materials",
    }
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
    @paper.disallowMultipleComponent
    export class SkinnedMeshRenderer extends paper.BaseRenderer {
        /**
         * 
         */
        public static dataCaches: { key: string, data: Float32Array }[] = [];

        @paper.serializedField
        private readonly _materials: Material[] = [];

        @paper.serializedField
        private _mesh: Mesh | null = null;

        /**
         * mesh instance
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * mesh实例
         * @version paper 1.0
         * @platform Web
         * @language
         */
        public get mesh() {
            return this._mesh;
        }
        public set mesh(mesh: Mesh | null) {
            if (this._mesh === mesh) {
                return;
            }

            if (this._mesh) {
                // this._mesh.dispose(); TODO
            }

            this._mesh = mesh;
            paper.EventPool.dispatchEvent(SkinnedMeshRendererEventType.Mesh, this);
        }

        @paper.serializedField
        private readonly _bones: Transform[] = [];

        /**
         * 
         * 根骨骼
         */
        @paper.serializedField
        public rootBone: Transform;


        @paper.serializedField
        public center: Vector3 = new Vector3();


        @paper.serializedField
        public size: Vector3 = new Vector3();
        /**
         * 
         */
        public _boneDirty: boolean = true;
        private _maxBoneCount: number = 0;
        /**
         * Local [qX, qY, qZ, qW, tX, tY, tZ, 1.0, ...]
         *  
         */
        public _skeletonMatrixData: Float32Array;
        /**
         * 
         */
        public _retargetBoneNames: string[] | null = null;

        private _efficient: boolean = true; // 是否高效模式
        private cacheData: Float32Array;

        private _getMatByIndex(index: number, out: Matrix) {
            const mesh = this._mesh;
            if (!mesh) {
                return null;
            }

            const blendIndices = helpVector4E;
            mesh.getAttribute(index, gltf.MeshAttributeType.JOINTS_0, 0, blendIndices);

            if (blendIndices.x >= this._maxBoneCount || blendIndices.y >= this._maxBoneCount || blendIndices.z >= this._maxBoneCount || blendIndices.w >= this._maxBoneCount) {
                return null;
            }

            const blendWeights = helpVector4F;
            mesh.getAttribute(index, gltf.MeshAttributeType.WEIGHTS_0, 0, blendWeights);

            if (this._efficient) {
                const vec40r = helpVector4A;
                const vec30p = helpVector3A;
                vec40r.x = this._skeletonMatrixData[8 * blendIndices.x + 0]; // TODO
                vec40r.y = this._skeletonMatrixData[8 * blendIndices.x + 1];
                vec40r.z = this._skeletonMatrixData[8 * blendIndices.x + 2];
                vec40r.w = this._skeletonMatrixData[8 * blendIndices.x + 3];

                vec30p.x = this._skeletonMatrixData[8 * blendIndices.x + 4];
                vec30p.y = this._skeletonMatrixData[8 * blendIndices.x + 5];
                vec30p.z = this._skeletonMatrixData[8 * blendIndices.x + 6];

                const vec41r = helpVector4B;
                const vec31p = helpVector3B;
                vec41r.x = this._skeletonMatrixData[8 * blendIndices.y + 0];
                vec41r.y = this._skeletonMatrixData[8 * blendIndices.y + 1];
                vec41r.z = this._skeletonMatrixData[8 * blendIndices.y + 2];
                vec41r.w = this._skeletonMatrixData[8 * blendIndices.y + 3];

                vec31p.x = this._skeletonMatrixData[8 * blendIndices.y + 4];
                vec31p.y = this._skeletonMatrixData[8 * blendIndices.y + 5];
                vec31p.z = this._skeletonMatrixData[8 * blendIndices.y + 6];

                const vec42r = helpVector4C;
                const vec32p = helpVector3C;
                vec42r.x = this._skeletonMatrixData[8 * blendIndices.z + 0];
                vec42r.y = this._skeletonMatrixData[8 * blendIndices.z + 1];
                vec42r.z = this._skeletonMatrixData[8 * blendIndices.z + 2];
                vec42r.w = this._skeletonMatrixData[8 * blendIndices.z + 3];

                vec32p.x = this._skeletonMatrixData[8 * blendIndices.z + 4];
                vec32p.y = this._skeletonMatrixData[8 * blendIndices.z + 5];
                vec32p.z = this._skeletonMatrixData[8 * blendIndices.z + 6];

                const vec43r = helpVector4D;
                const vec33p = helpVector3D;
                vec43r.x = this._skeletonMatrixData[8 * blendIndices.w + 0];
                vec43r.y = this._skeletonMatrixData[8 * blendIndices.w + 1];
                vec43r.z = this._skeletonMatrixData[8 * blendIndices.w + 2];
                vec43r.w = this._skeletonMatrixData[8 * blendIndices.w + 3];

                vec33p.x = this._skeletonMatrixData[8 * blendIndices.w + 4];
                vec33p.y = this._skeletonMatrixData[8 * blendIndices.w + 5];
                vec33p.z = this._skeletonMatrixData[8 * blendIndices.w + 6];

                const mat0 = helpMatrixA;
                const mat1 = helpMatrixB;
                const mat2 = helpMatrixC;
                const mat3 = helpMatrixD;

                egret3d.Matrix.fromRTS(vec30p, Vector3.ONE, vec40r as any, mat0);
                egret3d.Matrix.fromRTS(vec31p, Vector3.ONE, vec41r as any, mat1);
                egret3d.Matrix.fromRTS(vec32p, Vector3.ONE, vec42r as any, mat2);
                egret3d.Matrix.fromRTS(vec33p, Vector3.ONE, vec43r as any, mat3);

                egret3d.Matrix.scale(blendWeights.x, mat0);
                egret3d.Matrix.scale(blendWeights.y, mat1);
                egret3d.Matrix.scale(blendWeights.z, mat2);
                egret3d.Matrix.scale(blendWeights.w, mat3);

                egret3d.Matrix.add(mat0, mat1, out);
                egret3d.Matrix.add(out, mat2, out);
                egret3d.Matrix.add(out, mat3, out);
            }
            else {
                // TODO
                // const mat0 = helpMatrixA;
                // const mat1 = helpMatrixB;
                // const mat2 = helpMatrixC;
                // const mat3 = helpMatrixD;
                // mat0.rawData = this._skeletonMatrixData.slice(16 * blendIndices.x, 16 * blendIndices.x + 16);
                // mat1.rawData = this._skeletonMatrixData.slice(16 * blendIndices.y, 16 * blendIndices.y + 16);
                // mat2.rawData = this._skeletonMatrixData.slice(16 * blendIndices.z, 16 * blendIndices.z + 16);
                // mat3.rawData = this._skeletonMatrixData.slice(16 * blendIndices.w, 16 * blendIndices.w + 16);

                // egret3d.Matrix.scale(blendWeights.x, mat0);
                // egret3d.Matrix.scale(blendWeights.y, mat1);
                // egret3d.Matrix.scale(blendWeights.z, mat2);
                // egret3d.Matrix.scale(blendWeights.w, mat3);

                // egret3d.Matrix.add(mat0, mat1, out);
                // egret3d.Matrix.add(out, mat2, out);
                // egret3d.Matrix.add(out, mat3, out);
            }

            return out;
        }

        /**
         * @inheritDoc
         */
        public initialize() {
            super.initialize();

            this.materials = this._materials;
            this.mesh = this._mesh;
            this.bones = this._bones;

            let shaderType = ShaderType.SQT;

            if (this._materials.length > 0) {
                const materialPasses = this._materials[0].getShader().passes["skin"];
                if (!materialPasses || materialPasses.length === 0) {
                    shaderType = ShaderType.Matrix;
                }
            }

            // TODO _bonePoses 应该是动态长度
            switch (shaderType) {
                case ShaderType.Matrix:
                    this._maxBoneCount = 24;
                    this._skeletonMatrixData = new Float32Array(16 * this._maxBoneCount);
                    break;

                case ShaderType.SQT:
                    this._maxBoneCount = 55;
                    this._skeletonMatrixData = new Float32Array(8 * this._maxBoneCount);

                    for (let i = 0; i < this._maxBoneCount; ++i) {
                        let iA = i * 8;
                        this._skeletonMatrixData[iA++] = 0.0;
                        this._skeletonMatrixData[iA++] = 0.0;
                        this._skeletonMatrixData[iA++] = 0.0;
                        this._skeletonMatrixData[iA++] = 1.0;
                        this._skeletonMatrixData[iA++] = 0.0;
                        this._skeletonMatrixData[iA++] = 0.0;
                        this._skeletonMatrixData[iA++] = 0.0;
                        this._skeletonMatrixData[iA++] = 1.0;
                    }
                    break;
            }

            // TODO 如果layer发生改变，需要重新刷新在renderList中的层级。 可以依赖 event
            // if (this.materials != null && this.materials.length > 0) {
            //     let _mat = this.materials[0];
            //     if (_mat) {
            //         this.layer = _mat.getLayer();
            //         if (!this.issetq) {
            //             this._queue = _mat.getQueue();
            //         }
            //     }
            // }
        }
        /**
         * @inheritDoc
         */
        public uninitialize() {
            super.uninitialize();

            if (this._mesh) {
                this._mesh.dispose();
            }

            this._bones.length = 0;
            this._mesh = null;
        }

        public serialize() {
            const target = super.serialize();
            target.center = [this.center.x, this.center.y, this.center.z];
            target.size = [this.size.x, this.size.y, this.size.z];
            target.rootBone = null;
            target._bones = [] as paper.IUUID[];
            target._mesh = this._mesh ? this._mesh.serialize() : null;
            target._materials = [] as paper.IUUID[];

            if (this.rootBone) {
                target.rootBone = { uuid: this.rootBone.uuid };
            }

            const materials = this._materials;
            target._materials.length = materials.length;
            for (let i = 0, l = materials.length; i < l; i++) {
                const material = materials[i];
                target._materials[i] = paper.createAssetReference(material);
            }

            const bones = this._bones;
            target._bones.length = bones.length;
            for (let i = 0, l = bones.length; i < l; i++) {
                const bone = bones[i];
                target._bones[i] = { uuid: bone.uuid };
            }

            return target;
        }

        public deserialize(element: any) {
            super.deserialize(element);

            this.center.deserialize(element.center);
            this.size.deserialize(element.size);

            if (element._mesh) {
                this._mesh = new (Mesh as any)(); //
                (this._mesh as Mesh).deserialize(element._mesh);
            }

            if (element.rootBone) {
                this.rootBone = paper.getDeserializedAssetOrComponent(element.rootBone) as egret3d.Transform;
            }

            this._materials.length = 0;
            if (element._materials) {
                for (let i = 0, l = element._materials.length; i < l; i++) {
                    this._materials.push(paper.getDeserializedAssetOrComponent(element._materials[i]) as Material);
                }
            }

            this._bones.length = 0;
            if (element._bones) {
                for (let i = 0, l = element._bones.length; i < l; i++) {
                    this._bones.push(paper.getDeserializedAssetOrComponent(element._bones[i]) as egret3d.Transform);
                }
            }
        }
        /**
         * ray intersects
         * @param ray ray
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 射线检测
         * @param ray 射线
         * @version paper 1.0
         * @platform Web
         * @language
         */
        public intersects(ray: Ray) {
            const mesh = this._mesh;
            if (!mesh) {
                return null;
            }

            const mvpmat = this.gameObject.transform.getWorldMatrix();
            let pickinfo = null;
            // let data = this.mesh.data;
            let subMeshIndex = 0;
            for (const primitive of mesh.glTFMesh.primitives) {
                const mat0 = helpMat4_1;
                const mat1 = helpMat4_2;
                const mat2 = helpMat4_3;
                const mat00 = helpMat4_4;
                const mat11 = helpMat4_5;
                const mat22 = helpMat4_6;
                const indices = mesh.getIndices(subMeshIndex);

                if (indices) {
                    const t0 = helpVec3_1;
                    const t1 = helpVec3_2;
                    const t2 = helpVec3_3;
                    const vertices = mesh.getVertices(subMeshIndex);


                    for (let i = 0; i < indices.length; i += 3) {
                        // TODO
                        const verindex0 = indices[i];
                        const verindex1 = indices[i + 1];
                        const verindex2 = indices[i + 2];
                        const p0 = helpVec3_4;
                        const p1 = helpVec3_5;
                        const p2 = helpVec3_6;

                        let index = indices[i] * 3;
                        Vector3.set(vertices[index], vertices[index + 1], vertices[index + 2], p0);
                        index = indices[i + 1] * 3;
                        Vector3.set(vertices[index], vertices[index + 1], vertices[index + 2], p1);
                        index = indices[i + 2] * 3;
                        Vector3.set(vertices[index], vertices[index + 1], vertices[index + 2], p2);

                        this._getMatByIndex(verindex0, mat0);
                        this._getMatByIndex(verindex1, mat1);
                        this._getMatByIndex(verindex2, mat2);
                        if (mat0 === null || mat1 === null || mat2 === null) continue;

                        egret3d.Matrix.multiply(mvpmat, mat0, mat00);
                        egret3d.Matrix.multiply(mvpmat, mat1, mat11);
                        egret3d.Matrix.multiply(mvpmat, mat2, mat22);

                        egret3d.Matrix.transformVector3(p0, mat00, t0);
                        egret3d.Matrix.transformVector3(p1, mat11, t1);
                        egret3d.Matrix.transformVector3(p2, mat22, t2);

                        const result = ray.intersectsTriangle(t0, t1, t2);
                        if (result) {
                            if (result.distance < 0) continue;
                            if (!pickinfo || pickinfo.distance > result.distance) {
                                pickinfo = result;
                                pickinfo.triangleIndex = i / 3;
                                pickinfo.subMeshIndex = subMeshIndex;
                                const tdir = helpVec3_7;
                                egret3d.Vector3.copy(ray.direction, tdir);
                                egret3d.Vector3.scale(tdir, result.distance);
                                egret3d.Vector3.add(ray.origin, tdir, pickinfo.position);
                            }
                        }
                    }
                }

                subMeshIndex++;
            }

            return pickinfo;
        }
        /**
         * material list
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 材质数组
         * @version paper 1.0
         * @platform Web
         * @language
         */
        public get materials(): ReadonlyArray<Material> {
            return this._materials;
        }
        public set materials(value: ReadonlyArray<Material>) {
            if (value !== this._materials) {
                for (const material of value) {
                    this._materials.push(material);
                }
            }

            paper.EventPool.dispatchEvent(SkinnedMeshRendererEventType.Materials, this);
        }
        /**
         * 骨骼列表
         * 
         */
        public get bones(): ReadonlyArray<Transform> {
            return this._bones;
        }
        public set bones(value: ReadonlyArray<Transform>) {
            if (value !== this._bones) {
                this._bones.length = 0;
                for (const bone of value) {
                    this._bones.push(bone);
                }
            }
        }
        /**
         * 
         */
        public get boneBuffer(): Readonly<Float32Array> {
            return this.cacheData || this._skeletonMatrixData;
        }
    }
}
