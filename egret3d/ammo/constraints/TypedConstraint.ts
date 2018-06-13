namespace egret3d.ammo {
    const _helpVector3A = new Vector3();
    const _helpVector3B = new Vector3();
    const _helpVector3C = new Vector3();
    const _helpVector3D = new Vector3();
    const _helpQuaternion = new Quaternion();
    const _helpMatrix = new Matrix();

    /**
     * 
     */
    export abstract class TypedConstraint extends paper.BaseComponent {
        protected static readonly _helpMatrixA: Matrix = new Matrix();
        protected static readonly _helpMatrixB: Matrix = new Matrix();

        @paper.serializedField
        protected _disableCollisionsBetweenConstrainedBodies: boolean = true;
        @paper.serializedField
        protected _constraintType: Ammo.ConstraintType = Ammo.ConstraintType.ConstrainToAnotherBody;
        @paper.serializedField
        protected _overrideNumSolverIterations: int = 20;
        @paper.serializedField
        protected _breakingImpulseThreshold: number = Infinity;
        @paper.serializedField
        protected readonly _constraintPoint: Vector3 = Vector3.ZERO.clone();
        @paper.serializedField
        protected readonly _constraintAxisX: Vector3 = Vector3.FORWARD.clone();
        @paper.serializedField
        protected readonly _constraintAxisY: Vector3 = Vector3.UP.clone();
        @paper.serializedField
        protected _otherRigidBody: Rigidbody | null = null;
        protected _btTypedConstraint: Ammo.btTypedConstraint | null = null;

        protected abstract _createConstraint(): Ammo.btTypedConstraint | null;

        protected _getCollisionObject() {
            const collisionObject = this.gameObject.getComponent(CollisionObject);
            if (!collisionObject) {
                console.debug("Never.");
                return null;
            }

            if (!this._otherRigidBody) {
                console.error("The constraint need to config another rigid body.", this.gameObject.name, this.gameObject.hashCode);
                return null;
            }

            return collisionObject;
        }

        protected _createFrame(forward: Vector3, up: Vector3, constraintPoint: Vector3, frame: Matrix) {
            const right = Vector3.cross(forward, up, _helpVector3A).normalize();
            frame.set3x3(
                forward.x, forward.y, forward.z,
                up.x, up.y, up.z,
                right.x, right.y, right.z,
            );
            frame.setTranslation(constraintPoint);
        }

        protected _createFrames(forwardA: Vector3, upA: Vector3, constraintPointA: Vector3, frameA: Matrix, frameB: Matrix) {
            if (!this._otherRigidBody) {
                console.debug("Never.");
                return;
            }

            frameA.identity(); // TODO move to createFrame?
            frameB.identity();
            this._createFrame(forwardA, upA, constraintPointA, frameA);
            const thisTransform = this.gameObject.transform;
            const otherTransform = this._otherRigidBody.gameObject.transform;
            const quaternion = Quaternion.multiply(
                thisTransform.getLocalRotation(),
                otherTransform.getLocalRotation(),
                _helpQuaternion
            );
            const matrixValues = frameA.rawData;
            const xx = quaternion.transformVector3(_helpVector3A.set(matrixValues[0], matrixValues[1], matrixValues[2]));
            const yy = quaternion.transformVector3(_helpVector3B.set(matrixValues[4], matrixValues[5], matrixValues[6]));
            const zz = quaternion.transformVector3(_helpVector3C.set(matrixValues[8], matrixValues[9], matrixValues[10]));
            frameB.set3x3(
                xx.x, xx.y, xx.z,
                yy.x, yy.y, yy.z,
                zz.x, zz.y, zz.z,
            );
            frameB.setTranslation(
                _helpMatrix.copy(otherTransform.getWorldMatrix()).identity().transformVector3(
                    thisTransform.getWorldMatrix().transformVector3(_helpVector3D.copy(constraintPointA))
                )
            );
        }

        public uninitialize() {
            super.uninitialize();

            if (this._btTypedConstraint) {
                Ammo.destroy(this._btTypedConstraint);
            }

            this._btTypedConstraint = null;
        }

        public get btTypedConstraint() {
            if (!this._btTypedConstraint) {
                this._btTypedConstraint = this._createConstraint();
            }

            return this._btTypedConstraint;
        }
    }
}