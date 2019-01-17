namespace examples.camera {

    export class Layers implements Example {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");

            egret3d.Camera.main.gameObject.addComponent(Start);
        }
    }

    class Start extends paper.Behaviour {
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public get red() {
            return this._red;
        }
        public set red(value: boolean) {
            this._red = value;

            if (value) {
                this._mainCamera.cullingMask |= paper.Layer.UserLayer10;
            }
            else {
                this._mainCamera.cullingMask &= ~paper.Layer.UserLayer10;
            }
        }

        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public get green() {
            return this._green;
        }
        public set green(value: boolean) {
            this._green = value;

            if (value) {
                this._mainCamera.cullingMask |= paper.Layer.UserLayer11;
            }
            else {
                this._mainCamera.cullingMask &= ~paper.Layer.UserLayer11;
            }
        }

        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public get blue() {
            return this._blue;
        }
        public set blue(value: boolean) {
            this._blue = value;

            if (value) {
                this._mainCamera.cullingMask |= paper.Layer.UserLayer12;
            }
            else {
                this._mainCamera.cullingMask &= ~paper.Layer.UserLayer12;
            }
        }

        private _red: boolean = true;
        private _green: boolean = true;
        private _blue: boolean = true;
        private readonly _mainCamera: egret3d.Camera = egret3d.Camera.main;

        public onAwake() {
            const mainCamera = this._mainCamera;

            { // Main camera.
                mainCamera.cullingMask = paper.Layer.UserLayer10 | paper.Layer.UserLayer11 | paper.Layer.UserLayer12;
                mainCamera.fov = 70.0 * egret3d.Const.DEG_RAD;
                mainCamera.far = 10000.0;
                mainCamera.near = 1.0;
                mainCamera.backgroundColor.fromHex(0xFFFFFF);
                mainCamera.gameObject.addComponent(behaviors.RotateAround);
                //
                paper.GameObject.globalGameObject.getComponent(paper.editor.ModelComponent)!.select(mainCamera.gameObject);
            }

            { // Create lights.
                const pointLight = paper.GameObject.create("Point Light").addComponent(egret3d.PointLight);
                pointLight.distance = 10000;
                pointLight.color.fromHex(0xFFFFFF);
                pointLight.transform.setParent(mainCamera.transform);
            }

            { // Create game objects.
                const colors = [0xff0000, 0x00ff00, 0x0000ff];
                const layers = [paper.Layer.UserLayer10, paper.Layer.UserLayer11, paper.Layer.UserLayer12];

                for (let i = 0; i < 300; ++i) {
                    const layer = (i % 3);
                    const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, `Cube ${i}`);
                    gameObject.layer = layers[layer];
                    gameObject.renderer!.material = egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT).setColor(colors[layer]);
                    gameObject.transform
                        .setLocalPosition(
                            Math.random() * 800.0 - 400.0,
                            Math.random() * 800.0 - 400.0,
                            Math.random() * 800.0 - 400.0,
                        )
                        .setLocalEuler(
                            Math.random() * 2.0 * Math.PI,
                            Math.random() * 2.0 * Math.PI,
                            Math.random() * 2.0 * Math.PI,
                        )
                        .setLocalScale(
                            (Math.random() + 0.5) * 20.0,
                            (Math.random() + 0.5) * 20.0,
                            (Math.random() + 0.5) * 20.0,
                        );
                }
            }
        }
    }
}