namespace paper.editor{

    //添加游戏对象
    export class AddGameObjectState extends BaseState {
        public static toString(): string {
            return "[class common.AddGameObjectState]";
        }

        public static create(data: any = null): AddGameObjectState | null {
            const state = new AddGameObjectState();
            state.data = data;
            return state;
        }

        public undo(): boolean {
            if (super.undo()) {
                var datas = this.data.datas;
                var gameObjs = editor.Editor.editorModel.getGameObjectsByUUids(this.data.cacheGameObjectUUid);
                editor.Editor.editorModel._deleteGameObject(gameObjs);
                var selectUUids = datas.filter(function (data) {
                    if (data.parentUUid) {
                        return data.parentUUid;
                    }
                });
                this.dispatchEditorModelEvent(editor.EditorModelEvent.DELETE_GAMEOBJECTS, selectUUids);
                return true;
            }
            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                let { datas } = this.data;
                let selectUUids: string[] = [];
                for (let index = 0; index < datas.length; index++) {
                    const element = datas[index];
                    const { parentUUid } = element;

                    let gameObj: GameObject;

                    if (element.serializeData) {
                        gameObj = deserialize(element.serializeData, element.assetsMap);
                    } else {
                        gameObj = new GameObject();
                        gameObj.name = "NewGameObject";
                        element.serializeData = serialize(gameObj);
                        element.assetsMap = Editor.editorModel.createAssetMap(element.serializeData);
                    }

                    if (parentUUid) {
                        const parentGameObj: GameObject | null = Editor.editorModel.getGameObjectByUUid(parentUUid);
                        if (parentGameObj) {
                            gameObj.transform.setParent(parentGameObj.transform);
                        }
                    }

                    selectUUids.push(gameObj.uuid);
                }

                this.data.cacheGameObjectUUid = selectUUids.concat();

                //select new objects
                this.dispatchEditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS, selectUUids);
                return true;
            }
            return false;
        }
    }
}