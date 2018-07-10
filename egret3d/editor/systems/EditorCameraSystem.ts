namespace paper.editor {
    /**
     * EditorCamera系统
     */
    export class EditorCameraSystem extends egret3d.CameraSystem {
        public onUpdate(deltaTime: number) {
            this._components.sort((a, b) => {
                return a.order - b.order;
            });

            const lightSystem = paper.Application.systemManager.getSystem(egret3d.LightSystem);
            const lights = lightSystem ? lightSystem.components : null;

            let camera: egret3d.Camera | null = null;
            for (const component of this._components) {
                if (component.gameObject.tag === "EditorCamera") {
                    camera = component;
                }
                component.update(deltaTime);
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
                egret3d.WebGLKit.webgl.clearColor(0, 0, 0, 1);
                egret3d.WebGLKit.webgl.clearDepth(1.0);
                egret3d.WebGLKit.webgl.clear(egret3d.WebGLKit.webgl.COLOR_BUFFER_BIT | egret3d.WebGLKit.webgl.DEPTH_BUFFER_BIT);
            }
        }
    }
}
