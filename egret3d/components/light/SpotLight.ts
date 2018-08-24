namespace egret3d {
    /**
     * 
     */
    export class SpotLight extends BaseLight {
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public decay: number = 2.0;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public distance: number = 0.0;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public angle: number = Math.PI / 3.0;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public penumbra: number = 0.0;

        public update(camera: Camera, faceIndex: number) {
            camera.near = this.shadowCameraNear;
            camera.far = this.shadowCameraFar;
            camera.size = this.shadowSize;
            camera.fov = this.angle;
            camera.gameObject.transform.getWorldMatrix().copy(this.gameObject.transform.getWorldMatrix()); //

            super.update(camera, faceIndex);
        }
    }
}