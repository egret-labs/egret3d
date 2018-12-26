namespace egret3d {
    /**
     * 雾的模式。
     */
    export const enum FogMode {
        None,
        Fog,
        FogEXP2
    }
    /**
     * 雾。
     */
    export class Fog implements paper.ISerializable {
        /**
         * @internal
         */
        public static create(scene: paper.Scene) {
            return new Fog(scene);
        }
        /**
         * 雾的强度。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public density: number = 0.01;
        /**
         * 雾的近平面。
         * - 最小值 0.01。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.01, step: 1.0 })
        public near: number = 0.01;
        /**
         * 雾的远平面。
         * - 最小值 0.02。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.02, step: 1.0 })
        public far: number = 100.0;
        /**
         * 雾的颜色。
         */
        @paper.editor.property(paper.editor.EditType.COLOR)
        public readonly color: Color = Color.create(0.5, 0.5, 0.5, 1);

        private _mode: FogMode = FogMode.None;
        private readonly _scene: paper.Scene;

        private constructor(scene: paper.Scene) {
            this._scene = scene;
        }

        public serialize() {
            return [this.mode, this.density, this.near, this.far]
                .concat(this.color.serialize());
        }

        public deserialize(data: Readonly<[number, number, number, number, number, number, number, number]>) {
            this.mode = data[0];
            this.density = data[1];
            this.near = data[2];
            this.far = data[3];
            this.color.fromArray(data, 4);

            return this;
        }
        /**
         * 雾的模式。
         */
        @paper.editor.property(paper.editor.EditType.LIST, { listItems: paper.editor.getItemsFromEnum((egret3d as any).FogMode) }) // TODO
        public get mode(): FogMode {
            return this._mode;
        }
        public set mode(value: FogMode) {
            if (this._mode === value) {
                return;
            }
            
            const scene = this._scene;
            this._mode = value;

            switch (value) {
                case FogMode.Fog:
                    scene.defines.addDefine(ShaderDefine.USE_FOG);
                case FogMode.FogEXP2:
                    scene.defines.addDefine(ShaderDefine.FOG_EXP2);
                    break;

                case FogMode.None:
                    scene.defines.removeDefine(ShaderDefine.USE_FOG);
                    scene.defines.removeDefine(ShaderDefine.FOG_EXP2);
                    break;
            }
        }
    }
}