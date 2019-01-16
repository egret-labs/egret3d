

namespace behaviors {
    export class LookAtTarget extends paper.Behaviour {
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public readonly lookAtPoint: egret3d.Vector3 = egret3d.Vector3.create();

        public target: paper.GameObject | null = null;

        public onUpdate() {
            const target = this.lookAtPoint;

            if (this.target) {
                target.copy(this.target.transform.position);
            }

            this.gameObject.transform.lookAt(target);
        }
    }
}
