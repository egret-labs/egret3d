namespace egret3d.ammo {
    /**
     * 
     */
    export class FixedConstraint extends TypedConstraint {

        protected _createConstraint() {
            const collisionObject = this.gameObject.getComponent(CollisionObject);
            if (!collisionObject) {
                console.debug("Never.");
                return null;
            }

            if (!this._otherRigidBody) {
                console.error("The constraint need to config another rigid body.", this.gameObject.name, this.gameObject.hashCode);
                return null;
            }
            //
            const helpMatrixA = TypedConstraint._helpMatrixA;
            const helpMatrixB = TypedConstraint._helpMatrixB;
            this._createFrames(this._constraintAxisX, this._constraintAxisY, this._constraintPoint, helpMatrixA, helpMatrixB)
            const helpMatrix3x3 = PhysicsSystem.helpMatrix3x3;
            const helpTransformA = PhysicsSystem.helpTransformA;
            const helpTransformB = PhysicsSystem.helpTransformB;
            //
            helpMatrix3x3.setValue(
                helpMatrixA.rawData[0], helpMatrixA.rawData[1], helpMatrixA.rawData[2],
                helpMatrixA.rawData[4], helpMatrixA.rawData[5], helpMatrixA.rawData[6],
                helpMatrixA.rawData[8], helpMatrixA.rawData[9], helpMatrixA.rawData[10],
            );
            helpTransformA.setIdentity();
            helpTransformA.setBasis(helpMatrix3x3);
            //
            helpMatrix3x3.setValue(
                helpMatrixB.rawData[0], helpMatrixB.rawData[1], helpMatrixB.rawData[2],
                helpMatrixB.rawData[4], helpMatrixB.rawData[5], helpMatrixB.rawData[6],
                helpMatrixB.rawData[8], helpMatrixB.rawData[9], helpMatrixB.rawData[10],
            );
            helpTransformB.setIdentity();
            helpTransformB.setBasis(helpMatrix3x3);
            //
            const btConstraint = new Ammo.btFixedConstraint(
                collisionObject.btCollisionObject as Ammo.btRigidBody, this._otherRigidBody.btCollisionObject as Ammo.btRigidBody,
                helpTransformA, helpTransformB
            );
            btConstraint.setBreakingImpulseThreshold(this._breakingImpulseThreshold);
            btConstraint.setOverrideNumSolverIterations(this._overrideNumSolverIterations);

            return btConstraint;
        }
    }
}