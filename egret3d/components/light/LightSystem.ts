namespace egret3d {
    /**
     * Light系统
     */
    export class LightSystem extends paper.BaseSystem<BaseLight> {
        protected readonly _interests = [
            { componentClass: [DirectLight, SpotLight, PointLight] }
        ];
        private readonly _lightCamera: Camera = this._globalGameObject.getComponent(Camera) || this._globalGameObject.addComponent(Camera);
        private readonly _drawCalls: DrawCalls = this._globalGameObject.getComponent(DrawCalls) || this._globalGameObject.addComponent(DrawCalls);

        public onUpdate() {
            const camera = this._lightCamera;
            const drawCalls = this._drawCalls.drawCalls;

            for (const light of this._components) {
                if (!light.castShadows) {
                    continue;;
                }

                let faceCount = 1;

                if (light.type === LightType.Point) {
                    faceCount = 6;
                }
                else if (light.type === LightType.Direction) {
                }
                else if (light.type === LightType.Spot) {
                }

                for (let i = 0; i < faceCount; ++i) {
                    (light.renderTarget as GlRenderTargetCube).activeCubeFace = i; // TODO 创建接口。
                    light.update(camera, i);
                    camera._targetAndViewport(light.renderTarget, false);

                    // render shadow
                    const context = camera.context;
                    if (light.type === LightType.Point) {
                        context.drawtype = "_distance_package";
                    }
                    else {
                        context.drawtype = "_depth_package";
                    }

                    context.updateCamera(camera, light.matrix);
                    context.updateLightDepth(light);

                    this._drawCalls.sortAfterFrustumCulling(camera); // TODO

                    for (const drawCall of drawCalls) {
                        if (!drawCall.renderer.castShadows) {
                            continue;
                        }

                        const gameObject = drawCall.renderer.gameObject;
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

                GlRenderTarget.useNull(WebGLKit.webgl);
            }
        }
    }
}
