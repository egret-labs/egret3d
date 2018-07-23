namespace egret3d {
    /**
     * WebGL 渲染系统
     */
    export class WebGLRenderSystem extends paper.BaseSystem {
        protected readonly _interests = [
            [
                { componentClass: Camera }
            ],
            [
                { componentClass: Egret2DRenderer }
            ],
            [
                { componentClass: [DirectLight, SpotLight, PointLight] }
            ]
        ];
        private readonly _drawCalls: DrawCalls = this._globalGameObject.getComponent(DrawCalls) || this._globalGameObject.addComponent(DrawCalls);
        private readonly _lightCamera: Camera = this._globalGameObject.getComponent(Camera) || this._globalGameObject.addComponent(Camera);
        private readonly _webgl: WebGLRenderingContext = WebGLKit.webgl;
        private readonly _stateEnable: gltf.EnableState[] = [gltf.EnableState.BLEND, gltf.EnableState.CULL_FACE, gltf.EnableState.DEPTH_TEST];
        //
        private _cacheContext: RenderContext;
        private _cacheContextVersion: number;
        private _cacheProgram: WebGLProgram;
        private _cacheMaterial: Material;
        private _cacheMaterialVerision: number;
        private _cacheMesh: Mesh;
        private _cacheMeshVersion: number;
        private _cacheDefines: string;
        //
        private _updateState(state: gltf.States) {
            //enable
            for (const e of this._stateEnable) {
                state.enable.indexOf(e) >= 0 ? this._webgl.enable(e) : this._webgl.disable(e);
            }
            //functions
            for (const e in state.functions) {
                //
                (this._webgl[e] as Function).call(this._webgl, state.functions[e]);
            }
        }

        private _updateContextDefines(context: RenderContext, material: Material) {
            this._cacheDefines = "";
            if (context.lightCount > 0) {
                this._cacheDefines += "#define USE_LIGHT " + context.lightCount + "\n";

                if (context.directLightCount > 0) {
                    this._cacheDefines += "#define USE_DIRECT_LIGHT " + context.directLightCount + "\n";
                }
                if (context.pointLightCount > 0) {
                    this._cacheDefines += "#define USE_POINT_LIGHT " + context.pointLightCount + "\n";
                }
                if (context.spotLightCount > 0) {
                    this._cacheDefines += "#define USE_SPOT_LIGHT " + context.spotLightCount + "\n";
                }

                if (context.drawCall.renderer.receiveShadows) {
                    this._cacheDefines += "#define USE_SHADOW \n";
                    this._cacheDefines += "#define USE_PCF_SOFT_SHADOW \n";
                }
            }
            //自定义的宏定义TODO
            this._cacheDefines += material.shaderDefine;
        }

        private _updateContextUniforms(context: RenderContext, material: Material, technique: gltf.Technique, forceUpdate: boolean) {
            const needUpdate = this._cacheContext !== context || this._cacheContextVersion !== context.version || forceUpdate;
            if (!needUpdate) {
                return;
            }

            this._cacheContext = context;
            this._cacheContextVersion = context.version;
            const webgl = this._webgl;

            for (const key in technique.uniforms) {
                const uniform = technique.uniforms[key];
                const paperExtension = uniform.extensions.paper;
                if (!paperExtension.enable) {
                    continue;
                }
                const location = paperExtension.location;
                switch (uniform.semantic) {
                    case gltf.UniformSemanticType.MODEL:
                        webgl.uniformMatrix4fv(location, false, context.matrix_m.rawData);
                        paperExtension.dirty = false;
                        break;
                    case gltf.UniformSemanticType.VIEW:
                        webgl.uniformMatrix4fv(location, false, context.matrix_v.rawData);
                        paperExtension.dirty = false;
                        break;
                    case gltf.UniformSemanticType.PROJECTION:
                        webgl.uniformMatrix4fv(location, false, context.matrix_p.rawData);
                        paperExtension.dirty = false;
                        break;
                    case gltf.UniformSemanticType._VIEWPROJECTION:
                        webgl.uniformMatrix4fv(location, false, context.matrix_vp.rawData);
                        paperExtension.dirty = false;
                        break;
                    case gltf.UniformSemanticType.MODELVIEWPROJECTION:
                        webgl.uniformMatrix4fv(location, false, context.matrix_mvp.rawData);
                        paperExtension.dirty = false;
                        break;
                    case gltf.UniformSemanticType._CAMERA_POS:
                        webgl.uniform3fv(location, context.cameraPosition);
                        paperExtension.dirty = false;
                        break;
                    case gltf.UniformSemanticType._CAMERA_FORWARD:
                        webgl.uniform3fv(location, context.cameraForward);
                        paperExtension.dirty = false;
                        break;
                    case gltf.UniformSemanticType._CAMERA_UP:
                        webgl.uniform3fv(location, context.cameraUp);
                        paperExtension.dirty = false;
                        break;
                    case gltf.UniformSemanticType._LIGHTCOUNT:
                        webgl.uniform1f(location, context.lightCount);
                        paperExtension.dirty = false;
                        break;
                    case gltf.UniformSemanticType._DIRECTLIGHTS:
                        if (context.directLightCount > 0) {
                            webgl.uniform1fv(location, context.directLightArray);
                            paperExtension.dirty = false;
                        }
                        break;
                    case gltf.UniformSemanticType._POINTLIGHTS:
                        if (context.pointLightCount > 0) {
                            webgl.uniform1fv(location, context.pointLightArray);
                            paperExtension.dirty = false;
                        }
                        break;
                    case gltf.UniformSemanticType._SPOTLIGHTS:
                        if (context.spotLightCount > 0) {
                            webgl.uniform1fv(location, context.spotLightArray);
                            paperExtension.dirty = false;
                        }
                        break;
                    case gltf.UniformSemanticType._DIRECTIONSHADOWMAT:
                        webgl.uniformMatrix4fv(location, false, context.directShadowMatrix);
                        paperExtension.dirty = false;
                        break;
                    case gltf.UniformSemanticType._SPOTSHADOWMAT:
                        webgl.uniformMatrix4fv(location, false, context.spotShadowMatrix);
                        paperExtension.dirty = false;
                        break;
                    case gltf.UniformSemanticType._DIRECTIONSHADOWMAP:
                        const directShadowLen = context.directShadowMaps.length;
                        if (directShadowLen > 0 && uniform.extensions.paper.textureUnits) {
                            const units = uniform.extensions.paper.textureUnits;
                            webgl.uniform1iv(location, units);

                            for (let i = 0, l = units.length; i < l; i++) {
                                webgl.activeTexture(webgl.TEXTURE0 + units[i]);
                                webgl.bindTexture(webgl.TEXTURE_2D, context.directShadowMaps[i]);
                            }
                            paperExtension.dirty = false;
                        }
                        break;
                    case gltf.UniformSemanticType._POINTSHADOWMAP:
                        const pointShadowLen = context.pointShadowMaps.length;
                        if (pointShadowLen > 0 && uniform.extensions.paper.textureUnits) {
                            const units = uniform.extensions.paper.textureUnits;
                            webgl.uniform1iv(location, units);

                            for (let i = 0, l = units.length; i < l; i++) {
                                webgl.activeTexture(webgl.TEXTURE0 + units[i]);
                                webgl.bindTexture(webgl.TEXTURE_2D, context.pointShadowMaps[i]);
                            }
                            paperExtension.dirty = false;
                        }
                        break;
                    case gltf.UniformSemanticType._SPOTSHADOWMAP:
                        const spotShadowLen = context.spotShadowMaps.length;
                        if (spotShadowLen > 0 && uniform.extensions.paper.textureUnits) {
                            const units = uniform.extensions.paper.textureUnits;
                            webgl.uniform1iv(location, units);

                            for (let i = 0, l = units.length; i < l; i++) {
                                webgl.activeTexture(webgl.TEXTURE0 + units[i]);
                                webgl.bindTexture(webgl.TEXTURE_2D, context.spotShadowMaps[i]);
                            }
                            paperExtension.dirty = false;
                        }
                        break;
                    case gltf.UniformSemanticType._LIGHTMAPTEX:
                        if (paperExtension.textureUnits && paperExtension.textureUnits.length === 1) {
                            const unit = paperExtension.textureUnits[0];
                            webgl.uniform1i(location, unit);
                            webgl.activeTexture(webgl.TEXTURE0 + unit);
                            webgl.bindTexture(webgl.TEXTURE_2D, context.lightmap);
                            paperExtension.dirty = false;
                        }
                        else {
                            console.error("Error texture unit");
                        }
                        break;
                    case gltf.UniformSemanticType._LIGHTMAPINTENSITY:
                        webgl.uniform1f(location, context.lightmapIntensity);
                        paperExtension.dirty = false;
                        break;
                    case gltf.UniformSemanticType._LIGHTMAPOFFSET:
                        if (context.lightmapOffset) {
                            webgl.uniform4fv(location, context.lightmapOffset);
                            paperExtension.dirty = false;
                        }
                        else {
                            console.debug("Error light map scale and offset.");
                        }
                        break;
                    case gltf.UniformSemanticType._LIGHTMAPUV:
                        webgl.uniform1f(location, context.lightmapUV);
                        paperExtension.dirty = false;
                        break;
                    case gltf.UniformSemanticType._BONESVEC4:
                        webgl.uniform4fv(location, context.boneData);
                        paperExtension.dirty = false;
                        break;
                    case gltf.UniformSemanticType._REFERENCEPOSITION:
                        webgl.uniform4fv(location, context.lightPosition);
                        paperExtension.dirty = false;
                        break;
                    case gltf.UniformSemanticType._NEARDICTANCE:
                        webgl.uniform1f(location, context.lightShadowCameraNear);
                        paperExtension.dirty = false;
                        break;
                    case gltf.UniformSemanticType._FARDISTANCE:
                        webgl.uniform1f(location, context.lightShadowCameraFar);
                        paperExtension.dirty = false;
                        break;
                }
            }
        }

        private _updateUniforms(context: RenderContext, material: Material, technique: gltf.Technique, forceUpdate: boolean) {
            const needUpdate = this._cacheMaterial !== material || this._cacheMaterialVerision !== material.version || forceUpdate;
            if (!needUpdate) {
                return;
            }

            this._cacheMaterial = material;
            this._cacheMaterialVerision = material.version;
            const webgl = this._webgl;
            for (const key in technique.uniforms) {
                const uniform = technique.uniforms[key];
                const paperExtension = uniform.extensions.paper;
                if (!paperExtension.dirty || !paperExtension.enable) {
                    continue;
                }
                
                const location = uniform.extensions.paper.location;
                const value = uniform.value;
                switch (uniform.type) {
                    case gltf.UniformType.BOOL:
                    case gltf.UniformType.Int:
                        if (uniform.count && uniform.count > 1) {
                            webgl.uniform1iv(location, value);
                        }
                        else {
                            webgl.uniform1i(location, value);
                        }
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
                        if (uniform.count && uniform.count > 1) {
                            webgl.uniform1fv(location, value);
                        }
                        else {
                            webgl.uniform1f(location, value);
                        }
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
                        if (paperExtension.textureUnits && paperExtension.textureUnits.length === 1) {
                            const unit = paperExtension.textureUnits[0];
                            webgl.uniform1i(location, unit);
                            webgl.activeTexture(webgl.TEXTURE0 + unit);
                            webgl.bindTexture(webgl.TEXTURE_2D, (value as Texture).glTexture.texture);
                        }
                        else {
                            console.error("Error texture unit");
                        }
                        break;
                }

                paperExtension.dirty = false;
            }
        }

        private _updateAttributes(mesh: Mesh, subMeshIndex: number, technique: gltf.Technique, forceUpdate: boolean) {
            const needUpdate = this._cacheMesh !== mesh || this._cacheMeshVersion !== mesh._version || forceUpdate;
            if (!needUpdate) {
                return;
            }

            this._cacheMesh = mesh;
            this._cacheMeshVersion = mesh._version;
            if (0 <= subMeshIndex && subMeshIndex < mesh.glTFMesh.primitives.length) {
                const glTFAsset = mesh.glTFAsset;
                const primitive = mesh.glTFMesh.primitives[subMeshIndex];
                const ibo = mesh.ibos[subMeshIndex];

                const gl = this._webgl;
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
        private _drawCall(mesh: Mesh, drawCall: DrawCall) {
            const webgl = this._webgl;
            const primitive = mesh.glTFMesh.primitives[drawCall.subMeshIndex];
            const vertexAccessor = mesh.glTFAsset.getAccessor(primitive.attributes.POSITION);
            const bufferOffset = mesh.glTFAsset.getBufferOffset(vertexAccessor);

            if (primitive.indices !== undefined) {
                const indexAccessor = mesh.glTFAsset.getAccessor(primitive.indices);
                switch (primitive.mode) { // TODO
                    case gltf.MeshPrimitiveMode.Lines:
                        webgl.drawElements(webgl.LINES, indexAccessor.count, webgl.UNSIGNED_SHORT, bufferOffset);
                        break;
                    case gltf.MeshPrimitiveMode.Triangles:
                    default:
                        webgl.drawElements(webgl.TRIANGLES, indexAccessor.count, webgl.UNSIGNED_SHORT, bufferOffset);
                        break;
                }
            }
            else {
                switch (primitive.mode) {
                    case gltf.MeshPrimitiveMode.Lines:
                        webgl.drawArrays(webgl.LINES, bufferOffset, vertexAccessor.count);
                        break;
                    case gltf.MeshPrimitiveMode.LineLoop:
                        webgl.drawArrays(webgl.LINE_LOOP, bufferOffset, vertexAccessor.count);
                        break;
                    case gltf.MeshPrimitiveMode.LineStrip:
                        webgl.drawArrays(webgl.LINE_STRIP, bufferOffset, vertexAccessor.count);
                        break;
                    case gltf.MeshPrimitiveMode.Triangles:
                    default:
                        webgl.drawArrays(webgl.TRIANGLES, bufferOffset, vertexAccessor.count);
                        break;
                }
            }
        }
        private _renderCall(context: RenderContext, drawCall: DrawCall) {
            const renderer = drawCall.renderer;
            context.drawCall = drawCall;
            context.updateModel(drawCall.matrix || renderer.gameObject.transform.getWorldMatrix());
            if(drawCall.boneData){
                context.updateBones(drawCall.boneData);
            }
            //
            const material = drawCall.shadow || drawCall.material;
            const technique = material._gltfTechnique;
            //Defines
            this._updateContextDefines(context, material);
            //Program
            const program = WebGLKit.getProgram(context, material, technique, this._cacheDefines);
            //State
            this._updateState(technique.states);
            //Use Program
            let force = false;
            if(this._cacheProgram !== program){
                this._cacheProgram = program;
                this._webgl.useProgram(program);
                force = true;
            }
            //Uniform
            this._updateContextUniforms(context, material, technique, force);
            this._updateUniforms(context, material, technique, force);
            //Attribute
            this._updateAttributes(drawCall.mesh, drawCall.subMeshIndex, technique, force);
            //Draw
            this._drawCall(drawCall.mesh, drawCall);
        }
        /**
         * @internal
         * @param camera 
         */
        public _renderCamera(camera: Camera) {
            //在这里先剔除，然后排序，最后绘制
            const drawCalls = this._drawCalls;
            drawCalls.sortAfterFrustumCulling(camera);

            const opaqueCalls = drawCalls.opaqueCalls;
            const transparentCalls = drawCalls.transparentCalls;

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
        /**
         * @internal
         * @param light
         */
        public _renderLightShadow(light: BaseLight) {
            const camera = this._lightCamera;
            const drawCalls = this._drawCalls;
            const faceCount = light.type === LightType.Point ? 6 : 1;

            for (let i = 0; i < faceCount; ++i) {
                (light.renderTarget as GlRenderTargetCube).activeCubeFace = i; // TODO 创建接口。
                light.update(camera, i);
                camera._targetAndViewport(light.renderTarget, false);
                // render shadow
                const context = camera.context;
                context.updateCamera(camera, light.matrix);
                context.updateLightDepth(light);

                drawCalls.shadowFrustumCulling(camera);

                const shadowMaterial = light.type === LightType.Point ? egret3d.DefaultMaterial.SHADOW_DISTANCE : egret3d.DefaultMaterial.SHADOW_DEPTH;
                for (const drawCall of drawCalls.shadowCalls) {
                    //TODO, 现在不支持蒙皮动画阴影
                    // let drawType = "base";
                    // if (drawCall.boneData) {
                    //     context.updateBones(drawCall.boneData);
                    //     drawType = "skin";
                    // }
                    drawCall.shadow = shadowMaterial;
                    this._renderCall(context, drawCall);
                    drawCall.shadow = undefined;
                }
            }

            GlRenderTarget.useNull(WebGLKit.webgl);
        }

        public onUpdate() {
            //Lights
            const lights = this._groups[2].components as BaseLight[];
            if (lights.length > 0) {
                for (const light of lights) {
                    if (!light.castShadows) {
                        continue;
                    }
                    this._renderLightShadow(light);
                }
            }
            //Cameras
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
                this._webgl.clearColor(0, 0, 0, 1);
                this._webgl.clearDepth(1.0);
                this._webgl.clear(WebGLKit.webgl.COLOR_BUFFER_BIT | WebGLKit.webgl.DEPTH_BUFFER_BIT);
            }
        }
    }
}