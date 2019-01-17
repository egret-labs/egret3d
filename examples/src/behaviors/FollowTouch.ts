namespace behaviors {

    export class FollowTouch extends paper.Behaviour {
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 1.0 })
        public followSpeed: number = 0.05;
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public readonly lookAtPoint: egret3d.Vector3 = egret3d.Vector3.create();

        public target: paper.GameObject | null = null;

        public onUpdate(): any {
            const target = this.lookAtPoint;

            if (this.target) {
                target.copy(this.target.transform.position);
            }

            const inputCollecter = this.gameObject.getComponent(egret3d.InputCollecter)!;
            const defaultPointer = inputCollecter.defaultPointer;
            const transform = this.transform;

            transform.translate(
                (defaultPointer.position.x - transform.localPosition.x) * this.followSpeed,
                (-defaultPointer.position.y - transform.localPosition.y) * this.followSpeed,
                0.0
            );
            transform.lookAt(target);

        }
    }
}

