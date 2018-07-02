namespace egret3d.oimo {
    export class Rigidbody extends paper.BaseComponent {
        private _oimoRigidbody:OIMO.RigidBody;
        private _config:OIMO.RigidBodyConfig;

        constructor(){
            super();
            this._config=new OIMO.RigidBodyConfig();
        }

        
    }
}