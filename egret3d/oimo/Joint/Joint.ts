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

    const enum ValueType {
        CollisionEnabled,
        GlobalAnchor,
    }
    /**
     * 
     */
    export abstract class Joint<T extends OIMO.Joint> extends paper.BaseComponent {
        /**
         * 
         */
        public readonly jointType: JointType;

        @paper.serializedField
        protected readonly _anchor: Vector3 = Vector3.ZERO.clone();
        @paper.serializedField
        protected readonly _values: Float32Array = new Float32Array([
            0, 0,
        ]);
        @paper.serializedField
        protected _connectedBody: Rigidbody | null = null;
        protected _rigidbody: Rigidbody = null as any;
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
        public get collisionEnabled() {
            return this._values[ValueType.CollisionEnabled] > 0;
        }
        public set collisionEnabled(value: boolean) {
            if (this.collisionEnabled === value) {
                return;
            }

            this._values[ValueType.CollisionEnabled] = value ? 1 : 0;

            if (this._oimoJoint) {
                this._oimoJoint.setAllowCollision(value);
            }
        }
        /**
         * 
         */
        public get isGlobalAnchor() {
            return this._values[ValueType.GlobalAnchor] > 0;
        }
        public set isGlobalAnchor(value: boolean) {
            if (this._oimoJoint) {
                console.warn("Cannot change the isGlobalAnchor after the joint has been created.");
            }
            else {
                this._values[ValueType.GlobalAnchor] = value ? 1 : 0;
            }
        }
        /**
         * 
         */
        public get anchor() {
            return this._anchor;
        }
        public set anchor(value: Readonly<Vector3>) {
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