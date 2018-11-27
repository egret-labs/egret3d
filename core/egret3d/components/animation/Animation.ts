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
         * 动画速度。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public timeScale: number = 1.0;
        /**
         * @internal
         */
        public _statesDirty: boolean = false;
        /**
         * @internal
         */
        public readonly _animationNames: string[] = [];
        @paper.serializedField
        private readonly _animations: AnimationAsset[] = [];
        /**
         * @internal
         */
        public readonly _animationFadeStates: AnimationFadeState[][] = [];
        /**
         * @internal
         */
        public readonly _blendLayers: { [key: string]: BlendLayer } = {};
        @paper.serializedField
        private _animationController: AnimationController | null = null;
        private _lastAnimationLayer: AnimationLayer | null = null;
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
        public _getBlendlayer(name: string, type: string) {
            const blendLayers = this._blendLayers;
            name += "/" + type;

            if (!(name in blendLayers)) {
                blendLayers[name] = BlendLayer.create();
            }

            return blendLayers[name];
        }

        public uninitialize() {
            super.uninitialize();

            const animationFadeStates = this._animationFadeStates;
            for (const fadeStates of animationFadeStates) {
                for (const fadeState of fadeStates) {
                    fadeState.release();
                }
            }

            const blendLayers = this._blendLayers;
            for (const k in blendLayers) {
                blendLayers[k].release();
                delete blendLayers[k];
            }

            this._animationNames.length = 0;
            this._animations.length = 0;
            this._animationFadeStates.length = 0;
            // this._blendLayers;
            this._animationController = null;
            this._lastAnimationLayer = null;
        }
        /**
         * 
         */
        public fadeIn(
            animationName: string | null = null,
            fadeTime: number, playTimes: number = -1,
            layerIndex: uint = 0, layerAdditive: boolean = false,
        ): AnimationState | null {
            // 
            let animationAsset: AnimationAsset | null = null;
            let animationClip: GLTFAnimationClip | null = null;

            for (const eachAnimationAsset of this._animations) {
                animationAsset = eachAnimationAsset;
                if (animationName) {
                    animationClip = eachAnimationAsset.getAnimationClip(animationName);
                    if (animationClip !== null) {
                        break;
                    }
                }
                else {
                    animationClip = eachAnimationAsset.getAnimationClip("");
                    break;
                }
            }

            if (!animationAsset || !animationClip) {
                console.warn(`There is no animation clip named "${animationName}" in the "${this.gameObject.path}" gameObject.`, animationName, this.gameObject.path);
                return null;
            }
            //
            if (!this._animationController) {
                this._animationController = AnimationController.create();
            }

            const animationController = this._animationController;
            const animationLayer = animationController.getLayer(layerIndex);
            animationLayer.additive = layerAdditive;
            layerIndex = animationController.layers.indexOf(animationLayer);
            const animationNode: AnimationNode = {
                asset: "",
                clip: "",
                timeScale: 1.0,
            };
            //
            const animationFadeStates = this._animationFadeStates;
            if (layerIndex >= animationFadeStates.length) {
                animationFadeStates[layerIndex] = [];
            }

            for (const fadeStates of animationFadeStates[layerIndex]) {
                fadeStates.fadeOut(fadeTime);
            }

            const lastFadeState = AnimationFadeState.create();
            lastFadeState.totalTime = fadeTime;
            animationFadeStates[layerIndex].push(lastFadeState);
            //
            const animationState = AnimationState.create();
            animationState._initialize(this, animationLayer, animationNode, animationAsset, animationClip);
            animationState.playTimes = playTimes < 0 ? (animationClip.playTimes || 0) : playTimes;
            lastFadeState.states.push(animationState);
            //
            this._statesDirty = true;
            this._lastAnimationLayer = animationLayer;

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
            const animationFadeStates = this._animationFadeStates;
            for (const fadeStates of animationFadeStates) {
                for (const fadeState of fadeStates) {
                    for (const animationState of fadeState.states) {
                        animationState.stop();
                    }
                }
            }
        }
        /**
         * 
         */
        public get lastAnimationnName(): string {
            const lastAnimationState = this.lastAnimationState;
            return lastAnimationState ? lastAnimationState.animationClip.name : "";
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
        public get animationController() {
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
                const animationFadeStates = this._animationFadeStates;
                if (animationFadeStates.length > layerIndex) {
                    const fadeStates = animationFadeStates[layerIndex];
                    return fadeStates.length > 0 ? fadeStates[fadeStates.length - 1].states[0] : null;
                }
            }

            return null;
        }
    }
}