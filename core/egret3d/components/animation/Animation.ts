namespace egret3d {
    /**
     * 
     */
    class BlendLayer {
        private static _instances = [] as BlendLayer[];

        public static create() {
            if (this._instances.length > 0) {
                return this._instances.pop()!;
            }

            return new BlendLayer();
        }

        public dirty: number = 0;
        public layer: number = 0;
        public leftWeight: number = 0.0;
        public layerWeight: number = 0.0;
        public blendWeight: number = 0.0;

        private constructor() { }

        public release() {
            if (BlendLayer._instances.indexOf(this) >= 0) {
                throw new Error();
            }

            this.dirty = 0;
            this.layer = 0;
            this.leftWeight = 0.0;
            this.layerWeight = 0.0;
            this.blendWeight = 0.0;

            BlendLayer._instances.push(this);
        }

        public update(animationState: AnimationState) {
            const animationLayer = animationState.layer;
            let animationWeight = animationState._globalWeight;

            if (this.dirty > 0) {
                if (this.leftWeight > 0.0) {
                    if (animationState.additive && this.layer !== animationLayer) {
                        if (this.layerWeight >= this.leftWeight) {
                            this.leftWeight = 0.0;

                            return false;
                        }

                        this.layer = animationLayer;
                        this.leftWeight -= this.layerWeight;
                        this.layerWeight = animationWeight * this.leftWeight;
                    }

                    animationWeight *= this.leftWeight;
                    this.dirty++;
                    this.blendWeight = animationWeight;

                    return true;
                }

                return false;
            }

            this.dirty++;
            this.layer = animationLayer;
            this.leftWeight = 1.0;
            this.layerWeight = animationWeight;
            this.blendWeight = animationWeight;
        }
    }
    /**
     * 
     */
    class AnimationChannel {
        private static _instances = [] as AnimationChannel[];

        public static create() {
            if (this._instances.length > 0) {
                return this._instances.pop()!;
            }

            return new AnimationChannel();
        }

        private constructor() { }

        public release() {
            if (AnimationChannel._instances.indexOf(this) >= 0) {
                throw new Error();
            }


            AnimationChannel._instances.push(this);
        }

        glTFChannel: GLTFAnimationChannel;
        glTFSampler: gltf.AnimationSampler;
        blendLayer: BlendLayer | null;
        components: paper.BaseComponent | paper.BaseComponent[];
        inputBuffer: Float32Array;
        outputBuffer: Float32Array;
        update: ((channel: AnimationChannel, animationState: AnimationState) => void) | null = null;
    }
    const _animationChannels: AnimationChannel[] = [];
    /**
     * 动画混合节点。
     */
    export abstract class BlendNode {
        /**
         * @private
         */
        public additive: boolean = false;
        /**
         * 动画混合模式。（根节点有效）
         */
        public layer: number = 0;
        /**
         * 节点权重。
         */
        public weight: number = 1.0;
        /**
         * 淡入淡出的时间。
         */
        public fadeTime: number = 1.0;
        /**
         * 父节点。
         */
        public parent: BlendNode | null = null;
        /**
         * -1: Fade in, 0: Fade complete, 1: Fade out;
         * @internal
         */
        public _fadeState: number = -1;
        /**
         * -1: Fade start, 0: Fading, 1: Fade complete;
         * @internal
         */
        public _subFadeState: number = -1;
        /**
         * 累计权重。
         * @internal
         */
        public _globalWeight: number = 0.0;
        /**
         * 融合进度。
         * @internal
         */
        public _fadeProgress: number = 0.0;
        /**
         * 全局融合时间标记。
         */
        protected _fadeTimeStart: number = 0.0;

        protected _onFadeStateChange() {

        }

        public update(globalTime: number) {
            const isFadeOut = this._fadeState > 0;
            const localFadeTime = globalTime - this._fadeTimeStart;

            if (this._subFadeState < 0) { // Fade start event.
                this._subFadeState = 0;
                this._onFadeStateChange();
            }

            if (localFadeTime >= this.fadeTime) { // Fade complete.
                this._subFadeState = 1;
                this._fadeProgress = isFadeOut ? 0.0 : 1.0;
            }
            else if (localFadeTime > 0.0) { // Fading.
                this._fadeProgress = isFadeOut ? (1.0 - localFadeTime / this.fadeTime) : (localFadeTime / this.fadeTime);
            }
            else { // Before fade.
                this._fadeProgress = isFadeOut ? 1.0 : 0.0;
            }

            if (this._subFadeState > 0) { // Fade complete event.
                if (!isFadeOut) {
                    this._fadeState = 0;
                    this._onFadeStateChange();
                }
            }

            this._globalWeight = this.weight * this._fadeProgress;
            if (this.parent) {
                this._globalWeight *= this.parent._globalWeight;
            }
        }

        public fadeOut(fadeTime: number) {
            const globalTime = paper.Time.time; //
            const localFadeTime = globalTime - this._fadeTimeStart;

            if (this._fadeState > 0) {
                if (fadeTime > this.fadeTime - localFadeTime) { // If the animation is already in fade out, the new fade out will be ignored.
                    return;
                }
            }
            else {
                this._fadeState = 1;
                this._subFadeState = -1;

                if (fadeTime <= 0.0 || this._fadeProgress <= 0.0) {
                    this._fadeProgress = 0.000001; // Modify fade progress to different value.
                }
            }

            this.fadeTime = this._fadeProgress > 0.000001 ? fadeTime / this._fadeProgress : 0.0;
            this._fadeTimeStart = globalTime - this.fadeTime * (1.0 - this._fadeProgress);
        }
    }
    /**
     * 动画混合树节点。
     */
    export class BlendTree extends BlendNode {
        private readonly _blendNodes: BlendNode[] = [];
    }
    /**
     * 动画状态。
     */
    export class AnimationState extends BlendNode {
        /**
         * @private
         */
        public layer: number = 0;
        /**
         * 动画总播放次数。
         */
        public playTimes: number = 0;
        /**
         * 动画当前播放次数。
         */
        public currentPlayTimes: number = 0;
        /**
         * 播放速度。
         */
        public timeScale: number = 1.0;
        /**
         * @private
         */
        public animationAsset: GLTFAsset = null as any;
        /**
         * 播放的动画数据。
         */
        public animation: GLTFAnimation = null as any;
        /**
         * 播放的动画剪辑。
         */
        public animationClip: GLTFAnimationClip = null as any;
        /**
         * 是否允许播放。
         */
        private _isPlaying: boolean = true;
        /**
         * 播放状态。
         * -1: start, 0: playing, 1: complete;
         */
        private _playState: number = -1;
        /**
         * 全局播放时间标记。
         */
        private _playTimeStart: number = 0.0;
        /**
         * 本地播放时间。
         */
        private _playTime: number = 0.0;
        private _animationComponent: Animation = null as any;
        // TODO cache.
        private readonly _channels: AnimationChannel[] = [];

        private _onUpdateTranslation(channel: AnimationChannel, animationState: AnimationState) {
            let isInterpolation = false;
            let frameIndex = 0;
            const inputBuffer = channel.inputBuffer;
            const outputBuffer = channel.outputBuffer;

            if (animationState._playTime <= inputBuffer[0]) {
            }
            else if (animationState._playTime >= inputBuffer[inputBuffer.length - 1]) {
                frameIndex = inputBuffer.length - 1;
            }
            else {
                isInterpolation = channel.glTFSampler.interpolation !== "STEP";

                for (let i = 0, l = inputBuffer.length; i < l; ++i) { // TODO 更快的查询
                    if (animationState._playTime < inputBuffer[i]) {
                        break;
                    }

                    frameIndex = i;
                }
            }

            const isComponents = Array.isArray(channel.components);
            let offset = frameIndex * 3;
            let x = outputBuffer[offset++];
            let y = outputBuffer[offset++];
            let z = outputBuffer[offset++];

            if (isInterpolation) {
                const progress = (animationState._playTime - inputBuffer[frameIndex]) / (inputBuffer[frameIndex + 1] - inputBuffer[frameIndex]);
                x += (outputBuffer[offset++] - x) * progress;
                y += (outputBuffer[offset++] - y) * progress;
                z += (outputBuffer[offset++] - z) * progress;
            }

            if (isComponents) {
                for (const component of channel.components as Transform[]) {
                    component.setLocalPosition(x, y, z);
                }
            }
            else {
                (channel.components as Transform).setLocalPosition(x, y, z);
            }
        }

        private _onUpdateRotation(channel: AnimationChannel, animationState: AnimationState) {
            let isInterpolation = false;
            let frameIndex = 0;
            const inputBuffer = channel.inputBuffer;
            const outputBuffer = channel.outputBuffer;

            if (animationState._playTime <= inputBuffer[0]) {
            }
            else if (animationState._playTime >= inputBuffer[inputBuffer.length - 1]) {
                frameIndex = inputBuffer.length - 1;
            }
            else {
                isInterpolation = channel.glTFSampler.interpolation !== "STEP";

                for (let i = 0, l = inputBuffer.length; i < l; ++i) { // TODO 更快的查询
                    if (animationState._playTime < inputBuffer[i]) {
                        break;
                    }

                    frameIndex = i;
                }
            }

            const isComponents = Array.isArray(channel.components);
            let offset = frameIndex * 4;
            let x = outputBuffer[offset++];
            let y = outputBuffer[offset++];
            let z = outputBuffer[offset++];
            let w = outputBuffer[offset++];

            if (isInterpolation) {
                const progress = (animationState._playTime - inputBuffer[frameIndex]) / (inputBuffer[frameIndex + 1] - inputBuffer[frameIndex]);
                x += (outputBuffer[offset++] - x) * progress;
                y += (outputBuffer[offset++] - y) * progress;
                z += (outputBuffer[offset++] - z) * progress;
                w += (outputBuffer[offset++] - w) * progress;
            }

            if (isComponents) {
                for (const component of channel.components as Transform[]) {
                    component.setLocalRotation(x, y, z, w);
                }
            }
            else {
                (channel.components as Transform).setLocalRotation(x, y, z, w);
            }
        }

        private _onUpdateScale(channel: AnimationChannel, animationState: AnimationState) {
            let isInterpolation = false;
            let frameIndex = 0;
            const inputBuffer = channel.inputBuffer;
            const outputBuffer = channel.outputBuffer;

            if (animationState._playTime <= inputBuffer[0]) {
            }
            else if (animationState._playTime >= inputBuffer[inputBuffer.length - 1]) {
                frameIndex = inputBuffer.length - 1;
            }
            else {
                isInterpolation = channel.glTFSampler.interpolation !== "STEP";

                for (let i = 0, l = inputBuffer.length; i < l; ++i) { // TODO 更快的查询
                    if (animationState._playTime < inputBuffer[i]) {
                        break;
                    }

                    frameIndex = i;
                }
            }

            const isComponents = Array.isArray(channel.components);
            let offset = frameIndex * 3;
            let x = outputBuffer[offset++];
            let y = outputBuffer[offset++];
            let z = outputBuffer[offset++];

            if (isInterpolation) {
                const progress = (animationState._playTime - inputBuffer[frameIndex]) / (inputBuffer[frameIndex + 1] - inputBuffer[frameIndex]);
                x += (outputBuffer[offset++] - x) * progress;
                y += (outputBuffer[offset++] - y) * progress;
                z += (outputBuffer[offset++] - z) * progress;
            }

            if (isComponents) {
                for (const component of channel.components as Transform[]) {
                    component.setLocalScale(x, y, z);
                }
            }
            else {
                (channel.components as Transform).setLocalScale(x, y, z);
            }
        }

        private _onUpdateActive(channel: AnimationChannel, animationState: AnimationState) {
            let frameIndex = 0;
            const inputBuffer = channel.inputBuffer;
            const outputBuffer = channel.outputBuffer;

            if (animationState._playTime <= inputBuffer[0]) {
            }
            else if (animationState._playTime >= inputBuffer[inputBuffer.length - 1]) {
                frameIndex = inputBuffer.length - 1;
            }
            else {
                for (let i = 0, l = inputBuffer.length; i < l; ++i) { // TODO 更快的查询
                    if (animationState._playTime < inputBuffer[i]) {
                        break;
                    }

                    frameIndex = i;
                }
            }

            const isComponents = Array.isArray(channel.components);
            const activeSelf = outputBuffer[frameIndex] !== 0;

            if (isComponents) {
                for (const component of channel.components as Transform[]) {
                    component.gameObject.activeSelf = activeSelf;
                }
            }
            else {
                (channel.components as Transform).gameObject.activeSelf = activeSelf;
            }
        }
        /**
         * @internal
         */
        public initialize(animationComponent: Animation, animationAsset: GLTFAsset, animationClip: GLTFAnimationClip) {
            const globalTime = paper.Time.time; //
            const assetConfig = animationAsset.config;
            //
            this.animationAsset = animationAsset;
            this.animationClip = animationClip;
            this.animation = (assetConfig.animations as GLTFAnimation[])[0]; // TODO 动画数据暂不合并。
            //
            this._fadeTimeStart = globalTime;
            this._playTimeStart = globalTime;
            this._animationComponent = animationComponent;

            if (this.animation.channels) {
                const rootGameObject = this._animationComponent.gameObject;
                const children = rootGameObject.transform.getAllChildren({}) as { [key: string]: Transform | (Transform[]) };
                children["__root__"] = rootGameObject.transform;

                for (const glTFChannel of this.animation.channels) {
                    const node = this.animationAsset.getNode(glTFChannel.target.node || 0);
                    if (!(node.name! in children)) {
                        continue;
                    }

                    const transforms = children[node.name!];
                    const channel = _animationChannels.length > 0 ? _animationChannels.pop()! : AnimationChannel.create();
                    const pathName = glTFChannel.target.path;
                    channel.glTFChannel = glTFChannel;
                    channel.glTFSampler = this.animation.samplers[glTFChannel.sampler];
                    channel.components = transforms; // TODO 更多组件
                    channel.inputBuffer = this.animationAsset.createTypeArrayFromAccessor(this.animationAsset.getAccessor(channel.glTFSampler.input));
                    channel.outputBuffer = this.animationAsset.createTypeArrayFromAccessor(this.animationAsset.getAccessor(channel.glTFSampler.output));

                    switch (pathName) {
                        case "translation":
                            channel.update = this._onUpdateTranslation;
                            channel.blendLayer = this._animationComponent._getBlendlayer(pathName, node.name!);
                            break;

                        case "rotation":
                            channel.update = this._onUpdateRotation;
                            channel.blendLayer = this._animationComponent._getBlendlayer(pathName, node.name!);
                            break;

                        case "scale":
                            channel.update = this._onUpdateScale;
                            channel.blendLayer = this._animationComponent._getBlendlayer(pathName, node.name!);
                            break;

                        case "weights":
                            // TODO
                            break;

                        case "custom":
                            switch (channel.glTFChannel.extensions!.paper.type) {
                                case "paper.GameObject":
                                    switch (channel.glTFChannel.extensions!.paper.property) {
                                        case "activeSelf":
                                            channel.update = this._onUpdateActive;
                                            break;
                                    }
                                    break;
                            }
                            break;

                        default:
                            console.warn("Unknown animation channel.", channel.glTFChannel.target.path);
                            break;
                    }

                    this._channels.push(channel);
                }
            }
        }
        /**
         * 
         */
        public update(globalTime: number) {
            super.update(globalTime);

            // const prevPlayTimes = this.currentPlayTimes;
            const prevPlayState = this._playState;
            const timeScale = this.timeScale * this._animationComponent.timeScale;
            const timeScaleR = timeScale === 0.0 ? 0.0 : 1.0 / timeScale;
            const position = this.animationClip.position;
            const duration = this.animationClip.duration;
            const totalTime = this.playTimes * duration;
            let localPlayTime = (globalTime - this._playTimeStart) * timeScaleR;

            let currentTime = 0.0;

            if (this.playTimes > 0 && (timeScale >= 0.0 ? localPlayTime >= totalTime : localPlayTime <= 0.0)) {
                if (this._playState <= 0 && this._isPlaying) {
                    this._playState = 1;
                }

                this.currentPlayTimes = this.playTimes;

                if (localPlayTime >= totalTime) {
                    // currentTime = duration + 0.000001; // Precision problem.
                    currentTime = duration; // TODO CHECK.
                }
                else {
                    currentTime = 0.0;
                }
            }
            else {
                if (this._playState !== 0 && this._isPlaying) {
                    this._playState = 0;
                }

                if (localPlayTime < 0.0) {
                    localPlayTime = -localPlayTime;
                    this.currentPlayTimes = Math.floor(localPlayTime / duration);
                    currentTime = duration - (localPlayTime % duration);
                }
                else {
                    this.currentPlayTimes = Math.floor(localPlayTime / duration);
                    currentTime = localPlayTime % duration;
                }
            }

            currentTime += position;
            this._playTime = currentTime;

            if (this._channels.length > 0) {
                for (const channel of this._channels) {
                    if (channel.update) {
                        channel.update(channel, this);
                    }
                }
            }

            if (prevPlayState !== this._playState && this._playState === 1) {
                this._animationComponent._dispatchEvent("complete", this); // TODO buffer event.

                const animationNames = this._animationComponent._animationNames;
                if (animationNames.length > 0) {
                    const animationName = animationNames.shift();
                    this._animationComponent.play(animationName);
                }
            }
        }

        public fateOut(): void {
            this._fadeState = 1;
            this._subFadeState = -1;
        }
    }
    /**
     * 动画组件。
     */
    @paper.allowMultiple
    export class Animation extends paper.BaseComponent {
        /**
         * @private
         */
        @paper.serializedField
        public autoPlay: boolean = false;
        /**
         * 动画速度。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public timeScale: number = 1.0;
        /**
         * 动画数据列表。
         */
        @paper.serializedField
        private readonly _animations: GLTFAsset[] = [];
        /**
         * 骨骼姿势列表。
         * @internal
         */
        public readonly _blendLayers: BlendLayer[] = [];
        /**
         * 混合节点列表。
         */
        private readonly _blendNodes: BlendNode[] = [];
        /**
         * @internal
         */
        public readonly _animationNames: string[] = [];
        private _fadeInParamter: any[] | null = null;
        /**
         * 最后一个播放的动画状态。
         * - 当进行动画混合时，该值通常没有任何意义。
         */
        private _lastAnimationState: AnimationState | null = null;
        /**
         * TODO more event type.
         * sendMessage.
         * @internal
         */
        public _dispatchEvent(type: string, animationState: AnimationState, eventObject?: any) {
            for (const component of this.gameObject.getComponents(paper.Behaviour as any, true) as paper.Behaviour[]) {
                if (component.onAnimationEvent) {
                    component.onAnimationEvent(type, animationState, eventObject);
                }
            }
        }
        /**
         * @internal
         */
        public _getBlendlayer(type: string, name: string): BlendLayer {
            if (!(type in this._blendLayers)) {
                this._blendLayers[type] = {};
            }

            const blendLayers = this._blendLayers[type];

            if (!(name in blendLayers)) {
                blendLayers[name] = BlendLayer.create();
            }

            return blendLayers[name];
        }
        /**
         * @internal
         */
        public _update(globalTime: number) {
            if (this._fadeInParamter) {
                this.fadeIn.apply(this, this._fadeInParamter);
                this._fadeInParamter = null;
            }

            const blendNodes = this._blendNodes;
            const blendNodeCount = blendNodes.length;

            if (blendNodeCount === 1) {
                const blendNode = blendNodes[0];

                if (blendNode._fadeState > 0 && blendNode._subFadeState > 0) {
                    blendNodes.length = 0;

                    if (this._lastAnimationState === blendNode) {
                        this._lastAnimationState = null;
                    }
                }
                else {
                    blendNode.update(globalTime);
                }
            }
            else if (blendNodeCount > 1) {
                for (let i = 0, r = 0; i < blendNodeCount; ++i) {
                    const blendNode = blendNodes[i];

                    if (blendNode._fadeState > 0 && blendNode._subFadeState > 0) {
                        r++;
                        if (this._lastAnimationState === blendNode) {
                            this._lastAnimationState = null;
                        }
                    }
                    else {
                        if (r > 0) {
                            blendNodes[i - r] = blendNode;
                        }

                        blendNode.update(globalTime);
                    }

                    if (i === blendNodeCount - 1 && r > 0) {
                        blendNodes.length -= r;

                        if (this._lastAnimationState === null && blendNodes.length > 0) {
                            const blendNode = blendNodes[blendNodes.length - 1];

                            if (blendNode instanceof AnimationState) {
                                this._lastAnimationState = blendNode;
                            }
                        }
                    }
                }
            }
            else {

            }
        }

        public uninitialize() {
            super.uninitialize();

            for (const blendLayer of this._blendLayers) {
                blendLayer.release();
            }

            this._blendLayers.length = 0;
        }

        public fadeIn(
            animationName: string | null = null,
            fadeTime: number, playTimes: number = -1,
            layer: number = 0, additive: boolean = false,
        ): AnimationState | null {
            let animationAsset: GLTFAsset | null = null;
            let animationClip: GLTFAnimationClip | null = null;

            for (const animation of this._animations) {
                animationAsset = animation;
                if (animationName) {
                    animationClip = animation.getAnimationClip(animationName);
                    if (animationClip !== null) {
                        break;
                    }
                }
                else {
                    animationClip = animation.getAnimationClip("");
                    break;
                }
            }

            if (!animationAsset || !animationClip) {
                return null;
            }

            for (const blendNode of this._blendNodes) {
                if ((!blendNode.parent && blendNode.layer === layer)) {
                    blendNode.fadeOut(fadeTime);
                }
            }

            const animationState = new AnimationState();
            animationState.initialize(this, animationAsset, animationClip);
            animationState.additive = additive;
            animationState.fadeTime = fadeTime;
            animationState.playTimes = playTimes < 0 ? (animationClip.playTimes || 0) : playTimes;

            // TODO sort by layer and blend tree.
            this._blendNodes.push(animationState);
            this._lastAnimationState = animationState;

            return animationState;
        }

        public play(animationNameOrNames: string | string[] | null = null, playTimes: number = -1): AnimationState | null {
            this._animationNames.length = 0;

            if (Array.isArray(animationNameOrNames)) {
                if (animationNameOrNames.length > 0) {
                    for (const animationName of animationNameOrNames) {
                        this._animationNames.push(animationName);
                    }

                    return this.fadeIn(this._animationNames.shift(), 0.0, playTimes);
                }

                return this.fadeIn(null, 0.0, playTimes);
            }

            return this.fadeIn(animationNameOrNames, 0.0, playTimes);
        }

        public stop() {
            for (const blendNode of this._blendNodes) {
                if (!blendNode.parent) {
                    blendNode.fadeOut(0.0);
                }
            }
        }

        public get lastAnimationnName(): string {
            return this._lastAnimationState ? this._lastAnimationState.animationClip.name : "";
        }
        /**
         * 动画数据列表。
         */
        public set animations(animations: ReadonlyArray<GLTFAsset>) {
            for (let i = 0, l = animations.length; i < l; i++) {
                this._animations[i] = animations[i];
            }
        }
        public get animations(): ReadonlyArray<GLTFAsset> {
            return this._animations;
        }
    }
}