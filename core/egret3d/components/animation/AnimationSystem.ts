namespace egret3d {
    /**
     * 
     */
    export class AnimationSystem extends paper.BaseSystem {
        protected readonly _interests = [
            { componentClass: Animation }
        ];

        public onAddComponent(component: Animation) {
            if (component.autoPlay) {
                component.play();
            }
        }

        public onUpdate() { // TODO 应将组件功能尽量移到系统
            const globalTime = this._clock.time;
            for (const gameObject of this._groups[0].gameObjects) {
                for (const animation of gameObject.getComponents(Animation)) {
                    animation._update(globalTime);
                }
            }
        }
    }
}