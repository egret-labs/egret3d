namespace behaviors {

    export class PositionReseter extends paper.Behaviour {
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public readonly original: egret3d.Vector3 = egret3d.Vector3.create(0.0, 0.01, 0.0);

        @paper.editor.property(paper.editor.EditType.NESTED)
        public readonly box: egret3d.Box = egret3d.Box.create();

        public onAwake() {
            this.original.copy(this.gameObject.transform.localPosition);
        }

        public onUpdate(): any {
            if (!this.box.contains(this.gameObject.transform.localPosition)) {
                this.gameObject.transform.localPosition = this.original;
            }
        }
    }
}

