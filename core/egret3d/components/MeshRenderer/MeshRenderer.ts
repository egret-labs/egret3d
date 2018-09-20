namespace egret3d {
    const _helpMatrix = Matrix4.create();
    /**
     * Mesh 渲染组件。
     */
    export class MeshRenderer extends paper.BaseRenderer {
        protected static readonly _helpRay: Ray = Ray.create();
        @paper.serializedField
        protected readonly _materials: Material[] = [DefaultMaterials.MESH_BASIC];

        public uninitialize() {
            super.uninitialize();

            this._materials.length = 0;
        }

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
            if (!meshFilter || !meshFilter.mesh) {
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

            if (raycastMesh ? aabb.raycast(localRay) && meshFilter.mesh.raycast(localRay, raycastInfo) : aabb.raycast(localRay, raycastInfo)) {
                if (raycastInfo) { // Update local raycast info to world.
                    raycastInfo.position.applyMatrix(worldMatrix);
                    raycastInfo.distance = p1.origin.getDistance(raycastInfo.position);
                }

                return true;
            }

            return false;
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
        @paper.editor.property(paper.editor.EditType.MATERIAL_ARRAY)
        public get materials(): ReadonlyArray<Material> {
            return this._materials;
        }
        public set materials(value: ReadonlyArray<Material>) {
            if (value === this._materials) {
                return;
            }
            // TODO 共享材质的接口。

            this._materials.length = 0;
            for (const material of value) {
                if (!material) {
                    console.warn("Invalid material.");
                }

                this._materials.push(material || DefaultMaterials.MISSING);
            }

            paper.EventPool.dispatchEvent(paper.RendererEventType.Materials, this);
        }
        /**
         * 材质数组中的第一个材质。
         */
        public get material(): Material | null {
            return this._materials.length > 0 ? this._materials[0] : null;
        }
        public set material(value: Material | null) {
            let dirty = false;
            if (value) {
                if (this._materials.length > 0) {
                    if (this._materials[0] !== value) {
                        this._materials[0] = value;
                        dirty = true;
                    }
                }
                else {
                    this._materials.push(value);
                    dirty = true;
                }
            }
            else if (this._materials.length > 0) {
                this._materials.splice(0, 1);
                dirty = true;
            }

            if (dirty) {
                paper.EventPool.dispatchEvent(paper.RendererEventType.Materials, this);
            }
        }
    }
}
