namespace egret3d {
    /**
     * 网格渲染组件。
     * - 用于渲染网格筛选组件提供的网格资源。
     */
    export class MeshRenderer extends paper.BaseRenderer {
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
                    raycastInfo.position.applyMatrix(localToWorldMatrix);
                    raycastInfo.distance = p1.origin.getDistance(raycastInfo.position);

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
    }
}
