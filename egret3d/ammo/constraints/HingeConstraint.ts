namespace egret3d.ammo {
    /**
     * 
     */
    export class HingeConstraint extends TypedConstraint {
        @paper.serializedField
        protected _motorEnabled: boolean = false;
        @paper.serializedField
        protected _limitEnabled: boolean = false;
        @paper.serializedField
        protected _targetVelocity: number = 0.0;
        @paper.serializedField
        protected _maxMotorImpulse: number = 0.0;
        @paper.serializedField
        protected _lowAngular: number = 0.0;
        @paper.serializedField
        protected _highAngular: number = 0.0;
        @paper.serializedField
        protected _softness: number = 0.9;
        @paper.serializedField
        protected _biasFactor: number = 0.3;
        @paper.serializedField
        protected _relaxationFactor: number = 0.0;

        protected _updateLimit() {
            (this._btTypedConstraint as Ammo.btHingeConstraint).setLimit(this._lowAngular, this._highAngular, this._softness, this._biasFactor, this._relaxationFactor);
        }

        protected _createConstraint() {
            const rigidbody = this.gameObject.getComponent(Rigidbody);
            if (!rigidbody) {
                console.debug("Never.");
                return null;
            }

            let btConstraint: Ammo.btHingeConstraint;

            if (this._constraintType === Ammo.ConstraintType.ConstrainToAnotherBody) {
                if (!this._connectedBody) {
                    console.error("The constraint need to config another rigid body.", this.gameObject.name, this.gameObject.hashCode);
                    return null;
                }

                const helpMatrixA = TypedConstraint._helpMatrixA;
                const helpMatrixB = TypedConstraint._helpMatrixB;

                this._createFrames(this._axisX, this._axisY, this._anchor, helpMatrixA, helpMatrixB);
                const helpVertex3A = PhysicsSystem.helpVector3A;
                const helpVertex3B = PhysicsSystem.helpVector3B;
                const helpVertex3C = PhysicsSystem.helpVector3C;
                const helpVertex3D = PhysicsSystem.helpVector3D;
                helpVertex3A.setValue(helpMatrixA.rawData[12], helpMatrixA.rawData[13], helpMatrixA.rawData[14]);
                helpVertex3B.setValue(helpMatrixB.rawData[12], helpMatrixB.rawData[13], helpMatrixB.rawData[14]);
                helpVertex3C.setValue(helpMatrixA.rawData[0], helpMatrixA.rawData[4], helpMatrixA.rawData[8]);
                helpVertex3D.setValue(helpMatrixB.rawData[0], helpMatrixB.rawData[4], helpMatrixB.rawData[8]);
                //
                btConstraint = new Ammo.btHingeConstraint(
                    rigidbody.btRigidbody, this._connectedBody.btRigidbody,
                    helpVertex3A, helpVertex3B, helpVertex3C, helpVertex3D,
                    false
                );
            }
            else {
                const helpVertex3A = PhysicsSystem.helpVector3A;
                const helpVertex3B = PhysicsSystem.helpVector3B;
                helpVertex3A.setValue(this._anchor.x, this._anchor.y, this._anchor.z);
                helpVertex3B.setValue(this._axisX.x, this._axisX.y, this._axisX.z);

                btConstraint = new Ammo.btHingeConstraint(
                    rigidbody.btRigidbody, helpVertex3A as any, helpVertex3B as any,
                    false as any
                );
            }

            if (this._motorEnabled) {
                btConstraint.enableAngularMotor(this._motorEnabled, this._targetVelocity, this._maxMotorImpulse);
            }

            if (this._limitEnabled) {
                this._updateLimit();
            }

            btConstraint.setBreakingImpulseThreshold(this._breakingImpulseThreshold);
            // btConstraint.setOverrideNumSolverIterations(this._overrideNumSolverIterations);

            return btConstraint;
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
        public get targetVelocity() {
            return this._targetVelocity;
        }
        public set targetVelocity(value: number) {
            if (this._targetVelocity === value) {
                return;
            }

            this._targetVelocity = value;

            if (this._btTypedConstraint && this._motorEnabled) {
                (this._btTypedConstraint as Ammo.btHingeConstraint).enableAngularMotor(this._motorEnabled, this._targetVelocity, this._maxMotorImpulse);
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

            if (this._btTypedConstraint && this._motorEnabled) {
                (this._btTypedConstraint as Ammo.btHingeConstraint).setMaxMotorImpulse(this._maxMotorImpulse);
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
        public get lowAngularLimit() {
            return this._lowAngular;
        }
        public set lowAngularLimit(value: number) {
            if (this._lowAngular === value) {
                return;
            }

            this._lowAngular = value;

            if (this._btTypedConstraint && this._limitEnabled) {
                this._updateLimit();
            }
        }
        /**
         * 
         */
        public get highAngularLimit() {
            return this._highAngular;
        }
        public set highAngularLimit(value: number) {
            if (this._highAngular === value) {
                return;
            }

            this._highAngular = value;

            if (this._btTypedConstraint && this._limitEnabled) {
                this._updateLimit();
            }
        }
        /**
         * 
         */
        public get softnessLimit() {
            return this._softness;
        }
        public set softnessLimit(value: number) {
            if (this._softness === value) {
                return;
            }

            this._softness = value;

            if (this._btTypedConstraint && this._limitEnabled) {
                this._updateLimit();
            }
        }
        /**
         * 
         */
        public get biasFactorLimit() {
            return this._biasFactor;
        }
        public set biasFactorLimit(value: number) {
            if (this._biasFactor === value) {
                return;
            }

            this._biasFactor = value;

            if (this._btTypedConstraint && this._limitEnabled) {
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

            if (this._btTypedConstraint && this._limitEnabled) {
                this._updateLimit();
            }
        }
        /**
         * 
         */
        public get hingeAngle() {
            if (this._btTypedConstraint) {
                return (this._btTypedConstraint as Ammo.btHingeConstraint).getHingeAngle() as number;
            }

            return 0.0;
        }
    }
}