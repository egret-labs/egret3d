namespace egret3d {

    /**
     * mesh的渲染组件
     */
    @paper.requireComponent(MeshFilter)
    @paper.disallowMultipleComponent
    export class MeshRenderer extends paper.BaseRenderer {
        @paper.serializedField
        private readonly _materials: Material[] = [];
        /**
         * 
         */
        public constructor() {
            super();

            // default
            const material = new Material();
            material.setShader(DefaultShaders.DIFFUSE);
            this._materials.push(material);
        }

        public serialize() {
            const target = super.serialize();
            target._receiveShadows = this._receiveShadows;
            target._castShadows = this._castShadows;
            target._lightmapIndex = this._lightmapIndex;
            target._lightmapScaleOffset = this._lightmapScaleOffset;
            target._materials = [] as any[];

            for (const material of this._materials) {
                target._materials.push(paper.serializeAsset(material));
            }

            return target;
        }

        public deserialize(element: any) {
            super.deserialize(element);

            this._receiveShadows = element._receiveShadows || false;
            this._castShadows = element._castShadows || false;
            this._lightmapIndex = element._lightmapIndex;

            if (element._materials) {
                this._materials.length = 0;
                for (let i = 0, l = element._materials.length; i < l; i++) {
                    this._materials.push(paper.getDeserializedObject<Material>(element._materials[i]));
                }
            }

            if (element._lightmapScaleOffset) {
                this._lightmapScaleOffset[0] = element._lightmapScaleOffset[0];
                this._lightmapScaleOffset[1] = element._lightmapScaleOffset[1];
                this._lightmapScaleOffset[2] = element._lightmapScaleOffset[2];
                this._lightmapScaleOffset[3] = element._lightmapScaleOffset[3];
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
