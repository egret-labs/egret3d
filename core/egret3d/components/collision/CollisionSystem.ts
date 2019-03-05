namespace egret3d {
    /**
     * @internal
     */
    export class CollisionSystem extends paper.BaseSystem<paper.GameObject>{
        private readonly _contactCollecter: ContactCollecter = paper.Application.sceneManager.globalEntity.getComponent(ContactCollecter)!;

        protected getMatchers() {
            return [
                paper.Matcher.create<paper.GameObject>(Transform)
                    .anyOf(BoxCollider, SphereCollider, CylinderCollider, CapsuleCollider, MeshCollider),
                paper.Matcher.create<paper.GameObject>(Transform)
                    .anyOf(MeshRenderer, SkinnedMeshRenderer, particle.ParticleRenderer),
            ];
        }

        public onTickCleanup() {
            this._contactCollecter._update();
        }
    }
}
