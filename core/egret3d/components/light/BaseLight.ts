namespace egret3d {
    /**
     * 灯光组件。
     */
    export abstract class BaseLight extends paper.BaseComponent {
        /**
         * TODO
         */
        @paper.serializedField
        public cullingMask: paper.Layer = paper.Layer.Default;
        /**
         * 该灯光的强度。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public intensity: number = 1.0;
        /**
         * 该灯光的颜色。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.COLOR)
        public readonly color: Color = Color.create(1.0, 1.0, 1.0, 1.0);
        /**
         * 该灯光是否投射阴影。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public castShadows: boolean = false;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NESTED)
        public readonly shadow: LightShadow = LightShadow.create(this);

        public uninitialize() {
            super.uninitialize();

            this.shadow._renderTarget.dispose();
        }
    }
}