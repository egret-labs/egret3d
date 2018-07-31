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
        public createInstance(isKeepUUID: boolean = false) {
            if (!this._raw) {
                return null;
            }

            const scene = deserialize<Scene>(this._raw,isKeepUUID);

            if (scene) { 
                scene.rawScene = this;
            }

            return scene;
        }
    }
}