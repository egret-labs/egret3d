namespace egret3d {
    /**
     * Light系统
     */
    export class LightSystem extends paper.BaseSystem<Light> {
        /**
         * @inheritDoc
         */
        protected readonly _interests = [
            { componentClass: Light }
        ];
        /**
         * @inheritDoc
         */
        public update() {
            for (const light of this._components) {
                let shadow: ILightShadow;
                let face = 1;

                if (light.isActiveAndEnabled && light.castShadows) {
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

                        for (const drawCall of Pool.shadowCaster.instances) {
                            if (drawCall.gameObject.activeInHierarchy) {
                                context.updateModel(drawCall.transform);
                                let drawType = "base";

                                if (drawCall.boneData) {
                                    context.updateBones(drawCall.boneData);
                                    drawType = "skin";
                                }

                                WebGLKit.draw(context, drawCall.material, drawCall.mesh, drawCall.subMeshInfo, drawType);
                            }
                        }
                    }

                    GlRenderTarget.useNull(WebGLKit.webgl);
                }
            }
        }
    }
}
