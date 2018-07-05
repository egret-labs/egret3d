namespace egret3d.oimo {
    export abstract class Joint extends paper.BaseComponent {
        protected _oimoJoint: OIMO.Joint = null;
        protected _config: OIMO.JointConfig;
        protected _rb1: Rigidbody;
        protected _rb2: Rigidbody;
        protected _worldAnchor: Vector3;

        constructor() {
            super();
            this._config = new OIMO.JointConfig();
            let rb = this.gameObject.getComponent(Rigidbody);
            if (!rb) {
                console.warn("need Rigidbody component");
            } else {
                this._rb1 = rb;
            }
        }

        get anchor1Local() {
            let r = new Vector3();
            return PhysicsSystem.toVector3(this._config.localAnchor1, r);
        }
        set anchor1Local(value: Vector3) {
            if (this.jointNotConstructed) {
                this._config.localAnchor1 = PhysicsSystem.toOIMOVec3_A(value);
            }
        }

        get anchor2Local() {
            let r = new Vector3();
            return PhysicsSystem.toVector3(this._config.localAnchor2, r);
        }
        set anchor2Local(value: Vector3) {
            if (this.jointNotConstructed) {
                this._config.localAnchor2 = PhysicsSystem.toOIMOVec3_A(value);
            }
        }

        public get worldAnchor() {
            if (!this._worldAnchor) {//auto calc anchor
                let pos1 = this.thisRigidbody.oimoRB.getTransform().getPosition();
                let pos2 = this.connectedRigidbody.oimoRB.getTransform().getPosition();
                this._worldAnchor = new Vector3();
                let worldAnchor = pos1.add(pos2).scale(0.5);
                this._worldAnchor = PhysicsSystem.toVector3(worldAnchor, this._worldAnchor);
            }
            return this._worldAnchor;
        }
        public set worldAnchor(value: Vector3) {
            if (this.jointNotConstructed) {
                this._worldAnchor = value;
            }
        }

        get appliedForce() {
            let r = new Vector3();
            return PhysicsSystem.toVector3(this._oimoJoint.getAppliedForce(), r);
        }
        get appliedTorque() {
            let r = new Vector3();
            return PhysicsSystem.toVector3(this._oimoJoint.getAppliedTorque(), r);
        }
        //TODO
        get thisRigidbody() {
            return this._rb1;
        }

        get connectedRigidbody() {
            this.notSettedWarning(this._rb2, "connected rigidbody 2");
            return this._rb2;
        }
        set connectedRigidbody(value: Rigidbody) {
            this._rb2 = value;
        }

        protected get oimoJoint() {
            if (!this._oimoJoint) { this._oimoJoint = this._createJoint(); }
            return this._oimoJoint;
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

        protected abstract _createJoint(): OIMO.Joint;

        public addToWorld(world: OIMO.World) {
            world.addJoint(this.oimoJoint);
        }

        public removeFromWorld(world: OIMO.World) {
            world.removeJoint(this._oimoJoint);
        }
    }

    export class JointType {
        public static readonly SPHERICAL = 0;
        public static readonly REVOLUTE = 1;
        public static readonly CYLINDRICAL = 2;
        public static readonly PRISMATIC = 3;
        public static readonly UNIVERSAL = 4;
        public static readonly RAGDOLL = 5;
    }
}