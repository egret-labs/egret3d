namespace egret3d {

    /**
     * mesh的渲染组件
     */
    @paper.disallowMultiple
    export class MeshRenderer extends paper.BaseRenderer {
        @paper.serializedField
        private readonly _materials: Material[] = [DefaultMaterials.DefaultDiffuse];

        protected _updateAABB() {
            if (!this._aabbDirty) {
                return;
            }

            this._aabbDirty = false;
            //
            const filter = this.gameObject.getComponent(MeshFilter);
            if (filter && filter.mesh) {
                const vertices = filter.mesh.getVertices();
                const minimum = helpVector3A;
                const maximum = helpVector3B;
                const position = helpVector3C;
                minimum.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
                maximum.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);

                for (let i = 0, l = vertices.length; i < l; i += 3) {
                    position.set(vertices[i], vertices[i + 1], vertices[i + 2]);
                    maximum.max(position, maximum);
                    minimum.min(position, minimum);
                }
            }
        }

        public uninitialize() {
            super.uninitialize();

            this._materials.length = 0;
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

            this._materials.length = 0;
            for (const material of value) {
                this._materials.push(material);
            }

            paper.EventPool.dispatchEvent(paper.RendererEventType.Materials, this);
        }
    }
}
