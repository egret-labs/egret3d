namespace behaviors {

    export class RotateAround extends paper.Behaviour {
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: -10.0, maximum: 10.0 })
        public rotateSpeed: number = 0.5;
        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public readonly lookAtPoint: egret3d.Vector3 = egret3d.Vector3.create();

        public target: paper.GameObject | null = null;

        private _radius: number = 0.0;
        private _radian: number = 0.0;

        public onUpdate(deltaTime: number): any {
            const transform = this.gameObject.transform;
            const position = transform.position;
            const target = this.lookAtPoint;

            if (this.target) {
                target.copy(this.target.transform.position);
            }

            if (this.rotateSpeed !== 0.0) {
                const radius = Math.sqrt(Math.pow(position.x - target.x, 2) + Math.pow(position.z - target.z, 2));
                const radian = Math.atan2(position.z - target.z, position.x - target.x);

                if (Math.abs(this._radius - radius) > 0.05) {
                    this._radius = radius;
                }

                if (Math.abs(this._radian - radian) > 0.05) {
                    this._radian = radian;
                }

                this._radian += deltaTime * this.rotateSpeed * 0.5;

                transform.setPosition(
                    target.x + Math.cos(this._radian) * this._radius,
                    position.y,
                    target.z + Math.sin(this._radian) * this._radius
                );
            }

            transform.lookAt(target);
        }
    }
}

