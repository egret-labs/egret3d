namespace egret3d {

    /**
     * 3d audio source component
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 3D音频组件
     * @version paper 1.0
     * @platform Web
     * @language
     */
    export class AudioSource3D extends paper.BaseComponent {

        /**
         * 
         */
        public update(deltaTime: number) {
            if (!!this._channel && this._playing && this.gameObject) {
                let position = this.gameObject.transform.getPosition();
                this._channel.setPosition(position.x, position.y, position.z);
            }
        }

        private _channel: sound.WebAudioChannel3D;

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

            this._channel = new egret3d.sound.WebAudioChannel3D();
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
            if (!!this._channel && !this._playing) {
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
            if (!!this._channel && this._playing) {
                this._channel.stop();
                this._playing = false;
            }
        }

        /**
         * max distance
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 音频传播最远距离
         * @version paper 1.0
         * @platform Web
         * @language
         */
        @editor.property(editor.EditType.NUMBER)
        public get maxDistance(): number {
            if (!!this._channel) {
                return this._channel.maxDistance;
            }
            return 0;
        }

        /**
         * max distance
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 音频传播最远距离
         * @version paper 1.0
         * @platform Web
         * @language
         */
        public set maxDistance(value: number) {
            if (!!this._channel) {
                this._channel.maxDistance = value;
            }
        }

        /**
         * min distance
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 音频传播最小距离
         * @version paper 1.0
         * @platform Web
         * @language
         */
        @editor.property(editor.EditType.NUMBER)
        public get minDistance(): number {
            if (!!this._channel) {
                return this._channel.minDistance;
            }
            return 0;
        }

        /**
         * min distance
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 音频传播最小距离
         * @version paper 1.0
         * @platform Web
         * @language
         */
        public set minDistance(value: number) {
            if (!!this._channel) {
                this._channel.minDistance = value;
            }
        }

        /**
         * rolloff factor
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 音频滚降系数
         * @version paper 1.0
         * @platform Web
         * @language
         */
        @editor.property(editor.EditType.NUMBER)
        public get rollOffFactor(): number {
            if (!!this._channel) {
                return this._channel.rollOffFactor;
            }
            return 0;
        }

        /**
         * rolloff factor
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 音频滚降系数
         * @version paper 1.0
         * @platform Web
         * @language
         */
        public set rollOffFactor(value: number) {
            if (!!this._channel) {
                this._channel.rollOffFactor = value;
            }
        }

        /**
         * rolloff factor
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 音频滚降系数
         * @version paper 1.0
         * @platform Web
         * @language
         */
        @editor.property(editor.EditType.LIST,{listItems:[{label:'linear',value:'linear'},{label:'inverse',value:'inverse'},{label:'exponential',value:'exponential'}]})
        public get distanceModel(): string {
            if (!!this._channel) {
                return this._channel.distanceModel;
            }
            return "";
        }

        /**
         * distance mode
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 音频衰减模式。支持“linear”，“inverse”，“exponential”三种
         * @version paper 1.0
         * @platform Web
         * @language
         */
        public set distanceModel(value: string) {
            if (!!this._channel) {
                this._channel.distanceModel = value;
            }
        }

        /**
         * velocity
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 速度
         * @version paper 1.0
         * @platform Web
         * @language
         */
        public getVelocity(): Vector3 {
            if (!!this._channel) {
                return this._channel.getVelocity();
            }
            return new Vector3();
        }

        /**
         * velocity
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 速度
         * @version paper 1.0
         * @platform Web
         * @language
         */
        public setVelocity(x: number, y: number, z: number) {
            if (!!this._channel) {
                this._channel.setVelocity(x, y, z);
            }
        }

    }

}