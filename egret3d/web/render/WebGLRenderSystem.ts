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
        private _usedTextureUnits: number = 0;
        private _texUnitsCache: number[] = [];
        private _cacheProgram: WebGLProgram;

        private _allocTextureUnit() {
            const textureUnit = this._usedTextureUnits;
            if (this._usedTextureUnits >= WebGLKit.capabilities.maxTextures) {
                console.warn('Trying to use ' + this._usedTextureUnits + ' texture units while this GPU supports only ' + WebGLKit.capabilities.maxTextures);
            }

            this._usedTextureUnits += 1;

            return textureUnit;
        }

        private _allocTextureUnits(num: number) {
            this._texUnitsCache.length = num;

            for (let i = 0; i < num; i++) {
                this._texUnitsCache[i] = this._allocTextureUnit();
            }

            return this._texUnitsCache;
        }

        private _updateUniform(uniform: GLTFUniform) {
            if (!uniform.extensions.paper.enable || !uniform.extensions.paper.dirty) {
                return;
            }
            const webgl = this._webGL;
            const paperExtension = uniform.extensions.paper;
            const location = paperExtension.location;
            const value = uniform.value;
            paperExtension.dirty = false;
            switch (uniform.type) {
                case gltf.UniformType.BOOL:
                case gltf.UniformType.Int:
                    webgl.uniform1i(location, value);
                    break;
                case gltf.UniformType.BOOL_VEC2:
                case gltf.UniformType.INT_VEC2:
                    webgl.uniform2iv(location, value);
                    break;
                case gltf.UniformType.BOOL_VEC3:
                case gltf.UniformType.INT_VEC3:
                    webgl.uniform3iv(location, value);
                    break;
                case gltf.UniformType.BOOL_VEC4:
                case gltf.UniformType.INT_VEC4:
                    webgl.uniform4iv(location, value);
                    break;
                case gltf.UniformType.FLOAT:
                    webgl.uniform1f(location, value);
                    break;
                case gltf.UniformType.FLOAT_VEC2:
                    webgl.uniform2fv(location, value);
                    break;
                case gltf.UniformType.FLOAT_VEC3:
                    webgl.uniform3fv(location, value);
                    break;
                case gltf.UniformType.FLOAT_VEC4:
                    webgl.uniform4fv(location, value);
                    break;
                case gltf.UniformType.FLOAT_MAT2:
                    webgl.uniformMatrix2fv(location, false, value);
                    break;
                case gltf.UniformType.FLOAT_MAT3:
                    webgl.uniformMatrix3fv(location, false, value);
                    break;
                case gltf.UniformType.FLOAT_MAT4:
                    webgl.uniformMatrix4fv(location, false, value);
                    break;
                case gltf.UniformType.SAMPLER_2D:
                    const unit = this._allocTextureUnit();
                    webgl.uniform1i(location, unit);
                    webgl.activeTexture(webgl.TEXTURE0 + unit);
                    webgl.bindTexture(webgl.TEXTURE_2D, (value as Texture).glTexture.texture);
                    break;
            }
        }

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

        private _updateUniforms(context: RenderContext, technique: gltf.Technique, forceUpdate: boolean) {
            //
            const webgl = this._webGL;
            for (const key in technique.uniforms) {
                const uniform = technique.uniforms[key];
                const paperExtension = uniform.extensions.paper;
                if (!paperExtension.dirty) {
                    continue;
                }
                const location = uniform.extensions.paper.location;
                switch (uniform.semantic) {
                    case gltf.UniformSemanticType.MODEL:
                        webgl.uniformMatrix4fv(location, false, context.matrix_m.rawData);
                        break;
                    case gltf.UniformSemanticType.VIEW:
                        webgl.uniformMatrix4fv(location, false, context.matrix_v.rawData);
                        break;
                    case gltf.UniformSemanticType.PROJECTION:
                        webgl.uniformMatrix4fv(location, false, context.matrix_p.rawData);
                        break;
                    case gltf.UniformSemanticType._VIEWPROJECTION:
                        webgl.uniformMatrix4fv(location, false, context.matrix_vp.rawData);
                        break;
                    case gltf.UniformSemanticType.MODELVIEWPROJECTION:
                        webgl.uniformMatrix4fv(location, false, context.matrix_mvp.rawData);
                        break;
                    case gltf.UniformSemanticType._CAMERA_POS:
                        webgl.uniform3fv(location, context.cameraPosition);
                        break;
                    case gltf.UniformSemanticType._CAMERA_FORWARD:
                        webgl.uniform3fv(location, context.cameraForward);
                        break;
                    case gltf.UniformSemanticType._CAMERA_UP:
                        webgl.uniform3fv(location, context.cameraUp);
                        break;
                    case gltf.UniformSemanticType._LIGHTCOUNT:
                        webgl.uniform1f(location, context.lightCount);
                        break;
                    case gltf.UniformSemanticType._DIRECTLIGHTS:
                        if (context.directLightCount > 0) {
                            webgl.uniform1fv(location, context.directLightArray);
                        }
                        break;
                    case gltf.UniformSemanticType._POINTLIGHTS:
                        if (context.pointLightCount > 0) {
                            webgl.uniform1fv(location, context.pointLightArray);
                        }
                        break;
                    case gltf.UniformSemanticType._SPOTLIGHTS:
                        if (context.spotLightCount > 0) {
                            webgl.uniform1fv(location, context.spotLightArray);
                        }
                        break;
                    case gltf.UniformSemanticType._DIRECTIONSHADOWMAT:
                        webgl.uniformMatrix4fv(location, false, context.directShadowMatrix);
                        break;
                    case gltf.UniformSemanticType._SPOTSHADOWMAT:
                        webgl.uniformMatrix4fv(location, false, context.spotShadowMatrix);
                        break;
                    case gltf.UniformSemanticType._DIRECTIONSHADOWMAP:
                        {
                            const len = context.directShadowMaps.length;
                            if (len > 0) {
                                const units = this._allocTextureUnits(len);
                                webgl.uniform1iv(location, units);

                                for (let i = 0, l = units.length; i < l; i++) {
                                    webgl.activeTexture(webgl.TEXTURE0 + units[i]);
                                    webgl.bindTexture(webgl.TEXTURE_2D, context.directShadowMaps[i]);
                                }
                            }
                        }
                        break;
                    case gltf.UniformSemanticType._POINTSHADOWMAP:
                        {
                            const len = context.pointShadowMaps.length;
                            if (len > 0) {
                                const units = this._allocTextureUnits(len);
                                webgl.uniform1iv(location, units);

                                for (let i = 0, l = units.length; i < l; i++) {
                                    webgl.activeTexture(webgl.TEXTURE0 + units[i]);
                                    webgl.bindTexture(webgl.TEXTURE_2D, context.pointShadowMaps[i]);
                                }
                            }
                        }
                        break;
                    case gltf.UniformSemanticType._SPOTSHADOWMAP:
                        {
                            const len = context.spotShadowMaps.length;
                            if (len > 0) {
                                const units = this._allocTextureUnits(len);
                                webgl.uniform1iv(location, units);

                                for (let i = 0, l = units.length; i < l; i++) {
                                    webgl.activeTexture(webgl.TEXTURE0 + units[i]);
                                    webgl.bindTexture(webgl.TEXTURE_2D, context.spotShadowMaps[i]);
                                }
                            }
                        }
                        break;
                    case gltf.UniformSemanticType._LIGHTMAPTEX:
                        const unit = this._allocTextureUnit();
                        webgl.uniform1i(location, unit);
                        webgl.activeTexture(webgl.TEXTURE0 + unit);
                        webgl.bindTexture(webgl.TEXTURE_2D, context.lightmap);
                        break;
                    case gltf.UniformSemanticType._LIGHTMAPINTENSITY:
                        webgl.uniform1f(location, context.lightmapIntensity);
                        break;
                    case gltf.UniformSemanticType._LIGHTMAPOFFSET:
                        if (context.lightmapOffset) {
                            webgl.uniform4fv(location, context.lightmapOffset);
                        }
                        else {
                            console.debug("Error light map scale and offset.");
                        }
                        break;
                    case gltf.UniformSemanticType._LIGHTMAPUV:
                        webgl.uniform1f(location, context.lightmapUV);
                        break;
                    case gltf.UniformSemanticType._BONESVEC4:
                        webgl.uniform4fv(location, context.boneData);
                        break;
                    case gltf.UniformSemanticType._REFERENCEPOSITION:
                        webgl.uniform4fv(location, context.lightPosition);
                        break;
                    case gltf.UniformSemanticType._NEARDICTANCE:
                        webgl.uniform1f(location, context.lightShadowCameraNear);
                        break;
                    case gltf.UniformSemanticType._FARDISTANCE:
                        webgl.uniform1f(location, context.lightShadowCameraFar);
                        break;
                    default:
                        this._updateUniform(uniform);
                        break;
                }

                paperExtension.dirty = false;
            }
        }

        private _updateAttributes(mesh: Mesh, subMeshIndex: number, technique: gltf.Technique, forceUpdate: boolean) {
            if (0 <= subMeshIndex && subMeshIndex < mesh.glTFMesh.primitives.length) {
                const glTFAsset = mesh.glTFAsset;
                const primitive = mesh.glTFMesh.primitives[subMeshIndex];
                const ibo = mesh.ibos[subMeshIndex];

                const gl = this._webGL;
                gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbo);

                if (ibo) {
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
                }

                const attributes = technique.attributes;
                for (const k in attributes) {
                    const attribute = attributes[k];
                    if (!attribute.extensions.paper.enable) {
                        continue;
                    }

                    const location = attribute.extensions.paper.location;
                    const accessorIndex = primitive.attributes[attribute.semantic];
                    if (accessorIndex !== undefined) {
                        const accessor = glTFAsset.getAccessor(accessorIndex);
                        const bufferOffset = glTFAsset.getBufferOffset(accessor);
                        const typeCount = GLTFAsset.getAccessorTypeCount(accessor.type);
                        gl.vertexAttribPointer(location, typeCount, accessor.componentType, accessor.normalized ? true : false, 0, bufferOffset);
                        gl.enableVertexAttribArray(location);
                    }
                    else {
                        gl.disableVertexAttribArray(location);
                    }
                }
            }
            else {
                console.warn("Error arguments.");
            }
        }

        private _useProgram(program: WebGLProgram) {
            if (this._cacheProgram != program) {
                this._cacheProgram = program;
                this._webGL.useProgram(program);
                return true;
            }
            return false;
        }

        private _drawCall(mesh: Mesh, drawCall: DrawCall) {
            const webGL = this._webGL;
            const primitive = mesh.glTFMesh.primitives[drawCall.subMeshIndex];
            const vertexAccessor = mesh.glTFAsset.getAccessor(primitive.attributes.POSITION);
            const bufferOffset = mesh.glTFAsset.getBufferOffset(vertexAccessor);

            if (primitive.indices !== undefined) {
                const indexAccessor = mesh.glTFAsset.getAccessor(primitive.indices);
                switch (primitive.mode) { // TODO
                    case gltf.MeshPrimitiveMode.Lines:
                        webGL.drawElements(webGL.LINES, indexAccessor.count, webGL.UNSIGNED_SHORT, bufferOffset);
                        break;
                    case gltf.MeshPrimitiveMode.Triangles:
                    default:
                        webGL.drawElements(webGL.TRIANGLES, indexAccessor.count, webGL.UNSIGNED_SHORT, bufferOffset);
                        break;
                }
            }
            else {
                switch (primitive.mode) {
                    case gltf.MeshPrimitiveMode.Lines:
                        webGL.drawArrays(webGL.LINES, bufferOffset, vertexAccessor.count);
                        break;
                    case gltf.MeshPrimitiveMode.LineLoop:
                        webGL.drawArrays(webGL.LINE_LOOP, bufferOffset, vertexAccessor.count);
                        break;
                    case gltf.MeshPrimitiveMode.LineStrip:
                        webGL.drawArrays(webGL.LINE_STRIP, bufferOffset, vertexAccessor.count);
                        break;
                    case gltf.MeshPrimitiveMode.Triangles:
                    default:
                        webGL.drawArrays(webGL.TRIANGLES, bufferOffset, vertexAccessor.count);
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
            this._usedTextureUnits = 0;
            //Program
            const program = GlProgram.getProgram(context, material);
            //State
            this._updateState(drawCall.material._gltfTechnique.states);
            //Use Program
            const force = this._useProgram(program.program);
            //Uniform
            this._updateUniforms(context, technique, force);
            //Attribute
            this._updateAttributes(drawCall.mesh, drawCall.subMeshIndex, technique, force);
            //Draw
            this._drawCall(drawCall.mesh, drawCall);
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
            if (cameras.length > 0) {
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
            else {
                this._webGL.clearColor(0, 0, 0, 1);
                this._webGL.clearDepth(1.0);
                this._webGL.clear(WebGLKit.webgl.COLOR_BUFFER_BIT | WebGLKit.webgl.DEPTH_BUFFER_BIT);
            }
        }
    }
}