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

            // const helpVector3A = PhysicsSystem.helpVector3A;
            // const helpQuaternionA = PhysicsSystem.helpQuaternionA;
            // const helpTransformA = PhysicsSystem.helpTransformA;
            // const helpTransformB = PhysicsSystem.helpTransformB;
            // const helpMatrixA = TypedConstraint._helpMatrixA;
            // const helpMatrixB = TypedConstraint._helpMatrixB;
            // let btConstraint: Ammo.btConeTwistConstraint;

            // if (this._constraintType === Ammo.ConstraintType.ConstrainToAnotherBody) {
            //     if (!this._connectedBody) {
            //         console.error("The constraint need to config another rigid body.", this.gameObject.name, this.gameObject.hashCode);
            //         return null;
            //     }



            // frameB.setTranslation(
            //     helpMatrixA.copy(this._connectedBody.gameObject.transform.getWorldMatrix()).inverse().transformVector3(
            //         rigidbody.gameObject.transform.getWorldMatrix().transformVector3(this._anchor)
            //     )
            // );



            //     Vector3 pivotInOther = m_otherRigidBody.transform.InverseTransformPoint(targetRigidBodyA.transform.TransformPoint(m_localConstraintPoint));

            //     btConstraint = new Ammo.btPoint2PointConstraint(
            //         rigidbody.btRigidbody, this._connectedBody.btRigidbody,
            //         helpTransformA, helpTransformB
            //     );
            // }
            // else {
            //     this._createFrame(this._axisX, this._axisY, this._anchor, helpMatrixA);
            //     //
            //     const helpQA = Matrix.getQuaternion(helpMatrixA, TypedConstraint._helpQuaternionA);
            //     helpVector3A.setValue(helpMatrixA.rawData[8], helpMatrixA.rawData[9], helpMatrixA.rawData[10]);
            //     helpQuaternionA.setValue(helpQA.x, helpQA.y, helpQA.z, helpQA.w);
            //     helpTransformA.setIdentity();
            //     helpTransformA.setOrigin(helpVector3A);
            //     helpTransformA.setRotation(helpQuaternionA);
            // }

            // btConstraint.setBreakingImpulseThreshold(this._breakingImpulseThreshold);
            // // btConstraint.setOverrideNumSolverIterations(this._overrideNumSolverIterations);

            // return null;
        }
    }
}