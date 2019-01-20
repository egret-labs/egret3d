namespace egret3d {
    /**
     * 半球光组件。
     */
    export class HemisphereLight extends BaseLight {
        /**
         * 该灯光的背景颜色。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.COLOR)
        public readonly groundColor: Color = Color.create(0.0, 0.0, 0.0, 1.0);
    }
}