namespace behaviors {

    export class Rotater extends paper.Behaviour {
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public readonly speed: egret3d.Vector3 = egret3d.Vector3.create(0.0, 1.0, 0.0);

        public onUpdate(deltaTime: number): any {
            const { speed } = this;
            this.gameObject.transform.rotate(
                speed.x * deltaTime,
                speed.y * deltaTime,
                speed.z * deltaTime
            );
        }
    }
}

