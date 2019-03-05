namespace egret3d {

    export class CollisionSystem extends paper.BaseSystem<paper.GameObject>{

        protected getMatchers() {
            return [
                paper.Matcher.create<paper.GameObject>(Transform)
                    .anyOf(BoxCollider, SphereCollider, CylinderCollider, CapsuleCollider, MeshCollider),
                paper.Matcher.create<paper.GameObject>(Transform)
                    .anyOf(MeshRenderer, SkinnedMeshRenderer, particle.ParticleRenderer),
            ];
        }
    }
}
