namespace examples {

    export function createGridRoom() {
        const mesh = egret3d.MeshBuilder.createCube(
            40.0, 40.0, 40.0,
            0.0, 20.0, 0.0,
            40, 40, 40,
            false, true
        );
        mesh.name = "gridroom.mesh.bin";

        const gameObject = egret3d.DefaultMeshes.createObject(mesh, "Background");
        gameObject.hideFlags = paper.HideFlags.NotTouchable;

        async function loadResource() {
            const textureA = await RES.getResAsync("textures/grid_a.png") as egret3d.Texture;
            const textureB = await RES.getResAsync("textures/grid_b.png") as egret3d.Texture;

            textureA.gltfTexture.extensions.paper.anisotropy = 8;
            textureB.gltfTexture.extensions.paper.anisotropy = 8;

            gameObject.renderer!.materials = [
                egret3d.DefaultMaterials.MESH_LAMBERT.clone()
                    .setTexture(textureA)
                    .setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Front)
                    .setUVTransform(egret3d.Matrix3.create().fromUVTransform(0.0, 0.0, 20, 20, 0.0, 0.0, 0.0).release())
                ,
                egret3d.DefaultMaterials.MESH_LAMBERT.clone()
                    .setTexture(textureB)
                    .setBlend(gltf.BlendMode.Blend, paper.RenderQueue.Transparent)
                    .setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Front)
                ,
            ];
        }

        loadResource();

        return gameObject;
    }
}