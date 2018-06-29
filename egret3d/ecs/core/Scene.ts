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
                console.debug("Remove game object again.", gameObject.name, gameObject.uuid);
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
                console.debug("Add game object again.", gameObject.name, gameObject.uuid);
            }
        }
        /**
         * 返回当前激活场景中查找对应名称的GameObject
         * @param name 
         */
        public find(name: string) {
            for (const gameObject of this._gameObjects) {
                if (gameObject.name === name) {
                    return gameObject;
                }
            }

            return null;
        }
        /**
         * 返回一个在当前激活场景中查找对应tag的GameObject
         * @param tag 
         */
        public findWithTag(tag: string) {
            for (const gameObject of this._gameObjects) {
                if (gameObject.tag === tag) {
                    return gameObject;
                }
            }

            return null;
        }
        /**
         * 返回一个在当前激活场景中查找对应 uuid 的GameObject
         * @param uuid 
         */
        public findWithUUID(uuid: string) {
            for (const gameObject of this._gameObjects) {
                if (gameObject.uuid === uuid) {
                    return gameObject;
                }
            }

            return null;
        }
        /**
         * 返回所有在当前激活场景中查找对应tag的GameObject
         * @param name 
         */
        public findGameObjectsWithTag(tag: string) {
            const gameObjects: GameObject[] = [];
            for (const gameObject of this._gameObjects) {
                if (gameObject.tag === tag) {
                    gameObjects.push(gameObject);
                }
            }

            return gameObjects;
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
