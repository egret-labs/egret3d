namespace egret3d {
    /**
     * 
     */
    export interface GLTFAnimation extends gltf.Animation {
        extensions: {
            paper: {
                frameRate: number;
                clips: GLTFAnimationClip[];
                events?: GLTFAnimationFrameEvent[];
            };
        };
    }
    /**
     * 
     */
    export interface GLTFAnimationChannel extends gltf.AnimationChannel {
        extensions?: {
            paper: {
                type: string,
                property: string,
            }
        };
    }
    /**
     * 
     */
    export interface GLTFAnimationFrameEvent {
        /**
         * 事件名称。
         */
        name: string;
        /**
         * 
         */
        position: number;
        /**
         * 事件 int 变量。
         */
        intVariable?: int;
        /**
         * 事件 float 变量。
         */
        floatVariable?: number;
        /**
         * 事件 string 变量。
         */
        stringVariable?: string;
    }
    /**
     * 
     */
    export interface GLTFAnimationClip {
        /**
         * 动画剪辑名称。
         */
        name: string;
        /**
         * 播放次数。
         */
        playTimes?: uint;
        /**
         * 开始时间。（以秒为单位）
         */
        position: number;
        /**
         * 持续时间。（以秒为单位）
         */
        duration: number;
    }
    /**
     * 动画资源。
     */
    export class AnimationAsset extends GLTFAsset {
        /*
         * 获取动画剪辑。
         */
        public getAnimationClip(name: string): GLTFAnimationClip | null {
            if (
                !this.config.animations ||
                this.config.animations.length === 0

            ) { // TODO 动画数据暂不合并。
                return null;
            }

            const animation = this.config.animations[0] as GLTFAnimation;
            if (animation.extensions.paper.clips.length === 0) {
                return null;
            }

            if (!name) {
                return animation.extensions.paper.clips[0];
            }

            for (const animation of this.config.animations) {
                for (const animationClip of animation.extensions.paper.clips) {
                    if (animationClip.name === name) {
                        return animationClip;
                    }
                }
            }

            return null;
        }
    }
}