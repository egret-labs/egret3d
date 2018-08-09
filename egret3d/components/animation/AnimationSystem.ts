namespace egret3d {
    /**
     * 
     */
    export class AnimationSystem extends paper.BaseSystem {
        protected readonly _interests = [
            { componentClass: Animation }
        ];

        public onAddComponent(component: Animation) {
            const animations = component.gameObject.getComponents(Animation);
            component._addToSystem = true;

            if (component === animations[0] && !component._skinnedMeshRenderer) {
                component._skinnedMeshRenderer = component.gameObject.getComponentsInChildren(SkinnedMeshRenderer)[0];

                if (component._skinnedMeshRenderer) {
                    for (const bone of component._skinnedMeshRenderer.bones) {
                        const boneBlendLayer = new BoneBlendLayer();
                        component._boneBlendLayers.push(boneBlendLayer);
                    }
                }

                if (component.autoPlay) {
                    component.play();
                }
            }
        }

        public onUpdate() { // TODO 应将组件功能尽量移到系统
            const globalTime = this._clock.time;
            for (const gameObject of this._groups[0].gameObjects) {
                for (const animation of gameObject.getComponents(Animation)) {
                    animation.update(globalTime);
                }
            }
        }

        public onRemoveComponent(component: Animation) {
            component._addToSystem = false;
        }
    }
}