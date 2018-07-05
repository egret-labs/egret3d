namespace egret3d.oimo {
    /**
     * 
     */
    export enum JointType {
        SPHERICAL = OIMO.JointType.SPHERICAL,
        REVOLUTE = OIMO.JointType.REVOLUTE,
        CYLINDRICAL = OIMO.JointType.CYLINDRICAL,
        PRISMATIC = OIMO.JointType.PRISMATIC,
        UNIVERSAL = OIMO.JointType.UNIVERSAL,
        RAGDOLL = OIMO.JointType.RAGDOLL,
    }
    /**
     * 
     */
    export abstract class Joint<T extends OIMO.Joint> extends paper.BaseComponent {
        protected static readonly _helpVector3A: Vector3 = new Vector3();
        protected static readonly _helpVector3B: Vector3 = new Vector3();
        protected static readonly _helpVector3C: Vector3 = new Vector3();
        protected static readonly _helpVector3D: Vector3 = new Vector3();
        protected static readonly _helpQuaternionA: Quaternion = new Quaternion();
        protected static readonly _helpQuaternionB: Quaternion = new Quaternion();
        protected static readonly _helpMatrixA: Matrix = new Matrix();
        protected static readonly _helpMatrixB: Matrix = new Matrix();
        protected static readonly _helpMatrixC: Matrix = new Matrix();
        // @paper.serializedField
        // protected _constraintType: Ammo.ConstraintType = Ammo.ConstraintType.ConstrainToAnotherBody;
        @paper.serializedField
        protected _collisionEnabled: boolean = false;
        @paper.serializedField
        protected _autoCalculateConnectedAnchor: boolean = true;
        @paper.serializedField
        protected _isGlobalAnchor: boolean = false;
        @paper.serializedField
        protected readonly _anchor: Vector3 = Vector3.ZERO.clone();
        @paper.serializedField
        protected readonly _axisX: Vector3 = Vector3.FORWARD.clone();
        @paper.serializedField
        protected readonly _axisY: Vector3 = Vector3.UP.clone();
        @paper.serializedField
        protected readonly _connectedAnchor: Vector3 = Vector3.ZERO.clone();
        @paper.serializedField
        protected readonly _connectedAxisX: Vector3 = Vector3.FORWARD.clone();
        @paper.serializedField
        protected readonly _connectedAxisY: Vector3 = Vector3.UP.clone();
        @paper.serializedField
        protected _connectedBody: Rigidbody | null = null;
        protected _rigidbody: Rigidbody = null as any;
        protected _oimoJoint: T = null as any;

        protected abstract _createJoint(): T;

        protected _createFrame(forward: Vector3, up: Vector3, constraintPoint: Vector3, frame: Matrix) {
            if (this._isGlobalAnchor) {

            }
            else {
                const vR = Vector3.cross(forward, up, Joint._helpVector3A);
                const vU = Vector3.cross(vR, forward, Joint._helpVector3B);

                vR.normalize();
                vU.normalize();

                frame.identity();
                frame.set3x3(
                    forward.x, vU.x, vR.x,
                    forward.y, vU.y, vR.y,
                    forward.z, vU.z, vR.z,
                );
                frame.setTranslation(constraintPoint);
            }
        }

        protected _createFrames(frameA: Matrix, frameB: Matrix) {
            if (!this._connectedBody) {
                console.debug("Never.");
                return;
            }

            this._createFrame(this._axisX, this._axisY, this._anchor, frameA);

            if (this._autoCalculateConnectedAnchor) {
                if (this._isGlobalAnchor) {

                }
                else {
                    const thisTransform = this.gameObject.transform;
                    const otherTransform = this._connectedBody.gameObject.transform;
                    const quaternion = Quaternion.multiply(
                        thisTransform.getLocalRotation(),
                        Quaternion.inverse(otherTransform.getLocalRotation(), Joint._helpQuaternionA),
                        Joint._helpQuaternionB
                    );

                    const matrixValues = frameA.rawData;
                    const xx = quaternion.transformVector3(Joint._helpVector3A.set(matrixValues[0], matrixValues[1], matrixValues[2]));
                    const yy = quaternion.transformVector3(Joint._helpVector3B.set(matrixValues[4], matrixValues[5], matrixValues[6]));
                    const zz = quaternion.transformVector3(Joint._helpVector3C.set(matrixValues[8], matrixValues[9], matrixValues[10]));
                    frameB.identity();
                    frameB.set3x3(
                        xx.x, yy.x, zz.x,
                        xx.y, yy.y, zz.y,
                        xx.z, yy.z, zz.z,
                    );
                    frameB.setTranslation(
                        Joint._helpMatrixC.copy(otherTransform.getWorldMatrix()).inverse().transformVector3(
                            thisTransform.getWorldMatrix().transformVector3(Joint._helpVector3D.copy(this._connectedAnchor))
                        )
                    );
                }
            }
            else {
                this._createFrame(this._connectedAxisX, this._connectedAxisY, this._connectedAnchor, frameB);
            }
        }

        protected jointNotConstructed() {
            if (this._oimoJoint) {
                console.warn("joint already constructed, can't change connect target!");
                return false;
            }
            return true;
        }

        protected notSettedWarning(value: any, name: string): boolean {
            if (value == null || value == undefined) {
                console.warn(name + " is not setted!");
                return false;
            }
            return true;
        }


        /**
         * 
         */
        // public get collisionEnabled() {
        //     return this._collisionEnabled;
        // }
        // public set collisionEnabled(value: boolean) {
        //     if (this._collisionEnabled === value) {
        //         return;
        //     }

        //     if (this._oimoJoint) {
        //         console.warn("Cannot change the collisionEnabled after the constraint has been created.");
        //     }
        //     else {
        //         this._collisionEnabled = value;
        //     }
        // }
        /**
         * 
         */
        // public get constraintType() {
        //     return this._constraintType;
        // }
        // public set constraintType(value: Ammo.ConstraintType) {
        //     if (this._constraintType === value) {
        //         return;
        //     }

        //     if (this._oimoJoint) {
        //         console.warn("Cannot change the constraint type after the constraint has been created.");
        //     }
        //     else {
        //         this._constraintType = value;
        //     }
        // }

        // public addToWorld(world: OIMO.World) {
        //     world.addJoint(this.oimoJoint);
        // }

        // public removeFromWorld(world: OIMO.World) {
        //     world.removeJoint(this._oimoJoint);
        // }

        // public get worldAnchor() {
        //     if (!this._worldAnchor) {//auto calc anchor
        //         let pos1 = this.thisRigidbody.oimoRB.getTransform().getPosition();
        //         let pos2 = this.connectedRigidbody.oimoRB.getTransform().getPosition();
        //         this._worldAnchor = new Vector3();
        //         let worldAnchor = pos1.add(pos2).scale(0.5);
        //         this._worldAnchor = PhysicsSystem.toVector3(worldAnchor, this._worldAnchor);
        //     }

        //     return this._worldAnchor;
        // }
        // public set worldAnchor(value: Vector3) {
        //     if (this.jointNotConstructed) {
        //         this._worldAnchor = value;
        //     }
        // }
        /**
         * 
         */
        public get isGlobalAnchor() {
            return this._isGlobalAnchor;
        }
        public set isGlobalAnchor(value: boolean) {
            if (this._oimoJoint) {
                console.warn("Cannot change the isGlobalAnchor after the joint has been created.");
            }
            else {
                this._isGlobalAnchor = value;
            }
        }
        /**
         * 
         */
        public get anchor1Local() {
            return this._anchor;
        }
        public set anchor1Local(value: Vector3) {
            if (this._oimoJoint) {
                console.warn("Cannot change the anchor after the joint has been created.");
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
            if (this._oimoJoint) {
                console.warn("Cannot change the axis x after the joint has been created.");
            }
            else {
                this._axisX.copy(value).normalize();
                this._autoCalculateConnectedAnchor = false;
            }
        }
        /**
         * 
         */
        public get axisY() {
            return this._axisY;
        }
        public set axisY(value: Vector3) {
            if (this._oimoJoint) {
                console.warn("Cannot change the axis y after the joint has been created.");
            }
            else {
                this._axisY.copy(value).normalize();
                this._autoCalculateConnectedAnchor = false;
            }
        }
        /**
         * 
         */
        public get autoCalculateConnectedAnchor() {
            return this._autoCalculateConnectedAnchor;
        }
        public set autoCalculateConnectedAnchor(value: boolean) {
            if (this._oimoJoint) {
                console.warn("Cannot change the autoCalculateConnectedAnchor after the joint has been created.");
            }
            else {
                this._autoCalculateConnectedAnchor = value;
            }
        }
        /**
         * 
         */
        public get anchor2Local() {
            return this._connectedAnchor;
        }
        public set anchor2Local(value: Vector3) {
            if (this._oimoJoint) {
                console.warn("Cannot change the connected anchor after the joint has been created.");
            }
            else {
                this._connectedAnchor.copy(value);
                this._autoCalculateConnectedAnchor = false;
            }
        }
        /**
         * 
         */
        public get connectedAxisX() {
            return this._connectedAxisX;
        }
        public set connectedAxisX(value: Vector3) {
            if (this._oimoJoint) {
                console.warn("Cannot change the connected axis x after the joint has been created.");
            }
            else {
                this._connectedAxisX.copy(value).normalize();
                this._autoCalculateConnectedAnchor = false;
            }
        }
        /**
         * 
         */
        public get connectedAxisY() {
            return this._connectedAxisY;
        }
        public set connectedAxisY(value: Vector3) {
            if (this._oimoJoint) {
                console.warn("Cannot change the connected axis y after the joint has been created.");
            }
            else {
                this._connectedAxisY.copy(value).normalize();
                this._autoCalculateConnectedAnchor = false;
            }
        }
        /**
         * 
         */
        public get connectedRigidbody() {
            return this._connectedBody;
        }
        public set connectedRigidbody(value: Rigidbody | null) {
            if (this._connectedBody === value) {
                return;
            }

            if (this._oimoJoint) {
                console.warn("Cannot change the connected rigidbody after the joint has been created.");
            }
            else {
                this._connectedBody = value;
            }
        }
        /**
         * 
         */
        public get appliedForce() {
            const r = new Vector3();
            this._oimoJoint.getAppliedForceTo(PhysicsSystem.helpVec3A);

            return PhysicsSystem.toVector3(PhysicsSystem.helpVec3A, r);
        }
        /**
         * 
         */
        public get appliedTorque() {
            const r = new Vector3();
            this._oimoJoint.getAppliedTorqueTo(PhysicsSystem.helpVec3A);

            return PhysicsSystem.toVector3(PhysicsSystem.helpVec3A, r);
        }
        /**
         * 
         */
        public get rigidbody() {
            return this._rigidbody;
        }
        /**
         * 
         */
        public get oimoJoint() {
            if (!this._oimoJoint) {
                this._oimoJoint = this._createJoint();
            }

            return this._oimoJoint;
        }
    }
}