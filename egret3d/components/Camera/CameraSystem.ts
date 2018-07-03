namespace egret3d {
    /**
     * Camera系统
     */
    export class CameraSystem extends paper.BaseSystem<Camera> {
        protected readonly _interests = [
            { componentClass: Camera, isExtends: true }
        ];
        private readonly _drawCalls: DrawCalls = this._globalGameObject.getComponent(DrawCalls) || this._globalGameObject.addComponent(DrawCalls);

        private _applyDrawCall(context: RenderContext, drawCall: DrawCall): void {
            const renderer = drawCall.renderer;
            const lightmapIndex = renderer.lightmapIndex;

            context.drawCall = drawCall;

            context.updateModel(drawCall.matrix || renderer.gameObject.transform.getWorldMatrix());

            let drawType: string = "base"; // TODO

            if (drawCall.boneData) {
                context.updateBones(drawCall.boneData);
                drawType = "skin";
            }

            if (lightmapIndex >= 0) {
                const activeScene = paper.Application.sceneManager.activeScene;
                if (activeScene.lightmaps.length > lightmapIndex) {
                    context.updateLightmap(
                        activeScene.lightmaps[lightmapIndex],
                        drawCall.mesh.glTFMesh.primitives[drawCall.subMeshIndex].attributes.TEXCOORD_1 ? 1 : 0,
                        renderer.lightmapScaleOffset,
                        activeScene.lightmapIntensity
                    );
                    drawType = "lightmap";
                }
            }

            WebGLKit.draw(context, drawType);
        }

        public $renderCamera(camera: Camera) {
            // this._drawCalls.updateZdist(camera);
            this._drawCalls.sort();

            for (const drawCall of this._drawCalls.drawCalls) {
                // 视锥剔除
                // if(drawCall.frustumTest) {
                //     if(!camera.testFrustumCulling(drawCall.gameObject.transform)) {
                //         return;
                //     }
                // }

                const gameObject = drawCall.renderer.gameObject;

                if (camera.cullingMask & gameObject.layer) {
                    this._applyDrawCall(camera.context, drawCall);
                }
            }
            // Egret2D渲染不加入DrawCallList的排序
            const egret2DRenderSystem = paper.Application.systemManager.getSystem(Egret2DRendererSystem);
            if (egret2DRenderSystem && egret2DRenderSystem.enabled) {
                for (const egret2DRenderer of egret2DRenderSystem.components) {
                    if (camera.cullingMask & egret2DRenderer.gameObject.layer) {
                        egret2DRenderer.render(camera.context, camera);
                    }
                }
            }
        }

        public onUpdate() {
            this._components.sort((a, b) => { // TODO 不应每次产生函数实例。
                return a.order - b.order;
            });

            const lightSystem = paper.Application.systemManager.getSystem(LightSystem);
            const lights = lightSystem ? lightSystem.components : null;

            for (const component of this._components) {
                component.update(paper.Time.deltaTime);

                if (lights && lights.length > 0) {
                    component.context.updateLights(lights); // TODO 性能优化
                }
            }

            Performance.startCounter("render");

            if (this._components.length > 0) {
                for (const component of this._components) {
                    if (component.postQueues.length === 0) {
                        component.context.drawtype = "";
                        component._targetAndViewport(component.renderTarget, false);
                        this.$renderCamera(component);
                    }
                    else {
                        for (const item of component.postQueues) {
                            item.render(component, this);
                        }
                    }
                }
            }
            else {
                WebGLKit.webgl.clearColor(0, 0, 0, 1);
                WebGLKit.webgl.clearDepth(1.0);
                WebGLKit.webgl.clear(WebGLKit.webgl.COLOR_BUFFER_BIT | WebGLKit.webgl.DEPTH_BUFFER_BIT);
            }

            Performance.endCounter("render");
            Performance.updateFPS();
        }
    }
}
