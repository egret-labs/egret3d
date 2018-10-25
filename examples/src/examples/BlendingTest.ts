namespace examples {

    export class BlendingTest {
        async start() {
            // Load resource config.
            await RES.loadConfig("resource/default.res.json", "resource/");

            const textures = [
                await RES.getResAsync("UV_Grid_Sm.jpg"),
                await RES.getResAsync("sprite0.jpg"),
                await RES.getResAsync("sprite0.png"),
                await RES.getResAsync("lensflare0.png"),
                await RES.getResAsync("lensflare0_alpha.png"),
            ] as egret3d.Texture[];

            // Create camera.
            egret3d.Camera.main;
            egret3d.Camera.main.gameObject.transform.setLocalPosition(0.0, 0.0, -10);
            egret3d.Camera.main.gameObject.transform.lookAt(egret3d.Vector3.ZERO);

            const blends = [gltf.BlendMode.None, gltf.BlendMode.Blend, gltf.BlendMode.Add, gltf.BlendMode.Subtractive, gltf.BlendMode.Multiply];
            const blendNames = ["None", "Blend", "Add", "Subtractive", "Multiply"];

            for (let i = 0; i < textures.length; i++) {
                for (let j = 0; j < blends.length; j++) {
                    const texture = textures[i];
                    const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.QUAD, texture.name + "_" + blendNames[j]);
                    const renderer = gameObject.getComponent(egret3d.MeshRenderer) as egret3d.MeshRenderer;
                    renderer.material = renderer.material!.clone();
                    renderer.material!.setTexture(texture);
                    renderer.material!.setBlend(blends[j], paper.RenderQueue.Transparent).setDepth(true, false);
                    gameObject.transform.setLocalPosition((j - blends.length * 0.5 + 0.5) * 1.1, -(i - textures.length * 0.5 + 0.5) * 1.1, 0.0);
                }
            }

            {
                const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.PLANE, "Background");
                const renderer = gameObject.getComponent(egret3d.MeshRenderer) as egret3d.MeshRenderer;
                renderer.material = renderer.material!.clone();
                renderer.material.setTexture(egret3d.DefaultTextures.GRID);
                gameObject.transform.setLocalPosition(0.0, 0.0, 1.0).setLocalScale(2.0);
                gameObject.addComponent(UVUpdater);
            }
        }
    }

    class UVUpdater extends paper.Behaviour {
        private readonly _offset: egret3d.Vector2 = egret3d.Vector2.create();
        private readonly _repeat: egret3d.Vector2 = egret3d.Vector2.create(50.0, 50.0);
        private readonly _uvTransformMatrix: egret3d.Matrix3 = egret3d.Matrix3.create();

        public onAwake() {
            const material = this.gameObject.renderer!.material!;
            this._uvTransformMatrix.fromUVTransform(this._offset.x, this._offset.y, this._repeat.x, this._repeat.y, 0.0, 0.0, 0.0);
            material.setUVTTransform(this._uvTransformMatrix);
        }

        public onUpdate() {
            const time = paper.clock.time;
            const material = this.gameObject.renderer!.material!;
            this._offset.x = (time) % 1;
            this._offset.y = (time) % 1;
            this._uvTransformMatrix.fromUVTransform(this._offset.x, this._offset.y, this._repeat.x, this._repeat.y, 0.0, 0.0, 0.0);
            material.setUVTTransform(this._uvTransformMatrix);
        }

    }
}