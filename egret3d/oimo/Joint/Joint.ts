namespace egret3d.oimo {
    export class Joint extends paper.BaseComponent {
        protected _oimoJoint:OIMO.Joint;

        get anchor1(){
            return PhysicsSystem.toVec3_A( this._oimoJoint.getAnchor1());
        }
        get anchor2(){
            return PhysicsSystem.toVec3_A( this._oimoJoint.getAnchor2());
        }
        get appliedForce(){
            return PhysicsSystem.toVec3_A( this._oimoJoint.getAppliedForce());
        }
        get appliedTorque(){
            return PhysicsSystem.toVec3_A( this._oimoJoint.getAppliedTorque());
        }
    }
}