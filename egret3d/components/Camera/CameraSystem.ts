namespace egret3d {
    /**
     * Camera系统
     */
    export class CameraSystem extends paper.BaseSystem<Camera> {
        protected readonly _interests = [
            { componentClass: Camera, isExtends: true }
        ];

        private _applyDrawCall(context: RenderContext, draw: DrawCall): void {
            context.updateModel(draw.transform);

            let drawType: string = "base";

            if (draw.boneData) {
                context.updateBones(draw.boneData);
                drawType = "skin";
            }

            if (draw.lightMapIndex >= 0) {
                const activeScene = paper.Application.sceneManager.activeScene;

                if (activeScene.lightmaps.length > draw.lightMapIndex) {
                    context.updateLightmap(
                        activeScene.lightmaps[draw.lightMapIndex],
                        draw.mesh.glTFMesh.primitives[draw.subMeshInfo].attributes.TEXCOORD_1 ? 1 : 0,
                        draw.lightMapScaleOffset
                    );
                    drawType = "lightmap";
                }
            }

            const renderer = draw.renderer;
            if (renderer && renderer.receiveShadows) {
                context.receiveShadow = true;
            }
            else {
                context.receiveShadow = false;
            }

            WebGLKit.draw(context, draw.material, draw.mesh, draw.subMeshInfo, drawType, draw.transform._worldMatrixDeterminant < 0);
        }

        public $renderCamera(camera: Camera) {
            DrawCallList.updateZdist(camera);
            DrawCallList.sort();

            for (const drawCall of Pool.drawCall.instances) {
                // 视锥剔除
                // if(drawCall.frustumTest) {
                //     if(!camera.testFrustumCulling(drawCall.gameObject.transform)) {
                //         return;
                //     }
                // }

                const gameObject = drawCall.renderer.gameObject;

                if (camera.cullingMask & gameObject.layer) {
                    if (gameObject.activeInHierarchy) {
                        this._applyDrawCall(camera.context, drawCall);
                    }
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
