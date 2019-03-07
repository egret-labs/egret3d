namespace examples.oimo {

    export class TouchJointSystem extends paper.BaseSystem<paper.GameObject> {
        private readonly _touchPlane: egret3d.Plane = egret3d.Plane.create();
        private readonly _ray: egret3d.Ray = egret3d.Ray.create();
        private readonly _raycastInfo: egret3d.RaycastInfo = egret3d.RaycastInfo.create();
        private _touchEntity: paper.GameObject | null = null;

        public onFrame() {
            const { defaultPointer } = egret3d.inputCollecter;

            if (this._touchEntity) {
                if (defaultPointer.isUp(egret3d.PointerButtonsType.LeftMouse)) {
                    this._touchEntity.destroy();
                    this._touchEntity = null;
                }
                else {
                    egret3d.Camera.main.stageToRay(defaultPointer.position.x, defaultPointer.position.x, this._ray);

                    if (this._touchPlane.raycast(this._ray, this._raycastInfo)) {
                        this._touchEntity.transform.localPosition = this._raycastInfo.position;
                    }
                }
            }
            else if (defaultPointer.isDown(egret3d.PointerButtonsType.LeftMouse)) {
                const physicsSystem = paper.Application.systemManager.getSystem(egret3d.oimo.PhysicsSystem)!;
                egret3d.Camera.main.stageToRay(defaultPointer.position.x, defaultPointer.position.x, this._ray);
                this._raycastInfo.clear();

                if (physicsSystem.raycast(this._ray, paper.Layer.Default, 0.0, this._raycastInfo)) {
                    const rigidbody = this._raycastInfo.rigidbody as egret3d.oimo.Rigidbody;

                    if (rigidbody.type === egret3d.oimo.RigidbodyType.DYNAMIC) {
                        // Update touch plane.
                        this._touchPlane.fromPoint(this._raycastInfo.position);
                        // Create touch entity.
                        this._touchEntity = paper.GameObject.create();
                        this._touchEntity.transform.localPosition = this._raycastInfo.position;
                        // Set rigidbogy type.
                        this._touchEntity.addComponent(egret3d.oimo.Rigidbody).type = egret3d.oimo.RigidbodyType.KINEMATIC;
                        // Add joint.
                        const joint = this._touchEntity.addComponent(egret3d.oimo.SphericalJoint);
                        joint.collisionEnabled = false;
                        joint.springDamper.frequency = 4.0;
                        joint.springDamper.dampingRatio = 1.0;
                        joint.connectedRigidbody = this._raycastInfo.rigidbody as egret3d.oimo.Rigidbody;
                    }
                }
            }
        }
    }
}
