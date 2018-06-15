namespace egret3d {

    export const enum MeshRendererEventType {
        ReceiveShadows = "receiveShadows",
        CastShadows = "castShadows",
        LightmapIndex = "lightmapIndex",
        LightmapScaleOffset = "lightmapScaleOffset",
        Materials = "materials",
    }

    /**
     * mesh的渲染组件
     */
    export class MeshRenderer extends paper.BaseComponent implements paper.IRenderer {
        @paper.serializedField
        private _receiveShadows: boolean = false;
        @paper.serializedField
        private _castShadows: boolean = false;
        @paper.serializedField
        private _lightmapIndex: number = -1;
        @paper.serializedField
        private readonly _lightmapScaleOffset: Vector4 = new Vector4(1, 1, 0, 0);
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
        /**
         * @inheritDoc
         */
        public serialize() {
            const target = super.serialize();
            target._receiveShadows = this._receiveShadows;
            target._castShadows = this._castShadows;
            target._lightmapIndex = this._lightmapIndex;
            target._lightmapScaleOffset = [this._lightmapScaleOffset.x, this._lightmapScaleOffset.y, this._lightmapScaleOffset.z, this._lightmapScaleOffset.w];
            target._materials = [] as any[];
            target.uuid = this.uuid;

            for (const material of this._materials) {
                target._materials.push(paper.serializeAsset(material));
            }

            return target;
        }
        /**
         * @inheritDoc
         */
        public deserialize(element: any) {
            this._receiveShadows = element._receiveShadows || false;
            this._castShadows = element._castShadows || false;
            this._lightmapIndex = element._lightmapIndex;
            this.uuid = element.uuid;

            if (element._materials) {
                this._materials.length = 0;
                for (let i = 0, l = element._materials.length; i < l; i++) {
                    this._materials.push(paper.getDeserializedObject<Material>(element._materials[i]));
                }
            }

            if (element._lightmapScaleOffset) {
                this._lightmapScaleOffset.deserialize(element._lightmapScaleOffset);
            }
        }
        /**
         * @inheritDoc
         */
        public uninitialize() {
            super.uninitialize();

            this._materials.length = 0;
        }

        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public get receiveShadows(): boolean {
            return this._receiveShadows;
        }
        public set receiveShadows(value: boolean) {
            if (value === this._receiveShadows) {
                return;
            }

            this._receiveShadows = value;
            paper.EventPool.dispatchEvent(MeshRendererEventType.ReceiveShadows, this);
        }

        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public get castShadows(): boolean {
            return this._castShadows;
        }
        public set castShadows(value: boolean) {
            if (value === this._castShadows) {
                return;
            }

            this._castShadows = value;
            paper.EventPool.dispatchEvent(MeshRendererEventType.CastShadows, this);
        }

        @paper.editor.property(paper.editor.EditType.NUMBER)
        public get lightmapIndex(): number {
            return this._lightmapIndex;
        }
        public set lightmapIndex(value: number) {
            if (value === this._lightmapIndex) {
                return;
            }

            this._lightmapIndex = value;
            paper.EventPool.dispatchEvent(MeshRendererEventType.LightmapIndex, this);
        }

        @paper.editor.property(paper.editor.EditType.VECTOR4)
        public get lightmapScaleOffset(): Readonly<Vector4> {
            return this._lightmapScaleOffset;
        }
        public set lightmapScaleOffset(value: Readonly<Vector4>) {
            this._lightmapScaleOffset.x = value.x;
            this._lightmapScaleOffset.y = value.y;
            this._lightmapScaleOffset.z = value.z;
            this._lightmapScaleOffset.w = value.w;
            paper.EventPool.dispatchEvent(MeshRendererEventType.LightmapScaleOffset, this);
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

            paper.EventPool.dispatchEvent(MeshRendererEventType.Materials, this);
        }
    }
}
