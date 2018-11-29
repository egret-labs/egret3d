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
        public static create() {
            return new Fog();
        }
        /**
         * 雾的模式。
         */
        @paper.editor.property(paper.editor.EditType.LIST, { listItems: paper.editor.getItemsFromEnum((egret3d as any).FogMode) }) // TODO
        public mode: FogMode = FogMode.None;
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
        /**
         * 禁止实例化。
         */
        private constructor() {
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
    }
}