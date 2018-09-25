namespace Test {
    export async function start() {
        // Create camera.
        egret3d.Camera.main;

        const quad1 = paper.GameObject.create("");
        quad1.addComponent(egret3d.MeshFilter).mesh = egret3d.DefaultMeshes.CUBE;
        quad1.addComponent(egret3d.MeshRenderer).material = egret3d.DefaultMaterials.MESH_BASIC.clone();
        quad1.getComponent(egret3d.MeshRenderer).material.setTexture("map", egret3d.DefaultTextures.LIGHT_ICON);
        const tempQuaternion = egret3d.Quaternion.create(-0.3841199053811769, 0.48007488462750014, 0.5575619026703519, -0.5577676291525578);
        console.log("前 x:" + tempQuaternion.x + " y:" + tempQuaternion.y + " z:" + tempQuaternion.z + " w:" + tempQuaternion.w);
        quad1.transform.setLocalRotation(tempQuaternion);
        const tt = quad1.transform.getRotation();
        console.log("前 x:" + tt.x + " y:" + tt.y + " z:" + tt.z + " w:" + tt.w);

        // const quad = paper.GameObject.create("");
        // quad.addComponent(egret3d.MeshFilter).mesh = egret3d.DefaultMeshes.QUAD;
        // quad.addComponent(egret3d.MeshRenderer).material = egret3d.DefaultMaterials.MESH_BASIC.clone();
        // quad.getComponent(egret3d.MeshRenderer).material.setTexture("map", egret3d.DefaultTextures.CAMERA_ICON);
        console.log("Test");
    }
}