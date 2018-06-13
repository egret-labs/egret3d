namespace egret3d.ammo {
    /**
     * 
     */
    export class ConeTwistConstraint extends TypedConstraint {
        @paper.serializedField
        protected _swingSpan1: number = Math.PI;
        @paper.serializedField
        protected _swingSpan2: number = Math.PI;
        @paper.serializedField
        protected _twistSpan: number = Math.PI;
        @paper.serializedField
        protected _softness: number = 0.5;
        @paper.serializedField
        protected _biasFactor: number = 0.3;
        @paper.serializedField
        protected _relaxationFactor: number = 1.0;

        protected _updateLimit() {
            (this._btTypedConstraint as Ammo.btConeTwistConstraint).setLimit(this._swingSpan1, this._swingSpan2, this._twistSpan, this._softness, this._biasFactor, this._relaxationFactor);
        }

        protected _createConstraint() {
            const collisionObject = this.gameObject.getComponent(CollisionObject);
            if (!collisionObject || !collisionObject.btCollisionObject) {
                console.debug("Arguments error.");
                return null;
            }

            if (!this._otherRigidBody || !this._otherRigidBody.btCollisionObject) {
                console.debug("Arguments error.");
                return null;
            }

            const helpMatrixA = TypedConstraint._helpMatrixA;
            const helpMatrixB = TypedConstraint._helpMatrixB;

            if (this._constraintType === Ammo.ConstraintType.ConstrainToAnotherBody) {
                if (this._createFrames(this._constraintAxisX, this._constraintAxisY, this._constraintPoint, helpMatrixA, helpMatrixB)) {
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
                    const btConstraint = new Ammo.btConeTwistConstraint(
                        collisionObject.btCollisionObject as Ammo.btRigidBody, this._otherRigidBody.btCollisionObject as Ammo.btRigidBody,
                        helpTransformA, helpTransformB
                    );
                    this._updateLimit();

                    btConstraint.setBreakingImpulseThreshold(this._breakingImpulseThreshold);
                    btConstraint.setOverrideNumSolverIterations(this._overrideNumSolverIterations);

                    return btConstraint;
                }
            }
            else {
                // TODO
                console.debug("btConeTwistConstraint TODO.");
            }

            return null;
        }
        /**
         * 
         */
        public get swingSpan1() {
            return this._swingSpan1;
        }
        public set swingSpan1(value: number) {
            if (this._swingSpan1 === value) {
                return;
            }

            this._swingSpan1 = value;

            if (this._btTypedConstraint) {
                this._updateLimit();
            }
        }
        /**
         * 
         */
        public get swingSpan2() {
            return this._swingSpan2;
        }
        public set swingSpan2(value: number) {
            if (this._swingSpan2 === value) {
                return;
            }

            this._swingSpan2 = value;

            if (this._btTypedConstraint) {
                this._updateLimit();
            }
        }
        /**
         * 
         */
        public get twistSpan() {
            return this._twistSpan;
        }
        public set twistSpan(value: number) {
            if (this._twistSpan === value) {
                return;
            }

            this._twistSpan = value;

            if (this._btTypedConstraint) {
                this._updateLimit();
            }
        }
        /**
         * 
         */
        public get softness() {
            return this._softness;
        }
        public set softness(value: number) {
            if (this.softness === value) {
                return;
            }

            this._softness = value;

            if (this._btTypedConstraint) {
                this._updateLimit();
            }
        }
        /**
         * 
         */
        public get biasFactor() {
            return this._biasFactor;
        }
        public set biasFactor(value: number) {
            if (this._biasFactor === value) {
                return;
            }

            this._biasFactor = value;

            if (this._btTypedConstraint) {
                this._updateLimit();
            }
        }
        /**
         * 
         */
        public get relaxationFactor() {
            return this._relaxationFactor;
        }
        public set relaxationFactor(value: number) {
            if (this._relaxationFactor === value) {
                return;
            }

            this._relaxationFactor = value;

            if (this._btTypedConstraint) {
                this._updateLimit();
            }
        }
    }
}