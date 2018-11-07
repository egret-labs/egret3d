namespace examples.shaders {

    export class XRay {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            // Create camera.
            egret3d.Camera.main;
            // Load shader.
            await RES.getResAsync("shaders/xray.shader.json");

            {
                // Load prefab resource.
                await RES.getResAsync("Assets/C_xiaohuangren_D_01_ANIM.prefab.json");
                // Create prefab.
                const gameObject = paper.Prefab.create("Assets/C_xiaohuangren_D_01_ANIM.prefab.json")!;
                gameObject.getComponentInChildren(egret3d.Animation)!.play("run01");
                gameObject.getComponentInChildren(egret3d.SkinnedMeshRenderer)!.gameObject.addComponent(XRayTester);
            }

            // {
            //     const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "Cube");
            //     gameObject.addComponent(RayUpdater);
            // }

            //
            egret3d.Camera.main.gameObject.addComponent(behaviors.RotateComponent);
        }
    }

    export class XRayTester extends paper.Behaviour {
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 4.0 })
        public p: number = 3.0;
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 2.0 })
        public c: number = 1.0;
        @paper.editor.property(paper.editor.EditType.COLOR)
        public readonly glowColor: egret3d.Color = egret3d.Color.create();

        private _camera: paper.GameObject | null = null;

        public onAwake() {
            this._camera = egret3d.Camera.main.gameObject;

            const xRay = RES.getRes("shaders/xray.shader.json");
            this.gameObject.renderer!.material = egret3d.Material.create(xRay).setBlend(gltf.BlendMode.Add, paper.RenderQueue.Transparent).setDepth(true, false);
        }

        public onUpdate() {
            this.gameObject.renderer!.material!
                .setFloat("p", this.p)
                .setFloat("c", this.c)
                .setColor("glowColor", this.glowColor)
                .setVector3("viewVector", egret3d.Vector3.create().subtract(this._camera!.transform.position, this.gameObject.transform.position).release());
        }
    }
}