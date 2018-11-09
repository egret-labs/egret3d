namespace examples.postprocessing {

    export class UnrealBloom {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/sniper");
            // Load shader.
            await RES.getResAsync("shaders/luminosityhigh.shader.json");
            await RES.getResAsync("shaders/unrealboom/composite.shader.json");
            await RES.getResAsync("shaders/unrealboom/seperableblur.shader.json");

            // Load shader.
            await RES.getResAsync("shaders/xray.shader.json");

            {
                // Load prefab resource.
                await RES.getResAsync("Assets/Scenes/SampleScene.scene.json");

                egret3d.Camera.main.backgroundColor.set(0, 0, 0);

                // Create prefab.
                const cube = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
                cube.addComponent(shaders.XRayTester);

                const sphere = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.SPHERE);
                sphere.addComponent(shaders.XRayTester);

                const gameObject = paper.Scene.create("Assets/Scenes/SampleScene.scene.json")!;
                // gameObject.transform.setLocalPosition(-30.0, -75.0, 40);
                // gameObject.transform.setLocalScale(0.5, 0.5, 0.5);
                // const renders = gameObject.gameObjects.getComponentsInChildren(egret3d.MeshRenderer);
                const builds = paper.GameObject.find("building");
                const renders = builds.getComponentsInChildren(egret3d.MeshRenderer);

                for (const render of renders) {
                    render.gameObject.addComponent(shaders.XRayTester);
                }

                // gameObject.addComponent(behaviors.RotateComponent);
                // const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
                // gameObject.getComponentInChildren(egret3d.Animation)!.play("run01");
                // gameObject.getComponentInChildren(egret3d.SkinnedMeshRenderer)!.gameObject.addComponent(shaders.XRayTester);
            }

            // Create camera.
            egret3d.Camera.main.gameObject.addComponent(UnrealBloomTester);
        }
    }

    class UnrealBloomTester extends paper.Behaviour {
        @paper.editor.property(paper.editor.EditType.NESTED)
        public readonly unrealBloomPass: UnrealBloomPass = new UnrealBloomPass();

        public onEnable() {
            const camera = this.gameObject.getComponent(egret3d.Camera);

            if (camera && camera.postQueues.indexOf(this.unrealBloomPass) < 0) {
                camera.postQueues.push(this.unrealBloomPass);
            }

        }

        public onDisable() {
            const camera = this.gameObject.getComponent(egret3d.Camera);

            if (camera) {
                const index = camera.postQueues.indexOf(this.unrealBloomPass);
                if (index >= 0) {
                    camera.postQueues.splice(index);
                }
            }
        }
    }

    class UnrealBloomPass extends egret3d.CameraPostProcessing {
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.1, maximum: 2.0 })
        public exposure: number = 1.0;
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 1.0 })
        public threshold: number = 0.0;
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 3.0 })
        public strength: number = 0.5;
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 1.0 })
        public radius: number = 0.0;
        @paper.editor.property(paper.editor.EditType.VECTOR2)
        public readonly blurDirectionX: egret3d.Vector2 = egret3d.Vector2.create(0.2, 0.0);
        @paper.editor.property(paper.editor.EditType.VECTOR2)
        public readonly blurDirectionY: egret3d.Vector2 = egret3d.Vector2.create(0.0, 0.2);

        private _mips: number = 5.0;
        private readonly _renderState: egret3d.WebGLRenderState = paper.GameObject.globalGameObject.getComponent(egret3d.WebGLRenderState)!;
        private readonly _materialHighPassFilter: egret3d.Material = egret3d.Material.create(RES.getRes("shaders/luminosityhigh.shader.json"))
            .setFloat("smoothWidth", 0.01)
            .setFloat("defaultOpacity", 0.0)
            .setColor("defaultColor", egret3d.Color.ZERO)
            .setDepth(true, true);
        private readonly _compositeMaterial: egret3d.Material = egret3d.Material.create(RES.getRes("shaders/unrealboom/composite.shader.json"))
            .addDefine("NUM_MIPS", this._mips);
        private readonly _renderTargetsHorizontal: egret3d.GlRenderTarget[] = [];
        private readonly _renderTargetsVertical: egret3d.GlRenderTarget[] = [];
        private readonly _separableBlurMaterials: egret3d.Material[] = [];
        private readonly _defaultMaterial:egret3d.Material = egret3d.DefaultMaterials.MESH_BASIC.clone();
        private readonly _copyMaterial: egret3d.Material = new egret3d.Material(egret3d.DefaultShaders.COPY)
            .setBlend(gltf.BlendMode.Additive, paper.RenderQueue.Transparent);
        private _renderTargetBright: egret3d.GlRenderTarget = null!;

        public constructor() {
            super();

            // Render targets.
            let resx = Math.round(egret3d.stage.viewport.w / 1);
            let resy = Math.round(egret3d.stage.viewport.h / 1);

            this._renderTargetBright = new egret3d.GlRenderTarget(
                "UnrealBloomPass.bright",
                resx, resy, true, false, false, true
            )

            for (let i = 0; i < this._mips; i++) {
                const renderTargetH = new egret3d.GlRenderTarget("UnrealBloomPass.h" + i, resx, resy, true, false, false, true);
                const renderTargetV = new egret3d.GlRenderTarget("UnrealBloomPass.v" + i, resx, resy, true, false, false, true);

                resx = Math.round(resx / 2);
                resy = Math.round(resy / 2);

                this._renderTargetsHorizontal.push(renderTargetH);
                this._renderTargetsVertical.push(renderTargetV);
            }

            // Gaussian Blur Materials.
            const kernelSizes = [3, 5, 7, 9, 11];
            resx = Math.round(egret3d.stage.viewport.w / 1);
            resy = Math.round(egret3d.stage.viewport.h / 1);

            for (let i = 0; i < this._mips; i++) {
                const kernelSize = kernelSizes[i];
                const material = egret3d.Material.create(RES.getRes("shaders/unrealboom/seperableblur.shader.json"))
                    .addDefine("KERNEL_RADIUS", kernelSize)
                    .addDefine("SIGMA", kernelSize)
                    .setVector2("texSize", egret3d.Vector2.create(resx, resy).release())
                    .setDepth(true, true);

                resx = Math.round(resx / 2);
                resy = Math.round(resy / 2);

                this._separableBlurMaterials.push(material);
            }

            // Composite material.
            this._compositeMaterial
                .setTexture("blurTexture1", this._renderTargetsVertical[0])
                .setTexture("blurTexture2", this._renderTargetsVertical[1])
                .setTexture("blurTexture3", this._renderTargetsVertical[2])
                .setTexture("blurTexture4", this._renderTargetsVertical[3])
                .setTexture("blurTexture5", this._renderTargetsVertical[4])
                .setFloat("bloomStrength", this.strength)
                .setFloat("bloomRadius", this.radius)
                .setFloatv("bloomFactors[0]", [1.0, 0.8, 0.6, 0.4, 0.2])
                .setVector3v("bloomTintColors[0]", [0.2, 0.4, 0.4, 0.2, 0.4, 0.4, 0.2, 0.4, 0.4, 0.2, 0.4, 0.4, 0.2, 0.4, 0.4])
                .setDepth(true, true);
        }

        public render(context: egret3d.PostProcessRenderContext) {
            const backClearColor = this._renderState.clearColor.clone().release();

            context.blit(context.fullScreenRT, this._defaultMaterial);
            // 1. Extract Bright Areas
            this._materialHighPassFilter
                .setTexture("tDiffuse", context.fullScreenRT)
                .setFloat("luminosityThreshold", this.threshold);
            context.blit(context.fullScreenRT, this._materialHighPassFilter, this._renderTargetBright);

            // 2. Blur All the mips progressively
            let inputRenderTarget = this._renderTargetBright;

            for (let i = 0; i < this._mips; i++) {
                const renderTargetHorizontal = this._renderTargetsHorizontal[i];
                const renderTargetVertical = this._renderTargetsVertical[i];
                const separableBlurMaterial = this._separableBlurMaterials[i];

                separableBlurMaterial
                    .setTexture("colorTexture", inputRenderTarget)
                    .setVector2("direction", this.blurDirectionX);
                context.blit(context.fullScreenRT, separableBlurMaterial, renderTargetHorizontal);

                separableBlurMaterial
                    .setTexture("colorTexture", renderTargetHorizontal)
                    .setVector2("direction", this.blurDirectionY);
                context.blit(context.fullScreenRT, separableBlurMaterial, renderTargetVertical);

                inputRenderTarget = renderTargetVertical;
            }

            // Composite All the mips
            this._compositeMaterial
                .setFloat("bloomStrength", this.strength)
                .setFloat("bloomRadius", this.radius);

            context.blit(context.fullScreenRT, this._compositeMaterial, this._renderTargetsHorizontal[0]);
            this._copyMaterial.setTexture(this._renderTargetsHorizontal[0]);
            // this._renderState.clearBuffer(gltf.BufferBit.COLOR_BUFFER_BIT, backClearColor);
            context.blit(this._renderTargetsHorizontal[0]);

            // Restore renderer settings
            // this._renderState.clearBuffer(gltf.BufferBit.COLOR_BUFFER_BIT, backClearColor);
        }
    }
}