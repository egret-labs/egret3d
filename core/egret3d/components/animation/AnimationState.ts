namespace egret3d {
    /**
     * @private
     */
    export class AnimationFadeState extends paper.BaseRelease<AnimationFadeState> {
        private static readonly _instances: AnimationFadeState[] = [];
        public static create(): AnimationFadeState {
            let instance: AnimationFadeState;
            if (this._instances.length > 0) {
                instance = this._instances.pop()!;
                instance._released = false;
            }
            else {
                instance = new AnimationFadeState();
                instance.onClear();
            }

            return instance;
        }
        /**
         * -1: Fade in, 0: Fade complete, 1: Fade out;
         */
        public fadeState: -1 | 0 | 1;
        /**
         * -1: Fade start, 0: Fading, 1: Fade complete;
         */
        public subFadeState: -1 | 0 | 1;
        public progress: number;
        public time: number;
        public totalTime: number;
        public readonly states: AnimationState[] = [];

        private constructor() {
            super();
        }

        public onClear() {
            for (const state of this.states) {
                state.release();
            }

            this.fadeState = -1;
            this.subFadeState = -1;
            this.progress = 0.0;
            this.time = 0.0;
            this.totalTime = 0.0;
            this.states.length = 0;
        }

        public fadeOut(totalTime: number): this {
            if (this.fadeState > 0) {
                if (totalTime > this.totalTime - this.time) { // If the animation is already in fade out, the new fade out will be ignored.
                    return this;
                }
            }
            else {
                this.fadeState = 1;
                this.subFadeState = -1;

                if (totalTime <= 0.0 || this.progress <= 0.0) {
                    this.progress = Const.EPSILON; // Modify fade progress to different value.
                }
            }

            this.totalTime = this.progress > Const.EPSILON ? totalTime / this.progress : 0.0;
            this.time = this.totalTime * (1.0 - this.progress);

            return this;
        }
    }
    /**
     * 动画状态。
     */
    export class AnimationState extends paper.BaseRelease<AnimationState> {
        private static readonly _instances: AnimationState[] = [];

        public static create(): AnimationState {
            let instance: AnimationState;
            if (this._instances.length > 0) {
                instance = this._instances.pop()!;
                instance._released = false;
            }
            else {
                instance = new AnimationState();
                instance.onClear();
            }

            return instance;
        }
        /**
         * 动画总播放次数。
         */
        public playTimes: uint;
        /**
         * 动画当前播放次数。
         */
        public currentPlayTimes: uint;
        /**
         * 
         */
        public weight: number;
        /**
         * @private
         */
        public readonly channels: AnimationChannel[] = [];
        /**
         * @private
         */
        public animationLayer: AnimationLayer;
        /**
         * @private
         */
        public animationNode: AnimationNode;
        /**
         * @private
         */
        public animationAsset: AnimationAsset;
        /**
         * 播放的动画数据。
         */
        public animation: GLTFAnimation;
        /**
         * 播放的动画剪辑。
         */
        public animationClip: GLTFAnimationClip;
        // public parent: AnimationState | null;

        /**
         * 是否允许播放。
         * @internal
         */
        public _playheadEnabled: boolean;
        /**
         * 播放状态。
         * -1: start, 0: playing, 1: complete;
         * @internal
         */
        public _playState: -1 | 0 | 1;
        /**
         * 本地播放时间。
         * @internal
         */
        public _time: number;
        /**
         * 当前动画时间。
         * @internal
         */
        public _currentTime: number;
        /**
         * @internal
         */
        public _globalWeight: number;

        private constructor() {
            super();
        }

        public onClear() {
            for (const channel of this.channels) {
                channel.release();
            }

            this.playTimes = 0;
            this.currentPlayTimes = 0;
            this.weight = 1.0;
            this.channels.length = 0;
            this.animationNode = null!;
            this.animationAsset = null!;
            this.animation = null!;
            this.animationClip = null!;

            this._playheadEnabled = true;
            this._playState = -1;
            this._time = 0.0;
            this._currentTime = 0.0;
            this._globalWeight = 0.0;
        }
        /**
         * @internal
         */
        public _initialize(animation: Animation, animationLayer: AnimationLayer, animationNode: AnimationNode, animationAsset: AnimationAsset, animationClip: GLTFAnimationClip) {
            const assetConfig = animationAsset.config;

            this.animationAsset = animationAsset;
            this.animation = (assetConfig.animations as GLTFAnimation[])[0]; // TODO 动画数据暂不合并。
            this.animationClip = animationClip;
            this.animationNode = animationNode;

            if (this.animation.channels) {
                const rootGameObject = animation.gameObject;
                const children = rootGameObject.transform.getAllChildren({}) as { [key: string]: Transform | (Transform[]) };
                children["__root__"] = rootGameObject.transform; //

                for (const glTFChannel of this.animation.channels) {
                    const nodeName = this.animationAsset.getNode(glTFChannel.target.node!).name!;
                    if (!(nodeName! in children)) {
                        continue;
                    }

                    const pathName = glTFChannel.target.path;
                    const transforms = children[nodeName!];
                    const channel = AnimationChannel.create();
                    const binder = animation._getBinder(nodeName, pathName);

                    channel.glTFChannel = glTFChannel;
                    channel.glTFSampler = this.animation.samplers[glTFChannel.sampler];
                    channel.inputBuffer = this.animationAsset.createTypeArrayFromAccessor(this.animationAsset.getAccessor(channel.glTFSampler.input));
                    channel.outputBuffer = this.animationAsset.createTypeArrayFromAccessor(this.animationAsset.getAccessor(channel.glTFSampler.output));
                    channel.binder = binder;
                    binder.components = transforms; // TODO 更多组件

                    switch (pathName) {
                        case "translation":
                            binder.updateTarget = AnimationBinder.onUpdateTranslation;
                            if (!binder.bindPose) {
                                binder.bindPose = Vector3.create().copy((transforms as Transform).localPosition);
                            }
                            break;

                        case "rotation":
                            binder.updateTarget = AnimationBinder.onUpdateRotation;
                            if (!binder.bindPose) {
                                binder.bindPose = Quaternion.create().copy((transforms as Transform).localRotation);
                            }
                            break;

                        case "scale":
                            binder.updateTarget = AnimationBinder.onUpdateScale;
                            if (!binder.bindPose) {
                                binder.bindPose = Vector3.create().copy((transforms as Transform).localScale);
                            }
                            break;

                        case "weights":
                            // TODO
                            break;

                        case "custom":
                            switch (channel.glTFChannel.extensions!.paper.type) {
                                case "paper.GameObject":
                                    switch (channel.glTFChannel.extensions!.paper.property) {
                                        case "activeSelf":
                                            binder.updateTarget = AnimationBinder.onUpdateActive;
                                            break;
                                    }
                                    break;
                            }
                            break;

                        default:
                            console.warn("Unknown animation channel.", channel.glTFChannel.target.path);
                            break;
                    }

                    this.channels.push(channel);
                }
            }
        }

        public play() {
            this._playheadEnabled = true;
        }

        public stop() {
            this._playheadEnabled = false;
        }

        public get isPlaying() {
            return this._playheadEnabled && this._playState !== 1;
        }

        public get isCompleted() {
            return this._playState === 1;
        }
        /**
         * 播放速度。
         */
        public get timeScale(): number {
            return this.animationNode.timeScale;
        }
        public set timeScale(value: number) {
            if (DEBUG && value !== value) {
                throw new Error();
            }

            this.animationNode.timeScale = value;
        }

        public get totalTime() {
            return this.animationClip.duration;
        }

        public get currentTime() {
            return this._currentTime;
        }
    }
}