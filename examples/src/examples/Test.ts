namespace Test {
    export async function start() {
        // Create camera.
        egret3d.Camera.main;
        const gameObject = paper.GameObject.create(name);
            // gameObject.hideFlags = paper.HideFlags.HideAndDontSave;
            gameObject.addComponent(egret3d.MeshFilter).mesh = egret3d.DefaultMeshes.CIRCLE_LINE;
            gameObject.addComponent(egret3d.MeshRenderer).material = egret3d.DefaultMaterials.MESH_BASIC.clone();
        console.log("Test");
    }
}