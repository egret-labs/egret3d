namespace egret3d.ammo {
    /**
     * 
     */
    export class SliderConstraint extends TypedConstraint {
        @paper.serializedField
        protected _lowerLinearLimit: number = -10.0;
        @paper.serializedField
        protected _upperLinearLimit: number = -10.0;
        @paper.serializedField
        protected _lowerAngularLimit: number = -Math.PI;
        @paper.serializedField
        protected _upperAngularLimit: number = Math.PI;

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
                    const btConstraint = new Ammo.btSliderConstraint(
                        collisionObject.btCollisionObject as Ammo.btRigidBody, this._otherRigidBody.btCollisionObject as Ammo.btRigidBody,
                        helpTransformA, helpTransformB,
                        true
                    );
                    btConstraint.setLowerLinLimit(this._lowerLinearLimit);
                    btConstraint.setUpperLinLimit(this._upperLinearLimit);
                    btConstraint.setLowerAngLimit(this._lowerAngularLimit);
                    btConstraint.setUpperAngLimit(this._upperAngularLimit);
                    btConstraint.setBreakingImpulseThreshold(this._breakingImpulseThreshold);
                    btConstraint.setOverrideNumSolverIterations(this._overrideNumSolverIterations);

                    return btConstraint;
                }
            }
            else if (this._createFrame(this._constraintAxisX, this._constraintAxisY, this._constraintPoint, helpMatrixA)) {
                console.debug("btSliderConstraint TODO.");
                // TODO
                // const btConstraint = new Ammo.btSliderConstraint();
                // btConstraint.setLowerLinLimit(this._lowerLinearLimit);
                // btConstraint.setUpperLinLimit(this._upperLinearLimit);
                // btConstraint.setLowerAngLimit(this._lowerAngularLimit);
                // btConstraint.setUpperAngLimit(this._upperAngularLimit);
                // btConstraint.setBreakingImpulseThreshold(this._breakingImpulseThreshold);
                // btConstraint.setOverrideNumSolverIterations(this._overrideNumSolverIterations);

                return null;
            }

            return null;
        }
        /**
         * 
         */
        public get lowerLinearLimit() {
            return this._lowerLinearLimit;
        }
        public set lowerLinearLimit(value: number) {
            if (this._lowerLinearLimit === value) {
                return;
            }

            this._lowerLinearLimit = value;

            if (this._btTypedConstraint) {
                (this._btTypedConstraint as Ammo.btSliderConstraint).setLowerLinLimit(this._lowerLinearLimit);
            }
        }
        /**
         * 
         */
        public get upperLinearLimit() {
            return this._upperLinearLimit;
        }
        public set upperLinearLimit(value: number) {
            if (this._upperLinearLimit === value) {
                return;
            }

            this._upperLinearLimit = value;

            if (this._btTypedConstraint) {
                (this._btTypedConstraint as Ammo.btSliderConstraint).setUpperLinLimit(this._upperLinearLimit);
            }
        }
        /**
         * 
         */
        public get lowerAngularLimit() {
            return this._lowerAngularLimit;
        }
        public set lowerAngularLimit(value: number) {
            if (this._lowerAngularLimit === value) {
                return;
            }

            this._lowerAngularLimit = value;

            if (this._btTypedConstraint) {
                (this._btTypedConstraint as Ammo.btSliderConstraint).setLowerAngLimit(this._lowerAngularLimit);
            }
        }
        /**
         * 
         */
        public get upperAngularLimit() {
            return this._upperAngularLimit;
        }
        public set upperAngularLimit(value: number) {
            if (this._upperAngularLimit === value) {
                return;
            }

            this._upperAngularLimit = value;

            if (this._btTypedConstraint) {
                (this._btTypedConstraint as Ammo.btSliderConstraint).setUpperAngLimit(this._upperAngularLimit);
            }
        }
    }
}