namespace egret3d.oimo {
    export class PhysicsSystem extends paper.BaseSystem< Rigidbody | CollisionShape >{
        private static _helpVector3A: OIMO.Vec3 | null = null;
        private static _helpVector3B: OIMO.Vec3 | null = null;
        private static _helpVector3C: OIMO.Vec3 | null = null;

        protected readonly _interests = [
            {
                componentClass: [BoxCollisionShape,SphereCollisionShape]
            },
            {
                componentClass: [/*CollisionObject,*/ Rigidbody]
            }
        ];

        private _oimoWorld: OIMO.World;
        private _gravity = new Vector3(0, -9.80665, 0);


        public initialize() {
            super.initialize();

            this._oimoWorld.setGravity(PhysicsSystem.toOIMOVec3_A(this._gravity));
        }

        public update() { }

        protected _onAddComponent(component:  Rigidbody | CollisionShape) {
            if (!super._onAddComponent(component)) {
                return false;
            }
            //
            return true;
        }

        protected _onRemoveComponent(component:  Rigidbody | CollisionShape) {
            if (!super._onRemoveComponent(component)) {
                return false;
            }
/*
            const index = this._startGameObjects.indexOf(component.gameObject);
            if (index >= 0) {
                this._startGameObjects.splice(index, 1);
            }
            else {
                const collisionObject = this._getComponent(component.gameObject, 1) as Rigidbody;
                this._oimoWorld.removeRigidBody(collisionObject.oimoRigidbody);
            }*/

            return true;
        }
        //#region help vector
        /**
         * @internal
         */
        public static get helpVector3A(): OIMO.Vec3 {
            if (!this._helpVector3A) {
                this._helpVector3A = new OIMO.Vec3();
            }

            return this._helpVector3A;
        }

        /**
         * @internal
         */
        public static get helpVector3B(): OIMO.Vec3 {
            if (!this._helpVector3B) {
                this._helpVector3B = new OIMO.Vec3();
            }

            return this._helpVector3B;
        }

        /**
         * @internal
         */
        public static get helpVector3C(): OIMO.Vec3 {
            if (!this._helpVector3C) {
                this._helpVector3C = new OIMO.Vec3();
            }

            return this._helpVector3C;
        }

        /**
         * @internal
         */
        public static toOIMOVec3_A(value: Vector3) {
            let result=PhysicsSystem.helpVector3A;
            result.x = value.x;
            result.y = value.y;
            result.z = value.z;
            return result;
        }

        /**
         * @internal
         */
        public static toVec3_A(value: OIMO.Vec3) {
            let result=new Vector3();
            result.x = value.x;
            result.y = value.y;
            result.z = value.z;
            return result;
        }

        public set gravity(value: Vector3) {
            this._gravity = value;
        }
        public get gravity() {
            return this._gravity;
        }
        //#endregion
    }
}