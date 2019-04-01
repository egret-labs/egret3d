namespace egret3d {
    /**
     * 网格渲染组件。
     * - 用于渲染网格筛选组件提供的网格资源。
     */
    @paper.requireComponent(Transform)
    @paper.requireComponent(MeshFilter)
    export class MeshRenderer extends paper.BaseRenderer {

        protected _lightmapIndex: int = -1;
        /**
         * 如果该属性合并到 UV2 中，会破坏网格共享，共享的网格无法拥有不同的 lightmap UV。
         */
        @paper.serializedField
        protected readonly _lightmapScaleOffset: Vector4 = Vector4.create();

        protected _getlocalBoundingBox(): Readonly<Box> | null {
            const { mesh } = this.entity.getComponent(MeshFilter)!;

            return mesh !== null ? mesh.boundingBox : null;
        }
        /**
         * 实时获取网格资源的指定三角形顶点位置。
         * @param triangleIndex 三角形索引。
         * @param output 
         */
        public getTriangle(triangleIndex: uint, output: Triangle | null = null): Triangle {
            if (output === null) {
                output = Triangle.create();
            }

            const { mesh } = this.entity.getComponent(MeshFilter)!;

            if (mesh !== null && !mesh.isDisposed) {
                const transform = this.entity.getComponent(Transform)!;
                const { localToWorldMatrix } = transform;
                mesh.getTriangle(triangleIndex, output);
                output.a.applyMatrix(localToWorldMatrix);
                output.b.applyMatrix(localToWorldMatrix);
                output.c.applyMatrix(localToWorldMatrix);
            }

            return output;
        }

        public raycast(ray: Readonly<Ray>, raycastInfo: RaycastInfo | null = null) {
            const { mesh } = this.entity.getComponent(MeshFilter)!;

            if (mesh !== null && !mesh.isDisposed) {
                const transform = this.entity.getComponent(Transform)!;
                const { worldToLocalMatrix } = transform;
                const localRay = helpRay.applyMatrix(worldToLocalMatrix, ray);

                if (this.localBoundingBox.raycast(localRay) && mesh.raycast(localRay, raycastInfo)) {
                    if (raycastInfo !== null) { // Update local raycast info to world.
                        const { localToWorldMatrix } = transform;
                        const { normal } = raycastInfo;
                        raycastInfo.distance = ray.origin.getDistance(raycastInfo.position.applyMatrix(localToWorldMatrix));
                        raycastInfo.transform = transform;

                        if (normal !== null) {
                            // normal.applyDirection(localToWorldMatrix);
                            normal.applyMatrix3(helpMatrix3A.fromMatrix4(worldToLocalMatrix).transpose()).normalize();
                        }
                    }

                    return true;
                }
            }

            return false;
        }
        /**
         * 该组件的光照图索引。
         */
        @paper.editor.property(paper.editor.EditType.INT)
        @paper.serializedField("_lightmapIndex")
        public get lightmapIndex(): int {
            return this._lightmapIndex;
        }
        public set lightmapIndex(value: int) {
            if (value === this._lightmapIndex) {
                return;
            }

            this._lightmapIndex = value;
        }
        /**
         * TODO
         */
        public get lightmapScaleOffset(): Readonly<Vector4> {
            return this._lightmapScaleOffset;
        }
    }
}
