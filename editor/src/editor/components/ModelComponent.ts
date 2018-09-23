namespace paper.debug {
    /**
     * 
     */
    export const enum ModelComponentEvent {
        SceneSelected = "SceneSelected",
        SceneUnselected = "SceneUnselected",
        GameObjectHovered = "GameObjectHovered",
        GameObjectSelected = "GameObjectSelected",
        GameObjectUnselected = "GameObjectUnselected",
    }
    /**
     * 
     */
    export class ModelComponent extends SingletonComponent {
        /**
         * 所有选中的实体。
         */
        public readonly selectedGameObjects: GameObject[] = [];
        /**
         * 选中的场景。
         */
        public selectedScene: Scene | null = null;
        /**
         * 
         */
        public hoveredGameObject: GameObject | null = null;
        /**
         * 最后一个选中的实体。
         */
        public selectedGameObject: GameObject | null = null;

        public select(value: Scene | GameObject | null, isReplace?: boolean) {
            if (value) {
                if (value instanceof Scene) {
                    if (this.selectedScene === value) {
                        return;
                    }
                }
                else if (
                    this.selectedGameObject === value ||
                    this.selectedGameObjects.indexOf(value) >= 0
                ) {
                    return;
                }
            }

            if (!value || value instanceof Scene || this.selectedScene) {
                isReplace = true;
            }

            if (isReplace) {
                if (this.selectedScene) {
                    const selectedScene = this.selectedScene;
                    this.selectedScene = null;
                    EventPool.dispatchEvent(ModelComponentEvent.SceneUnselected, this, selectedScene);
                }
                else if (this.selectedGameObjects.length > 0) {
                    const gameObjects = this.selectedGameObjects.concat();
                    this.selectedGameObjects.length = 0;
                    this.selectedGameObject = null;

                    for (const gameObject of gameObjects) {
                        EventPool.dispatchEvent(ModelComponentEvent.GameObjectUnselected, this, gameObject);
                    }
                }
            }

            if (value) {
                if (value instanceof Scene) {
                    this.selectedScene = value;
                    EventPool.dispatchEvent(ModelComponentEvent.SceneSelected, this, value);
                }
                else {
                    this.selectedGameObjects.push(value);
                    this.selectedGameObject = value;
                    EventPool.dispatchEvent(ModelComponentEvent.GameObjectSelected, this, value);
                }
            }

            (global || window)["psgo"] = value; // For quick debug.
        }

        public unselect(value: Scene | GameObject) {
            if (value instanceof Scene) {
                if (this.selectedScene === value) {
                    this.selectedScene = null;
                    EventPool.dispatchEvent(ModelComponentEvent.SceneUnselected, this, value);
                }
            }
            else {
                const index = this.selectedGameObjects.indexOf(value);
                if (index >= 0) {
                    if (this.selectedGameObject === value) {
                        this.selectedGameObject = null;
                    }

                    this.selectedGameObjects.splice(index, 1);
                    EventPool.dispatchEvent(ModelComponentEvent.GameObjectUnselected, this, value);
                }
            }
        }

        public hover(value: GameObject | null) {
            if (this.hoveredGameObject === value) {
                return;
            }

            this.hoveredGameObject = value;
            EventPool.dispatchEvent(ModelComponentEvent.GameObjectHovered, this, this.hoveredGameObject);
        }
    }
}