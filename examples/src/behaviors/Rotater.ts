namespace behaviors {

    export class Rotater extends paper.Behaviour {
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public readonly speed: egret3d.Vector3 = egret3d.Vector3.create(0.0, 0.05, 0.0);

        public onUpdate(deltaTime: number): any {
            this.gameObject.transform.rotate(this.speed.multiplyScalar(deltaTime));
        }
    }
}

