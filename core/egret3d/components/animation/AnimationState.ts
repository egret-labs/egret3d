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
        public readonly states: AnimationBaseState[] = [];

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
     * 
     */
    export abstract class AnimationBaseState extends paper.BaseRelease<AnimationBaseState>{
        /**
         * 
         */
        public weight: number;
        /**
         * @private
         */
        public animationLayer: AnimationLayer;
        /**
         * @private
         */
        public animationNode: AnimationBaseNode | null;
        /**
         * @internal
         */
        public _globalWeight: number;
        /**
         * @internal
         */
        public _globalTimeScale: number;
        /**
         * @internal
         */
        public _parent: AnimationTreeState | null;

        protected constructor() {
            super();
        }

        public onClear() {
            this.weight = 1.0;
            this.animationLayer = null!;
            this.animationNode = null;

            this._globalWeight = 0.0;
            this._globalTimeScale = 1.0;
            this._parent = null;
        }
        /**
         * 
         */
        public abstract get name(): string;
    }
    /**
     * 
     */
    export class AnimationTreeState extends AnimationBaseState {
        private static readonly _instances: AnimationTreeState[] = [];
        /**
         * @internal
         */
        public static create(): AnimationTreeState {
            let instance: AnimationTreeState;
            if (this._instances.length > 0) {
                instance = this._instances.pop()!;
                instance._released = false;
            }
            else {
                instance = new AnimationTreeState();
                instance.onClear();
            }

            return instance;
        }
        /**
         * 
         */
        public get name() {
            return (this.animationNode as AnimationTree).name;
        }
    }
    /**
     * 动画状态。
     */
    export class AnimationState extends AnimationBaseState {
        private static readonly _instances: AnimationState[] = [];
        /**
         * @internal
         */
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
         * @private
         */
        public readonly channels: AnimationChannel[] = [];
        /**
         * 播放的动画数据。
         */
        public animationAsset: AnimationAsset;
        /**
         * @private
         */
        public animation: GLTFAnimation;
        /**
         * 播放的动画剪辑。
         */
        public animationClip: GLTFAnimationClip;
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
        public _timeScale: number;
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
        private readonly _lastMotionPosition: Vector3 = egret3d.Vector3.create();
        /**
         * @internal
         */
        private _animation: Animation;
        /**
         * @internal
         */
        public _applyRootMotion(x: number, y: number, z: number, weight: number) {
            if (!this._animation.applyRootMotion) {
                return;
            }

            const transform = this._animation.gameObject.transform;
            const position = helpVector3A.set(x, y, z);
            const lastMotionPosition = this._lastMotionPosition;

            lastMotionPosition.subtract(position, lastMotionPosition).applyMatrix3(transform.localToParentMatrix).multiplyScalar(weight);
            transform.translate(lastMotionPosition);
            lastMotionPosition.copy(position);
        }
        /**
         * @internal
         */
        public _initialize(animation: Animation, animationLayer: AnimationLayer, animationNode: AnimationNode | null, animationAsset: AnimationAsset, animationClip: GLTFAnimationClip) {
            const assetConfig = animationAsset.config;

            this.animationAsset = animationAsset;
            this.animation = (assetConfig.animations as GLTFAnimation[])[0]; // TODO 动画数据暂不合并。
            this.animationClip = animationClip;
            this.animationLayer = animationLayer;
            this.animationNode = animationNode;
            this._animation = animation;

            if (this.animation.channels) {
                const animationMask = animationLayer.mask as AnimationMask | null;
                const jointNames = animationMask ? animationMask.jointNames : null;
                const rootGameObject = animation.gameObject;
                const children = rootGameObject.transform.getAllChildren({}) as { [key: string]: Transform | (Transform[]) };
                children["__root__"] = rootGameObject.transform; // 

                for (const glTFChannel of this.animation.channels as GLTFAnimationChannel[]) {
                    const nodeIndex = glTFChannel.target.node;
                    const pathName = glTFChannel.target.path;
                    const extension = glTFChannel.extensions ? glTFChannel.extensions.paper : null;

                    if (nodeIndex === undefined) {
                        // const channel = AnimationChannel.create();
                        // channel.components = animation;
                        // this.channels.push(channel);

                        switch (pathName) {
                            default:
                                console.warn("Unknown animation channel.", pathName);
                                break;
                        }
                    }
                    else {
                        const nodeName = this.animationAsset.getNode(nodeIndex).name!;
                        if (!(nodeName in children) || (jointNames && jointNames.indexOf(nodeName) < 0)) {
                            continue;
                        }

                        const channel = AnimationChannel.create();
                        let transform = children[nodeName];
                        let binder: AnimationBinder | null = null;

                        if (Array.isArray(transform)) {
                            transform = transform[0];
                        }

                        channel.glTFChannel = glTFChannel;
                        channel.glTFSampler = this.animation.samplers[glTFChannel.sampler];
                        channel.inputBuffer = this.animationAsset.createTypeArrayFromAccessor(this.animationAsset.getAccessor(channel.glTFSampler.input)) as Float32Array;
                        channel.outputBuffer = this.animationAsset.createTypeArrayFromAccessor(this.animationAsset.getAccessor(channel.glTFSampler.output)) as Float32Array;
                        this.channels.push(channel);

                        if (!extension) {
                            binder = channel.binder = animation._getBinder(nodeName, pathName);
                            binder.target = transform;
                        }

                        switch (pathName) {
                            case "translation":
                                channel.updateTarget = channel.onUpdateTranslation;
                                if (binder!.bindPose === null) {
                                    binder!.bindPose = Vector3.create().copy(transform.localPosition);
                                    binder!.updateTarget = binder!.onUpdateTranslation;
                                }
                                break;

                            case "rotation":
                                channel.updateTarget = channel.onUpdateRotation;
                                if (binder!.bindPose === null) {
                                    binder!.bindPose = Quaternion.create().copy(transform.localRotation);
                                    binder!.updateTarget = binder!.onUpdateRotation;
                                }
                                break;

                            case "scale":
                                channel.updateTarget = channel.onUpdateScale;
                                if (binder!.bindPose === null) {
                                    binder!.bindPose = Vector3.create().copy(transform.localScale);
                                    binder!.updateTarget = binder!.onUpdateScale;
                                }
                                break;

                            case "weights":
                                // TODO
                                break;

                            case "custom":
                                switch (extension!.type) {
                                    case "paper.GameObject":
                                        switch (extension!.property) {
                                            case "activeSelf":
                                                channel.binder = transform;
                                                channel.updateTarget = channel.onUpdateActive;
                                                break;
                                        }
                                        break;

                                    default:
                                        const componentClass = egret.getDefinitionByName(extension!.type) as paper.IComponentClass<paper.BaseComponent> | undefined | null; // TODO 不依赖 getDefinitionByName

                                        if (componentClass) {
                                            const component = transform.gameObject.getComponent(componentClass);
                                            if (component) {
                                                const uri = extension!.uri;
                                                const needUpdate = extension!.needUpdate;
                                                channel.updateTarget = channel.onUpdateFloat; // TODO

                                                if (uri) {
                                                    const paths = uri.split("/");
                                                    let target: any = component;
                                                    let updateTarget: any = null;
                                                    let path = "";

                                                    for (path of paths) {
                                                        if (!path) {
                                                            continue;
                                                        }

                                                        if (path === "$") { // 标识为拥有 needUpdate 接口的目标。
                                                            updateTarget = target;
                                                        }
                                                        else {
                                                            target = target[path];
                                                        }
                                                    }

                                                    channel.binder = target;
                                                    if (needUpdate !== undefined && needUpdate >= 0) {
                                                        channel.needUpdate = (updateTarget || target).needUpdate;
                                                    }
                                                }
                                                else {
                                                    channel.binder = component;
                                                    if (needUpdate !== undefined && needUpdate >= 0) {
                                                        channel.needUpdate = (component as any).needUpdate; // TODO interface
                                                    }
                                                }
                                            }
                                            else {
                                                console.warn("Can not find component.", extension!.type);
                                            }
                                        }
                                        else {
                                            console.warn("Unknown component class.", extension!.type);
                                        }
                                }
                                break;

                            default:
                                console.warn("Unknown animation channel.", pathName);
                                break;
                        }
                    }
                }
            }
        }

        public onClear() {
            super.onClear();

            for (const channel of this.channels) {
                channel.release();
            }

            this.playTimes = 0;
            this.currentPlayTimes = 0;
            this.channels.length = 0;
            this.animationAsset = null!;
            this.animation = null!;
            this.animationClip = null!;

            this._playheadEnabled = true;
            this._playState = -1;
            this._timeScale = 1.0;
            this._time = 0.0;
            this._currentTime = -1.0;
            this._lastMotionPosition.clear();
            this._animation = null!;
        }
        /**
         * 继续该动画状态的播放。
         */
        public play(): this {
            this._playheadEnabled = true;

            return this;
        }
        /**
         * 停止该动画状态的播放。
         */
        public stop(): this {
            this._playheadEnabled = false;

            return this;
        }
        /**
         * 该动画状态是否正在播放。
         */
        public get isPlaying(): boolean {
            return this._playheadEnabled && this._playState !== 1;
        }
        /**
         * 该动画状态是否播放完毕。
         */
        public get isCompleted(): boolean {
            return this._playState === 1;
        }
        /**
         * 该动画状态的播放速度。
         */
        public get timeScale(): number {
            return this._timeScale;
        }
        public set timeScale(value: number) {
            if (value !== value) {
                value = 0.0;
            }

            this._timeScale = value;
        }
        /**
         * 该动画状态的总播放时间。
         */
        public get totalTime(): number {
            return this.animationClip.duration;
        }
        /**
         * 该动画状态的当前播放时间。
         */
        public get currentTime(): number {
            return this._currentTime;
        }
        /**
         * 
         */
        public get name() {
            return this.animationClip ? this.animationClip.name : "";
        }
    }
}