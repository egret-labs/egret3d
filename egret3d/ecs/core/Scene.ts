namespace paper {
    /**
     * 场景类
     */
    export class Scene extends SerializableObject {
        /**
         * 场景名称。
         */
        @serializedField
        public name: string = "";
        /**
         * 场景的light map列表。
         */
        @serializedField
        public readonly lightmaps: egret3d.Texture[] = [];
        /**
         * 存储着关联的数据
         * 场景保存时，将场景快照数据保存至对应的资源中
         */
        public rawScene: egret3d.RawScene | null = null;

        private readonly _gameObjects: GameObject[] = [];
        /**
         * @internal
         */
        public constructor() {
            super();

            Application.sceneManager._addScene(this);
        }

        /**
         * @internal
         */
        public _destroy() {
            let i = this._gameObjects.length;
            while (i--) {
                const gameObject = this._gameObjects[i];
                if (!gameObject || gameObject.transform.parent) {
                    continue;
                }

                gameObject.destroy();
            }

            this.lightmaps.length = 0;
            this._gameObjects.length = 0;
            this.rawScene = null as any;
        }

        /**
         * @internal
         */
        public _removeGameObject(gameObject: GameObject) {
            const index = this._gameObjects.indexOf(gameObject);
            if (index > -1) {
                this._gameObjects.splice(index, 1);
            }
            else {
                console.debug("Remove game object again.", gameObject.hashCode);
            }
        }

        /**
         * @internal
         */
        public _addGameObject(gameObject: GameObject) {
            if (this._gameObjects.indexOf(gameObject) < 0) {
                this._gameObjects.push(gameObject);
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
            for (const gameObject of this._gameObjects) {
                if (!gameObject.transform.parent) {
                    gameObjects.push(gameObject);
                }
            }

            return gameObjects;
        }

        /**
         * 当前场景的所有GameObject对象池
         */
        @serializedField
        @deserializedIgnore
        public get gameObjects(): ReadonlyArray<GameObject> {
            return this._gameObjects;
        }
    }
}
