namespace egret3d {
    /**
     * 动画系统。
     */
    export class AnimationSystem extends paper.BaseSystem {
        protected readonly _interests = [
            { componentClass: Animation }
        ];

        public onAddComponent(component: Animation) {
            if (component.autoPlay && (!component.lastAnimationState || !component.lastAnimationState.isPlaying)) {
                component.play();
            }
        }

        public onUpdate(deltaTime: number) {
            // TODO 应将组件功能尽量移到系统，视野剔除
            for (const gameObject of this._groups[0].gameObjects) {
                gameObject.getComponent(Animation)!._update(deltaTime);
            }
        }
    }
}