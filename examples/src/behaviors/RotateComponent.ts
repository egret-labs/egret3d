namespace behaviors {

    export class RotateComponent extends paper.Behaviour {
        public rotateSpeed: number = 0.1;
        public readonly lookAtPoint: egret3d.Vector3 = egret3d.Vector3.create();
        public target: paper.GameObject | null = null;

        private _radius: number = 0.0;
        private _distanceY: number = 0.0;
        private _timer: number = 0.0;

        public onAwake() {
            console.log("onAwake");
        }

        public onEnable() {
            console.log("onEnable");
        }

        public onStart() {
            console.log("onStart");
        }

        public onUpdate(delta: number): any {
            this._timer += delta;

            const target = this.target ? this.target.transform.position : this.lookAtPoint;
            const transform = this.gameObject.transform;
            const position = transform.position;

            const radius = Math.sqrt(Math.pow(position.x - target.x, 2) + Math.pow(position.z - target.z, 2));
            const distanceY = position.y - target.y;

            if (Math.abs(this._radius - radius) > 0.05) {
                this._radius = radius;
            }

            if (Math.abs(this._distanceY - distanceY) > 0.05) {
                this._distanceY = distanceY;
            }

            const sin = Math.sin(this._timer * this.rotateSpeed);
            const cos = -Math.cos(this._timer * this.rotateSpeed);
            transform.setLocalPosition(target.x + sin * this._radius, target.y + this._distanceY, target.z + cos * this._radius);
            transform.lookAt(target);
        }

        public onDisable() {
            console.log("onDisable");
        }

        public onDestroy() {
            console.log("onDestroy");
        }
    }
}

