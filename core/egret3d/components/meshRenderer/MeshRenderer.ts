namespace egret3d {
    const _helpMatrix = Matrix4.create();
    /**
     * 网格渲染组件。
     * - 渲染网格筛选组件提供的网格资源。
     */
    export class MeshRenderer extends paper.BaseRenderer {
        public recalculateAABB() {
            this._aabb.clear();

            const filter = this.gameObject.getComponent(MeshFilter);
            if (filter && filter.mesh) {
                const vertices = filter.mesh.getVertices()!;
                const position = helpVector3A;

                for (let i = 0, l = vertices.length; i < l; i += 3) {
                    position.set(vertices[i], vertices[i + 1], vertices[i + 2]);
                    this._aabb.add(position);
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
            const localRay = helpRay.applyMatrix(transform.inverseWorldMatrix, p1);
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

            if (raycastMesh ? aabb.raycast(localRay) && meshFilter.mesh.raycast(localRay, raycastInfo) : aabb.raycast(localRay, raycastInfo)) {
                const worldMatrix = transform.worldMatrix;

                if (raycastInfo) { // Update local raycast info to world.
                    raycastInfo.position.applyMatrix(worldMatrix);
                    raycastInfo.distance = p1.origin.getDistance(raycastInfo.position);

                    if (raycastInfo.normal) {
                        raycastInfo.normal.applyDirection(worldMatrix).normalize();
                    }
                }

                return true;
            }

            return false;
        }
    }
}
