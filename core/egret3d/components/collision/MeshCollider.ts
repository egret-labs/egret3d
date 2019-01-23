namespace egret3d {
    /**
     * 网格碰撞组件接口。
     */
    export interface IMeshCollider extends ICollider {
    }
    /**
     * 网格碰撞组件。
     */
    @paper.allowMultiple
    export class MeshCollider extends paper.BaseComponent implements IMeshCollider, IRaycast {
        public readonly colliderType: ColliderType = ColliderType.Mesh;

        protected readonly _localBoundingBox: Box = Box.create();
        private _mesh: Mesh | null = null;
        /**
         * @internal
         */
        public uninitialize() {
            super.uninitialize();

            if (this._mesh) {
                this._mesh.release();
            }

            this._mesh = null;
        }
        
        public raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo): boolean {
            const mesh = this._mesh;
            if (mesh) {
                const transform = this.gameObject.transform;
                const worldToLocalMatrix = transform.worldToLocalMatrix;
                const localRay = helpRay.applyMatrix(worldToLocalMatrix, ray);
                const localBoundingBox = this._localBoundingBox;

                if (localBoundingBox.raycast(localRay) && mesh.raycast(localRay, raycastInfo)) {
                    if (raycastInfo) { // Update local raycast info to world.
                        const localToWorldMatrix = transform.localToWorldMatrix;
                        raycastInfo.distance = ray.origin.getDistance(raycastInfo.position.applyMatrix(localToWorldMatrix));
                        raycastInfo.transform = transform;

                        const normal = raycastInfo.normal;
                        if (normal) {
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
         * 该组件的网格资源。
         */
        @paper.editor.property(paper.editor.EditType.MESH)
        @paper.serializedField("_mesh")
        public get mesh(): Mesh | null {
            return this._mesh;
        }
        public set mesh(value: Mesh | null) {
            if (this._mesh === value) {
                return;
            }

            if (this._mesh) {
                this._mesh.release();
            }

            if (value) {
                value.retain();
            }

            this._localBoundingBox.clear();

            if (value && !value.isDisposed) {
                const vertices = value.getVertices()!;
                const position = helpVector3A;

                for (let i = 0, l = vertices.length; i < l; i += 3) {
                    position.set(vertices[i], vertices[i + 1], vertices[i + 2]);
                    this._localBoundingBox.add(position);
                }
            }

            this._mesh = value;
        }
    }
}