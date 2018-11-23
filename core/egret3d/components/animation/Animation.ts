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
        private readonly _blendLayers: { [key: string]: { [key: string]: TargetBlendLayer } } = {};
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
                blendLayers[name] = TargetBlendLayer.create();
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
                    blendLayers[kB].clear();
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
            animationState.layer = layer;
            animationState.fadeTotalTime = fadeTime;
            animationState.playTimes = playTimes < 0 ? (animationClip.playTimes || 0) : playTimes;

            let isAdded = false;
            const blendNodes = this._blendNodes;
            if (blendNodes.length > 0) {
                for (let i = 0, l = blendNodes.length; i < l; ++i) {
                    if (animationState.layer > blendNodes[i].layer) {
                        isAdded = true;
                        blendNodes.splice(i, 0, animationState);
                        break;
                    }
                    else if (i !== l - 1 && animationState.layer > blendNodes[i + 1].layer) {
                        isAdded = true;
                        blendNodes.splice(i + 1, 0, animationState);
                        break;
                    }
                }
            }

            if (!isAdded) {
                blendNodes.push(animationState);
            }

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