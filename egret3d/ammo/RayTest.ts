namespace egret3d.ammo {
    /**
     * 
     */
    export class RayTest extends paper.BaseComponent {
        @paper.serializedField
        public distance: number = 100.0;
        @paper.serializedField
        public collisionGroups: Ammo.CollisionFilterGroups = Ammo.CollisionFilterGroups.DebrisFilter;
        @paper.serializedField
        public collisionMask: Ammo.CollisionFilterGroups = Ammo.CollisionFilterGroups.AllFilter;
    }
    /**
     * 
     */
    export class RayTestSystem extends paper.BaseSystem<RayTest> {
        protected _onAddComponent(component: RayTest) {
            if (!super._onAddComponent(component)) {
                return false;
            }

            return true;
        }

        protected _onRemoveComponent(component: RayTest) {
            if (!super._onRemoveComponent(component)) {
                return false;
            }

            return true;
        }

        public update() {
            
        }
    }
}