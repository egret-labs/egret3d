namespace paper.editor {
    /**
     * EditorCamera系统
     */
    export class EditorCameraSystem extends egret3d.CameraSystem {
        public onUpdate(deltaTime: number) {
            const cameras = this._cameras.cameras;
            let camera: egret3d.Camera | null = null;

            if (cameras.length > 0) {
                const lights = this._groups[1].components as ReadonlyArray<egret3d.BaseLight>;
                const activeScene = paper.Application.sceneManager.activeScene;
                this._cameras.sort();

                for (const component of cameras) { // TODO 完善所有摄像机的渲染
                    if (component.gameObject.scene !== activeScene) {
                        continue;
                    }

                    component.update(deltaTime);

                    if (lights.length > 0) {
                        component.context.updateLights(lights); // TODO 性能优化
                    }

                    if (component.gameObject.tag === "EditorCamera") {
                        camera = component;
                    }
                }
            }

            if (camera) {
                // camera.context.drawtype = "";
                camera._targetAndViewport(camera.renderTarget, false);
                // this.$renderCamera(camera); TODO
            }
            else {
                egret3d.WebGLCapabilities.webgl.clearColor(0, 0, 0, 1);
                egret3d.WebGLCapabilities.webgl.clearDepth(1.0);
                egret3d.WebGLCapabilities.webgl.clear(egret3d.WebGLCapabilities.webgl.COLOR_BUFFER_BIT | egret3d.WebGLCapabilities.webgl.DEPTH_BUFFER_BIT);
            }
        }
    }
}
