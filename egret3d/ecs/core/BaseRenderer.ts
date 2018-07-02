namespace paper {
    export const enum RendererEventType {
        ReceiveShadows = "receiveShadows",
        CastShadows = "castShadows",
        LightmapIndex = "lightmapIndex",
        LightmapScaleOffset = "lightmapScaleOffset",
        Materials = "materials",
    }

    /**
     * renderer component interface
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 渲染器组件接口
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export abstract class BaseRenderer extends BaseComponent {
        @paper.serializedField
        protected _receiveShadows: boolean = false;
        @paper.serializedField
        protected _castShadows: boolean = false;
        @paper.serializedField
        protected _lightmapIndex: number = -1;
        @paper.serializedField
        protected readonly _lightmapScaleOffset: Float32Array = new Float32Array([1.0, 1.0, 0.0, 0.0]);

        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public get receiveShadows(): boolean {
            return this._receiveShadows;
        }
        public set receiveShadows(value: boolean) {
            if (value === this._receiveShadows) {
                return;
            }

            this._receiveShadows = value;
            paper.EventPool.dispatchEvent(RendererEventType.ReceiveShadows, this);
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
            paper.EventPool.dispatchEvent(RendererEventType.CastShadows, this);
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
            paper.EventPool.dispatchEvent(RendererEventType.LightmapIndex, this);
        }

        // @paper.editor.property(paper.editor.EditType.VECTOR4) TODO
        public get lightmapScaleOffset(): Float32Array {
            return this._lightmapScaleOffset;
        }

        public setLightmapScaleOffset(scaleX: number, scaleY: number, offsetX: number, offsetY: number) {
            this._lightmapScaleOffset[0] = scaleX;
            this._lightmapScaleOffset[1] = scaleY;
            this._lightmapScaleOffset[2] = offsetX;
            this._lightmapScaleOffset[3] = offsetY;
            paper.EventPool.dispatchEvent(RendererEventType.LightmapScaleOffset, this);
        }
    }
}