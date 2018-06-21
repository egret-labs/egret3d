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
            const rigidbody = this.gameObject.getComponent(Rigidbody);
            if (!rigidbody) {
                console.debug("Never.");
                return null;
            }

            const helpVector3A = PhysicsSystem.helpVector3A;
            const helpQuaternionA = PhysicsSystem.helpQuaternionA;
            const helpTransformA = PhysicsSystem.helpTransformA;
            const helpTransformB = PhysicsSystem.helpTransformB;
            const helpMatrixA = TypedConstraint._helpMatrixA;
            const helpMatrixB = TypedConstraint._helpMatrixB;
            let btConstraint: Ammo.btConeTwistConstraint;

            if (this._constraintType === Ammo.ConstraintType.ConstrainToAnotherBody) {
                if (!this._connectedBody) {
                    console.error("The constraint need to config another rigid body.", this.gameObject.name, this.gameObject.hashCode);
                    return null;
                }

                this._createFrames(this._axisX, this._axisY, this._anchor, helpMatrixA, helpMatrixB);
                //
                const helpQA = Matrix.getQuaternion(helpMatrixA, TypedConstraint._helpQuaternionA);
                helpVector3A.setValue(helpMatrixA.rawData[8], helpMatrixA.rawData[9], helpMatrixA.rawData[10]);
                helpQuaternionA.setValue(helpQA.x, helpQA.y, helpQA.z, helpQA.w);
                helpTransformA.setIdentity();
                helpTransformA.setOrigin(helpVector3A);
                helpTransformA.setRotation(helpQuaternionA);
                //
                const helpQB = Matrix.getQuaternion(helpMatrixB, TypedConstraint._helpQuaternionA);
                helpVector3A.setValue(helpMatrixB.rawData[8], helpMatrixB.rawData[9], helpMatrixB.rawData[10]);
                helpQuaternionA.setValue(helpQB.x, helpQB.y, helpQB.z, helpQB.w);
                helpTransformB.setIdentity();
                helpTransformB.setOrigin(helpVector3A);
                helpTransformB.setRotation(helpQuaternionA);
                //
                btConstraint = new Ammo.btConeTwistConstraint(
                    rigidbody.btRigidbody, this._connectedBody.btRigidbody,
                    helpTransformA, helpTransformB
                );
            }
            else {
                this._createFrame(this._axisX, this._axisY, this._anchor, helpMatrixA);
                //
                const helpQA = Matrix.getQuaternion(helpMatrixA, TypedConstraint._helpQuaternionA);
                helpVector3A.setValue(helpMatrixA.rawData[8], helpMatrixA.rawData[9], helpMatrixA.rawData[10]);
                helpQuaternionA.setValue(helpQA.x, helpQA.y, helpQA.z, helpQA.w);
                helpTransformA.setIdentity();
                helpTransformA.setOrigin(helpVector3A);
                helpTransformA.setRotation(helpQuaternionA);
                //
                btConstraint = new Ammo.btConeTwistConstraint(rigidbody.btRigidbody, helpTransformA as any);
            }

            this._updateLimit();
            btConstraint.setBreakingImpulseThreshold(this._breakingImpulseThreshold);
            // btConstraint.setOverrideNumSolverIterations(this._overrideNumSolverIterations);

            return btConstraint;
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