namespace paper {

    /**
     * 场景类
     */
    export class Scene extends SerializableObject {

        /**
         * 场景名称。
         */
        @paper.serializedField
        public name: string = "";


        /**
         * 场景的light map列表。
         */
        @paper.serializedField
        public readonly lightmaps: egret3d.Texture[] = [];

        /**
         * 当前场景的所有GameObject对象池
         * 
         */
        @paper.serializedField
        @paper.deserializedIgnore
        public readonly gameObjects: GameObject[] = [];

        /**
         * 存储着关联的数据
         * 场景保存时，将场景快照数据保存至对应的资源中
         * 
         */
        public $rawScene: egret3d.RawScene | null = null;

        public constructor() {
            super();

            Application.sceneManager._addScene(this);

            for (const gameObject of Application.sceneManager.globalObjects) {
                this.$addGameObject(gameObject);
            }
        }

        /**
         * 销毁
         * @internal
         */
        public $destroy() {
            const globalObjects = Application.sceneManager.globalObjects;
            let i = this.gameObjects.length;
            while (i--) {
                const gameObject = this.gameObjects[i];
                if (globalObjects.indexOf(gameObject) >= 0) {
                    continue;
                }

                gameObject.destroy();
            }

            this.lightmaps.length = 0;
            this.gameObjects.length = 0;
            this.$rawScene = null as any;
        }

        /**
         * 移除GameObject对象
         * 
         */
        public $removeGameObject(gameObject: GameObject) {
            const index = this.gameObjects.indexOf(gameObject);
            if (index > -1) {
                this.gameObjects.splice(index, 1);
            }
            else {
                console.debug("Remove game object again.", gameObject.hashCode);
            }
        }

        /**
         * 添加一个GameObject对象
         * 
         */
        public $addGameObject(gameObject: GameObject) {
            if (this.gameObjects.indexOf(gameObject) < 0) {
                this.gameObjects.push(gameObject);
            }
            else {
                console.debug("Add game object again.", gameObject.hashCode);
            }
        }

        /**
         * 获取所有根级GameObject对象
         */
        public getRootGameObjects() {
            const gameObjects: GameObject[] = [];
            for (const gameObject of this.gameObjects) {
                if (!gameObject.transform.parent) {
                    gameObjects.push(gameObject);
                }
            }

            return gameObjects;
        }
    }
}
