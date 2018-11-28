namespace egret3d {
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