namespace examples.shaders {

    export class XRay {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            // Create camera.
            egret3d.Camera.main;

            // Load shader.
            const xRay = await RES.getResAsync("shaders/xray.shader.json") as egret3d.Shader;

            {
                // Load prefab resource.
                await RES.getResAsync("Assets/C_xiaohuangren_D_01_ANIM.prefab.json");
                // Create prefab.
                const gameObject = paper.Prefab.create("Assets/C_xiaohuangren_D_01_ANIM.prefab.json")!;
                gameObject.getComponentInChildren(egret3d.Animation)!.play("run01");

                const renderer = gameObject.getComponentInChildren(egret3d.SkinnedMeshRenderer)!;
                renderer.material = egret3d.Material.create(xRay).setBlend(gltf.BlendMode.Add, paper.RenderQueue.Transparent).setDepth(true, false);
                // gameObject.addComponent(XRayTester);
            }

            //
            egret3d.Camera.main.gameObject.addComponent(behaviors.RotateComponent);
        }
    }

    // class XRayTester extends paper.Behaviour {
    //     @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 4.0 })
    //     public p: number = 3.0;
    //     @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 2.0 })
    //     public c: number = 1.0;
    //     @paper.editor.property(paper.editor.EditType.COLOR)
    //     public readonly glowColor: egret3d.Color = egret3d.Color.create();

    //     private _camera: paper.GameObject | null = null;

    //     public onAwake() {
    //         this._camera = egret3d.Camera.main.gameObject;

    //         const xRay = RES.getRes("shaders/xray.shader.json");
    //         const meshFileter = this.gameObject.getComponent(egret3d.MeshFilter)!;
    //         if (meshFileter && meshFileter.mesh && meshFileter.mesh.glTFMesh) {
    //             // meshFileter.mesh!.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines;
    //             // this.gameObject.renderer!.material!.glTFTechnique.states!.functions!.lineWidth = [2];
    //             // this.gameObject.renderer!.material!.setOpacity(0.6);
    //         }

    //         if (this.gameObject.renderer && this.gameObject.renderer!.material) {
    //             this.gameObject.renderer!.material = egret3d.Material.create(xRay).setBlend(gltf.BlendMode.Add, paper.RenderQueue.Transparent).setDepth(true, false);
    //         }

    //     }

    //     public onUpdate() {
    //         if (this.gameObject.renderer && this.gameObject.renderer!.material) {
    //             this.gameObject.renderer!.material!
    //                 .setFloat("p", this.p)
    //                 .setFloat("c", this.c)
    //                 .setColor("glowColor", this.glowColor)
    //         }

    //     }
    // }
}