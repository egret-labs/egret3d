namespace Test {
    export async function start() {
        // Create camera.
        egret3d.Camera.main;

        const quad1 = paper.GameObject.create("");
        quad1.addComponent(egret3d.MeshFilter).mesh = egret3d.DefaultMeshes.QUAD;
        quad1.addComponent(egret3d.MeshRenderer).material = egret3d.DefaultMaterials.MESH_BASIC.clone();
        quad1.getComponent(egret3d.MeshRenderer).material.setTexture("map", egret3d.DefaultTextures.LIGHT_ICON);
        quad1.transform.setLocalPosition(1,0,0);

        const quad = paper.GameObject.create("");
        quad.addComponent(egret3d.MeshFilter).mesh = egret3d.DefaultMeshes.QUAD;
        quad.addComponent(egret3d.MeshRenderer).material = egret3d.DefaultMaterials.MESH_BASIC.clone();
        quad.getComponent(egret3d.MeshRenderer).material.setTexture("map", egret3d.DefaultTextures.CAMERA_ICON);
        console.log("Test");
    }
}