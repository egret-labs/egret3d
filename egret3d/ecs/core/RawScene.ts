namespace paper {
    /**
     * scene asset
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 场景数据资源
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class RawScene extends BaseObjectAsset {
        /**
         * @internal
         */
        public createInstance() {
            if (!this._raw) {
                return null;
            }

            const scene = deserialize(this._raw) as Scene | null;

            if (scene) {
                scene.rawScene = this;
            }

            return scene;
        }
    }
}