namespace egret3d {

    /**
     * 2d audio source component
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 2D音频组件
     * @version paper 1.0
     * @platform Web
     * @language
     */
    export class AudioSource2D extends paper.BaseComponent {

        private _channel: sound.WebAudioChannel2D;

        private _sound: Sound;

        /**
         * set sound asset
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置音频资源
         * @version paper 1.0
         * @platform Web
         * @language
         */
        @editor.property(editor.EditType.SOUND)
        public set sound(sound: Sound) {
            if (!!this._channel && this._playing) {
                this._channel.stop();
                this._channel.dispose();
                // this._sound.unuse();
            }

            if (!egret3d.sound.WebAudio.instance.isSupported) {
                return;
            }

            this._channel = new egret3d.sound.WebAudioChannel2D();
            this._channel.buffer = sound.buffer;
            this._sound = sound;

            // sound.use();
        }

        private _volume: number = 1;

        /**
         * volume
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 音量
         * @version paper 1.0
         * @platform Web
         * @language
         */
        @editor.property(editor.EditType.NUMBER)
        public set volume(value: number) {
            if (!!this._channel) {
                this._channel.volume = value;
                this._volume = value;
            }
        }

        /**
         * volume
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 音量
         * @version paper 1.0
         * @platform Web
         * @language
         */
        public get volume(): number {
            return this._volume;
        }

        private _loop: boolean = false;

        /**
         * is loop
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 是否循环
         * @version paper 1.0
         * @platform Web
         * @language
         */
        @editor.property(editor.EditType.CHECKBOX)
        public set loop(value: boolean) {
            if (!!this._channel) {
                this._channel.loop = value;
                this._loop = value;
            }
        }

        /**
         * is loop
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 是否循环
         * @version paper 1.0
         * @platform Web
         * @language
         */
        public get loop(): boolean {
            return this._loop;
        }

        private _playing: boolean = false;

        /**
         * play
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 播放音频
         * @version paper 1.0
         * @platform Web
         * @language
         */
        public play(offset?: number) {
            if (!!this._channel) {
                this._channel.start(offset);
                this._playing = true;
            }
        }

        /**
         * stop play
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 暂停音频
         * @version paper 1.0
         * @platform Web
         * @language
         */
        public stop() {
            if (!!this._channel) {
                this._channel.stop();
                this._playing = false;
            }
        }
    }
}
