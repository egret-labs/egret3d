namespace egret3d {
    /**
     * 
     */
    export class WebGLRenderSystem extends paper.BaseSystem {
        protected readonly _interests = [
            [
                { componentClass: Camera }
            ],
            [
                { componentClass: Egret2DRenderer }
            ],
        ];
        private readonly _drawCalls: DrawCalls = this._globalGameObject.getComponent(DrawCalls) || this._globalGameObject.addComponent(DrawCalls);
        private readonly _webGL: WebGLRenderingContext = WebGLKit.webgl;
        private readonly _stateEnable: gltf.EnableState[] = [gltf.EnableState.BLEND, gltf.EnableState.CULL_FACE, gltf.EnableState.DEPTH_TEST];

        // private readonly _techiques: GLTFWebglGlTechnique = this._globalGameObject.getComponent(GLTFWebglGlTechnique) || this._globalGameObject.addComponent(GLTFWebglGlTechnique);

        private _updateState(state: gltf.States) {
            //enable
            for (const e of this._stateEnable) {
                state.enable.indexOf(e) >= 0 ? this._webGL.enable(e) : this._webGL.disable(e);
            }

            //functions
            for (const e in state.functions) {
                //
                (this._webGL[e] as Function).call(this._webGL, state.functions[e]);
            }
        }

        private _updateUniforms(technique: gltf.Technique) {
            const webgl = this._webGL;
            for (const key in technique.uniforms) {
                const uniform = technique.uniforms[key];
                switch(uniform.type){
                    case gltf.UniformType.BOOL:
                        
                    break;
                }
            }
        }

        private _renderCall(context: RenderContext, drawCall: DrawCall) {
            const renderer = drawCall.renderer;
            const lightmapIndex = renderer.lightmapIndex;

            context.drawCall = drawCall;

            context.updateModel(drawCall.matrix || renderer.gameObject.transform.getWorldMatrix());

            //
            const material = drawCall.material;
            const technique = material._gltfTechnique;

            //Program
            const program = GlProgram.getProgram(context, material);
            //State
            this._updateState(drawCall.material._gltfTechnique.states);

            //Uniform

            //Attribute

            //Draw

            // let drawType: string = "base"; // TODO

            // if (drawCall.boneData) {
            //     context.updateBones(drawCall.boneData);
            //     drawType = "skin";
            // }

            // if (lightmapIndex >= 0) {
            //     const activeScene = paper.Application.sceneManager.activeScene;
            //     if (activeScene.lightmaps.length > lightmapIndex) {
            //         context.updateLightmap(
            //             activeScene.lightmaps[lightmapIndex],
            //             drawCall.mesh.glTFMesh.primitives[drawCall.subMeshIndex].attributes.TEXCOORD_1 ? 1 : 0,
            //             renderer.lightmapScaleOffset,
            //             activeScene.lightmapIntensity
            //         );
            //         drawType = "lightmap";
            //     }
            // }

            // WebGLKit.draw(context, drawType);
        }


        /**
         * @internal
         * @param camera 
         */
        public _renderCamera(camera: Camera) {
            //在这里先剔除，然后排序，最后绘制           
            this._drawCalls.sortAfterFrustumCulling(camera);

            const opaqueCalls = this._drawCalls.opaqueCalls;
            const transparentCalls = this._drawCalls.transparentCalls;

            //Step1 draw opaque
            for (const drawCall of opaqueCalls) {
                this._renderCall(camera.context, drawCall);
            }
            //Step2 draw transparent
            for (const drawCall of transparentCalls) {
                this._renderCall(camera.context, drawCall);
            }

            // Egret2D渲染不加入DrawCallList的排序
            const egret2DRenderers = this._groups[1].components as ReadonlyArray<Egret2DRenderer>;
            for (const egret2DRenderer of egret2DRenderers) {
                if (camera.cullingMask & egret2DRenderer.gameObject.layer) {
                    egret2DRenderer.render(camera.context, camera);
                }
            }
        }

        public onUpdate() {
            //
            const cameras = this._groups[0].components as Camera[];
            for (const camera of cameras) {
                if (camera.postQueues.length === 0) {
                    camera.context.drawtype = "";
                    camera._targetAndViewport(camera.renderTarget, false);
                    this._renderCamera(camera);
                }
                else {
                    for (const item of camera.postQueues) {
                        item.render(camera, this);
                    }
                }
            }
        }
    }
}