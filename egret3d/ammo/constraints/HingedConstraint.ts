namespace egret3d.ammo {
    /**
     * 
     */
    export class HingedConstraint extends TypedConstraint {
        @paper.serializedField
        protected _motorEnabled: boolean = false;
        @paper.serializedField
        protected _limitEnabled: boolean = false;
        @paper.serializedField
        protected _targetMotorAngularVelocity: number = 0.0;
        @paper.serializedField
        protected _maxMotorImpulse: number = 0.0;
        @paper.serializedField
        protected _lowAngularLimit: number = 0.0;
        @paper.serializedField
        protected _highAngularLimit: number = 0.0;
        @paper.serializedField
        protected _limitSoftness: number = 0.9;
        @paper.serializedField
        protected _limitBiasFactor: number = 0.3;

        protected _updateLimit() {
            (this._btTypedConstraint as Ammo.btHingeConstraint).setLimit(this._lowAngularLimit, this._highAngularLimit, this._limitSoftness, this._limitBiasFactor);
        }

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
                    const helpVertex3A = PhysicsSystem.helpVector3A;
                    const helpVertex3B = PhysicsSystem.helpVector3B;
                    const helpVertex3C = PhysicsSystem.helpVector3C;
                    const helpVertex3D = PhysicsSystem.helpVector3D;
                    helpVertex3A.setValue(helpMatrixA.rawData[8], helpMatrixA.rawData[9], helpMatrixA.rawData[10]);
                    helpVertex3B.setValue(helpMatrixB.rawData[8], helpMatrixB.rawData[9], helpMatrixB.rawData[10]);
                    helpVertex3C.setValue(helpMatrixA.rawData[0], helpMatrixA.rawData[4], helpMatrixA.rawData[8]);
                    helpVertex3D.setValue(helpMatrixB.rawData[0], helpMatrixB.rawData[4], helpMatrixB.rawData[8]);
                    //
                    const btConstraint = new Ammo.btHingeConstraint(
                        collisionObject.btCollisionObject as Ammo.btRigidBody, this._otherRigidBody.btCollisionObject as Ammo.btRigidBody,
                        helpVertex3A, helpVertex3B, helpVertex3C, helpVertex3D
                    );

                    if (this._motorEnabled) {
                        btConstraint.enableAngularMotor(this._motorEnabled, this._targetMotorAngularVelocity, this._maxMotorImpulse);
                    }

                    if (this._limitEnabled) {
                        this._updateLimit();
                    }

                    btConstraint.setBreakingImpulseThreshold(this._breakingImpulseThreshold);
                    btConstraint.setOverrideNumSolverIterations(this._overrideNumSolverIterations);

                    return btConstraint;
                }
            }
            else {
                // TODO
                console.debug("btHingeConstraint TODO.");
            }

            return null;
        }
        /**
         * 
         */
        public get motorEnabled() {
            return this._motorEnabled;
        }
        public set motorEnabled(value: boolean) {
            if (this._motorEnabled === value) {
                return;
            }

            this._motorEnabled = value;

            if (this._btTypedConstraint) {
                (this._btTypedConstraint as Ammo.btHingeConstraint).enableMotor(this._motorEnabled);
            }
        }
        /**
         * 
         */
        public get limitEnabled() {
            return this._limitEnabled;
        }
        public set limitEnabled(value: boolean) {
            if (this._limitEnabled === value) {
                return;
            }

            this._limitEnabled = value;
        }
        /**
         * 
         */
        public get targetMotorAngularVelocity() {
            return this._targetMotorAngularVelocity;
        }
        public set targetMotorAngularVelocity(value: number) {
            if (this._targetMotorAngularVelocity === value) {
                return;
            }

            this._targetMotorAngularVelocity = value;

            if (this._btTypedConstraint) {
                (this._btTypedConstraint as Ammo.btHingeConstraint).enableAngularMotor(this._motorEnabled, this._targetMotorAngularVelocity, this._maxMotorImpulse);
            }
        }
        /**
         * 
         */
        public get maxMotorImpulse() {
            return this._maxMotorImpulse;
        }
        public set maxMotorImpulse(value: number) {
            if (this._maxMotorImpulse === value) {
                return;
            }

            this._maxMotorImpulse = value;

            if (this._btTypedConstraint) {
                (this._btTypedConstraint as Ammo.btHingeConstraint).setMaxMotorImpulse(this._maxMotorImpulse);
            }
        }
        /**
         * 
         */
        public get lowAngularLimit() {
            return this._lowAngularLimit;
        }
        public set lowAngularLimit(value: number) {
            if (this._lowAngularLimit === value) {
                return;
            }

            this._lowAngularLimit = value;

            if (this._btTypedConstraint) {
                this._updateLimit();
            }
        }
        /**
         * 
         */
        public get highAngularLimit() {
            return this._highAngularLimit;
        }
        public set highAngularLimit(value: number) {
            if (this._highAngularLimit === value) {
                return;
            }

            this._highAngularLimit = value;

            if (this._btTypedConstraint) {
                this._updateLimit();
            }
        }
        /**
         * 
         */
        public get limitSoftness() {
            return this._limitSoftness;
        }
        public set limitSoftness(value: number) {
            if (this._limitSoftness === value) {
                return;
            }

            this._limitSoftness = value;

            if (this._btTypedConstraint) {
                this._updateLimit();
            }
        }
        /**
         * 
         */
        public get limitBiasFactor() {
            return this._limitBiasFactor;
        }
        public set limitBiasFactor(value: number) {
            if (this._limitBiasFactor === value) {
                return;
            }

            this._limitBiasFactor = value;

            if (this._btTypedConstraint) {
                this._updateLimit();
            }
        }
        /**
         * 
         */
        public get angle() {
            if (this._btTypedConstraint) {
                return (this._btTypedConstraint as Ammo.btHingeConstraint).getHingeAngle() as number;
            }
            return 0.0;
        }
    }
}