namespace egret3d {
    /**
     * Light系统
     */
    export class LightSystem extends paper.BaseSystem<Light> {
        protected readonly _interests = [
            { componentClass: Light }
        ];
        private readonly _drawCalls: DrawCalls = this._globalGameObject.getComponent(DrawCalls) || this._globalGameObject.addComponent(DrawCalls);

        public onUpdate() {
            for (const light of this._components) {
                let shadow: ILightShadow;
                let face = 1;

                if (light.castShadows) {
                    switch (light.type) {

                        case LightTypeEnum.Point:
                            if (!light.$pointLightShadow) {
                                light.$pointLightShadow = new PointLightShadow();
                            }
                            shadow = light.$pointLightShadow;
                            face = 6;
                            break;

                        case LightTypeEnum.Spot:
                            if (!light.$spotLightShadow) {
                                light.$spotLightShadow = new SpotLightShadow();
                            }
                            shadow = light.$spotLightShadow;
                            face = 1;
                            break;

                        case LightTypeEnum.Direction:
                        default:
                            if (!light.$directLightShadow) {
                                light.$directLightShadow = new DirectLightShadow();
                            }
                            shadow = light.$directLightShadow;
                            face = 1;
                            break;
                    }

                    for (let j = 0; j < face; j++) {

                        shadow.update(light, j);

                        (<GlRenderTargetCube>shadow.renderTarget).activeCubeFace = j;

                        shadow.camera._targetAndViewport(shadow.renderTarget, false);

                        // render shadow
                        let context = shadow.camera.context;
                        if (light.type === LightTypeEnum.Point) {
                            context.drawtype = "_distance_package";
                        }
                        else {
                            context.drawtype = "_depth_package";
                        }

                        context.updateCamera(shadow.camera);
                        context.updateLightDepth(light);

                        for (const drawCall of this._drawCalls.drawCalls) {
                            if (!drawCall.renderer.castShadows) {
                                continue;
                            }

                            const gameObject = drawCall.renderer.gameObject;
                            if (gameObject.activeInHierarchy) {
                                context.drawCall = drawCall;
                                context.updateModel(drawCall.matrix || gameObject.transform.getWorldMatrix());
                                //
                                let drawType = "base";
                                if (drawCall.boneData) {
                                    context.updateBones(drawCall.boneData);
                                    drawType = "skin";
                                }

                                WebGLKit.draw(context, drawType);
                            }
                        }
                    }

                    GlRenderTarget.useNull(WebGLKit.webgl);
                }
            }
        }
    }
}
