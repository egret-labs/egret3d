namespace paper {
    export const enum RendererEventType {
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
        /**
         * 
         */
        public readonly aabb: egret3d.AABB = new egret3d.AABB();
        /**
         * @internal
         */
        public _aabbDirty: boolean = true;
        @serializedField
        protected _receiveShadows: boolean = false;
        @serializedField
        protected _castShadows: boolean = false;
        @serializedField
        protected _lightmapIndex: number = -1;
        @serializedField
        protected readonly _lightmapScaleOffset: Float32Array = new Float32Array([1.0, 1.0, 0.0, 0.0]);

        protected abstract _updateAABB(): void;

        @editor.property(editor.EditType.CHECKBOX)
        public get receiveShadows() {
            return this._receiveShadows;
        }
        public set receiveShadows(value: boolean) {
            if (value === this._receiveShadows) {
                return;
            }

            this._receiveShadows = value;
        }

        @editor.property(editor.EditType.CHECKBOX)
        public get castShadows() {
            return this._castShadows;
        }
        public set castShadows(value: boolean) {
            if (value === this._castShadows) {
                return;
            }

            this._castShadows = value;
        }

        @editor.property(editor.EditType.NUMBER)
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