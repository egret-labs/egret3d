namespace examples {
    export class DefaultMeshes {
        async start() {
            // Load resource config.
            await RES.loadConfig("resource/default.res.json", "resource/");
            // Create camera.
            egret3d.Camera.main;

            { // Create light.
                const gameObject = paper.GameObject.create("Light");
                gameObject.transform.setLocalPosition(1.0, 10.0, -1.0);
                gameObject.transform.lookAt(egret3d.Vector3.ZERO);

                const light = gameObject.addComponent(egret3d.DirectionalLight);
                light.intensity = 0.5;
            }

            const gameObject = paper.GameObject.create();
            const meshFilter = gameObject.addComponent(egret3d.MeshFilter);
            const meshRenderer = gameObject.addComponent(egret3d.MeshRenderer);
            meshFilter.mesh = egret3d.DefaultMeshes.CUBE;
            meshRenderer.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT);

            // GUI.
            const guiComponent = paper.GameObject.globalGameObject.getOrAddComponent(paper.editor.GUIComponent);
            const options = {
                mesh: "CUBE",
                texture: false,
            };
            const gui = guiComponent.hierarchy.addFolder("DefaultMeshes");
            gui.open();
            gui.add(options, "mesh", [
                "QUAD",
                "QUAD_PARTICLE",
                "PLANE",
                "CUBE",
                "PYRAMID",
                "CONE",
                "CYLINDER",
                "TORUS",
                "SPHERE",
            ]).onChange((v: string) => {
                meshFilter.mesh = (egret3d.DefaultMeshes as any)[v];
            });
            gui.add(options, "texture").onChange(async (v: boolean) => {
                if (v) {
                    meshRenderer.material!.setTexture(await RES.getResAsync("UV_Grid_Sm.jpg"));
                }
                else {
                    meshRenderer.material!.setTexture(null);
                }
            });
        }
    }
}