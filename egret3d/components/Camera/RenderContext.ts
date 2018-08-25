namespace egret3d {

    /**
     * 缓存场景通用数据
     * 包括矩阵信息，灯光，光照贴图，viewport尺寸等等
     */
    export class RenderContext {
        public readonly DIRECT_LIGHT_SIZE: number = 12;
        public readonly POINT_LIGHT_SIZE: number = 15;
        public readonly SPOT_LIGHT_SIZE: number = 18;
        /**
         * 
         */
        public version: number = 0;
        /**
         * 
         */
        public lightCount: number = 0;
        public directLightCount: number = 0;
        public pointLightCount: number = 0;
        public spotLightCount: number = 0;

        public shaderContextDefine: string = "";
        /**
         * 
         */
        public lightmap: Texture | null = null;
        public lightmapUV: number = 1;
        public lightmapIntensity: number = 1.0;
        public lightmapOffset: Float32Array | null = null;

        public boneData: Float32Array | null = null;

        // 15: x, y, z, dirX, dirY, dirZ, colorR, colorG, colorB, intensity, shadow, shadowBias, shadowRadius, shadowMapSizeX, shadowMapSizeY
        public directLightArray: Float32Array = new Float32Array(0);
        // 19: x, y, z, dirX, dirY, dirZ, colorR, colorG, colorB, intensity, distance, decay, shadow, shadowBias, shadowRadius, shadowCameraNear, shadowCameraFar, shadowMapSizeX, shadowMapSizeY
        public pointLightArray: Float32Array = new Float32Array(0);
        // 19: x, y, z, dirX, dirY, dirZ, colorR, colorG, colorB, intensity, distance, decay, coneCos, penumbraCos, shadow, shadowBias, shadowRadius, shadowMapSizeX, shadowMapSizeY
        public spotLightArray: Float32Array = new Float32Array(0);
        public directShadowMatrix: Float32Array = new Float32Array(0);
        public spotShadowMatrix: Float32Array = new Float32Array(0);
        public pointShadowMatrix: Float32Array = new Float32Array(0);//TODO
        public readonly matrix_m: Matrix4 = new Matrix4();
        public readonly matrix_mvp: Matrix4 = new Matrix4();
        public readonly directShadowMaps: (WebGLTexture | null)[] = [];
        public readonly pointShadowMaps: (WebGLTexture | null)[] = [];
        public readonly spotShadowMaps: (WebGLTexture | null)[] = [];
        public readonly ambientLightColor: Float32Array = new Float32Array([0, 0, 0]);

        public readonly viewPortPixel: IRectangle = { x: 0, y: 0, w: 0, h: 0 };

        //
        public readonly cameraPosition: Float32Array = new Float32Array(3);
        public readonly cameraForward: Float32Array = new Float32Array(3);
        public readonly cameraUp: Float32Array = new Float32Array(3);


        // transforms
        public readonly matrix_v: Matrix4 = new Matrix4();
        public readonly matrix_p: Matrix4 = new Matrix4();
        public readonly matrix_mv: Matrix4 = new Matrix4();
        public readonly matrix_vp: Matrix4 = new Matrix4();
        public readonly matrix_mv_inverse: Matrix3 = new Matrix3();//INVERS

        public updateLightmap(texture: Texture, uv: number, offset: Float32Array, intensity: number) {
            this.lightmap = texture;
            this.lightmapUV = uv;
            this.lightmapOffset = offset;
            this.lightmapIntensity = intensity;
            this.version++;
        }

        public updateCamera(camera: Camera, matrix: Matrix4) {
            camera.calcViewPortPixel(this.viewPortPixel); // update viewport
            camera.calcProjectMatrix(this.viewPortPixel.w / this.viewPortPixel.h, this.matrix_p);

            this.matrix_v.inverse(matrix);
            this.matrix_vp.multiply(this.matrix_p, this.matrix_v);

            const rawData = matrix.rawData;

            if (this.cameraPosition[0] !== rawData[12] ||
                this.cameraPosition[1] !== rawData[13] ||
                this.cameraPosition[2] !== rawData[14]) {
                this.cameraPosition[0] = rawData[12];
                this.cameraPosition[1] = rawData[13];
                this.cameraPosition[2] = rawData[14];
                this.version++;
            }

            if (this.cameraUp[0] !== rawData[4] ||
                this.cameraUp[1] !== rawData[5] ||
                this.cameraUp[2] !== rawData[6]) {
                this.cameraUp[0] = rawData[4];
                this.cameraUp[1] = rawData[5];
                this.cameraUp[2] = rawData[6];
                this.version++;
            }

            if (this.cameraForward[0] !== rawData[8] ||
                this.cameraForward[1] !== rawData[9] ||
                this.cameraForward[2] !== rawData[10]) {
                this.cameraForward[0] = -rawData[8];
                this.cameraForward[1] = -rawData[9];
                this.cameraForward[2] = -rawData[10];
                this.version++;
            }
        }

        public updateLights(lights: ReadonlyArray<BaseLight>, ambientLightColor: Color) {
            let allLightCount = 0, directLightCount = 0, pointLightCount = 0, spotLightCount = 0;
            if (lights.length > 0) {
                this.ambientLightColor[0] = ambientLightColor.r;
                this.ambientLightColor[1] = ambientLightColor.g;
                this.ambientLightColor[2] = ambientLightColor.b;
            }

            for (const light of lights) { // TODO 如何 灯光组件关闭，此处有何影响。

                if (light instanceof DirectionalLight) {
                    directLightCount++;
                }
                else if (light instanceof PointLight) {
                    pointLightCount++;
                }
                else if (light instanceof SpotLight) {
                    spotLightCount++;
                }

                allLightCount++;
            }

            // TODO
            if (this.directLightArray.length !== directLightCount * this.DIRECT_LIGHT_SIZE) {
                this.directLightArray = new Float32Array(directLightCount * this.DIRECT_LIGHT_SIZE);
            }

            if (this.pointLightArray.length !== pointLightCount * this.POINT_LIGHT_SIZE) {
                this.pointLightArray = new Float32Array(pointLightCount * this.POINT_LIGHT_SIZE);
            }

            if (this.spotLightArray.length !== spotLightCount * this.SPOT_LIGHT_SIZE) {
                this.spotLightArray = new Float32Array(spotLightCount * this.SPOT_LIGHT_SIZE);
            }

            if (this.directShadowMatrix.length !== directLightCount * 16) {
                this.directShadowMatrix = new Float32Array(directLightCount * 16);
            }

            if (this.spotShadowMatrix.length !== spotLightCount * 16) {
                this.spotShadowMatrix = new Float32Array(spotLightCount * 16);
            }

            this.directShadowMaps.length = directLightCount;
            this.pointShadowMaps.length = pointLightCount;
            this.spotShadowMaps.length = spotLightCount;

            this.lightCount = allLightCount;
            this.directLightCount = directLightCount;
            this.pointLightCount = pointLightCount;
            this.spotLightCount = spotLightCount;

            let directLightIndex = 0, pointLightIndex = 0, spotLightIndex = 0, index = 0;
            let lightArray = this.directLightArray;

            for (const light of lights) {
                const position = light.gameObject.transform.getPosition();
                dirHelper.applyDirection(this.matrix_v, position).normalize();

                switch (light.constructor) {
                    case DirectionalLight: {
                        lightArray = this.directLightArray;
                        index = directLightIndex * this.DIRECT_LIGHT_SIZE;
                        lightArray[index++] = dirHelper.x;
                        lightArray[index++] = dirHelper.y;
                        lightArray[index++] = dirHelper.z;

                        lightArray[index++] = light.color.r * light.intensity;
                        lightArray[index++] = light.color.g * light.intensity;
                        lightArray[index++] = light.color.b * light.intensity;
                        break;
                    }

                    case PointLight: {
                        lightArray = this.pointLightArray;
                        index = pointLightIndex * this.POINT_LIGHT_SIZE;

                        lightArray[index++] = position.x;
                        lightArray[index++] = position.y;
                        lightArray[index++] = position.z;

                        lightArray[index++] = light.color.r * light.intensity;
                        lightArray[index++] = light.color.g * light.intensity;
                        lightArray[index++] = light.color.b * light.intensity;

                        lightArray[index++] = (light as PointLight).distance;
                        lightArray[index++] = (light as PointLight).decay;
                        break;
                    }

                    case SpotLight: {
                        lightArray = this.spotLightArray;
                        index = spotLightIndex * this.SPOT_LIGHT_SIZE;

                        lightArray[index++] = position.x;
                        lightArray[index++] = position.y;
                        lightArray[index++] = position.z;

                        lightArray[index++] = dirHelper.x;
                        lightArray[index++] = dirHelper.y;
                        lightArray[index++] = dirHelper.z;

                        lightArray[index++] = light.color.r * light.intensity;
                        lightArray[index++] = light.color.g * light.intensity;
                        lightArray[index++] = light.color.b * light.intensity;

                        lightArray[index++] = (light as SpotLight).distance;
                        lightArray[index++] = (light as SpotLight).decay;
                        lightArray[index++] = Math.cos((light as SpotLight).angle);
                        lightArray[index++] = Math.cos((light as SpotLight).angle * (1 - (light as SpotLight).penumbra));
                        break;
                    }
                }

                if (light.castShadows) {
                    lightArray[index++] = 1;
                    lightArray[index++] = light.shadowBias;
                    lightArray[index++] = light.shadowRadius;
                    lightArray[index++] = light.shadowSize;
                    lightArray[index++] = light.shadowSize;

                    switch (light.constructor) {
                        case DirectionalLight:
                            this.directShadowMatrix.set(light.matrix.rawData, directLightIndex * 16);
                            this.directShadowMaps[directLightIndex++] = light.renderTarget.texture;
                            break;

                        case PointLight:
                            lightArray[index++] = light.shadowCameraNear;
                            lightArray[index++] = light.shadowCameraFar;
                            this.pointShadowMatrix.set(light.matrix.rawData, pointLightIndex * 16);
                            this.pointShadowMaps[pointLightIndex++] = light.renderTarget.texture;
                            break;

                        case SpotLight:
                            this.spotShadowMatrix.set(light.matrix.rawData, spotLightIndex * 16);
                            this.spotShadowMaps[spotLightIndex++] = light.renderTarget.texture;
                            break;
                    }
                }
                else {
                    lightArray[index++] = 0;
                    lightArray[index++] = 0;
                    lightArray[index++] = 0;
                    lightArray[index++] = 0;

                    switch (light.constructor) {
                        case DirectionalLight:
                            this.directShadowMaps[directLightIndex++] = null;
                            break;

                        case PointLight:
                            lightArray[index++] = 0;
                            lightArray[index++] = 0;
                            this.pointShadowMaps[pointLightIndex++] = null;
                            break;

                        case SpotLight:
                            this.spotShadowMaps[spotLightIndex++] = null;
                            break;
                    }
                }
            }

            this.version++;
        }

        updateModel(matrix: Matrix4) {
            this.matrix_m.copy(matrix); // clone matrix because getWorldMatrix returns a reference
            this.matrix_mv.multiply(this.matrix_v, this.matrix_m);
            this.matrix_mvp.multiply(this.matrix_vp, this.matrix_m);


            this.matrix_mv_inverse.getNormalMatrix(this.matrix_mv);

            this.version++;
        }

        updateBones(data: Float32Array | null) {
            this.boneData = data;

            this.version++;
        }
        //TODO废弃
        public readonly lightPosition: Float32Array = new Float32Array([0.0, 0.0, 0.0, 1.0]);
        public lightShadowCameraNear: number = 0;
        public lightShadowCameraFar: number = 0;
        public updateLightDepth(light: BaseLight) {
            const position = light.gameObject.transform.getPosition();
            if (this.lightPosition[0] !== position.x ||
                this.lightPosition[1] !== position.y ||
                this.lightPosition[2] !== position.z) {
                this.lightPosition[0] = position.x;
                this.lightPosition[1] = position.y;
                this.lightPosition[2] = position.z;
                this.version++;
            }

            if (this.lightShadowCameraNear !== light.shadowCameraNear ||
                this.lightShadowCameraNear !== light.shadowCameraFar) {
                this.lightShadowCameraNear = light.shadowCameraNear;
                this.lightShadowCameraFar = light.shadowCameraFar;
                this.version++;
            }
        }

        public update(drawCall: DrawCall) {
            this.shaderContextDefine = "";
            const renderer = drawCall.renderer;
            this.updateModel(drawCall.matrix || renderer.gameObject.transform.getWorldMatrix());
            if (drawCall.boneData) {
                this.updateBones(drawCall.boneData);
                //this.shaderContextDefine += "#define SKINNING \n";
            }
            //
            if (renderer.lightmapIndex >= 0) {
                const activeScene = paper.Application.sceneManager.activeScene;
                if (activeScene.lightmaps.length > renderer.lightmapIndex) {
                    this.updateLightmap(
                        activeScene.lightmaps[renderer.lightmapIndex],
                        drawCall.mesh.glTFMesh.primitives[drawCall.subMeshIndex].attributes.TEXCOORD_1 ? 1 : 0,
                        renderer.lightmapScaleOffset,
                        activeScene.lightmapIntensity
                    );

                    this.shaderContextDefine += "#define USE_LIGHTMAP \n";
                }
            }

            if (this.lightCount > 0) {
                // this.shaderContextDefine += "#define USE_LIGHT " + this.lightCount + "\n";

                if (this.directLightCount > 0) {
                    this.shaderContextDefine += "#define NUM_DIR_LIGHTS " + this.directLightCount + "\n";
                }
                if (this.pointLightCount > 0) {
                    this.shaderContextDefine += "#define NUM_POINT_LIGHTS " + this.pointLightCount + "\n";
                }
                if (this.spotLightCount > 0) {
                    this.shaderContextDefine += "#define NUM_SPOT_LIGHTS " + this.spotLightCount + "\n";
                }
                if (renderer.receiveShadows) {
                    this.shaderContextDefine += "#define USE_SHADOWMAP \n";
                    this.shaderContextDefine += "#define USE_PCF_SOFT_SHADOW \n";
                }
            }
        }
    }

    let dirHelper: Vector3 = new Vector3();
}
