namespace examples.materials {

    export class Blending {
        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            //
            const textures = [
                await RES.getResAsync("threejs/textures/UV_Grid_Sm.jpg"),
                await RES.getResAsync("threejs/textures/sprite0.jpg"),
                await RES.getResAsync("threejs/textures/sprite0.png"),
                await RES.getResAsync("threejs/textures/lensflare/lensflare0.png"),
                await RES.getResAsync("threejs/textures/lensflare/lensflare0_alpha.png"),
            ] as egret3d.Texture[];

            paper.GameObject.globalGameObject.addComponent(Start, textures);
        }
    }

    class Start extends paper.Behaviour {

        public onAwake(textures: egret3d.Texture[]) {
            egret3d.Camera.main.gameObject.transform
                .setLocalPosition(0.0, 0.0, -10.0)
                .lookAt(egret3d.Vector3.ZERO);
            // 
            const blends = [egret3d.BlendMode.None, egret3d.BlendMode.Normal, egret3d.BlendMode.Additive, egret3d.BlendMode.Subtractive, egret3d.BlendMode.Multiply];
            const blendNames = ["None", "Normal", "Additive", "Subtractive", "Multiply"];

            for (let i = 0; i < textures.length; i++) {
                for (let j = 0; j < blends.length; j++) {
                    const texture = textures[i];
                    const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.QUAD, texture.name.split("/").pop() + " " + blendNames[j]);
                    const renderer = gameObject.getComponent(egret3d.MeshRenderer)!;
                    renderer.material = egret3d.Material.create()
                        .setTexture(texture)
                        .setBlend(blends[j], egret3d.RenderQueue.Blend);
                    gameObject.transform.setLocalPosition((j - blends.length * 0.5 + 0.5) * 1.1, -(i - textures.length * 0.5 + 0.5) * 1.1, 0.0);
                }
            }

            { // Background.
                const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.PLANE, "Background");
                const renderer = gameObject.getComponent(egret3d.MeshRenderer)!;
                renderer.material = egret3d.Material.create().setTexture(egret3d.DefaultTextures.GRID);
                gameObject.transform.setLocalPosition(0.0, 0.0, 1.0).setLocalScale(2.0);
                gameObject.addComponent(UVUpdater);
            }
        }
    }

    class UVUpdater extends paper.Behaviour {
        private readonly _offset: egret3d.Vector2 = egret3d.Vector2.create();
        private readonly _repeat: egret3d.Vector2 = egret3d.Vector2.create(50.0, 50.0);
        private readonly _uvTransformMatrix: egret3d.Matrix3 = egret3d.Matrix3.create();

        public onUpdate() {
            const time = paper.clock.time;
            const material = this.gameObject.renderer!.material!;
            this._offset.x = (time) % 1;
            this._offset.y = (time) % 1;
            this._uvTransformMatrix.fromUVTransform(this._offset.x, this._offset.y, this._repeat.x, this._repeat.y, 0.0, 0.0, 0.0);
            material.setUVTransform(this._uvTransformMatrix);
        }
    }
}