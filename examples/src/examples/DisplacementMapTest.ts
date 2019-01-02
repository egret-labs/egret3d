namespace examples {

    export class DisplacementMapTest {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            // Load scene resource.
            await RES.getResAsync("Assets/ninjaHead_Low.prefab.json");
            await RES.getResAsync("Assets/Models/ninja/normal.image.json");
            await RES.getResAsync("Assets/Models/ninja/ao.image.json");
            await RES.getResAsync("Assets/Models/ninja/displacement.image.json");

            egret3d.Camera.main;

            const renderState = paper.GameObject.globalGameObject.getOrAddComponent(egret3d.RenderState);
            renderState.toneMapping = egret3d.ToneMapping.LinearToneMapping;
            renderState.toneMappingExposure = 1.0;

            //
            const lightObj = paper.GameObject.create("light");
            const light = lightObj.addComponent(egret3d.DirectionalLight);
            light.color.set(1.0, 0.0, 0.0, 1.0);
            // Create scene.
            const ninja = paper.Prefab.create("Assets/ninjaHead_Low.prefab.json")!;
            ninja.transform.position.set(0, -185, -63).update();
            ninja.transform.localEulerAngles.set(-38, 179, 0).update();
            ninja.addComponent(GUIScript);
        }
    }

    class GUIScript extends paper.Behaviour {
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 1.0 })
        public metalness: number = 1.0;
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 1.0 })
        public roughness: number = 0.4;
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 1.0 })
        public aoMapIntensity: number = 1.0;
        // @paper.editor.property(paper.editor.EditType.FLOAT)
        // public envMapIntensity: number = 0.0;
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 3.0 })
        public displacementScale: number = 2.436143;
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public displacementBias: number = -0.428408;
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: -1.0, maximum: 1.0 })
        public normalScale: number = 1.0;

        private _material: egret3d.Material | null = null;
        public onAwake() {

            const normalMap = RES.getRes("Assets/Models/ninja/normal.image.json");
            const aoMap = RES.getRes("Assets/Models/ninja/ao.image.json");
            const displacementMap = RES.getRes("Assets/Models/ninja/displacement.image.json");

            this._material = egret3d.Material.create(egret3d.DefaultShaders.MESH_PHYSICAL_DOUBLESIDE);
            this._material.setColor("diffuse", egret3d.Color.WHITE);
            this._material.setTexture("normalMap", normalMap).setTexture("aoMap", aoMap).setTexture("displacementMap", displacementMap);
            this._material.addDefine("USE_NORMALMAP").addDefine("USE_AOMAP").addDefine("USE_DISPLACEMENTMAP").addDefine("STANDARD").addDefine("DOUBLE_SIDED");

            this.gameObject.renderer!.material = this._material;
        }

        public onUpdate() {
            const material = this._material!;
            material.setFloat("metalness", this.metalness);
            material.setFloat("roughness", this.roughness);
            material.setFloat("aoMapIntensity", this.aoMapIntensity);
            material.setFloat("displacementScale", this.displacementScale);
            material.setFloat("displacementBias", this.displacementBias);
            material.setVector2("normalScale", egret3d.Vector2.create(1, 1).multiplyScalar(this.normalScale).release());
        }
    }
}