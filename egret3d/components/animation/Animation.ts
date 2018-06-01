namespace egret3d {
    /**
     * 
     */
    export class BoneBlendLayer {
        public dirty: number = 0;
        public layer: number = 0;
        public leftWeight: number = 0;
        public layerWeight: number = 0;
        public blendWeight: number = 0;
        public target: Transform | null = null;

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
        glTFChannel: GLTFAnimationChannel;
        glTFSampler: gltf.AnimationSampler;
        gameObject: paper.GameObject;
        component: paper.BaseComponent;
        inputBuffer: Float32Array;
        outputBuffer: Float32Array;
        update: (channel: AnimationChannel) => void | null = null;
    }
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
         * 
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
            const globalTime = paper.Time.time;
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
         * 帧率。
         */
        private _frameRate: number = 0;
        /**
         * 总帧数。
         */
        private _frameCount: number = 0;
        /**
         * 全局播放时间标记。
         */
        private _playTimeStart: number = 0.0;
        /**
         * 本地播放时间。
         */
        private _playTime: number = 0.0;
        /**
         * 帧插值进度。
         */
        private _frameProgress: number = 0.0;
        private _animationComponent: Animation = null as any;
        // TODO
        private readonly _channels: AnimationChannel[] = [];
        // TODO
        private readonly _retargetBoneIndices: number[] = [];
        private readonly _delta: number[] = [];
        private _frameBuffer: Float32Array = null as any;
        private _frameOffset: number = -1;
        private _nextFrameOffset: number = -1;
        private _frameOffsets: number[] = null as any;

        private _onArriveAtFrame() {

        }

        private _onUpdateFrame() {
            const delta = this._delta;
            const result = this._animationComponent._skinnedMeshRenderer._skeletonMatrixData;
            const boneBlendLayers = this._animationComponent._boneBlendLayers;
            const frameBuffer = this._frameBuffer;

            for (let i = 0, l = this._retargetBoneIndices.length; i < l; ++i) {
                const boneIndex = this._retargetBoneIndices[i];
                if (boneIndex < 0) { // Pass untarget bone or mask bone.
                    continue;
                }

                const poseBoneOffsetA = i * 7;
                const poseBoneOffsetC = boneIndex * 8;
                const frameOffset = this._frameOffset + poseBoneOffsetA;
                const boneBlendNode = boneBlendLayers[boneIndex];

                if (boneBlendNode.update(this)) {
                    for (let j = 0; j < 7; ++j) {
                        result[poseBoneOffsetC + j] = frameBuffer[frameOffset + j];
                    }

                    result[poseBoneOffsetC + 7] = 1.0;
                }
            }
        }

        private _onUpdateTranslation(channel: AnimationChannel) {
            let isInterpolation = false;
            let frameIndex = 0;
            const inputBuffer = channel.inputBuffer;
            const outputBuffer = channel.outputBuffer;
            const transform = channel.component as Transform;

            if (this._playTime <= inputBuffer[0]) {
            }
            else if (this._playTime >= inputBuffer[inputBuffer.length - 1]) {
                frameIndex = inputBuffer.length - 1;
            }
            else {
                isInterpolation = channel.glTFSampler.interpolation !== "STEP";

                for (let i = 0, l = inputBuffer.length; i < l; ++i) {
                    if (this._playTime < inputBuffer[i]) {
                        break;
                    }

                    frameIndex = i;
                }
            }

            const offset = frameIndex * 3;
            const x = outputBuffer[offset];
            const y = outputBuffer[offset + 1];
            const z = outputBuffer[offset + 2];

            if (isInterpolation) {
                const nextIndex = offset + 3;
                const progress = (this._playTime - inputBuffer[frameIndex]) / (inputBuffer[frameIndex + 1] - inputBuffer[frameIndex]);
                transform.setLocalPosition(
                    x + (outputBuffer[nextIndex] - x) * progress,
                    y + (outputBuffer[nextIndex + 1] - y) * progress,
                    z + (outputBuffer[nextIndex + 2] - z) * progress,
                );
            }
            else {
                transform.setLocalPosition(x, y, z);
            }
        }

        private _onUpdateRotation(channel: AnimationChannel) {
            let isInterpolation = false;
            let frameIndex = 0;
            const inputBuffer = channel.inputBuffer;
            const outputBuffer = channel.outputBuffer;
            const transform = channel.component as Transform;

            if (this._playTime <= inputBuffer[0]) {
            }
            else if (this._playTime >= inputBuffer[inputBuffer.length - 1]) {
                frameIndex = inputBuffer.length - 1;
            }
            else {
                isInterpolation = channel.glTFSampler.interpolation !== "STEP";

                for (let i = 0, l = inputBuffer.length; i < l; ++i) {
                    if (this._playTime < inputBuffer[i]) {
                        break;
                    }

                    frameIndex = i;
                }
            }

            const offset = frameIndex * 4;
            const x = outputBuffer[offset];
            const y = outputBuffer[offset + 1];
            const z = outputBuffer[offset + 2];
            const w = outputBuffer[offset + 3];

            if (isInterpolation) {
                const nextIndex = offset + 4;
                const progress = (this._playTime - inputBuffer[frameIndex]) / (inputBuffer[frameIndex + 1] - inputBuffer[frameIndex]);
                transform.setLocalRotation(
                    x + (outputBuffer[nextIndex] - x) * progress,
                    y + (outputBuffer[nextIndex + 1] - y) * progress,
                    z + (outputBuffer[nextIndex + 2] - z) * progress,
                    w + (outputBuffer[nextIndex + 3] - w) * progress,
                );
            }
            else {
                transform.setLocalRotation(x, y, z, w);
            }
        }

        private _onUpdateScale(channel: AnimationChannel) {
            let isInterpolation = false;
            let frameIndex = 0;
            const inputBuffer = channel.inputBuffer;
            const outputBuffer = channel.outputBuffer;
            const transform = channel.component as Transform;

            if (this._playTime <= inputBuffer[0]) {
            }
            else if (this._playTime >= inputBuffer[inputBuffer.length - 1]) {
                frameIndex = inputBuffer.length - 1;
            }
            else {
                isInterpolation = channel.glTFSampler.interpolation !== "STEP";

                for (let i = 0, l = inputBuffer.length; i < l; ++i) {
                    if (this._playTime < inputBuffer[i]) {
                        break;
                    }

                    frameIndex = i;
                }
            }

            const offset = frameIndex * 3;
            const x = outputBuffer[offset];
            const y = outputBuffer[offset + 1];
            const z = outputBuffer[offset + 2];

            if (isInterpolation) {
                const nextIndex = offset + 3;
                const progress = (this._playTime - inputBuffer[frameIndex]) / (inputBuffer[frameIndex + 1] - inputBuffer[frameIndex]);
                transform.setLocalScale(
                    x + (outputBuffer[nextIndex] - x) * progress,
                    y + (outputBuffer[nextIndex + 1] - y) * progress,
                    z + (outputBuffer[nextIndex + 2] - z) * progress,
                );
            }
            else {
                transform.setLocalScale(x, y, z);
            }
        }

        private _onUpdateActive(channel: AnimationChannel) {
            let frameIndex = 0;
            const inputBuffer = channel.inputBuffer;
            const outputBuffer = channel.outputBuffer;
            const transform = channel.component as Transform;

            if (this._playTime <= inputBuffer[0]) {
            }
            else if (this._playTime >= inputBuffer[inputBuffer.length - 1]) {
                frameIndex = inputBuffer.length - 1;
            }
            else {
                for (let i = 0, l = inputBuffer.length; i < l; ++i) {
                    if (this._playTime < inputBuffer[i]) {
                        break;
                    }

                    frameIndex = i;
                }
            }

            const offset = frameIndex * 3;
            transform.gameObject.activeSelf = outputBuffer[offset] !== 0;
        }

        /**
         * 
         */
        public initialize(animationComponent: Animation, animationAsset: GLTFAsset, animationClip: GLTFAnimationClip) {
            const globalTime = paper.Time.time;
            const assetConfig = animationAsset.config;
            //
            this.animationAsset = animationAsset;
            this.animationClip = animationClip;
            this.animation = (assetConfig.animations as GLTFAnimation[])[0]; // TODO 动画数据暂不合并。
            //
            const paperAnimation = this.animation.extensions.paper;
            const dataAccessor = this.animationAsset.getAccessor(paperAnimation.data);
            //
            this._frameRate = paperAnimation.frameRate;
            this._frameCount = paperAnimation.frameCount;
            this._fadeTimeStart = globalTime;
            this._playTimeStart = globalTime;
            this._animationComponent = animationComponent;
            //
            const skinnedMeshRenderer = this._animationComponent._skinnedMeshRenderer;
            if (skinnedMeshRenderer) {
                // Retargeting.
                const skeletonRetarget = skinnedMeshRenderer._retargetBoneNames || skinnedMeshRenderer.bones.map(bone => bone.gameObject.name);
                const animationRetarget = paperAnimation.retarget ? paperAnimation.retarget.joints : paperAnimation.joints;
                //
                this._delta.length = skeletonRetarget.length * 7;
                this._frameBuffer = this.animationAsset.createTypeArrayFromAccessor(dataAccessor);
                this._frameOffsets = this.animation.extensions.paper.frames;

                for (const boneName of animationRetarget) {
                    const index = skeletonRetarget.indexOf(boneName);
                    this._retargetBoneIndices.push(index);
                }

                // if (assetConfig.extensions.paper.skeletons) {
                //     for (const skeleton of assetConfig.extensions.paper.skeletons) {
                //         if (skeleton.name === this.animationAsset.name) {
                //             this._skeleton = skeleton;
                //             if (this._skeleton && !this._skeleton.do) {
                //                 const tPose = this._skeleton.tPose;
                //                 let iA = 0;
                //                 let iB = 0;
                //                 for (let i = 0; i < skeletonRetarget.length; i++) {
                //                     helpQuaternionA.x = tPose[iA++];
                //                     helpQuaternionA.y = tPose[iA++];
                //                     helpQuaternionA.z = tPose[iA++];
                //                     helpQuaternionA.w = tPose[iA++];
                //                     helpVec3A.x = tPose[iA++];
                //                     helpVec3A.y = tPose[iA++];
                //                     helpVec3A.z = tPose[iA++];
                //                     Quaternion.inverse(helpQuaternionA);
                //                     Quaternion.transformVector3(helpQuaternionA, helpVec3A, helpVec3A);
                //                     helpVec3A.x *= -1;
                //                     helpVec3A.y *= -1;
                //                     helpVec3A.z *= -1;
                //                     tPose[iB++] = helpQuaternionA.x;
                //                     tPose[iB++] = helpQuaternionA.y;
                //                     tPose[iB++] = helpQuaternionA.z;
                //                     tPose[iB++] = helpQuaternionA.w;
                //                     tPose[iB++] = helpVec3A.x;
                //                     tPose[iB++] = helpVec3A.y;
                //                     tPose[iB++] = helpVec3A.z;
                //                 }
                //             }
                //         }
                //     }
                // }
            }
            else if (this.animation.channels) {
                const rootGameObject = this._animationComponent.gameObject;
                const transforms = rootGameObject.transform.getAllChildren();
                const gameObjects: { [key: string]: paper.GameObject } = {};
                gameObjects[rootGameObject.name] = rootGameObject;

                for (const { gameObject } of transforms) {
                    gameObjects[gameObject.name] = gameObject;
                }

                for (const glTFChannel of this.animation.channels) {
                    const node = this.animationAsset.getNode(glTFChannel.target.node || 0);
                    const gameObject = gameObjects[node.name];
                    if (!gameObject) {
                        continue;
                    }

                    const channel = new AnimationChannel();
                    channel.glTFChannel = glTFChannel;
                    channel.glTFSampler = this.animation.samplers[glTFChannel.sampler];
                    channel.gameObject = gameObject;
                    channel.component = gameObject.transform; // TODO 更多组件
                    channel.inputBuffer = this.animationAsset.createTypeArrayFromAccessor(this.animationAsset.getAccessor(channel.glTFSampler.input));
                    channel.outputBuffer = this.animationAsset.createTypeArrayFromAccessor(this.animationAsset.getAccessor(channel.glTFSampler.output));

                    switch (channel.glTFChannel.target.path) {
                        case "translation":
                            channel.update = this._onUpdateTranslation.bind(this);
                            break;

                        case "rotation":
                            channel.update = this._onUpdateRotation.bind(this);
                            break;

                        case "scale":
                            channel.update = this._onUpdateScale.bind(this);
                            break;

                        case "weights":
                            // TODO
                            break;

                        case "custom":
                            switch (channel.glTFChannel.extensions.paper.type) {
                                case "paper.GameObject":
                                    switch (channel.glTFChannel.extensions.paper.property) {
                                        case "activeSelf":
                                            channel.update = this._onUpdateActive.bind(this);
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

            const prevPlayTimes = this.currentPlayTimes;
            const prevPlayState = this._playState;
            const timeScale = this.timeScale * this._animationComponent.timeScale;
            const r = timeScale === 0.0 ? 0.0 : 1.0 / timeScale;
            const position = this.animationClip.position;
            const duration = this.animationClip.duration;
            const totalTime = this.playTimes * duration;
            let localPlayTime = (globalTime - this._playTimeStart) * r;

            let currentTime = 0.0;

            if (this.playTimes > 0 && (localPlayTime >= totalTime || localPlayTime <= 0.0)) {
                if (this._playState <= 0 && this._isPlaying) {
                    this._playState = 1;
                }

                this.currentPlayTimes = this.playTimes;

                if (localPlayTime >= totalTime) {
                    currentTime = duration + 0.000001; // Precision problem.
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
                        channel.update(channel);
                    }
                }
            }
            else if (this._animationComponent._skinnedMeshRenderer) {
                // Clear frame flag when timeline start or loopComplete.
                if (
                    (prevPlayState < 0 && this._playState !== prevPlayState) ||
                    (this._playState <= 0 && this.currentPlayTimes !== prevPlayTimes)
                ) {
                    this._frameOffset = -1;
                }

                if (this._frameCount > 0) {
                    const frameIndexF = this._playTime * this._frameRate;
                    const frameIndex = Math.min(Math.floor(frameIndexF), this._frameCount - 1);
                    const frameOffset = this._frameOffsets[frameIndex];
                    if (this._frameOffset !== frameOffset) {
                        this._frameOffset = frameOffset;
                        this._nextFrameOffset = this._frameOffsets[frameIndex + 1];
                        this._onArriveAtFrame();
                    }

                    this._frameProgress = frameIndexF - frameIndex;
                    this._onUpdateFrame();
                }
                else if (this._frameOffset < 0) {
                    this._frameOffset = this._frameOffsets[0];
                    this._nextFrameOffset = -1;
                    this._onArriveAtFrame();
                }
            }
        }

        public fateOut(): void {
            this._fadeState = 1;
            this._subFadeState = 1;
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
        public timeScale: number = 1.0;
        /**
         * 动画数据列表。
         */
        @paper.serializedField
        private readonly _animations: GLTFAsset[] = [];
        /**
         * 骨骼姿势列表。
         * 
         */
        public readonly _boneBlendLayers: BoneBlendLayer[] = [];
        /**
         * 混合节点列表。
         */
        private readonly _blendNodes: BlendNode[] = [];
        /**
         * 最后一个播放的动画状态。
         * 当进行动画混合时，该值通常没有任何意义。
         */
        private _lastAnimationState: AnimationState | null = null;
        /**
         * 
         */
        public _skinnedMeshRenderer: SkinnedMeshRenderer | null = null;
        /**
         * @inheritDoc
         */
        public initialize() {
            super.initialize();

            if (!this._skinnedMeshRenderer) {
                this._skinnedMeshRenderer = this.gameObject.getComponentsInChildren(SkinnedMeshRenderer)[0];

                if (this._skinnedMeshRenderer) {
                    for (const bone of this._skinnedMeshRenderer.bones) {
                        const boneBlendLayer = new BoneBlendLayer();
                        this._boneBlendLayers.push(boneBlendLayer);
                    }
                }
            }
        }
        /**
         * 
         */
        public update(globalTime: number) {
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

                // if (this._lastAnimationState) {
                //     const skeleton = this._lastAnimationState._skeleton;
                //     if (skeleton) {
                //         const result = this._skinnedMeshRenderer._skeletonMatrixData;
                //         const bones = this._skinnedMeshRenderer.bones;
                //         let iA = 0;
                //         let iB = 0;
                //         for (let i = 0, l = this._boneBlendLayers.length; i < l; ++i) {
                //             const boneBlendLayer = this._boneBlendLayers[i];
                //             boneBlendLayer.dirty = false;

                //             if (i < bones.length) {
                //                 const bone = bones[i];
                //                 const dir = helpVec3A;
                //                 const dirtran = helpVec3B;

                //                 helpQuaternionB.x = skeleton.tPose[iA++];
                //                 helpQuaternionB.y = skeleton.tPose[iA++];
                //                 helpQuaternionB.z = skeleton.tPose[iA++];
                //                 helpQuaternionB.w = skeleton.tPose[iA++];
                //                 dir.x = skeleton.tPose[iA++];
                //                 dir.x = skeleton.tPose[iA++];
                //                 dir.y = skeleton.tPose[iA++];

                //                 helpQuaternionA.x = result[iB];
                //                 helpQuaternionA.y = result[iB];
                //                 helpQuaternionA.z = result[iB];
                //                 helpQuaternionA.w = result[iB];

                //                 Quaternion.transformVector3(helpQuaternionA, dir, dirtran);

                //                 dirtran.x += result[iB];
                //                 dirtran.y += result[iB];
                //                 dirtran.z += result[iB];
                //                 iB++;

                //                 Quaternion.multiply(helpQuaternionA, helpQuaternionB, helpQuaternionC);

                //                 const position = helpVec3A;
                //                 const rotation = helpQuaternionA;

                //                 Vector3.add(bone.getPosition(), dirtran, position);
                //                 Quaternion.multiply(helpQuaternionC, bone.getRotation(), rotation);

                //                 bone.setPosition(position);
                //                 bone.setRotation(rotation);
                //             }
                //         }
                //     }
                // }
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

        public play(animationName: string | null = null, playTimes: number = -1): AnimationState | null {
            return this.fadeIn(animationName, 0.0, playTimes);
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
    /**
     * @private
     */
    export class AnimationSystem extends paper.BaseSystem<Animation> {
        /**
         * @inheritDoc
         */
        protected readonly _interests = [
            {
                componentClass: Animation
            }
        ];
        /**
         * @inheritDoc
         */
        protected _onAddComponent(component: Animation) {
            if (!super._onAddComponent(component)) {
                return false;
            }

            if (component.autoPlay) {
                component.play();
            }

            return true;
        }
        /**
         * @inheritDoc
         */
        public update() { // TODO 应将组件功能尽量移到系统
            const globalTime = paper.Time.time;
            for (const component of this._components) {
                component.update(globalTime);
            }
        }
    }
}