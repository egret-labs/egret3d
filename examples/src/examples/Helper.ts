namespace examples {

    export function createGridRoom(offsetY: number = 20.0) {
        { // Create light.
            paper.Scene.activeScene.fog.mode = egret3d.FogMode.Fog;
            paper.Scene.activeScene.fog.color.fromHex(0xFFFFFF);
            //
            const directionalLight = paper.GameObject.create("Directional Light").addComponent(egret3d.DirectionalLight);
            directionalLight.intensity = 0.4;
            directionalLight.transform.setLocalPosition(0.0, 20.0, -10.0).lookAt(egret3d.Vector3.ZERO);
            //
            const pointLight = paper.GameObject.create("Point Light").addComponent(egret3d.PointLight);
            pointLight.intensity = 0.6;
            pointLight.decay = 0.0;
            pointLight.distance = 0.0;
            pointLight.castShadows = true;
            pointLight.shadow.mapSize = 1024;
            pointLight.transform.setLocalPosition(0.0, 10.0, 5.0).lookAt(egret3d.Vector3.ZERO);
        }

        const mesh = egret3d.MeshBuilder.createCube(
            40.0, 40.0, 40.0,
            0.0, offsetY, 0.0,
            40, 40, 40,
        );
        mesh.name = "custom/gridroom.mesh.bin";

        const gameObject = egret3d.creater.createGameObject("Grid Room", { mesh });
        // gameObject.hideFlags = paper.HideFlags.NotTouchable;
        gameObject.activeSelf = false;

        async function loadResource() {
            const textureA = await RES.getResAsync("textures/grid_a.png") as egret3d.Texture;
            const textureB = await RES.getResAsync("textures/grid_b.png") as egret3d.Texture;
            textureA.gltfTexture.extensions.paper.anisotropy = 4;
            textureB.gltfTexture.extensions.paper.anisotropy = 4;

            const renderer = gameObject.renderer!;
            renderer.receiveShadows = true;
            renderer.materials = [
                egret3d.DefaultMaterials.MESH_LAMBERT.clone()
                    .setTexture(textureA)
                    .setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Front)
                    .setUVTransform(egret3d.Matrix3.create().fromUVTransform(0.0, 0.0, 20, 20, 0.0, 0.0, 0.0).release())
                ,
                egret3d.DefaultMaterials.MESH_LAMBERT.clone()
                    .setTexture(textureB)
                    .setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Front)
                    .setBlend(egret3d.BlendMode.Normal, egret3d.RenderQueue.Blend)
                ,
            ];
            gameObject.activeSelf = true;
        }

        loadResource();

        return gameObject;
    }

    export function selectGameObjectAndComponents(gameObject: paper.GameObject, ...args: paper.IComponentClass<paper.BaseComponent>[]) {
        const modelComponent = paper.GameObject.globalGameObject.getComponent(paper.editor.ModelComponent);

        if (modelComponent) {
            modelComponent.select(gameObject);
            modelComponent.openComponents.apply(modelComponent, args);
        }
    }
}