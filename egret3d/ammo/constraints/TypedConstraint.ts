namespace egret3d.ammo {
    const _helpVector3A = new Vector3();
    const _helpVector3B = new Vector3();
    const _helpVector3C = new Vector3();
    const _helpVector3D = new Vector3();
    const _helpMatrix = new Matrix();

    /**
     * 
     */
    export abstract class TypedConstraint extends paper.BaseComponent {
        protected static readonly _helpQuaternionA: Quaternion = new Quaternion();
        protected static readonly _helpQuaternionB: Quaternion = new Quaternion();
        protected static readonly _helpMatrixA: Matrix = new Matrix();
        protected static readonly _helpMatrixB: Matrix = new Matrix();

        @paper.serializedField
        protected _collisionEnabled: boolean = false;
        @paper.serializedField
        protected _constraintType: Ammo.ConstraintType = Ammo.ConstraintType.ConstrainToAnotherBody;
        @paper.serializedField
        protected _overrideNumSolverIterations: int = 20;
        @paper.serializedField
        protected _breakingImpulseThreshold: number = Infinity;
        @paper.serializedField
        protected readonly _anchor: Vector3 = Vector3.ZERO.clone();
        @paper.serializedField
        protected readonly _axisX: Vector3 = Vector3.FORWARD.clone();
        @paper.serializedField
        protected readonly _axisY: Vector3 = Vector3.UP.clone();
        @paper.serializedField
        protected _connectedBody: Rigidbody | null = null;
        protected _btTypedConstraint: Ammo.btTypedConstraint | null = null;

        protected abstract _createConstraint(): Ammo.btTypedConstraint | null;

        protected _createFrame(forward: Vector3, up: Vector3, constraintPoint: Vector3, frame: Matrix) {
            const vR = Vector3.cross(forward, up, _helpVector3A).normalize();
            const vU = Vector3.cross(vR, forward, _helpVector3B).normalize();
            frame.identity();
            frame.set3x3(
                forward.x, forward.y, forward.z,
                vU.x, vU.y, vU.z,
                vR.x, vR.y, vR.z,
            );
            frame.setTranslation(constraintPoint);
        }

        protected _createFrames(forwardA: Vector3, upA: Vector3, constraintPointA: Vector3, frameA: Matrix, frameB: Matrix) {
            if (!this._connectedBody) {
                console.debug("Never.");
                return;
            }

            this._createFrame(forwardA, upA, constraintPointA, frameA);
            const thisTransform = this.gameObject.transform;
            const otherTransform = this._connectedBody.gameObject.transform;
            const quaternion = Quaternion.multiply(
                thisTransform.getLocalRotation(),
                Quaternion.inverse(otherTransform.getLocalRotation(), TypedConstraint._helpQuaternionA),
                TypedConstraint._helpQuaternionB
            );

            const matrixValues = frameA.rawData;
            const xx = quaternion.transformVector3(_helpVector3A.set(matrixValues[0], matrixValues[1], matrixValues[2]));
            const yy = quaternion.transformVector3(_helpVector3B.set(matrixValues[4], matrixValues[5], matrixValues[6]));
            const zz = quaternion.transformVector3(_helpVector3C.set(matrixValues[8], matrixValues[9], matrixValues[10]));
            frameB.identity();
            frameB.set3x3(
                xx.x, xx.y, xx.z,
                yy.x, yy.y, yy.z,
                zz.x, zz.y, zz.z,
            );
            frameB.setTranslation(
                _helpMatrix.copy(otherTransform.getWorldMatrix()).inverse().transformVector3(
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
        /**
         * 
         */
        public get collisionEnabled() {
            return this._collisionEnabled;
        }
        public set collisionEnabled(value: boolean) {
            if (this._collisionEnabled === value) {
                return;
            }

            if (this._btTypedConstraint) {
                console.warn("Cannot change the disableCollisionsBetweenConstrainedBodies after the constraint has been created.");
            }
            else {
                this._collisionEnabled = value;
            }
        }
        /**
         * 
         */
        public get constraintType() {
            return this._constraintType;
        }
        public set constraintType(value: Ammo.ConstraintType) {
            if (this._constraintType === value) {
                return;
            }

            if (this._btTypedConstraint) {
                console.warn("Cannot change the constraint type after the constraint has been created.");
            }
            else {
                this._constraintType = value;
            }
        }
        /**
         * 
         */
        public get overrideNumSolverIterations() {
            return this._overrideNumSolverIterations;
        }
        public set overrideNumSolverIterations(value: Ammo.ConstraintType) {
            if (this._overrideNumSolverIterations === value) {
                return;
            }

            this._overrideNumSolverIterations = value;

            if (this._btTypedConstraint) {
                this._btTypedConstraint.setOverrideNumSolverIterations(this._overrideNumSolverIterations);
            }
        }
        /**
         * 
         */
        public get breakingImpulseThreshold() {
            return this._breakingImpulseThreshold;
        }
        public set breakingImpulseThreshold(value: Ammo.ConstraintType) {
            if (this._breakingImpulseThreshold === value) {
                return;
            }

            this._breakingImpulseThreshold = value;

            if (this._btTypedConstraint) {
                this._btTypedConstraint.setBreakingImpulseThreshold(this._breakingImpulseThreshold);
            }
        }
        /**
         * 
         */
        public get anchor() {
            return this._anchor;
        }
        public set anchor(value: Vector3) {
            if (this._btTypedConstraint) {
                console.warn("Cannot change the anchor after the constraint has been created.");
            }
            else {
                this._anchor.copy(value);
            }
        }
        /**
         * 
         */
        public get axisX() {
            return this._axisX;
        }
        public set axisX(value: Vector3) {
            if (this._btTypedConstraint) {
                console.warn("Cannot change the axis x after the constraint has been created.");
            }
            else {
                this._axisX.copy(value);
            }
        }
        /**
         * 
         */
        public get axisY() {
            return this._axisY;
        }
        public set axisY(value: Vector3) {
            if (this._btTypedConstraint) {
                console.warn("Cannot change the axis y after the constraint has been created.");
            }
            else {
                this._axisY.copy(value);
            }
        }
        /**
         * 
         */
        public get connectedBody() {
            return this._connectedBody;
        }
        public set connectedBody(value: Rigidbody | null) {
            if (this._connectedBody === value) {
                return;
            }

            if (this._btTypedConstraint) {
                console.warn("Cannot change the axis y after the constraint has been created.");
            }
            else {
                this._connectedBody = value;
            }
        }

        public get btTypedConstraint() {
            if (!this._btTypedConstraint) {
                this._btTypedConstraint = this._createConstraint();
            }

            return this._btTypedConstraint;
        }
    }
}