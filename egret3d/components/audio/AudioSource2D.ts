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
         * 设置音频资源
         */
        @paper.editor.property(paper.editor.EditType.SOUND)
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
         * 音量
         */
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public set volume(value: number) {
            if (!!this._channel) {
                this._channel.volume = value;
                this._volume = value;
            }
        }

        /**
         * 音量
         */
        public get volume(): number {
            return this._volume;
        }

        private _loop: boolean = false;

        /**
         * 是否循环
         */
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public set loop(value: boolean) {
            if (!!this._channel) {
                this._channel.loop = value;
                this._loop = value;
            }
        }


        /**
         * 是否循环
         */
        public get loop(): boolean {
            return this._loop;
        }

        private _playing: boolean = false;


        /**
         * 播放音频
         */
        public play(offset?: number) {
            if (!!this._channel) {
                this._channel.start(offset);
                this._playing = true;
            }
        }


        /**
         * 暂停音频
         */
        public stop() {
            if (!!this._channel) {
                this._channel.stop();
                this._playing = false;
            }
        }
    }
}
