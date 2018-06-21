namespace egret3d.ammo {
    /**
     * 
     */
    export class BallSocketConstraint extends TypedConstraint {
        protected _createConstraint() {
            const rigidbody = this.gameObject.getComponent(Rigidbody);
            if (!rigidbody) {
                console.debug("Never.");
                return null;
            }

            const helpVector3A = PhysicsSystem.helpVector3A;
            const helpVector3B = PhysicsSystem.helpVector3B;
            let btConstraint: Ammo.btPoint2PointConstraint;
            helpVector3A.setValue(this._anchor.x, this._anchor.y, this._anchor.z);

            if (this._constraintType === Ammo.ConstraintType.ConstrainToAnotherBody) {
                if (!this._connectedBody) {
                    console.error("The constraint need to config another rigid body.", this.gameObject.name, this.gameObject.hashCode);
                    return null;
                }

                const pivotInOther = helpMatrixA.copy(this._connectedBody.gameObject.transform.getWorldMatrix()).inverse().transformVector3(
                    rigidbody.gameObject.transform.getWorldMatrix().transformVector3(TypedConstraint._helpVector3A.copy(this._anchor))
                );
                helpVector3B.setValue(pivotInOther.x, pivotInOther.y, pivotInOther.z);
                btConstraint = new Ammo.btPoint2PointConstraint(
                    rigidbody.btRigidbody, this._connectedBody.btRigidbody,
                    helpVector3A, helpVector3B
                );
            }
            else {
                btConstraint = new Ammo.btPoint2PointConstraint(rigidbody.btRigidbody, helpVector3A as any);
            }

            btConstraint.setBreakingImpulseThreshold(this._breakingImpulseThreshold);
            // btConstraint.setOverrideNumSolverIterations(this._overrideNumSolverIterations);

            return btConstraint;
        }
    }
}