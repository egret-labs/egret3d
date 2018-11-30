namespace behaviors {
    /**
     * 
     */
    export class AnimationHelper extends paper.Behaviour {
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 10.0 })
        public fadeTime: number = 0.3;

        @paper.editor.property(paper.editor.EditType.LIST, { listItems: "_animations" })
        public get animation(): string {
            return this._animation;
        }
        public set animation(value: string) {
            if (this._animation === value) {
                return;
            }

            this._animation = value;
            this.play();
        }

        @paper.editor.property(paper.editor.EditType.BUTTON)
        public play: () => void = () => {
            const animation = this.gameObject.getComponent(egret3d.Animation);
            if (animation) {
                animation.fadeIn(this.animation, this.fadeTime);
            }
        }

        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public logEvents: boolean = false;

        private _animation: string = "";
        private readonly _animations: paper.editor.ListItem[] = [];

        public onAwake(logEvents?: boolean) {
            if (logEvents) {
                this.logEvents = true;
            }
        }

        public onStart() {
            const animation = this.gameObject.getComponent(egret3d.Animation);
            if (animation) {
                for (const animationAsset of animation.animations) {
                    for (const glftAnimation of animationAsset.config.animations as egret3d.GLTFAnimation[]) {
                        for (const animationClip of glftAnimation.extensions.paper.clips) {
                            this._animations.push({ label: animationClip.name, value: animationClip.name });
                        }
                    }
                }
            }
        }

        public onAnimationEvent(animationEvent: egret3d.AnimationEvent) {
            if (this.logEvents) {
                console.log(animationEvent.type, animationEvent.animationState.animationClip.name);
            }
        }
    }
}