namespace examples.tests {

    export class RaycastTest {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");

            // Create camera.
            egret3d.Camera.main;

            { // Create light.
                const gameObject = paper.GameObject.create("Light");
                gameObject.transform.setLocalPosition(1.0, 10.0, -1.0);
                gameObject.transform.lookAt(egret3d.Vector3.ZERO);

                const light = gameObject.addComponent(egret3d.DirectionalLight);
                light.intensity = 0.5;
            }

            {
                const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.TRIANGLE, "TriangleMesh");
                gameObject.transform.setLocalPosition(0.0, 3.0, 0.0);
                gameObject.renderer!.material = egret3d.DefaultMaterials.MESH_LAMBERT;

                const line = paper.GameObject.create("MeshRendererRaycast");
                line.transform.setLocalPosition(0.0, 3.0, -2.0);
                line.addComponent(behaviors.RotateAround).target = gameObject;
                const rendererRaycast = line.addComponent(behaviors.RendererRaycast);
                rendererRaycast.raycastMesh = true;
                rendererRaycast.target = gameObject;

                //
                rendererRaycast.target.addComponent(MeshTriangleFollower).rendererRaycaster = rendererRaycast;
            }

            {
                const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CYLINDER, "CylinderMesh");
                gameObject.transform.setLocalPosition(0.0, 0.0, 0.0);
                gameObject.renderer!.material = egret3d.DefaultMaterials.MESH_LAMBERT;

                const line = paper.GameObject.create("MeshRendererRaycast");
                line.transform.setLocalPosition(0.0, 0.0, -2.0);
                line.addComponent(behaviors.RotateAround).target = gameObject;
                const rendererRaycast = line.addComponent(behaviors.RendererRaycast);
                rendererRaycast.raycastMesh = true;
                rendererRaycast.target = gameObject;
            }

            {
                // Load prefab resource.
                await RES.getResAsync("Assets/C_xiaohuangren_D_01_ANIM.prefab.json");
                // Create prefab.
                const gameObject = paper.Prefab.create("Assets/C_xiaohuangren_D_01_ANIM.prefab.json")!;
                gameObject.transform.setLocalPosition(-3.0, 0.0, 0.0);
                gameObject.getComponentInChildren(egret3d.Animation)!.play("run01");

                const line = paper.GameObject.create("SkinnedMeshRendererRaycast");
                line.transform.setLocalPosition(-3.0, 0.5, -2.0);
                const rendererRaycast = line.addComponent(behaviors.RendererRaycast);
                rendererRaycast.raycastMesh = true;
                rendererRaycast.target = gameObject.getComponentInChildren(egret3d.SkinnedMeshRenderer)!.gameObject;

                //
                rendererRaycast.target.addComponent(MeshTriangleFollower).rendererRaycaster = rendererRaycast;
            }

            {
                const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.PYRAMID, "Collider");
                gameObject.transform.setLocalPosition(3.0, 0.0, 0.0);
                gameObject.renderer!.material = egret3d.DefaultMaterials.MESH_LAMBERT;

                {
                    const boxCollider = gameObject.addComponent(egret3d.BoxCollider);
                    boxCollider.box.size = egret3d.Vector3.create(2.0, 2.0, 2.0).release();
                    boxCollider.box.center = egret3d.Vector3.create(0.0, 0.0, 2.0).release();
                }

                {
                    const boxCollider = gameObject.addComponent(egret3d.BoxCollider);
                    boxCollider.box.size = egret3d.Vector3.create(2.0, 2.0, 2.0).release();
                    boxCollider.box.center = egret3d.Vector3.create(0.0, 0.0, -2.0).release();
                }

                {
                    const sphereCollider = gameObject.addComponent(egret3d.SphereCollider);
                    sphereCollider.sphere.radius = 1.0;
                    sphereCollider.sphere.center.set(1.0, 0.0, 0.0);
                }

                {
                    const cylinderCollider = gameObject.addComponent(egret3d.CylinderCollider);
                    cylinderCollider.cylinder.topRadius = 1.0;
                    cylinderCollider.cylinder.bottomRadius = 1.0;
                    cylinderCollider.cylinder.height = 2.0;
                    cylinderCollider.cylinder.center.set(-1.0, 0.0, 0.0);
                }

                {
                    const capsuleCollider = gameObject.addComponent(egret3d.CapsuleCollider);
                    capsuleCollider.capsule.radius = 0.5;
                    capsuleCollider.capsule.height = 0.5;
                    capsuleCollider.capsule.center.set(0.0, 2.0, 0.0);
                }

                const line = paper.GameObject.create("ColliderRaycast");
                line.transform.setLocalPosition(3.0, 2.0, -2.0);
                line.addComponent(behaviors.RotateAround).target = gameObject;
                line.addComponent(behaviors.ColliderRaycast).target = gameObject;
            }
        }
    }

    class MeshTriangleFollower extends paper.Behaviour {
        public rendererRaycaster: behaviors.RendererRaycast | null = null;

        private readonly _normal: paper.GameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.LINE_Z, "SkinnedMeshTriangleFollower");

        public onLateUpdate() {
            if (!this.rendererRaycaster) {
                this._normal.activeSelf = false;
                return;
            }

            const triangleIndex = this.rendererRaycaster.raycastInfo.triangleIndex;
            if (triangleIndex < 0) {
                this._normal.activeSelf = false;
                return;
            }

            const raycastInfo = this.rendererRaycaster.raycastInfo;
            const meshRender = this.rendererRaycaster.target!.renderer! as (egret3d.MeshRenderer | egret3d.SkinnedMeshRenderer);
            const coord = raycastInfo.coord;
            const triangle = meshRender.getTriangle(triangleIndex).release();

            this._normal.transform.position = triangle.getPointAt(coord.x, coord.y).release();
            this._normal.transform.lookRotation(triangle.getNormal().release());
            this._normal.activeSelf = true;
        }
    }
}