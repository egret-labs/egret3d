namespace RaycastTest {
    export async function start() {
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

        // {
        //     await RES.getResAsync("Assets/pp1.prefab.json");
        //     const gameObject = paper.Prefab.create("Assets/pp1.prefab.json");
        //     gameObject.transform.setLocalPosition(2.0, 0.0, 0.0);

        //     const line = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.LINE_Z, "Line");
        //     line.transform.setLocalPosition(2.0, 5.0, -5.0);
        //     line.addComponent(behaviors.RotateComponent).target = gameObject.getComponentInChildren(egret3d.Animation)!.gameObject;
        //     line.addComponent(RendererRaycast).target = gameObject.getComponentInChildren(egret3d.SkinnedMeshRenderer)!.gameObject;
        // }

        {
            const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.PYRAMID, "AABB");
            gameObject.transform.setLocalPosition(5.0, 0.0, 0.0);

            const line = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.LINE_Z, "Line");
            line.transform.setLocalPosition(5.0, 5.0, -5.0);
            line.addComponent(behaviors.RotateComponent).target = gameObject;
            line.addComponent(behaviors.RaycastAABB).target = gameObject;
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