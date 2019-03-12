namespace examples.tests {

    export class DefaultMeshesTest implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            await RES.getResAsync("threejs/textures/UV_Grid_Sm.jpg");
            // Create camera.
            egret3d.Camera.main.gameObject.addComponent(Starter);
            //
            createGridRoom();
        }
    }

    class Starter extends paper.Behaviour {
        public onAwake() {
            const defaultMeshes = [
                egret3d.DefaultMeshes.QUAD,
                egret3d.DefaultMeshes.CUBE,
                egret3d.DefaultMeshes.PYRAMID,
                egret3d.DefaultMeshes.CONE,
                egret3d.DefaultMeshes.CYLINDER,
                egret3d.DefaultMeshes.TORUS,
                egret3d.DefaultMeshes.SPHERE,
            ];
            const material = egret3d.Material.create(egret3d.DefaultShaders.MESH_PHONG)
                .setTexture(RES.getRes("threejs/textures/UV_Grid_Sm.jpg"))
                .setCullFace(false);

            let index = 0;
            const total = Math.ceil(defaultMeshes.length / 4.0);

            for (const mesh of defaultMeshes) {
                const gameObject = egret3d.creater.createGameObject(mesh.name, { mesh, material, castShadows: true });
                gameObject.transform.setLocalPosition((index % total) * 2.0 - 1.0, 1.0, Math.floor(index / total) * 2.0 - 2.0);
                gameObject.addComponent(behaviors.Rotater);
                index++;
            }
        }
    }
}
