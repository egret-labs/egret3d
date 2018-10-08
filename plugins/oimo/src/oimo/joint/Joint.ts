namespace egret3d.oimo {
    /**
     * 关节类型。
     */
    export enum JointType {
        Spherical = OIMO.JointType.SPHERICAL,
        Prismatic = OIMO.JointType.PRISMATIC,
        Hinge = OIMO.JointType.REVOLUTE,
        Cylindrical = OIMO.JointType.CYLINDRICAL,
        ConeTwist = OIMO.JointType.RAGDOLL,
        Universal = OIMO.JointType.UNIVERSAL,
    }

    const enum ValueType {
        CollisionEnabled,
        UseGlobalAnchor,
    }
    /**
     * 关节基类。
     */
    export abstract class Joint<T extends OIMO.Joint> extends paper.BaseComponent {
        /**
         * 关节类型。
         */
        public readonly jointType: JointType = -1;

        @paper.serializedField
        protected readonly _anchor: Vector3 = Vector3.create();
        /**
         * 
         */
        @paper.serializedField
        protected readonly _values: Float32Array = new Float32Array([
            0, 0,
        ]);
        @paper.serializedField
        protected _connectedBody: Rigidbody | null = null;
        protected _rigidbody: Rigidbody = null!;
        protected _oimoJoint: T = null!;

        protected abstract _createJoint(): T;
        /**
         * 
         */
        public getAppliedForce(out?: IVector3) {
            out = out || Vector3.create();
            this._oimoJoint.getAppliedForceTo(out as any); // TODO

            return out;
        }
        /**
         * 
         */
        public getAppliedTorque(out?: IVector3) {
            out = out || Vector3.create();
            this._oimoJoint.getAppliedTorqueTo(out as any); // TODO

            return out;
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
        public get useGlobalAnchor() {
            return this._values[ValueType.UseGlobalAnchor] > 0;
        }
        public set useGlobalAnchor(value: boolean) {
            if (this._oimoJoint) {
                console.warn("Cannot change the isGlobalAnchor after the joint has been created.");
            }
            else {
                this._values[ValueType.UseGlobalAnchor] = value ? 1 : 0;
            }
        }
        /**
         * 
         */
        public get anchor() {
            return this._anchor;
        }
        public set anchor(value: Readonly<IVector3>) {
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