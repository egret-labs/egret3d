/// <reference path="./EventDispatcher.ts" />
namespace paper.editor {
    /**
     * 编辑器事件
     */
    export class EditorEvent extends BaseEvent {
        public static CHANGE_SCENE = "changeScene";
        constructor(type: string, data?: any) {
            super(type, data);
        }
    }
    /**
     * 编辑器
     **/
    export class Editor {
        private static editorSceneModel: EditorSceneModel;
        /**初始化 */
        public static async init() {
            this.eventDispatcher = new EventDispatcher();
            //覆盖生成 uuid 的方式。
            createUUID = generateUuid;
            //初始化编辑环境
            this.initEditEnvironment();
            //初始化资源
            await RES.loadConfig("resource/default.res.json", "resource/");
            //初始化编辑场景
            this.editorSceneModel = new EditorSceneModel();
            this.editorSceneModel.init();

            Application.sceneManager.camerasScene = this.editorSceneModel.editorScene;
        }
        private static _activeEditorModel: EditorModel;
        /**
         * 当前激活的编辑模型
         */
        public static get activeEditorModel(): EditorModel {
            return this._activeEditorModel;
        }
        //设置激活模型
        private static setActiveModel(model: EditorModel): void {
            this.activeScene(model.scene);
            this._activeEditorModel = model;
            this.editorSceneModel.editorModel = model;
            this.dispatchEvent(new EditorEvent(EditorEvent.CHANGE_SCENE));
        }
        private static activeScene(scene: Scene): void {
            if (paper.Application.sceneManager.activeScene) {
                let objs = paper.Application.sceneManager.activeScene.getRootGameObjects();
                objs.forEach(obj => {
                    obj.activeSelf = false;
                });
            }
            paper.Application.sceneManager.activeScene = scene;
            let objs = paper.Application.sceneManager.activeScene.getRootGameObjects();
            objs.forEach(obj => {
                obj.activeSelf = true;
            });
        }
        /**
         * 编辑场景
         * @param sceneUrl 场景资源URL
         */
        public static async editScene(sceneUrl: string) {
            await RES.getResAsync(sceneUrl);
            const rawScene = RES.getRes(sceneUrl) as RawScene;
            if (rawScene) {
                if (this.activeEditorModel) {
                    this.activeEditorModel.scene.destroy();
                }
                let scene = rawScene.createInstance(true);
                let sceneEditorModel = new EditorModel();
                sceneEditorModel.init(scene, 'scene', sceneUrl);
                this.setActiveModel(sceneEditorModel);
            }
        }
        /**
         * 编辑预置体
         * @param prefabUrl 预置体资源URL
         */
        public static async editPrefab(prefabUrl: string) {
            await RES.getResAsync(prefabUrl);
            const prefab = RES.getRes(prefabUrl) as Prefab;
            if (prefab) {
                if (this.activeEditorModel) {
                    this.activeEditorModel.scene.destroy();
                }
                let scene = Scene.createEmpty('prefabEditScene', false);
                let prefabInstance = prefab.createInstance(scene, true);

                let prefabEditorModel = new EditorModel();
                prefabEditorModel.init(scene, 'prefab', prefabUrl);
                //清除自身的预置体信息
                let clearPrefabInfo = (obj: GameObject): void => {
                    obj.extras.linkedID = undefined;
                    obj.extras.prefab = undefined;
                    obj.extras.prefabRootId = undefined;
                    for (let i: number = 0; i < obj.transform.children.length; i++) {
                        let child = obj.transform.children[i].gameObject;
                        if (prefabEditorModel.isPrefabChild(child))
                            clearPrefabInfo(child);
                    }
                }
                clearPrefabInfo(prefabInstance);
                this.setActiveModel(prefabEditorModel);
            }
        }
        /**
         * 撤销
         */
        public static undo() {
            if (this.activeEditorModel)
                this.activeEditorModel.history.back();
        }
        /**
         * 重做
         */
        public static redo() {
            if (this.activeEditorModel)
                this.activeEditorModel.history.forward();
        }
        public static deserializeHistory(data: any): void {
            this.activeEditorModel.history.deserialize(data);
        }
        public static serializeHistory(): string {
            const historyData = this.activeEditorModel.history.serialize();
            return JSON.stringify(historyData);
        }
        private static eventDispatcher: EventDispatcher;
        public static addEventListener(type: string, fun: Function, thisObj: any, level: number = 0): void {
            this.eventDispatcher.addEventListener(type, fun, thisObj, level);
        }
        public static removeEventListener(type: string, fun: Function, thisObj: any): void {
            this.eventDispatcher.removeEventListener(type, fun, thisObj);
        }
        public static dispatchEvent(event: BaseEvent): void {
            this.eventDispatcher.dispatchEvent(event);
        }
        private static initEditEnvironment() {
            egret3d.runEgret({
                antialias: false,
                isEditor: true,
                isPlaying: false,
                systems: [
                    egret3d.BeginSystem,
                    paper.EnableSystem,
                    paper.StartSystem,
                    //
                    paper.UpdateSystem,
                    //
                    egret3d.AnimationSystem,
                    //
                    paper.LateUpdateSystem,
                    //
                    egret3d.MeshRendererSystem,
                    egret3d.SkinnedMeshRendererSystem,
                    egret3d.particle.ParticleSystem,
                    egret3d.Egret2DRendererSystem,
                    //
                    egret3d.CameraSystem,
                    egret3d.WebGLRenderSystem,
                    //
                    paper.DisableSystem,
                    egret3d.EndSystem
                ]
            });
        }
    }
}