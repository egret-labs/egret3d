namespace egret3d {
    /**
     * 网格渲染组件。
     * - 用于渲染网格筛选组件提供的网格资源。
     */
    export class MeshRenderer extends paper.BaseRenderer {
        @paper.serializedField
        protected _lightmapIndex: number = -1;
        /**
         * 如果该属性合并到 UV2 中，会破坏网格共享，共享的网格无法拥有不同的 lightmap UV。
         */
        @paper.serializedField
        protected readonly _lightmapScaleOffset: egret3d.Vector4 = egret3d.Vector4.create();

        public recalculateLocalBox() {
            this._localBoundingBox.clear();

            const filter = this.gameObject.getComponent(MeshFilter);
            if (filter && filter.mesh) {
                const vertices = filter.mesh.getVertices()!;
                const position = helpVector3A;

                for (let i = 0, l = vertices.length; i < l; i += 3) {
                    position.set(vertices[i], vertices[i + 1], vertices[i + 2]);
                    this._localBoundingBox.add(position);
                }
            }
        }

        /**
         * 实时获取网格资源的指定三角形顶点位置。
         * - 采用 CPU 蒙皮。
         */
        public getTriangle(triangleIndex: uint, triangle?: Triangle): Triangle {
            if (!triangle) {
                triangle = Triangle.create();
            }

            const meshFilter = this.gameObject.getComponent(MeshFilter);
            if (!meshFilter) {
                return triangle;
            }

            const mesh = meshFilter.mesh;
            if (!mesh) {
                return triangle;
            }

            const localToWorldMatrix = this.gameObject.transform.localToWorldMatrix;
            const indices = mesh.getIndices();
            const vertices = mesh.getVertices()!;

            for (let i = 0; i < 3; ++i) {
                const index = indices ? indices[triangleIndex * 3 + i] : triangleIndex * 9 + i;
                const vertexIndex = index * 3;

                switch (i) {
                    case 0:
                        triangle.a.fromArray(vertices, vertexIndex);
                        triangle.a.applyMatrix(localToWorldMatrix);
                        break;

                    case 1:
                        triangle.b.fromArray(vertices, vertexIndex);
                        triangle.b.applyMatrix(localToWorldMatrix);
                        break;

                    case 2:
                        triangle.c.fromArray(vertices, vertexIndex);
                        triangle.c.applyMatrix(localToWorldMatrix);
                        break;
                }
            }

            return triangle;
        }

        public raycast(p1: Readonly<egret3d.Ray>, p2?: boolean | egret3d.RaycastInfo, p3?: boolean) {
            const meshFilter = this.gameObject.getComponent(MeshFilter);
            if (!meshFilter || !meshFilter.enabled || !meshFilter.mesh) {
                return false;
            }

            let raycastMesh = false;
            let raycastInfo: egret3d.RaycastInfo | undefined = undefined;
            const transform = this.gameObject.transform;
            const worldToLocalMatrix = transform.worldToLocalMatrix;
            const localRay = helpRay.applyMatrix(worldToLocalMatrix, p1);
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

            if (raycastMesh ? localBoundingBox.raycast(localRay) && meshFilter.mesh.raycast(localRay, raycastInfo) : localBoundingBox.raycast(localRay, raycastInfo)) {
                if (raycastInfo) { // Update local raycast info to world.
                    const localToWorldMatrix = transform.localToWorldMatrix;
                    raycastInfo.distance = p1.origin.getDistance(raycastInfo.position.applyMatrix(localToWorldMatrix));
                    raycastInfo.transform = transform;

                    const normal = raycastInfo.normal;
                    if (normal) {
                        // normal.applyDirection(localToWorldMatrix);
                        normal.applyMatrix3(helpMatrix3A.fromMatrix4(worldToLocalMatrix).transpose()).normalize();
                    }
                }

                return true;
            }

            return false;
        }
        /**
         * 该组件的光照图索引。
         */
        @paper.editor.property(paper.editor.EditType.INT, { minimum: -1 })
        public get lightmapIndex() {
            return this._lightmapIndex;
        }
        public set lightmapIndex(value: number) {
            if (value === this._lightmapIndex) {
                return;
            }

            this._lightmapIndex = value;
        }

        public get lightmapScaleOffset() {
            return this._lightmapScaleOffset;
        }
    }
}
