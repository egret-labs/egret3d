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
            //启动egret3编辑环境
            this.runEgret();
            //初始化资源
            await RES.loadConfig("resource/default.res.json", "resource/");
            //初始化编辑场景
            this.editorSceneModel = new EditorSceneModel();
            this.editorSceneModel.init();

            Application.sceneManager.camerasScene = this.editorSceneModel.editorScene;
        }
        private static _activeEditorModel: EditorModel;
        public static get activeEditorModel(): EditorModel {
            return this._activeEditorModel;
        }
        private static runEgret() {
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
        private static editorModel: EditorModel;
        public static async editScene(sceneUrl: string) {
            await RES.getResAsync(sceneUrl);
            const rawScene = RES.getRes(sceneUrl) as RawScene;
            if (rawScene) {
                let scene = rawScene.createInstance(true);
                this.editorModel = new EditorModel();
                this.editorModel.init(scene);
                paper.Application.sceneManager.activeScene = this.editorModel.scene;
                this.editorSceneModel.editorModel = this._activeEditorModel = this.editorModel;
                this.dispatchEvent(new EditorEvent(EditorEvent.CHANGE_SCENE));
            }
        }
        private static prefabEditorModel: EditorModel;
        public static async attachPrefabEditScene(prefabUrl: string) {
            await RES.getResAsync(prefabUrl);
            const prefab = RES.getRes(prefabUrl) as Prefab;
            if (prefab) {
                if (this.prefabEditorModel) {
                    this.prefabEditorModel.scene.destroy();
                }
                let scene = Scene.createEmpty('prefabEditScene', false);
                prefab.createInstance(scene, true);
                this.prefabEditorModel = new EditorModel();
                this.prefabEditorModel.init(scene);

                paper.Application.sceneManager.activeScene = this.prefabEditorModel.scene;
                this.editorSceneModel.editorModel = this._activeEditorModel = this.prefabEditorModel;
                this.dispatchEvent(new EditorEvent(EditorEvent.CHANGE_SCENE));
            }
        }
        private static detachCurrentPrefabEditScene(): void {
            if (this.prefabEditorModel) {
                this.prefabEditorModel.scene.destroy();
                paper.Application.sceneManager.activeScene = this.editorModel.scene;
                this.editorSceneModel.editorModel = this._activeEditorModel = this.editorModel;
                this.dispatchEvent(new EditorEvent(EditorEvent.CHANGE_SCENE));
            }
        }
        public static undo() {
            if (this.activeEditorModel)
                this.activeEditorModel.history.back();
        }
        public static redo() {
            if (this.activeEditorModel)
                this.activeEditorModel.history.forward();
        }
        public static deserializeHistory(data: any): void {
            this.editorModel.history.deserialize(data);
        }
        public static serializeHistory(): string {
            const historyData =  this.editorModel.history.serialize();
            return JSON.stringify(historyData);
        }
        private static eventDispatcher: EventDispatcher;
        private static addEventListener(type: string, fun: Function, thisObj: any, level: number = 0): void {
            this.eventDispatcher.addEventListener(type, fun, thisObj, level);
        }
        private static removeEventListener(type: string, fun: Function, thisObj: any): void {
            this.eventDispatcher.removeEventListener(type, fun, thisObj);
        }
        private static dispatchEvent(event: BaseEvent): void {
            this.eventDispatcher.dispatchEvent(event);
        }
    }
}