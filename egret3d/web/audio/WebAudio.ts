namespace egret3d.sound {
    /**
     * web audio
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 基于 Web Audio 网络音频模块（单例）
     * @version paper 1.0
     * @platform Web
     * @language
     */
    export class WebAudio {

        private static _instance:WebAudio;

        /**
         * web audio instance
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 基于 Web Audio 网络音频模块单例
         * @version paper 1.0
         * @platform Web
         * @language
         */
        public static get instance():WebAudio {
            if(!this._instance) {
                this._instance = new WebAudio();
            }
            return this._instance;
        }

        private _audioContext: AudioContext;

        /**
         *   
         */
        public get audioContext(): AudioContext {
            return this._audioContext;
        }

        private constructor() {
            let _win: any = window;
            let _AudioContext = _win["AudioContext"] || _win["webkitAudioContext"] || _win["mozAudioContext"] || _win["msAudioContext"];
            if (!!_AudioContext) {
                this._audioContext = new _AudioContext();
                console.log("AudioContext inited --> ");
                console.log(this._audioContext);
            } else {
                console.warn("!Your browser does not support AudioContext");
            }
        }

        /**
         * is support web audio
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 当前运行环境是否支持 Web Audio
         * @version paper 1.0
         * @platform Web
         * @language
         */
        public get isSupported():boolean {
            return !!this._audioContext;
        }

        /**
         * active
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 某些平台中（IOS），需要在用户输入事件监听中调用此方法，音频才能正常播放
         * @version paper 1.0
         * @platform Web
         * @language
         */
        public active() {
            if(!this.isSupported) {
                return;
            }
            let buffer = this._audioContext.createBuffer(1, 1, 22050);
            let source = this._audioContext.createBufferSource();
            source.buffer = buffer;

            // connect to output (your speakers)
            source.connect(this._audioContext.destination);

            // play the file
            source.start();
        }

        /**
         *   
         */
        public decodeAudioData(buffer: ArrayBuffer, onSuccess: (buf: AudioBuffer) => void, onError: () => void): void {
            this._audioContext.decodeAudioData(buffer, (audiobuffer) => onSuccess(audiobuffer), () => onError());
        }

        private audioListener:WebAudioListener;

        public getAudioListener():WebAudioListener {
            if(!this.audioListener) {
                this.audioListener = new WebAudioListener();
            }
            return this.audioListener;
        }

    }

}