namespace egret3d {
    /**
     * 动画系统。
     */
    export class AnimationSystem extends paper.BaseSystem<paper.GameObject> {
        public readonly interests = [
            { componentClass: Animation }
        ];

        private _animation: Animation | null = null;

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

        private _updateAnimationTreeState(animationFadeState: AnimationFadeState, animationTreeState: AnimationTreeState) {
            const animationLayer = animationTreeState.animationLayer;

            let weight = animationLayer.weight * animationTreeState.weight;
            if (animationTreeState._parent) {
                weight *= animationTreeState._parent._globalWeight;
            }
            else {
                weight *= animationFadeState.progress;
            }

            animationTreeState._globalWeight = weight;
        }

        private _updateAnimationState(animationFadeState: AnimationFadeState, animationState: AnimationState, deltaTime: number, forceUpdate: boolean) {
            const animation = this._animation!;
            const gameObject = animation.gameObject;
            const animationLayer = animationState.animationLayer;
            // const animationNode = animationState.animationNode;

            let weight = animationLayer.weight * animationState.weight;
            if (animationState._parent) {
                weight *= animationState._parent._globalWeight;
            }
            else {
                weight *= animationFadeState.progress;
            }

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
                const mask = animationLayer.mask as AnimationMask | null;

                if (mask && mask._dirty) {
                    const jointNames = mask.jointNames;
                    const nodes = animationState.animationAsset.config.nodes!;

                    for (const channel of animationState.channels) {
                        if (jointNames && jointNames.length > 0) {
                            const jointIndex = channel.glTFChannel.target.node;
                            channel.enabled = jointIndex === undefined || jointNames.indexOf(nodes[jointIndex].name!) >= 0;
                        }
                        else {
                            channel.enabled = true;
                        }
                    }
                }

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

                for (let i = animationFadeStates.length - 1; i >= 0; i--) {
                    const fadeStates = animationFadeStates[i];

                    for (let j = 0, r = 0, lJ = fadeStates.length; j < lJ; ++j) {
                        let forceUpdate = false;
                        const fadeState = fadeStates[j];
                        const sFadeState = fadeState.fadeState;
                        const sSubFadeState = fadeState.subFadeState;

                        if (sFadeState === 1 && sSubFadeState === 1) {
                            r++;
                            fadeState.release();
                        }
                        else {
                            if (r > 0) {
                                fadeStates[j - r] = fadeState;
                            }

                            if (sFadeState !== 0 || sSubFadeState !== 0) {
                                forceUpdate = true;
                                this._updateAnimationFadeState(fadeState, deltaTime);
                            }

                            for (const animationState of fadeState.states) {
                                if (animationState.constructor === AnimationTreeState) {
                                    this._updateAnimationTreeState(fadeState, animationState as AnimationTreeState);
                                }
                                else {
                                    this._updateAnimationState(fadeState, animationState as AnimationState, deltaTime, forceUpdate);
                                }
                            }
                        }

                        if (j === lJ - 1 && r > 0) {
                            fadeStates.length -= r;
                        }
                    }
                }

                for (const layer of animationLayers) {
                    const mask = layer.mask as AnimationMask | null;
                    if (mask && mask._dirty) {
                        mask._dirty = false;
                    }
                }

                for (const k in blendlayers) { // Update blendLayers.
                    const blendLayer = blendlayers[k];
                    blendLayer.updateTarget();
                }
            }
        }
    }
}