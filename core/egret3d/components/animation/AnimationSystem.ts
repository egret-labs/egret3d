namespace egret3d {
    /**
     * 动画系统。
     */
    export class AnimationSystem extends paper.BaseSystem {
        public readonly interests = [
            { componentClass: Animation }
        ];

        private readonly _events: any[] = [];
        private _animation: Animation | null = null;
        private _animationLayer: AnimationLayer | null = null;

        private _updateAnimationFadeState(animationFadeState: AnimationFadeState, deltaTime: number) {
            if (deltaTime < 0.0) {
                deltaTime = -deltaTime;
            }

            const isFadeOut = animationFadeState.fadeState === 1;
            const totalTime = animationFadeState.totalTime;
            const time = animationFadeState.time += deltaTime;

            if (animationFadeState.subFadeState === -1) { // Fade start event.
                animationFadeState.subFadeState = 0;
            }

            if (time >= totalTime) { // Fade complete.
                animationFadeState.subFadeState = 1;
                animationFadeState.progress = isFadeOut ? 0.0 : 1.0;
            }
            else if (time > 0.0) { // Fading.
                animationFadeState.progress = isFadeOut ? (1.0 - time / totalTime) : (time / totalTime);
            }
            else { // Before fade.
                animationFadeState.progress = isFadeOut ? 1.0 : 0.0;
            }

            if (animationFadeState.subFadeState === 1) { // Fade complete event.
                if (!isFadeOut) {
                    animationFadeState.fadeState = 0;
                    animationFadeState.subFadeState = 0; //
                }
            }
        }

        private _updateAnimationState(animationFadeState: AnimationFadeState, animationState: AnimationState, deltaTime: number, forceUpdate: boolean) {
            const animation = this._animation!;
            const gameObject = animation.gameObject;
            const animationLayer = this._animationLayer!;
            // const animationNode = animationState.animationNode;

            let weight = animationLayer.weight * animationFadeState.progress * animationState.weight;
            // if (this.parent) { TODO
            //     this._globalWeight *= this.parent._globalWeight;
            // }
            animationState._globalWeight = weight;

            // Update time.
            if (animationState._playheadEnabled) {
                deltaTime *= animation.timeScale * animationState.timeScale;
                animationState._time += deltaTime;
            }

            // const isBlendDirty = this._fadeState !== 0 || this._subFadeState === 0;
            const prevPlayState = animationState._playState;
            const prevPlayTimes = animationState.currentPlayTimes;
            const prevTime = animationState._currentTime;
            const playTimes = animationState.playTimes;
            const duration = animationState.animationClip.duration;
            const totalTime = playTimes * duration;
            let currentTime = 0.0;

            if (playTimes > 0 && (animationState._time >= totalTime || animationState._time <= -totalTime)) {
                if (animationState._playState <= 0 && animationState._playheadEnabled) {
                    animationState._playState = 1;
                }

                animationState.currentPlayTimes = playTimes;

                if (animationState._time >= totalTime) {
                    currentTime = duration;
                }
                else {
                    currentTime = 0.0;
                }
            }
            else {
                if (animationState._playState !== 0 && animationState._playheadEnabled) {
                    animationState._playState = 0;
                }

                if (animationState._time < 0.0) {
                    animationState._time = -animationState._time;
                    animationState.currentPlayTimes = (animationState._time / duration) >> 0;
                    currentTime = duration - (animationState._time % duration);
                }
                else {
                    animationState.currentPlayTimes = (animationState._time / duration) >> 0;
                    currentTime = animationState._time % duration;
                }
            }

            currentTime += animationState.animationClip.position;
            animationState._currentTime = currentTime;

            if (forceUpdate || weight !== 0.0) {
                for (const channel of animationState.channels) {
                    if (!channel.updateTarget || !channel.enabled) {
                        continue;
                    }

                    const binder = channel.binder;
                    if (binder.constructor === AnimationBinder) {
                        if ((binder as AnimationBinder).updateBlend(animationLayer, animationState)) {
                            channel.updateTarget(animationLayer, animationState);
                        }
                    }
                    else {
                        channel.updateTarget(animationLayer, animationState);
                    }
                }
            }

            // this._events; // TODO buffer event.

            if (prevPlayState === -1 && animationState._playState !== -1) {
                gameObject.sendMessage("onAnimationEvent", AnimationEvent.create(AnimationEventType.Start, animationState), false);
            }

            //
            let loopEvent = false;
            const frameEvents = animationState.animation.extensions.paper.events;

            if (deltaTime !== 0.0 && frameEvents) {
                if (deltaTime > 0.0) {
                    if (prevTime < currentTime) {
                        for (const event of frameEvents) {
                            if (prevTime < event.position && event.position <= currentTime) {
                                gameObject.sendMessage(
                                    "onAnimationEvent",
                                    AnimationEvent.create(AnimationEventType.KeyFrame, animationState, event),
                                    false
                                );
                            }
                        }
                    }
                    else {
                        for (const event of frameEvents) {
                            if (prevTime < event.position) {
                                gameObject.sendMessage(
                                    "onAnimationEvent",
                                    AnimationEvent.create(AnimationEventType.KeyFrame, animationState, event),
                                    false
                                );
                            }
                        }

                        gameObject.sendMessage("onAnimationEvent", AnimationEvent.create(AnimationEventType.LoopComplete, animationState), false);

                        for (const event of frameEvents) {
                            if (event.position <= currentTime) {
                                gameObject.sendMessage(
                                    "onAnimationEvent",
                                    AnimationEvent.create(AnimationEventType.KeyFrame, animationState, event),
                                    false
                                );
                            }
                        }

                        loopEvent = true;
                    }
                }
                else {
                    if (prevTime > currentTime) {
                        for (const event of frameEvents) {
                            if (currentTime <= event.position && event.position < prevTime) {
                                gameObject.sendMessage(
                                    "onAnimationEvent",
                                    AnimationEvent.create(AnimationEventType.KeyFrame, animationState, event),
                                    false
                                );
                            }
                        }
                    }
                    else {
                        for (const event of frameEvents) {
                            if (event.position < prevTime) {
                                gameObject.sendMessage(
                                    "onAnimationEvent",
                                    AnimationEvent.create(AnimationEventType.KeyFrame, animationState, event),
                                    false
                                );
                            }
                        }

                        gameObject.sendMessage("onAnimationEvent", AnimationEvent.create(AnimationEventType.LoopComplete, animationState), false);

                        for (const event of frameEvents) {
                            if (currentTime <= event.position) {
                                gameObject.sendMessage(
                                    "onAnimationEvent",
                                    AnimationEvent.create(AnimationEventType.KeyFrame, animationState, event),
                                    false
                                );
                            }
                        }

                        loopEvent = true;
                    }
                }
            }

            if (animationState.currentPlayTimes !== prevPlayTimes) {
                if (!loopEvent) {
                    gameObject.sendMessage("onAnimationEvent", AnimationEvent.create(AnimationEventType.LoopComplete, animationState), false);
                }

                if (animationState._playState === 1) {
                    const clipNames = animationLayer._clipNames;
                    if (clipNames && clipNames.length > 0) {
                        animation.play(clipNames.shift()!);
                    }
                    else {
                        gameObject.sendMessage("onAnimationEvent", AnimationEvent.create(AnimationEventType.Complete, animationState), false);
                    }
                }
            }
        }

        public onAddComponent(component: Animation) {
            if (component.autoPlay && (!component.lastAnimationState || !component.lastAnimationState.isPlaying)) {
                component.play();
            }
        }

        public onUpdate(deltaTime: number) {
            for (const gameObject of this.groups[0].gameObjects) {
                const animation = this._animation = gameObject.getComponent(Animation)!;
                const animationController = animation.animationController!;
                if (!animationController) {
                    continue;
                }

                const animationLayers = animationController.layers;
                const animationFadeStates = animation._fadeStates;
                const blendlayers = animation._binders;

                for (const k in blendlayers) { // Reset blendLayers.
                    const blendLayer = blendlayers[k];
                    blendLayer.clear();
                }

                if (animation._statesDirty) {
                    animation._statesDirty = false;
                }

                for (let i = animationFadeStates.length - 1; i >= 0; i--) {
                    const fadeStates = animationFadeStates[i];
                    this._animationLayer = animationLayers[i];

                    for (let i = 0, r = 0, l = fadeStates.length; i < l; ++i) {
                        let forceUpdate = false;
                        const fadeState = fadeStates[i];
                        const sFadeState = fadeState.fadeState;
                        const sSubFadeState = fadeState.subFadeState;

                        if (sFadeState === 1 && sSubFadeState === 1) {
                            r++;
                            fadeState.release();
                        }
                        else {
                            if (r > 0) {
                                fadeStates[i - r] = fadeState;
                            }

                            if (sFadeState !== 0 || sSubFadeState !== 0) {
                                forceUpdate = true;
                                this._updateAnimationFadeState(fadeState, deltaTime);
                            }

                            for (const animationState of fadeState.states) {
                                this._updateAnimationState(fadeState, animationState, deltaTime, forceUpdate);
                            }
                        }

                        if (i === l - 1 && r > 0) {
                            fadeStates.length -= r;
                            animation._statesDirty = true;
                        }
                    }
                }

                for (const k in blendlayers) { // Update blendLayers.
                    const blendLayer = blendlayers[k];
                    blendLayer.updateTarget!();
                }
            }
        }
    }
}