namespace paper.editor {
    export class positionCtrlGeo extends BaseGeo {
        constructor() {
            super();
        }
        onSet() {
            let pcontroller = new paper.GameObject("", "", Application.sceneManager.editorScene);
            pcontroller.activeSelf = true;
            pcontroller.name = "GizmoController_Position";
            pcontroller.tag = "Editor";

            let x = new xAxis();

            let y = new yAxis();

            let z = new zAxis();

            this.geo = pcontroller
        }
    }
}