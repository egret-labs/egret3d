namespace egret3d {
    /**
     * EditorCamera系统
     */
    export class EditorCameraSystem extends CameraSystem {
        /**
         * @inheritDoc
         */
        public update() {
            this._components.sort((a, b) => {
                return a.order - b.order;
            });

            const lightSystem = paper.Application.systemManager.getSystem(LightSystem);
            const lights = lightSystem ? lightSystem.components : null;

            let camera: Camera | null = null;
            for (const component of this._components) {
                if (component.gameObject.tag === "EditorCamera") {
                    camera = component;
                }
                component.update(paper.Time.deltaTime);
                if (lights && lights.length > 0) {
                    component.context.updateLights(lights);
                }
            }

            if (camera) {
                camera.context.drawtype = "";
                camera._targetAndViewport(camera.renderTarget, false);
                this.$renderCamera(camera);
            }
            else {
                WebGLKit.webgl.clearColor(0, 0, 0, 1);
                WebGLKit.webgl.clearDepth(1.0);
                WebGLKit.webgl.clear(WebGLKit.webgl.COLOR_BUFFER_BIT | WebGLKit.webgl.DEPTH_BUFFER_BIT);
            }
        }
    }
}
