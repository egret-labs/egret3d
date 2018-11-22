namespace egret3d {
    /**
     * 动画混合层。
     */
    class BlendLayer extends paper.BaseRelease<BlendLayer> {
        private static _instances = [] as BlendLayer[];

        public static create() {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!;
                instance._released = false;
                return instance;
            }

            return new BlendLayer();
        }

        public dirty: number = 0;
        public layer: number = 0;
        public leftWeight: number = 0.0;
        public layerWeight: number = 0.0;
        public blendWeight: number = 0.0;

        private constructor() {
            super();
        }

        public onClear() {
            this.reset();
        }

        public reset() {
            this.dirty = 0;
            this.layer = 0;
            this.leftWeight = 0.0;
            this.layerWeight = 0.0;
            this.blendWeight = 0.0;
        }

        public updateLayerAndWeight(animationState: AnimationState) {
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

            return true;
        }
    }
    /**
     * 动画通道。
     */
    class AnimationChannel extends paper.BaseRelease<AnimationChannel> {
        private static _instances = [] as AnimationChannel[];

        public static create() {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!;
                instance._released = false;
                return instance;
            }

            return new AnimationChannel();
        }

        private constructor() {
            super();
        }

        public boneIndex: int;
        public glTFChannel: GLTFAnimationChannel;
        public glTFSampler: gltf.AnimationSampler;
        public blendLayer: BlendLayer | null;
        public components: paper.BaseComponent | paper.BaseComponent[];
        public inputBuffer: Float32Array;
        public outputBuffer: Float32Array;
        public updateTarget: ((channel: AnimationChannel, animationState: AnimationState) => void) | null = null;

        public getFrameIndex(currentTime: number): uint {
            const inputBuffer = this.inputBuffer;
            const frameCount = inputBuffer.length;

            if (DEBUG && frameCount === 0) {
                throw new Error();
            }

            if (frameCount === 1) {
                return -1;
            }
            else if (currentTime <= inputBuffer[0]) {
                return 0;
            }
            else if (currentTime >= inputBuffer[frameCount - 1]) {
                return frameCount - 2;
            }

            let beginIndex = 0;
            let endIndex = frameCount - 1;

            while (endIndex - beginIndex > 1) {
                const middleIndex = beginIndex + ((endIndex - beginIndex) * 0.5) >> 0;
                if (currentTime >= inputBuffer[middleIndex]) {
                    beginIndex = middleIndex;
                }
                else {
                    endIndex = middleIndex;
                }
            }

            return beginIndex;
        }
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
        public fadeTotalTime: number = 1.0;
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
         * 本地融合时间。
         */
        protected _fadeTime: number = 0.0;

        protected _onFadeStateChange() {
        }
        /**
         * @internal
         */
        public _update(deltaTime: number) {
            if (this._fadeState !== 0 || this._subFadeState !== 0) {
                const isFadeOut = this._fadeState > 0;

                if (this._subFadeState < 0) { // Fade start event.
                    this._subFadeState = 0;
                    this._onFadeStateChange();
                }

                if (deltaTime < 0.0) {
                    deltaTime = -deltaTime;
                }

                this._fadeTime += deltaTime;

                if (this._fadeTime >= this.fadeTotalTime) { // Fade complete.
                    this._subFadeState = 1;
                    this._fadeProgress = isFadeOut ? 0.0 : 1.0;
                }
                else if (this._fadeTime > 0.0) { // Fading.
                    this._fadeProgress = isFadeOut ? (1.0 - this._fadeTime / this.fadeTotalTime) : (this._fadeTime / this.fadeTotalTime);
                }
                else { // Before fade.
                    this._fadeProgress = isFadeOut ? 1.0 : 0.0;
                }

                if (this._subFadeState > 0) { // Fade complete event.
                    if (!isFadeOut) {
                        this._fadeState = 0;
                        this._subFadeState = 0;
                        this._onFadeStateChange();
                    }
                }
            }

            this._globalWeight = this.weight * this._fadeProgress;
            if (this.parent) {
                this._globalWeight *= this.parent._globalWeight;
            }
        }

        public fadeOut(fadeOutTime: number) {
            if (fadeOutTime < 0.0 || fadeOutTime !== fadeOutTime) {
                fadeOutTime = 0.0;
            }

            if (this._fadeState > 0) {
                if (fadeOutTime > this.fadeTotalTime - this._fadeTime) { // If the animation is already in fade out, the new fade out will be ignored.
                    return;
                }
            }
            else {
                this._fadeState = 1;
                this._subFadeState = -1;

                if (fadeOutTime <= 0.0 || this._fadeProgress <= 0.0) {
                    this._fadeProgress = 0.000001; // Modify fade progress to different value.
                }
            }

            this.fadeTotalTime = this._fadeProgress > 0.000001 ? fadeOutTime / this._fadeProgress : 0.0;
            this._fadeTime = this.fadeTotalTime * (1.0 - this._fadeProgress);
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
        public animationAsset: AnimationAsset = null!;
        /**
         * 播放的动画数据。
         */
        public animation: GLTFAnimation = null!;
        /**
         * 播放的动画剪辑。
         */
        public animationClip: GLTFAnimationClip = null!;
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
         * 本地播放时间。
         */
        private _time: number = 0.0;
        /**
         * 当前动画时间。
         */
        private _currentTime: number = 0.0;
        // TODO cache.
        private readonly _channels: AnimationChannel[] = [];
        private _animationComponent: Animation = null as any;
        /**
         * @internal
         */
        public _mesh: BaseMesh | null = null;

        private _onUpdateTranslation(channel: AnimationChannel, animationState: AnimationState) {
            const interpolation = channel.glTFSampler.interpolation;
            const currentTime = animationState._currentTime;
            const outputBuffer = channel.outputBuffer;
            const frameIndex = channel.getFrameIndex(currentTime);

            let x: number, y: number, z: number;

            if (frameIndex >= 0) {
                let offset = frameIndex * 3;
                x = outputBuffer[offset++];
                y = outputBuffer[offset++];
                z = outputBuffer[offset++];

                if (!interpolation || interpolation !== "STEP") {
                    const inputBuffer = channel.inputBuffer;
                    const frameStart = inputBuffer[frameIndex];
                    const progress = (currentTime - frameStart) / (inputBuffer[frameIndex + 1] - frameStart);
                    x += (outputBuffer[offset++] - x) * progress;
                    y += (outputBuffer[offset++] - y) * progress;
                    z += (outputBuffer[offset++] - z) * progress;
                }
            }
            else {
                x = outputBuffer[0];
                y = outputBuffer[1];
                z = outputBuffer[2];
            }

            const isArray = Array.isArray(channel.components);
            const blendLayer = channel.blendLayer!;
            const blendWeight = blendLayer.blendWeight;
            const blendTarget = (isArray ? (channel.components as Transform[])[0].localPosition : (channel.components as Transform).localPosition) as Vector3;

            if (blendLayer.dirty > 1) {
                blendTarget.x += x * blendWeight;
                blendTarget.y += y * blendWeight;
                blendTarget.z += z * blendWeight;
            }
            else if (blendWeight !== 1.0) {
                blendTarget.x = x * blendWeight;
                blendTarget.y = y * blendWeight;
                blendTarget.z = z * blendWeight;
            }
            else {
                blendTarget.x = x;
                blendTarget.y = y;
                blendTarget.z = z;
            }

            if (isArray) {
                for (const component of channel.components as Transform[]) {
                    component.localPosition = blendTarget;
                }
            }
            else {

                const mesh = animationState._mesh;
                if (mesh) {
                    const bindTransform = mesh._bindTransforms!;
                    let offset = channel.boneIndex * 10;
                    blendTarget.x += bindTransform[offset++];
                    blendTarget.y += bindTransform[offset++];
                    blendTarget.z += bindTransform[offset++];
                }

                blendTarget.update();
            }
        }

        private _onUpdateRotation(channel: AnimationChannel, animationState: AnimationState) {
            const interpolation = channel.glTFSampler.interpolation;
            const currentTime = animationState._currentTime;
            const outputBuffer = channel.outputBuffer;
            const frameIndex = channel.getFrameIndex(currentTime);

            let x: number, y: number, z: number, w: number;

            if (frameIndex >= 0) {
                let offset = frameIndex * 4;
                x = outputBuffer[offset++];
                y = outputBuffer[offset++];
                z = outputBuffer[offset++];
                w = outputBuffer[offset++];

                if (!interpolation || interpolation !== "STEP") {
                    const inputBuffer = channel.inputBuffer;
                    const frameStart = inputBuffer[frameIndex];
                    const progress = (currentTime - frameStart) / (inputBuffer[frameIndex + 1] - frameStart);
                    x += (outputBuffer[offset++] - x) * progress;
                    y += (outputBuffer[offset++] - y) * progress;
                    z += (outputBuffer[offset++] - z) * progress;
                    w += (outputBuffer[offset++] - w) * progress;
                }
            }
            else {
                x = outputBuffer[0];
                y = outputBuffer[1];
                z = outputBuffer[2];
                w = outputBuffer[3];
            }

            const isArray = Array.isArray(channel.components);
            // const blendLayer = channel.blendLayer!;
            // const blendWeight = blendLayer.blendWeight;
            const blendTarget = (isArray ? (channel.components as Transform[])[0].localRotation : (channel.components as Transform).localRotation) as Quaternion;

            // if (blendLayer.dirty > 1) {
            //     blendTarget.x += x * blendWeight;
            //     blendTarget.y += y * blendWeight;
            //     blendTarget.z += z * blendWeight;
            //     blendTarget.w += w * blendWeight;
            //     blendTarget.normalize();
            // }
            // else if (blendWeight !== 1.0) {
            //     blendTarget.x = x * blendWeight;
            //     blendTarget.y = y * blendWeight;
            //     blendTarget.z = z * blendWeight;
            //     blendTarget.w = w * blendWeight;
            //     blendTarget.normalize();
            // }
            // else {
            blendTarget.x = x;
            blendTarget.y = y;
            blendTarget.z = z;
            blendTarget.w = w;
            // }

            if (isArray) {
                for (const component of channel.components as Transform[]) {
                    component.localRotation = blendTarget;
                }
            }
            else {
                blendTarget.update();
            }
        }

        private _onUpdateScale(channel: AnimationChannel, animationState: AnimationState) {
            const interpolation = channel.glTFSampler.interpolation;
            const currentTime = animationState._currentTime;
            const outputBuffer = channel.outputBuffer;
            const frameIndex = channel.getFrameIndex(currentTime);

            let x: number, y: number, z: number;

            if (frameIndex >= 0) {
                let offset = frameIndex * 3;
                x = outputBuffer[offset++];
                y = outputBuffer[offset++];
                z = outputBuffer[offset++];

                if (!interpolation || interpolation !== "STEP") {
                    const inputBuffer = channel.inputBuffer;
                    const frameStart = inputBuffer[frameIndex];
                    const progress = (animationState._currentTime - frameStart) / (inputBuffer[frameIndex + 1] - frameStart);
                    x += (outputBuffer[offset++] - x) * progress;
                    y += (outputBuffer[offset++] - y) * progress;
                    z += (outputBuffer[offset++] - z) * progress;
                }
            }
            else {
                x = outputBuffer[0];
                y = outputBuffer[1];
                z = outputBuffer[2];
            }

            const isArray = Array.isArray(channel.components);
            // const blendLayer = channel.blendLayer!;
            // const blendWeight = blendLayer.blendWeight;
            const blendTarget = (isArray ? (channel.components as Transform[])[0].localScale : (channel.components as Transform).localScale) as Vector3;

            // if (blendLayer.dirty > 1) {
            //     blendTarget.x += (x - 1.0) * blendWeight;
            //     blendTarget.y += (y - 1.0) * blendWeight;
            //     blendTarget.z += (z - 1.0) * blendWeight;
            // }
            // else if (blendWeight !== 1.0) {
            //     blendTarget.x = (x - 1.0) * blendWeight + 1.0;
            //     blendTarget.y = (y - 1.0) * blendWeight + 1.0;
            //     blendTarget.z = (z - 1.0) * blendWeight + 1.0;
            // }
            // else {
            blendTarget.x = x;
            blendTarget.y = y;
            blendTarget.z = z;
            // }

            if (isArray) {
                for (const component of channel.components as Transform[]) {
                    component.localScale = blendTarget;
                }
            }
            else {
                blendTarget.update();
            }
        }

        private _onUpdateActive(channel: AnimationChannel, animationState: AnimationState) {
            const currentTime = animationState._currentTime;
            const outputBuffer = channel.outputBuffer;
            const frameIndex = channel.getFrameIndex(currentTime);

            const activeSelf = (frameIndex >= 0 ? outputBuffer[frameIndex] : outputBuffer[0]) !== 0;

            if (Array.isArray(channel.components)) {
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
        public initialize(animationComponent: Animation, animationAsset: AnimationAsset, animationClip: GLTFAnimationClip) {
            const assetConfig = animationAsset.config;
            //
            this.animationAsset = animationAsset;
            this.animationClip = animationClip;
            this.animation = (assetConfig.animations as GLTFAnimation[])[0]; // TODO 动画数据暂不合并。
            //
            this._fadeTime = 0.0;
            this._time = 0.0;
            this._animationComponent = animationComponent;

            if (this.animation.channels) {
                const rootGameObject = this._animationComponent.gameObject;
                const children = rootGameObject.transform.getAllChildren({}) as { [key: string]: Transform | (Transform[]) };
                children["__root__"] = rootGameObject.transform; //
                //
                let skinnedMeshRenderer: SkinnedMeshRenderer | null = null;
                for (const child of animationComponent.gameObject.transform.children) {
                    if (!child.gameObject.renderer || child.gameObject.renderer.constructor !== SkinnedMeshRenderer) {
                        continue;
                    }

                    skinnedMeshRenderer = child.gameObject.renderer as SkinnedMeshRenderer;
                    this._mesh = skinnedMeshRenderer.mesh!;
                    animationAsset._modify(this._mesh);
                }

                for (const glTFChannel of this.animation.channels) {
                    const nodeName = this.animationAsset.getNode(glTFChannel.target.node!).name!;
                    if (!(nodeName! in children)) {
                        continue;
                    }

                    const transforms = children[nodeName!];
                    const channel = _animationChannels.length > 0 ? _animationChannels.pop()! : AnimationChannel.create();
                    const pathName = glTFChannel.target.path;
                    channel.glTFChannel = glTFChannel;
                    channel.glTFSampler = this.animation.samplers[glTFChannel.sampler];
                    channel.components = transforms; // TODO 更多组件
                    channel.inputBuffer = this.animationAsset.createTypeArrayFromAccessor(this.animationAsset.getAccessor(channel.glTFSampler.input));
                    channel.outputBuffer = this.animationAsset.createTypeArrayFromAccessor(this.animationAsset.getAccessor(channel.glTFSampler.output));

                    if (this._mesh) {
                        channel.boneIndex = this._mesh.boneIndices![nodeName];
                    }
                    else {
                        channel.boneIndex = -1;
                    }

                    switch (pathName) {
                        case "translation":
                            channel.blendLayer = this._animationComponent._getBlendlayer(pathName, nodeName);
                            channel.updateTarget = this._onUpdateTranslation;
                            break;

                        case "rotation":
                            channel.blendLayer = this._animationComponent._getBlendlayer(pathName, nodeName);
                            channel.updateTarget = this._onUpdateRotation;
                            break;

                        case "scale":
                            channel.blendLayer = this._animationComponent._getBlendlayer(pathName, nodeName);
                            channel.updateTarget = this._onUpdateScale;
                            break;

                        case "weights":
                            // TODO
                            break;

                        case "custom":
                            switch (channel.glTFChannel.extensions!.paper.type) {
                                case "paper.GameObject":
                                    switch (channel.glTFChannel.extensions!.paper.property) {
                                        case "activeSelf":
                                            channel.updateTarget = this._onUpdateActive;
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
         * @internal
         */
        public _update(deltaTime: number) {
            super._update(deltaTime);

            // Update time.
            if (this._isPlaying) { // 11
                deltaTime *= this.timeScale * this._animationComponent.timeScale;
                this._time += deltaTime;
            }

            // const isBlendDirty = this._fadeState !== 0 || this._subFadeState === 0;
            const prevPlayState = this._playState;
            // const prevPlayTimes = this.currentPlayTimes;
            // const prevTime = this._currentTime;
            const duration = this.animationClip.duration;
            const totalTime = this.playTimes * duration;

            if (this.playTimes > 0 && (this._time >= totalTime || this._time <= -totalTime)) {
                if (this._playState <= 0 && this._isPlaying) {
                    this._playState = 1;
                }

                this.currentPlayTimes = this.playTimes;

                if (this._time >= totalTime) {
                    // currentTime = duration + 0.000001; // Precision problem.
                    this._currentTime = duration; // TODO CHECK.
                }
                else {
                    this._currentTime = 0.0;
                }
            }
            else {
                if (this._playState !== 0 && this._isPlaying) {
                    this._playState = 0;
                }

                if (this._time < 0.0) {
                    this._time = -this._time;
                    this.currentPlayTimes = Math.floor(this._time / duration);
                    this._currentTime = duration - (this._time % duration);
                }
                else {
                    this.currentPlayTimes = Math.floor(this._time / duration);
                    this._currentTime = this._time % duration;
                }
            }

            this._currentTime += this.animationClip.position;

            if (this.weight !== 0.0) {
                for (const channel of this._channels) {
                    if (!channel.updateTarget) {
                        continue;
                    }

                    const blendLayer = channel.blendLayer;
                    if (!blendLayer || blendLayer.updateLayerAndWeight(this)) {
                        channel.updateTarget(channel, this);
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

        public play() {
            this._isPlaying = true;
        }

        public stop() {
            this._isPlaying = false;
        }

        public fateOut(): void {
            this._fadeState = 1;
            this._subFadeState = -1;
        }

        public get isPlaying() {
            return this._isPlaying && this._playState !== 1;
        }

        public get isCompleted() {
            return this._playState === 1;
        }

        public get totalTime() {
            return this.animationClip.duration;
        }

        public get currentTime() {
            return this._currentTime;
        }
    }
    /**
     * 动画组件。
     */
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
        private readonly _animations: AnimationAsset[] = [];
        /**
         * 混合节点列表。
         */
        private readonly _blendNodes: BlendNode[] = [];
        /**
         * @internal
         */
        public readonly _animationNames: string[] = [];
        /**
         * 骨骼姿势列表。
         * @internal
         */
        private readonly _blendLayers: { [key: string]: { [key: string]: BlendLayer } } = {};
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
        public _getBlendlayer(type: string, name: string) {
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
            const blendNodes = this._blendNodes;
            const blendNodeCount = blendNodes.length;

            for (const k in this._blendLayers) { // Reset blendLayers.
                const blendLayers = this._blendLayers[k];

                for (const kB in blendLayers) {
                    blendLayers[kB].reset();
                }
            }

            if (blendNodeCount === 1) {
                const blendNode = blendNodes[0];

                if (blendNode._fadeState > 0 && blendNode._subFadeState > 0) {
                    blendNodes.length = 0;

                    if (this._lastAnimationState === blendNode) {
                        this._lastAnimationState = null;
                    }
                }
                else {
                    blendNode._update(globalTime);
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

                        blendNode._update(globalTime);
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

            for (const k in this._blendLayers) {
                const blendLayers = this._blendLayers[k];

                for (const kB in blendLayers) {
                    blendLayers[kB].release();
                }

                delete this._blendLayers[k];
            }
        }
        /**
         * 
         */
        public fadeIn(
            animationName: string | null = null,
            fadeTime: number, playTimes: number = -1,
            layer: number = 0, additive: boolean = false,
        ): AnimationState | null {
            let animationAsset: AnimationAsset | null = null;
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
            animationState.fadeTotalTime = fadeTime;
            animationState.playTimes = playTimes < 0 ? (animationClip.playTimes || 0) : playTimes;

            // TODO sort by layer and blend tree.
            this._blendNodes.push(animationState);
            this._lastAnimationState = animationState;

            return animationState;
        }
        /**
         * 
         */
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
        /**
         * 
         */
        public stop(): void {
            for (const blendNode of this._blendNodes) {
                if (!blendNode.parent && blendNode instanceof AnimationState) {
                    blendNode.stop();
                }
            }
        }
        /**
         * 
         */
        public get lastAnimationnName(): string {
            return this._lastAnimationState ? this._lastAnimationState.animationClip.name : "";
        }
        /**
         * 动画数据列表。
         */
        public get animations(): ReadonlyArray<AnimationAsset> {
            return this._animations;
        }
        public set animations(animations: ReadonlyArray<AnimationAsset>) {
            for (let i = 0, l = animations.length; i < l; i++) {
                this._animations[i] = animations[i];
            }
        }
        /**
         * 
         */
        public get lastAnimationState(): AnimationState | null {
            return this._lastAnimationState;
        }
    }
}