namespace RaycastTest {
    export async function start() {
        // Load resource config.
        await RES.loadConfig("resource/default.res.json", "resource/");

        // Create camera.
        egret3d.Camera.main;

        {
            const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CYLINDER, "Mesh");
            gameObject.transform.setLocalPosition(0.0, 0.0, 0.0);

            const line = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.LINE_Z, "Line");
            line.transform.setLocalPosition(0.0, 5.0, -5.0);
            line.addComponent(behaviors.RotateComponent).target = gameObject;
            line.addComponent(behaviors.RendererRaycast).target = gameObject;
        }

        {
            const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.PYRAMID, "BoxCollider");
            gameObject.transform.setLocalPosition(5.0, 0.0, 0.0);
            const boxCollider = gameObject.addComponent(egret3d.BoxCollider);
            boxCollider.aabb.size = egret3d.Vector3.create(2.0, 2.0, 2.0).release();
            boxCollider.aabb.center = egret3d.Vector3.create(0.0, 1.0, 0.0).release();

            const line = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.LINE_Z, "Line");
            line.transform.setLocalPosition(5.0, 5.0, -5.0);
            line.addComponent(behaviors.RotateComponent).target = gameObject;
            line.addComponent(behaviors.RaycastBoxCollider).target = gameObject;
        }

        {
            const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.PLANE, "Plane");
            gameObject.transform.setLocalPosition(20.0, 0.0, 0.0);

            const line = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.LINE_Z, "Line");
            line.transform.setLocalPosition(20.0, 5.0, -5.0);
            line.addComponent(behaviors.RotateComponent).target = gameObject;
            line.addComponent(behaviors.RaycastPlane).target = gameObject;
        }
    }
}