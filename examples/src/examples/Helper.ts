namespace examples {

    export function createGridRoom() {
        { // Create light.
            const gameObject = paper.GameObject.create("Point Light");
            gameObject.transform.setLocalPosition(1.0, 10.0, -1.0);
            gameObject.transform.lookAt(egret3d.Vector3.ZERO);

            const light = gameObject.addComponent(egret3d.PointLight);
            light.intensity = 1.0;
        }

        const mesh = egret3d.MeshBuilder.createCube(
            40.0, 40.0, 40.0,
            0.0, 20.0, 0.0,
            40, 40, 40,
        );
        mesh.name = "gridroom.mesh.bin";

        const gameObject = egret3d.DefaultMeshes.createObject(mesh, "Background");
        gameObject.hideFlags = paper.HideFlags.NotTouchable;
        gameObject.activeSelf = false;

        async function loadResource() {
            const textureA = await RES.getResAsync("textures/grid_a.png") as egret3d.Texture;
            const textureB = await RES.getResAsync("textures/grid_b.png") as egret3d.Texture;

            textureA.gltfTexture.extensions.paper.anisotropy = 4;
            textureB.gltfTexture.extensions.paper.anisotropy = 4;

            gameObject.renderer!.materials = [
                egret3d.DefaultMaterials.MESH_LAMBERT.clone()
                    .setTexture(textureA)
                    .setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Front)
                    .setUVTransform(egret3d.Matrix3.create().fromUVTransform(0.0, 0.0, 20, 20, 0.0, 0.0, 0.0).release())
                ,
                egret3d.DefaultMaterials.MESH_LAMBERT.clone()
                    .setTexture(textureB)
                    .setBlend(egret3d.BlendMode.Normal, egret3d.RenderQueue.Blend)
                    .setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Front)
                ,
            ];
            gameObject.activeSelf = true;
        }

        loadResource();

        return gameObject;
    }
}