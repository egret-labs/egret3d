namespace egret3d {
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
         * 是否将动画数据中根节点的变换动画应用到该组件实体的变换组件上。
         */
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        @paper.serializedField
        public applyRootMotion: boolean = false;

        /**
         * 动画速度。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public timeScale: number = 1.0;
        private readonly _animations: (AnimationAsset | null)[] = [];
        /**
         * @internal
         */
        public readonly _fadeStates: AnimationFadeState[][] = [];
        /**
         * @internal
         */
        public readonly _binders: { [key: string]: AnimationBinder } = {};
        private _animationController: AnimationController | null = null;
        private _lastAnimationLayer: AnimationLayer | null = null;
        /**
         * @internal
         */
        public _getBinder(name: string, type: string) {
            const blendLayers = this._binders;
            name += "/" + type;

            if (!(name in blendLayers)) {
                blendLayers[name] = AnimationBinder.create();
            }

            return blendLayers[name];
        }

        public uninitialize() {
            super.uninitialize();

            for (const animation of this._animations) {
                if (animation) {
                    animation.release();
                }
            }

            const fadeStatess = this._fadeStates;
            for (const fadeStates of fadeStatess) {
                for (const fadeState of fadeStates) {
                    fadeState.release();
                }
            }

            const binders = this._binders;
            for (const k in binders) {
                binders[k].release();
                delete binders[k];
            }

            if (this._animationController) {
                this._animationController.release();
            }

            this._animations.length = 0;
            this._fadeStates.length = 0;
            // this._binders;
            this._animationController = null;
            this._lastAnimationLayer = null;
        }
        /**
         * 融合播放一个指定的动画。
         * @param animationClipName 动画剪辑的名称。
         * @param fadeTime 融合的时间。
         * @param playTimes 播放次数。（-1：采用动画数据配置，0：循环播放，N：循环播放 N 次）
         * @param layerIndex 动画层索引。
         * @param layerAdditive 动画层混合方式是否为叠加。
         */
        public fadeIn(
            animationClipName: string,
            fadeTime: number, playTimes: int = -1,
            layerIndex: uint = 0, layerAdditive: boolean = false,
        ): AnimationState | null {
            //
            if (!this._animationController) {
                this._animationController = AnimationController.create(paper.DefaultNames.Default).retain();
            }

            const animationController = this._animationController;
            const animationLayers = animationController.layers;

            if (layerIndex > animationLayers.length) {
                console.warn(`The animation layers must be continuous.`);
                return null;
            }

            const animationLayer = animationController.getOrAddLayer(layerIndex);
            animationLayer.additive = layerAdditive;
            // const animationNode: AnimationNode = {
            //     asset: "",
            //     clip: "",
            //     timeScale: 1.0,
            // }; TODO
            // 
            let animationAsset: AnimationAsset | null = null;
            let animationClip: GLTFAnimationClip | null = null;
            let animationTree: AnimationTree | null = null;

            for (animationAsset of this._animations) {
                if (!animationAsset) {
                    continue;
                }

                animationClip = animationAsset.getAnimationClip(animationClipName);
                if (animationClip !== null) {
                    break;
                }
            }

            if (!animationAsset || !animationClip) {
                for (const node of animationLayer.machine.nodes) { // TODO
                    if (node.name === animationClipName) {
                        animationTree = node as AnimationTree;
                    }
                }

                if (!animationTree) {
                    console.warn(`There is no animation clip named "${animationClipName}" in the "${this.gameObject.path}" gameObject.`, animationClipName, this.gameObject.path);
                    return null;
                }
            }
            //
            const fadeStatess = this._fadeStates;
            if (layerIndex >= fadeStatess.length) {
                fadeStatess[layerIndex] = [];
            }

            for (const fadeStates of fadeStatess[layerIndex]) {
                fadeStates.fadeOut(fadeTime);
            }
            //
            const lastFadeState = AnimationFadeState.create();
            lastFadeState.totalTime = fadeTime;
            fadeStatess[layerIndex].push(lastFadeState);

            if (animationTree) {
                const animationTreeState = AnimationTreeState.create();
                animationTreeState.animationLayer = animationLayer;
                animationTreeState.animationNode = animationTree;
                lastFadeState.states.push(animationTreeState);

                for (const animationNode of animationTree.nodes as AnimationNode[]) { // TODO
                    animationAsset = paper.Asset.find<AnimationAsset>(animationNode.asset);
                    if (animationAsset) {
                        animationClip = animationAsset.getAnimationClip(animationNode.name);
                        if (animationClip) {
                            const animationState = AnimationState.create();
                            animationState._parent = animationTreeState;
                            animationState._initialize(this, animationLayer, null, animationAsset, animationClip);
                            animationState.playTimes = playTimes < 0 ? (animationClip.playTimes || 0) : playTimes;
                            lastFadeState.states.push(animationState);
                        }
                    }
                }

                return null;
            }
            //
            const animationState = AnimationState.create();
            animationState._initialize(this, animationLayer, null, animationAsset!, animationClip!);
            animationState.playTimes = playTimes < 0 ? (animationClip!.playTimes || 0) : playTimes;
            lastFadeState.states.push(animationState);
            //
            this._lastAnimationLayer = animationLayer;

            return animationState;
        }
        /**
         * 播放一个指定的动画。
         * @param animationClipNameOrNames 
         * @param playTimes 播放次数。（-1：采用动画数据配置，0：循环播放，N：循环播放 N 次）
         */
        public play(animationClipNameOrNames: string | (string[]) | null = null, playTimes: int = -1): AnimationState | null {
            if (!this._animationController) {
                this._animationController = AnimationController.create(paper.DefaultNames.Default).retain();
            }

            const animationController = this._animationController;
            const animationLayer = animationController.getOrAddLayer(0);
            //
            if (!animationLayer._clipNames) {
                animationLayer._clipNames = [];
            }

            const clipNames = animationLayer._clipNames;
            clipNames.length = 0;

            if (Array.isArray(animationClipNameOrNames)) {
                if (animationClipNameOrNames.length > 0) {
                    for (const animationName of animationClipNameOrNames) {
                        clipNames.push(animationName);
                    }
                    animationClipNameOrNames = clipNames.shift()!;
                }
                else {
                    animationClipNameOrNames = "";
                }
            }
            else if (!animationClipNameOrNames) {
                animationClipNameOrNames = "";
            }

            let animationState: AnimationState | null = null;

            if (animationClipNameOrNames) {
                animationState = this.fadeIn(animationClipNameOrNames as string, 0.0, playTimes);
            }
            else {
                const lastAnimationState = this.lastAnimationState;

                if (lastAnimationState) {
                    if (!lastAnimationState.isPlaying && !lastAnimationState.isCompleted) {
                        animationState = lastAnimationState;
                        lastAnimationState.play();
                    }
                    else {
                        animationState = this.fadeIn(lastAnimationState.animationClip.name, 0.0, playTimes);
                    }
                }
                else {
                    const animations = this._animations;
                    if (animations.length > 0) {
                        const defaultAnimationAsset = animations[0];
                        if (defaultAnimationAsset) {
                            animationClipNameOrNames = (defaultAnimationAsset.config.animations![0] as GLTFAnimation).extensions.paper.clips[0].name;
                            animationState = this.fadeIn(animationClipNameOrNames as string, 0.0, playTimes);
                        }
                    }
                }
            }

            return animationState;
        }
        /**
         * 
         */
        public stop(animationName: string | null = null, layerIndex: uint = 0): void {
            if (animationName) {
                const animationState = this.getState(animationName, layerIndex);
                if (animationState && animationState.constructor === AnimationState) {
                    (animationState as AnimationState).stop();
                }
            }
            else {
                const fadeStatess = this._fadeStates;
                for (const fadeStates of fadeStatess) {
                    for (const fadeState of fadeStates) {
                        for (const animationState of fadeState.states) {
                            if (animationState.constructor === AnimationState) {
                                (animationState as AnimationState).stop();
                            }
                        }
                    }
                }
            }
        }
        /**
         * 
         */
        public getState(animationName: string, layerIndex: uint = 0): AnimationBaseState | null {
            const fadeStatess = this._fadeStates;
            if (fadeStatess.length > layerIndex) {
                const fadeStates = fadeStatess[layerIndex];
                let i = fadeStates.length;
                while (i--) {
                    const fadeState = fadeStates[i];
                    for (const animationState of fadeState.states) {
                        if (animationState.name === animationName) {
                            return animationState;
                        }
                    }
                }
            }

            return null;
        }
        /**
         * 
         */
        public hasAnimation(animationClipName: string): boolean {
            for (const animationAsset of this._animations) {
                if (!animationAsset) {
                    continue;
                }

                const animationClip = animationAsset.getAnimationClip(animationClipName);
                if (animationClip) {
                    return true;
                }
            }

            return false;
        }
        /**
         * 
         */
        public get lastAnimationnName(): string {
            const lastAnimationState = this.lastAnimationState;
            return lastAnimationState ? lastAnimationState.name : "";
        }
        /**
         * 动画数据列表。
         */
        @paper.serializedField("_animations")
        public get animations(): ReadonlyArray<AnimationAsset | null> {
            return this._animations;
        }
        public set animations(value: ReadonlyArray<AnimationAsset | null>) {
            const animations = this._animations;

            for (const animation of animations) {
                if (animation) {
                    animation.release();
                }
            }

            if (value !== animations) {
                animations.length = 0;

                for (const animation of value) {
                    animations.push(animation);
                }
            }

            for (const animation of animations) {
                if (animation) {
                    animation.retain();
                }
            }
        }
        /**
         * 
         */
        public get animationController(): AnimationController | null {
            if (!this._animationController) {
                this._animationController = AnimationController.create(paper.DefaultNames.Default).retain();
            }
            return this._animationController;
        }
        /**
         * 
         */
        public get lastAnimationState(): AnimationState | null {
            const animationController = this._animationController;
            const lastAnimationLayer = this._lastAnimationLayer;

            if (animationController && lastAnimationLayer) {
                const layerIndex = animationController.layers.indexOf(lastAnimationLayer);
                const fadeStatess = this._fadeStates;

                if (fadeStatess.length > layerIndex) {
                    const fadeStates = fadeStatess[layerIndex];

                    if (fadeStates.length > 0) {
                        const animationStates = fadeStates[fadeStates.length - 1].states;
                        const animationState = animationStates[animationStates.length - 1];
                        if (animationState.constructor === AnimationState) {
                            return animationState as AnimationState;
                        }
                    }
                }
            }

            return null;
        }
    }
}