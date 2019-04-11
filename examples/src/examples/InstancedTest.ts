namespace examples {

    export class InstancedTest {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");

            egret3d.Camera.main.gameObject.addComponent(Start);
        }
    }

    class Start extends paper.Behaviour {

        public onAwake() {
            egret3d.renderState.enableGPUInstancing = true;

            const mainCamera = egret3d.Camera.main;

            { // Main camera.
                mainCamera.fov = 40.0 * egret3d.Const.DEG_RAD;
                mainCamera.far = 10000.0;
                mainCamera.near = 1.0;
                mainCamera.transform.setLocalPosition(0.0, 1000.0, -3200.0);
            }

            {
                const directionalLight = paper.GameObject.create("Directional Light").addComponent(egret3d.DirectionalLight);
                directionalLight.intensity = 0.4;
                directionalLight.transform.setLocalPosition(0.0, 20.0, -10.0).lookAt(egret3d.Vector3.ZERO);
            }

            {
                const randomMaterials: egret3d.Material[] =
                    [
                        egret3d.DefaultMaterials.MESH_PHYSICAL.clone().setColor(egret3d.Color.RED),
                        egret3d.DefaultMaterials.MESH_PHYSICAL.clone().setColor(egret3d.Color.BLUE),
                        egret3d.DefaultMaterials.MESH_PHYSICAL.clone().setColor(egret3d.Color.GREEN),
                    ];
                const randomMeshs: egret3d.Mesh[] =
                    [
                        egret3d.MeshBuilder.createSphere(5),
                    ];
                for (let i = 0; i < 10000; ++i) {
                    const mesh = randomMeshs[Math.floor(Math.random() * randomMeshs.length)];
                    const material = randomMaterials[Math.floor(Math.random() * randomMaterials.length)];
                    material.enableGPUInstancing = true;
                    const cone = egret3d.creater.createGameObject(`Cone ${i}`, { mesh, material });
                    cone.transform.setLocalPosition
                        (
                            Math.random() * 4000.0 - 2000.0,
                            Math.random() * 4000.0 - 2000.0,
                            Math.random() * 4000.0 - 2000.0,
                        )
                        .setLocalScale(Math.random() * 4.0 + 2.0);
                    const wander = cone.addComponent(behaviors.Wander);
                    wander.radius = Math.random() * 400.0 + 200;
                    wander.timeScale.set(Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5);
                    wander.center.copy(cone.transform.localPosition);
                }
            }
        }
    }

}