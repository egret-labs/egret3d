namespace egret3d {
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
         * @deprecated
         */
        public createInstance() {
            if (!this._raw) {
                return null;
            }

            return paper.deserialize<paper.Scene>(this._raw);
        }
    }
}