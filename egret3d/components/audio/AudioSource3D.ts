namespace egret3d {

    /**
     * 3D音频组件
     */
    export class AudioSource3D extends paper.BaseComponent {


        update(deltaTime: number) {
            if (!!this._channel && this._playing && this.gameObject) {
                let position = this.gameObject.transform.getPosition();
                this._channel.setPosition(position.x, position.y, position.z);
            }
        }

        private _channel: sound.WebAudioChannel3D;

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

            this._channel = new egret3d.sound.WebAudioChannel3D();
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
            if (!!this._channel && !this._playing) {
                this._channel.start(offset);
                this._playing = true;
            }
        }


        /**
         * 暂停音频
         */
        public stop() {
            if (!!this._channel && this._playing) {
                this._channel.stop();
                this._playing = false;
            }
        }

        /**
         * 音频传播最远距离
         */
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public get maxDistance(): number {
            if (!!this._channel) {
                return this._channel.maxDistance;
            }
            return 0;
        }

        /**
         * 音频传播最远距离
         */
        public set maxDistance(value: number) {
            if (!!this._channel) {
                this._channel.maxDistance = value;
            }
        }


        /**
         * 音频传播最小距离
         */
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public get minDistance(): number {
            if (!!this._channel) {
                return this._channel.minDistance;
            }
            return 0;
        }


        /**
         * 音频传播最小距离
         */
        public set minDistance(value: number) {
            if (!!this._channel) {
                this._channel.minDistance = value;
            }
        }


        /**
         * 音频滚降系数
         */
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public get rollOffFactor(): number {
            if (!!this._channel) {
                return this._channel.rollOffFactor;
            }
            return 0;
        }

        /**
         * 音频滚降系数
         */
        public set rollOffFactor(value: number) {
            if (!!this._channel) {
                this._channel.rollOffFactor = value;
            }
        }


        /**
         * 音频滚降系数
         */
        @paper.editor.property(paper.editor.EditType.LIST,{listItems:[{label:'linear',value:'linear'},{label:'inverse',value:'inverse'},{label:'exponential',value:'exponential'}]})
        public get distanceModel(): string {
            if (!!this._channel) {
                return this._channel.distanceModel;
            }
            return "";
        }


        /**
         * 音频衰减模式。支持“linear”，“inverse”，“exponential”三种
         */
        public set distanceModel(value: string) {
            if (!!this._channel) {
                this._channel.distanceModel = value;
            }
        }


        /**
         * 速度
         */
        public getVelocity(): Vector3 {
            if (!!this._channel) {
                return this._channel.getVelocity();
            }
            return new Vector3();
        }

        /**
         * 速度
         */
        public setVelocity(x: number, y: number, z: number) {
            if (!!this._channel) {
                this._channel.setVelocity(x, y, z);
            }
        }
    }
}