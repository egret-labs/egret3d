namespace examples.postprocessing {
    /**
     * 开发者需要在自己的主摄像机上加上FXAAPostProcess内置组件就可以实现抗锯齿,
     * example:
     * const mainCamera = this._mainCamera;
     * mainCamera.gameObject.addComponent(egret3d.postprocess.FXAAPostProcess);
     */
    export class AntiAliasingTest implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            //
            egret3d.Camera.main.gameObject.addComponent(Starter);

            //
            selectGameObjectAndComponents(egret3d.Camera.main.gameObject,
                Starter
            );
        }
    }

    class NoAntiAliasing extends egret3d.CameraPostprocessing {
        public onRender(camera: egret3d.Camera) {
            this.renderPostprocessTarget(camera);
            this.blit(camera.postprocessingRenderTarget, null, camera.renderTarget);
        }
    }

    enum AntiAliasingType {
        NO = "NoAntiAliasing",
        FXAA = "FXAA",
        SSAA = "SSAA",
    }

    class Starter extends paper.Behaviour {
        private _antiAliasingType: AntiAliasingType = AntiAliasingType.NO;
        public onAwake() {
            //
            for (let i = 0; i < 100; i++) {
                const cube = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
                cube.name = "Cube_" + i;
                cube.addComponent(behaviors.Rotater);
                const renderer = cube.getComponent(egret3d.MeshRenderer)!;
                const ranColor = egret3d.Color.create(Math.random(), Math.random(), Math.random());
                renderer.material = renderer.material!.clone().setColor(ranColor);
                cube.transform.position = egret3d.Vector3.create(Math.random() * 20 - 10, Math.random() * 10 - 5, Math.random() * 10 - 5);
            }

            this._changeAntiAliasingType();
        }

        private _changeAntiAliasingType() {
            const normal = this.gameObject.getOrAddComponent(NoAntiAliasing);
            const fxaa = this.gameObject.getOrAddComponent(egret3d.postprocess.FXAAPostprocess);
            const ssaa = this.gameObject.getOrAddComponent(egret3d.postprocess.SSAAPostprocess);
            switch (this._antiAliasingType) {
                case AntiAliasingType.NO:
                    {
                        fxaa.enabled = false;
                        ssaa.enabled = false;
                        normal.enabled = true;
                    }
                    break;
                case AntiAliasingType.FXAA:
                    {
                        normal.enabled = false;
                        ssaa.enabled = false;
                        fxaa.enabled = true;
                    }
                    break;
                case AntiAliasingType.SSAA:
                    {
                        normal.enabled = false;
                        fxaa.enabled = false;
                        ssaa.enabled = true;
                    }
                    break;
            }
        }

        @paper.editor.property(paper.editor.EditType.LIST, { listItems: AntiAliasingType as any })
        public get antiAliasingType() {
            return this._antiAliasingType;
        }
        public set antiAliasingType(value: AntiAliasingType) {
            if (this._antiAliasingType === value) {
                return;
            }

            this._antiAliasingType = value;
            this._changeAntiAliasingType();
        }
    }
}