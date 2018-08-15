namespace egret3d {

    /**
     * mesh的渲染组件
     */
    export class MeshRenderer extends paper.BaseRenderer {
        @paper.serializedField
        private readonly _materials: Material[] = [DefaultMaterials.DefaultDiffuse];

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
