namespace egret3d {

    let helpQuat_1: Quaternion = new Quaternion();

    /**
     * Guid Path Component
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 路径组件。
     * @version paper 1.0
     * @platform Web
     * @language
     */
    export class Guidpath extends paper.BaseComponent {

        private paths: egret3d.Vector3[];

        private _pathasset: PathAsset;

        /**
         * Path Asset
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 路径组件需要的路径资源。
         * @version paper 1.0
         * @platform Web
         * @language
         */
        set pathasset(pathasset: PathAsset) {
            // if (this._pathasset) {
            //     this._pathasset.unuse();
            // }
            this._pathasset = pathasset;
            // if (this._pathasset) {
            // this._pathasset.use();
            // }
        }

        /**
         * Path Asset
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 路径组件需要的路径资源。
         * @version paper 1.0
         * @platform Web
         * @language
         */
        get pathasset() {
            return this._pathasset;
        }

        /**
         * move speed
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 移动速度。
         * @default 1
         * @version paper 1.0
         * @platform Web
         * @language
         */
        public speed: number = 1;

        private isactived: boolean = false;
        private loopCount: number = 1;

        /**
         * play movement
         * @version paper 1.0
         * @param loopCount play times
         * @platform Web
         * @language en_US
         */
        /**
         * 按照路径开始移动。
         * @param loopCount 播放次数
         * @version paper 1.0
         * @platform Web
         * @language
         */
        play(loopCount: number = 1) {
            this.isactived = true;
            this.loopCount = loopCount;
        }

        /**
         * pause movement
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 暂停移动。
         * @version paper 1.0
         * @platform Web
         * @language
         */
        pause() {
            this.isactived = false;
        }

        /**
         * stop movement
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 停止移动。
         * @version paper 1.0
         * @platform Web
         * @language
         */
        stop() {
            this.isactived = false;
            this.folowindex = 0;
        }

        /**
         * restart movement
         * @param loopCount play times
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 重新按照路径移动。
         * @param loopCount 播放次数
         * @version paper 1.0
         * @platform Web
         * @language
         */
        replay(loopCount: number = 1) {
            this.isactived = true;
            this.folowindex = 0;
            this.loopCount = loopCount;
        }

        /**
         * loop play
         * @default false
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 循环播放。
         * @default false
         * @version paper 1.0
         * @platform Web
         * @language
         */
        public isloop: boolean = false;

        private datasafe: boolean = false;
        private folowindex: number = 0;

        /**
         * look forward
         * @default false
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 挂载此组件的gameobject是否朝向前方。
         * @default false
         * @version paper 1.0
         * @platform Web
         * @language
         */
        lookforward: boolean = false;

        private oncomplete: () => void;

        private mystrans: Transform;

        /**
         * set path asset
         * @param pathasset path asset
         * @param speed move speed
         * @param oncomplete on complete callback
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 设置路径组件的需要的参数。
         * @param pathasset 路径资源
         * @param speed 移动速度
         * @param oncomplete 按照路径移动结束需要执行的事件
         * @version paper 1.0
         * @platform Web
         * @language
         */
        setpathasset(pathasset: PathAsset, speed: number = 1, oncomplete: () => void = null) {
            this.pathasset = pathasset;
            if (pathasset == null) {
                console.log(this.gameObject.name + ":are you sure set the right pathasset（error：null）");
                return;
            }
            this.paths = pathasset.paths;
            if (this.paths[0] != null) {
                this.gameObject.transform.setLocalPosition(this.paths[0]);
                this.datasafe = true;
            }
            this.mystrans = this.gameObject.transform;
            this.speed = speed;
            this.oncomplete = oncomplete;
        }

        /**
         * 
         */
        public update(delta: number) {
            if (!this.isactived || !this.datasafe) return;
            this.followmove(delta);
        }

        private adjustDir: boolean = false;

        private followmove(delta: number) {
            var dist = egret3d.Vector3.getDistance(this.mystrans.getLocalPosition(), this.paths[this.folowindex]);
            if (dist < 0.01) {
                if (this.folowindex < this.paths.length - 1) {
                    var dir = new egret3d.Vector3();
                    this.mystrans.setLocalPosition(this.paths[this.folowindex]);
                    this.folowindex++;
                    this.adjustDir = true;
                } else {
                    this.folowindex = 0;
                    if (!this.isloop) {
                        this.loopCount--;
                        if (this.loopCount == 0) {
                            this.isactived = false;
                            this.loopCount = 1;
                            if (this.oncomplete) {
                                this.oncomplete();
                            }
                        }
                    }
                }
            } else {
                var dir = new egret3d.Vector3();
                egret3d.Vector3.subtract(this.paths[this.folowindex], this.mystrans.getLocalPosition(), dir);
                if (this.adjustDir) {
                    var targetpos = this.paths[this.folowindex];
                    var localppos = this.mystrans.getLocalPosition();
                    var quat = helpQuat_1;
                    egret3d.Quaternion.lookAt(localppos, targetpos, quat);
                    egret3d.Quaternion.copy(quat, this.mystrans.getLocalRotation());
                    this.adjustDir = false;
                }
                var distadd = this.speed * delta;
                if (distadd > dist) distadd = dist;
                var lerp = distadd / dist;
                var resultPosition = new egret3d.Vector3();
                egret3d.Vector3.lerp(this.mystrans.getLocalPosition(), this.paths[this.folowindex], lerp, resultPosition);
                this.mystrans.setLocalPosition(resultPosition);
            }
        }

    }
}