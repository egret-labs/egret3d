namespace paper.editor {
    export class BaseGeo {
        public editorModel: EditorModel;
        public geo: GameObject;

        private forward = new egret3d.Vector3(0, 0, 1);
        private up = new egret3d.Vector3(0, 1, 0);
        private right = new egret3d.Vector3(1, 0, 0);
        public onSet() {

        }
        public isPressed() {

        }
        public onMouseOn() {

        }
        public changeGeo(newGeo: BaseGeo) {

        }
    }
}