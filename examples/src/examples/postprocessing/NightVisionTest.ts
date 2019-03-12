namespace examples.postprocessing {

    export class NightVisionTest implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");

            // Load prefab resource.
            await RES.getResAsync("Assets/Models/Mixamo/vanguard.prefab.json");
            // Load animation resource.
            await RES.getResAsync("Assets/Animations/Mixamo/Looking_Around.ani.bin");
            await RES.getResAsync("Assets/Animations/Mixamo/Walking.ani.bin");
            await RES.getResAsync("Assets/Animations/Mixamo/Running.ani.bin");
            // Load textures.
            await RES.getResAsync("textures/HeatLookup.png");
            await RES.getResAsync("textures/HeatNoise.png");
            // Load shaders.
            await RES.getResAsync("shaders/nightVision/nightVision.shader.json");
            await RES.getResAsync("shaders/thermalVision/thermalVision.shader.json");
            await RES.getResAsync("shaders/thermalVision2/thermalVision2.shader.json");

            // Create camera.
            const camera = egret3d.Camera.main;
            paper.GameObject.create("DirectionalLight").addComponent(egret3d.DirectionalLight);
            this.createPrefab(egret3d.Vector3.ZERO, "Walking");
            this.createPrefab(egret3d.Vector3.create(-2, 0, -1), "Running");
            this.createPrefab(egret3d.Vector3.create(2, 0, 1), "Looking_Around");

            camera.gameObject.addComponent(Starter);
            //
            selectGameObjectAndComponents(egret3d.Camera.main.gameObject,
                Starter, components.NightVisionPostProcess, components.ThermalVisionPostProcess, components.ThermalVisionPostProcess2
            );
        }

        createPrefab(pos: egret3d.Vector3, animationName: string) {
            const gameObject = paper.Prefab.create("Assets/Models/Mixamo/vanguard.prefab.json")!;
            const animation = gameObject.getOrAddComponent(egret3d.Animation);
            animation.animations = [
                RES.getRes("Assets/Animations/Mixamo/Walking.ani.bin"),
                RES.getRes("Assets/Animations/Mixamo/Running.ani.bin"),
                RES.getRes("Assets/Animations/Mixamo/Looking_Around.ani.bin"),
            ];
            animation.fadeIn(animationName, 0.3, 0, 0);

            gameObject.transform.setLocalPosition(pos);
            gameObject.transform.setLocalEulerAngles(0, 180, 0);
        }
    }

    enum NightVisionType {
        NightVision = "NightVision",
        ThermalVision = "ThermalVision",
        ThermalVision2 = "ThermalVision2",
    }

    class Starter extends paper.Behaviour {
        private _type: NightVisionType = NightVisionType.NightVision;
        public onAwake() {
            this._changeNightVision();
        }

        private _changeNightVision() {
            const nightVision = this.gameObject.getOrAddComponent(components.NightVisionPostProcess);
            const thermalVision = this.gameObject.getOrAddComponent(components.ThermalVisionPostProcess);
            const thermalVision2 = this.gameObject.getOrAddComponent(components.ThermalVisionPostProcess2);
            switch (this._type) {
                case NightVisionType.NightVision:
                    {
                        thermalVision.enabled = false;
                        thermalVision2.enabled = false;
                        nightVision.enabled = true;
                    }
                    break;
                case NightVisionType.ThermalVision:
                    {
                        nightVision.enabled = false;
                        thermalVision2.enabled = false;
                        thermalVision.enabled = true;
                    }
                    break;
                case NightVisionType.ThermalVision2:
                    {
                        nightVision.enabled = false;
                        thermalVision.enabled = false;
                        thermalVision2.enabled = true;
                    }
                    break;
            }
        }

        @paper.editor.property(paper.editor.EditType.LIST, { listItems: NightVisionType as any })
        public get type() {
            return this._type;
        }
        public set type(value: NightVisionType) {
            if (this._type === value) {
                return;
            }

            this._type = value;
            this._changeNightVision();
        }
    }
}