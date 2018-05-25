namespace egret3d {
    /**
     * audio asset
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 声音资源。
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class Sound extends paper.Asset {

        /**
         * 
         */
        public buffer: AudioBuffer;

        /**
         * @inheritDoc
         */
        public dispose() {
            this.buffer = null;
        }

        /**
         * @inheritDoc
         */
        public caclByteLength(): number {
            if (this.buffer) {
                return this.buffer.length;
            }
        }
    }
}