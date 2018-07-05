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
        // @paper.serializedField
        // protected _constraintType: Ammo.ConstraintType = Ammo.ConstraintType.ConstrainToAnotherBody;
        @paper.serializedField
        protected _collisionEnabled: boolean = false;
        @paper.serializedField
        protected _autoCalculateConnectedAnchor: boolean = true;
        @paper.serializedField
        protected _isGlobalAnchor: boolean = false;
        @paper.serializedField
        protected readonly _anchor1Local: Vector3 = Vector3.ZERO.clone();
        @paper.serializedField
        protected readonly _axisX: Vector3 = Vector3.FORWARD.clone();
        @paper.serializedField
        protected readonly _axisY: Vector3 = Vector3.UP.clone();
        @paper.serializedField
        protected readonly _anchor2Local: Vector3 = Vector3.ZERO.clone();
        @paper.serializedField
        protected readonly _connectedAxisX: Vector3 = Vector3.FORWARD.clone();
        @paper.serializedField
        protected readonly _connectedAxisY: Vector3 = Vector3.UP.clone();
        @paper.serializedField
        protected _rb2: Rigidbody | null = null;
        protected _rb1: Rigidbody = null as any;
        protected _oimoJoint: T = null as any;

        protected abstract _createJoint(): T;

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
            return this._anchor1Local;
        }
        public set anchor1Local(value: Vector3) {
            if (this._oimoJoint) {
                console.warn("Cannot change the anchor after the joint has been created.");
            }
            else {
                this._anchor1Local.copy(value);
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
            return this._anchor2Local;
        }
        public set anchor2Local(value: Vector3) {
            if (this._oimoJoint) {
                console.warn("Cannot change the connected anchor after the joint has been created.");
            }
            else {
                this._anchor2Local.copy(value);
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
            return this._rb2;
        }
        public set connectedRigidbody(value: Rigidbody | null) {
            if (this._rb2 === value) {
                return;
            }

            if (this._oimoJoint) {
                console.warn("Cannot change the connected rigidbody after the joint has been created.");
            }
            else {
                this._rb2 = value;
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
            return this._rb1;
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