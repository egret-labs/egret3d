namespace egret3d {
    /**
     * IScreenAdapter
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 屏幕适配策略接口，实现此接口可以自定义适配策略
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export interface IScreenAdapter {
        $dirty: boolean;
        calculateScaler(canvasWidth: number, canvasHeight: number, out: { w: number, h: number, s: number }): void;
    }

    /**
     * ConstantAdapter
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 恒定像素的适配策略
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class ConstantAdapter implements IScreenAdapter {
        public $dirty = true;
        private _scaleFactor: number = 1;
        /**
         * scaleFactor
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置缩放值
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public set scaleFactor(value: number) {
            this._scaleFactor = value;
            this.$dirty = true;
        }
        public calculateScaler(canvasWidth: number, canvasHeight: number, out: { w: number, h: number, s: number }) {
            let scaler = this._scaleFactor;
            out.s = scaler;
            out.w = canvasWidth / scaler;
            out.h = canvasHeight / scaler;
        }
    }

    /**
     * ConstantAdapter
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 拉伸扩展的适配策略
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class ExpandAdapter implements IScreenAdapter {
        public $dirty = true;
        private _resolution: Vector2 = new Vector2(640, 1136);
        /**
         * setResolution
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置分辨率
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public setResolution(width: number, height: number) {
            this._resolution.x = width;
            this._resolution.y = height;
            this.$dirty = true;
        }
        public calculateScaler(canvasWidth: number, canvasHeight: number, out: { w: number, h: number, s: number }) {
            let canvasRate = canvasWidth / canvasHeight;
            let resolutionRate = this._resolution.x / this._resolution.y;
            let scaler = 1;
            if (canvasRate > resolutionRate) {
                scaler = canvasHeight / this._resolution.y;
            } else {
                scaler = canvasWidth / this._resolution.x;
            }
            out.s = scaler;
            out.w = canvasWidth / scaler;
            out.h = canvasHeight / scaler;
        }
    }

    /**
     * ShrinkAdapter
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 缩放的适配策略
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class ShrinkAdapter implements IScreenAdapter {
        public $dirty = true;
        private _resolution: Vector2 = new Vector2(640, 1136);
        /**
         * setResolution
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置分辨率
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public setResolution(width: number, height: number) {
            this._resolution.x = width;
            this._resolution.y = height;
            this.$dirty = true;
        }
        public calculateScaler(canvasWidth: number, canvasHeight: number, out: { w: number, h: number, s: number }) {
            let canvasRate = canvasWidth / canvasHeight;
            let resolutionRate = this._resolution.x / this._resolution.y;
            let scaler = 1;
            if (canvasRate > resolutionRate) {
                scaler = canvasWidth / this._resolution.x;
            } else {
                scaler = canvasHeight / this._resolution.y;
            }
            out.s = scaler;
            out.w = canvasWidth / scaler;
            out.h = canvasHeight / scaler;
        }
    }

    /**
     * MatchWidthOrHeightAdapter
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 适应宽高适配策略
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class MatchWidthOrHeightAdapter implements IScreenAdapter {
        public $dirty = true;
        private _resolution: Vector2 = new Vector2(640, 1136);
        /**
         * setResolution
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置分辨率
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public setResolution(width: number, height: number) {
            this._resolution.x = width;
            this._resolution.y = height;
            this.$dirty = true;
        }
        private _matchFactor: number = 1.0; // width : height
        /**
         * matchFactor
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置匹配系数，0-1之间，越小越倾向以宽度适配，越大越倾向以高度适配。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public set matchFactor(value: number) {
            this._matchFactor = value;
            this.$dirty = true;
        }
        public calculateScaler(canvasWidth: number, canvasHeight: number, out: { w: number, h: number, s: number }) {
            let scaler1 = canvasWidth / this._resolution.x;
            let scaler2 = canvasHeight / this._resolution.y;
            let scaler = scaler1 + (scaler2 - scaler1) * this._matchFactor;
            out.s = scaler;
            out.w = canvasWidth / scaler;
            out.h = canvasHeight / scaler;
        }
    }
}