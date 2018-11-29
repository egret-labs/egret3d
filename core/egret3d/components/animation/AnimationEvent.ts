namespace egret3d {
    /**
     * 动画事件类型。
     */
    export const enum AnimationEventType {
        Start,
        LoopComplete,
        Complete,
        KeyFrame,
        Sound,
    }
    /**
     * 动画事件。
     */
    export class AnimationEvent extends paper.BaseRelease<AnimationEvent> {
        private static _instances = [] as AnimationEvent[];

        public static create(type: AnimationEventType, animationState: AnimationState, keyFrameEvent: GLTFAnimationFrameEvent | null = null) {
            let instance: AnimationEvent | null = null;
            if (this._instances.length > 0) {
                instance = this._instances.pop()!;
                instance._released = false;
            }
            else {
                instance = new AnimationEvent();
            }

            instance.type = type;
            instance.animationState = animationState;
            instance.frameEvent = keyFrameEvent;

            return instance;
        }

        public type: AnimationEventType = AnimationEventType.Start;
        public animationState: AnimationState = null!;
        public frameEvent: GLTFAnimationFrameEvent | null = null;

        private constructor() {
            super();
        }
    }
}