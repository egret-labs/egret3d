namespace egret3d {
    /**
     * 矩形区域光组件。
     */
    export class RectangleAreaLight extends BaseLight {
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public width: number = 1.0;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public height: number = 1.0;
    }
}