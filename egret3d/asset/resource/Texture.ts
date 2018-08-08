namespace egret3d {

    /**
     * 纹理资源。
     */
    export class Texture extends paper.Asset {
        public dispose() {
            if (this._isBuiltin) {
                return;
            }
        }

        /**
         * @inheritDoc
         */
        public caclByteLength(): number {
            return 0;
        }
    }
}
