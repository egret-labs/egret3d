namespace behaviors {

    export class WaterEffect extends paper.Behaviour {
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public shininess: number = 1.0;
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public speed: number = 0.1;

        private readonly _lightDir: egret3d.Vector3 = egret3d.Vector3.create();
        private readonly _lightColor: egret3d.Color = egret3d.Color.create();
        private readonly _color: egret3d.Color = egret3d.Color.create(0.09402033, 0.2427614, 0.2720588, 1.0);

        private _material: egret3d.Material | null = null;
        private _time: number = 0.0;
        public onStart() {
            this._material = this.gameObject.renderer!.material!;

            this._material.setFloat("_Shininess", this.shininess);
            this._material.setVector4v("_Color", [this.color.r, this.color.g, this.color.b, this.color.a]);
            this._material.setVector3("lightDir", this._lightDir);
            this._material.setColor("lightColor", this._lightColor);
            this._material.setBlend(gltf.BlendMode.Blend, paper.RenderQueue.Transparent);
        }

        public onUpdate(deltaTime: number): any {
            this._time += deltaTime * this.speed;

            this._material!.setFloat("_time", this._time);
        }

        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public get lightDir(): Readonly<egret3d.Vector3> {
            return this._lightDir;
        }

        @paper.editor.property(paper.editor.EditType.COLOR)
        public get lightColor(): Readonly<egret3d.Color> {
            return this._lightColor;
        }

        @paper.editor.property(paper.editor.EditType.COLOR)
        public get color(): Readonly<egret3d.Color> {
            return this._color;
        }

        public set lightDir(value: Readonly<egret3d.Vector3>) {
            this._lightDir.copy(value);
            this._material!.setVector3("lightDir", this._lightDir);
        }

        public set lightColor(value: Readonly<egret3d.Color>) {
            this._lightColor.copy(value);
            this._material!.setColor("lightColor", this._lightColor);
        }

        public set color(value: Readonly<egret3d.Color>) {
            this._color.copy(value);
            this._material!.setVector4v("_Color", [this.color.r, this.color.g, this.color.b, this.color.a]);
        }
    }
}

