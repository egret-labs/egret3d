namespace egret3d {
    const _helpQuaternionA = Quaternion.create();
    const _helpQuaternionB = Quaternion.create();
    /**
     * @private
     */
    export class AnimationFadeState extends paper.BaseRelease<AnimationFadeState> {
        private static readonly _instances: AnimationFadeState[] = [];
        public static create(): AnimationFadeState {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!;
                instance._released = false;
                return instance;
            }

            return new AnimationFadeState().clear();
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
            this.clear();
        }

        public clear() {
            for (const state of this.states) {
                state.release();
            }

            this.fadeState = -1;
            this.subFadeState = -1;
            this.progress = 0.0;
            this.time = 0.0;
            this.totalTime = 0.0;
            this.states.length = 0;

            return this;
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
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!;
                instance._released = false;
                return instance;
            }

            return new AnimationState().clear();
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
         * 
         */
        public readonly channels: AnimationChannel[] = [];
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
            this.clear();
        }

        public clear() {
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

            return this;
        }

        private _onUpdateTranslation(channel: AnimationChannel, animationlayer: AnimationLayer, animationState: AnimationState) {
            const additive = animationlayer.additive;
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

            if (additive) {
                x -= outputBuffer[0];
                y -= outputBuffer[1];
                z -= outputBuffer[2];
            }

            const isArray = Array.isArray(channel.components);
            const blendLayer = channel.blendLayer!;
            const blendWeight = blendLayer.weight;
            const blendTarget = (isArray ? (channel.components as Transform[])[0].localPosition : (channel.components as Transform).localPosition) as Vector3;

            if (blendLayer.dirty > 1) {
                blendTarget.x += x * blendWeight;
                blendTarget.y += y * blendWeight;
                blendTarget.z += z * blendWeight;
            }
            else {
                if (blendWeight !== 1.0) {
                    blendTarget.x = x * blendWeight;
                    blendTarget.y = y * blendWeight;
                    blendTarget.z = z * blendWeight;
                }
                else {
                    blendTarget.x = x;
                    blendTarget.y = y;
                    blendTarget.z = z;
                }
            }

            if (channel.isEnd && blendLayer.totalWeight < 1.0 - Const.EPSILON) {
                const weight = 1.0 - blendLayer.totalWeight;
                const pose = blendLayer.additivePose as Vector3;
                blendTarget.x += pose.x * weight;
                blendTarget.y += pose.y * weight;
                blendTarget.z += pose.z * weight;
            }

            if (isArray) {
                for (const component of channel.components as Transform[]) {
                    component.localPosition = blendTarget;
                }
            }
            else {
                blendTarget.update();
            }
        }

        private _onUpdateRotation(channel: AnimationChannel, animationlayer: AnimationLayer, animationState: AnimationState) {
            const helpQuaternionA = _helpQuaternionA;
            const helpQuaternionB = _helpQuaternionB;
            const additive = animationlayer.additive;
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

            if (additive) {
                helpQuaternionA.fromArray(outputBuffer).multiply(helpQuaternionB.set(x, y, z, w)).inverse();
            }

            const isArray = Array.isArray(channel.components);
            const blendLayer = channel.blendLayer!;
            let blendWeight = blendLayer.weight;
            const blendTarget = (isArray ? (channel.components as Transform[])[0].localRotation : (channel.components as Transform).localRotation) as Quaternion;

            if (blendLayer.dirty > 1) {
                if (additive) {
                    blendTarget.multiply(helpQuaternionA.lerp(Quaternion.IDENTITY, helpQuaternionA, blendWeight));
                }
                else {
                    if (_helpQuaternionA.set(x, y, z, w).dot(blendTarget) < 0.0) {
                        blendWeight = -blendWeight;
                    }

                    blendTarget.x += x * blendWeight;
                    blendTarget.y += y * blendWeight;
                    blendTarget.z += z * blendWeight;
                    blendTarget.w += w * blendWeight;
                }
            }
            else if (additive) { // TODO
                const pose = blendLayer.additivePose as Quaternion;
                blendTarget.x = pose.x;
                blendTarget.y = pose.y;
                blendTarget.z = pose.z;
                blendTarget.w = pose.w;

                if (blendWeight !== 1.0) {
                    blendTarget.multiply(helpQuaternionA.lerp(Quaternion.IDENTITY, helpQuaternionA, blendWeight));
                }
                else {
                    blendTarget.multiply(helpQuaternionA);
                }
            }
            else if (blendWeight !== 1.0) {
                blendTarget.x = x * blendWeight;
                blendTarget.y = y * blendWeight;
                blendTarget.z = z * blendWeight;
                blendTarget.w = w * blendWeight;
            }
            else {
                blendTarget.x = x;
                blendTarget.y = y;
                blendTarget.z = z;
                blendTarget.w = w;
            }

            // if (channel.isEnd && blendLayer.totalWeight < 1.0 - Const.EPSILON) { TODO
            //     const weight = 1.0 - blendLayer.totalWeight;
            //     const pose = blendLayer.additivePose as Vector3;
            //     blendTarget.x += pose.x * weight;
            //     blendTarget.y += pose.y * weight;
            //     blendTarget.z += pose.z * weight;
            // }

            blendTarget.normalize();

            if (isArray) {
                for (const component of channel.components as Transform[]) {
                    component.localRotation = blendTarget;
                }
            }
            else {
                blendTarget.update();
            }
        }

        private _onUpdateScale(channel: AnimationChannel, animationlayer: AnimationLayer, animationState: AnimationState) {
            const additive = animationlayer.additive;
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

            if (additive) {
                x -= outputBuffer[0];
                y -= outputBuffer[1];
                z -= outputBuffer[2];
            }

            const isArray = Array.isArray(channel.components);
            const blendLayer = channel.blendLayer!;
            const blendWeight = blendLayer.weight;
            const blendTarget = (isArray ? (channel.components as Transform[])[0].localScale : (channel.components as Transform).localScale) as Vector3;

            if (blendLayer.dirty > 1) {
                blendTarget.x += x * blendWeight;
                blendTarget.y += y * blendWeight;
                blendTarget.z += z * blendWeight;
            }
            else {
                if (blendWeight !== 1.0) {
                    blendTarget.x = x * blendWeight;
                    blendTarget.y = y * blendWeight;
                    blendTarget.z = z * blendWeight;
                }
                else {
                    blendTarget.x = x;
                    blendTarget.y = y;
                    blendTarget.z = z;
                }
            }

            if (channel.isEnd && blendLayer.totalWeight < 1.0 - Const.EPSILON) {
                const weight = 1.0 - blendLayer.totalWeight;
                const pose = blendLayer.additivePose as Vector3;
                blendTarget.x += pose.x * weight;
                blendTarget.y += pose.y * weight;
                blendTarget.z += pose.z * weight;
            }

            if (isArray) {
                for (const component of channel.components as Transform[]) {
                    component.localScale = blendTarget;
                }
            }
            else {
                blendTarget.update();
            }
        }

        private _onUpdateActive(channel: AnimationChannel, animationlayer: AnimationLayer, animationState: AnimationState) {
            const currentTime = animationState._currentTime;
            const outputBuffer = channel.outputBuffer;
            const frameIndex = channel.getFrameIndex(currentTime);
            //
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

                    const transforms = children[nodeName!];
                    const channel = AnimationChannel.create();
                    const pathName = glTFChannel.target.path;
                    channel.glTFChannel = glTFChannel;
                    channel.glTFSampler = this.animation.samplers[glTFChannel.sampler];
                    channel.components = transforms; // TODO 更多组件
                    channel.inputBuffer = this.animationAsset.createTypeArrayFromAccessor(this.animationAsset.getAccessor(channel.glTFSampler.input));
                    channel.outputBuffer = this.animationAsset.createTypeArrayFromAccessor(this.animationAsset.getAccessor(channel.glTFSampler.output));

                    switch (pathName) {
                        case "translation":
                            channel.blendLayer = animation._getBlendlayer(nodeName, pathName);
                            channel.updateTarget = this._onUpdateTranslation;
                            if (!channel.blendLayer.additivePose) {
                                channel.blendLayer.additivePose = Vector3.create().copy((transforms as Transform).localPosition);
                            }
                            break;

                        case "rotation":
                            channel.blendLayer = animation._getBlendlayer(nodeName, pathName);
                            channel.updateTarget = this._onUpdateRotation;
                            if (!channel.blendLayer.additivePose) {
                                channel.blendLayer.additivePose = Quaternion.create().copy((transforms as Transform).localRotation);
                            }
                            break;

                        case "scale":
                            channel.blendLayer = animation._getBlendlayer(nodeName, pathName);
                            channel.updateTarget = this._onUpdateScale;
                            if (!channel.blendLayer.additivePose) {
                                channel.blendLayer.additivePose = Vector3.create().copy((transforms as Transform).localScale);
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