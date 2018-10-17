namespace egret3d {
    const enum LightSize {
        Directional = 11,
        Point = 15,
        Spot = 18,
    }
    const _helpVector3 = Vector3.create();
    /**
     * @internal
     */
    export class RenderContext {
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

        //TODO
        // 12: dirX, dirY, dirZ, colorR, colorG, colorB, shadow, shadowBias, shadowRadius, shadowMapSizeX, shadowMapSizeY
        public directLightArray: Float32Array = new Float32Array(0);
        // 16: x, y, z, colorR, colorG, colorB, distance, decay, shadow, shadowBias, shadowRadius, shadowMapSizeX, shadowMapSizeY, shadowCameraNear, shadowCameraFar,
        public pointLightArray: Float32Array = new Float32Array(0);
        // 18: x, y, z, dirX, dirY, dirZ, colorR, colorG, colorB, distance, decay, coneCos, penumbraCos, shadow, shadowBias, shadowRadius, shadowMapSizeX, shadowMapSizeY
        public spotLightArray: Float32Array = new Float32Array(0);
        public directShadowMatrix: Float32Array = new Float32Array(0);
        public spotShadowMatrix: Float32Array = new Float32Array(0);
        public pointShadowMatrix: Float32Array = new Float32Array(0);

        public readonly matrix_m: Matrix4 = Matrix4.create();
        public readonly matrix_mvp: Matrix4 = Matrix4.create();
        public readonly directShadowMaps: (WebGLTexture | null)[] = [];
        public readonly pointShadowMaps: (WebGLTexture | null)[] = [];
        public readonly spotShadowMaps: (WebGLTexture | null)[] = [];

        public readonly viewPortPixel: IRectangle = { x: 0, y: 0, w: 0, h: 0 };

        //
        public readonly cameraPosition: Float32Array = new Float32Array(3);
        public readonly cameraForward: Float32Array = new Float32Array(3);
        public readonly cameraUp: Float32Array = new Float32Array(3);


        // transforms
        public readonly matrix_v: Matrix4 = Matrix4.create();
        public readonly matrix_p: Matrix4 = Matrix4.create();
        public readonly matrix_mv: Matrix4 = Matrix4.create();
        public readonly matrix_vp: Matrix4 = Matrix4.create();
        public readonly matrix_mv_inverse: Matrix3 = new Matrix3();//INVERS

        public lightShadowCameraNear: number = 0;
        public lightShadowCameraFar: number = 0;
        public readonly lightPosition: Float32Array = new Float32Array([0.0, 0.0, 0.0]);

        public fogColor: Float32Array = new Float32Array(3);
        public fogDensity: number = 0.0;
        public fogNear: number = 0.0;
        public fogFar: number = 0.0;


        public drawCall: DrawCall = null!;

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
            }

            if (this.cameraUp[0] !== rawData[4] ||
                this.cameraUp[1] !== rawData[5] ||
                this.cameraUp[2] !== rawData[6]) {
                this.cameraUp[0] = rawData[4];
                this.cameraUp[1] = rawData[5];
                this.cameraUp[2] = rawData[6];
            }

            if (this.cameraForward[0] !== rawData[8] ||
                this.cameraForward[1] !== rawData[9] ||
                this.cameraForward[2] !== rawData[10]) {
                this.cameraForward[0] = -rawData[8];
                this.cameraForward[1] = -rawData[9];
                this.cameraForward[2] = -rawData[10];
            }
        }

        public updateLights(lights: ReadonlyArray<BaseLight>) {
            let allLightCount = 0, directLightCount = 0, pointLightCount = 0, spotLightCount = 0;

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
            if (this.directLightArray.length !== directLightCount * LightSize.Directional) {
                this.directLightArray = new Float32Array(directLightCount * LightSize.Directional);
            }

            if (this.pointLightArray.length !== pointLightCount * LightSize.Point) {
                this.pointLightArray = new Float32Array(pointLightCount * LightSize.Point);
            }

            if (this.spotLightArray.length !== spotLightCount * LightSize.Spot) {
                this.spotLightArray = new Float32Array(spotLightCount * LightSize.Spot);
            }

            if (this.directShadowMatrix.length !== directLightCount * 16) {
                this.directShadowMatrix = new Float32Array(directLightCount * 16);
            }

            if (this.pointShadowMatrix.length !== pointLightCount * 16) {
                this.pointShadowMatrix = new Float32Array(pointLightCount * 16);
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
                switch (light.constructor) {
                    case DirectionalLight: {
                        light.gameObject.transform.getForward(_helpVector3);
                        _helpVector3.applyDirection(this.matrix_v).normalize();

                        lightArray = this.directLightArray;
                        index = directLightIndex * LightSize.Directional;
                        // lightArray[index++] = dirHelper.x; // Right-hand.
                        // lightArray[index++] = dirHelper.y;
                        // lightArray[index++] = dirHelper.z;

                        lightArray[index++] = -_helpVector3.x; // Left-hand.
                        lightArray[index++] = -_helpVector3.y;
                        lightArray[index++] = -_helpVector3.z;

                        lightArray[index++] = light.color.r * light.intensity;
                        lightArray[index++] = light.color.g * light.intensity;
                        lightArray[index++] = light.color.b * light.intensity;
                        break;
                    }

                    case PointLight: {
                        const position = light.gameObject.transform.getPosition().clone().release();
                        position.applyMatrix(this.matrix_v);
                        lightArray = this.pointLightArray;
                        index = pointLightIndex * LightSize.Point;

                        lightArray[index++] = position.x;
                        lightArray[index++] = position.y;
                        lightArray[index++] = position.z;

                        lightArray[index++] = light.color.r * light.intensity;
                        lightArray[index++] = light.color.g * light.intensity;
                        lightArray[index++] = light.color.b * light.intensity;

                        const distance = (light as PointLight).distance;
                        lightArray[index++] = distance;
                        lightArray[index++] = distance === 0 ? 0 : (light as PointLight).decay;
                        break;
                    }

                    case SpotLight: {
                        const position = light.gameObject.transform.getPosition().clone().release();
                        position.applyMatrix(this.matrix_v);
                        light.gameObject.transform.getForward(_helpVector3);
                        _helpVector3.applyDirection(this.matrix_v).normalize();

                        lightArray = this.spotLightArray;
                        index = spotLightIndex * LightSize.Spot;

                        lightArray[index++] = position.x;
                        lightArray[index++] = position.y;
                        lightArray[index++] = position.z;

                        // lightArray[index++] = dirHelper.x; // Right-hand.
                        // lightArray[index++] = dirHelper.y;
                        // lightArray[index++] = dirHelper.z;

                        lightArray[index++] = -_helpVector3.x; // Left-hand.
                        lightArray[index++] = -_helpVector3.y;
                        lightArray[index++] = -_helpVector3.z;

                        lightArray[index++] = light.color.r * light.intensity;
                        lightArray[index++] = light.color.g * light.intensity;
                        lightArray[index++] = light.color.b * light.intensity;

                        const distance = (light as SpotLight).distance;
                        lightArray[index++] = distance;
                        lightArray[index++] = distance === 0 ? 0 : (light as SpotLight).decay;
                        lightArray[index++] = Math.cos((light as SpotLight).angle);
                        lightArray[index++] = Math.cos((light as SpotLight).angle * (1 - (light as SpotLight).penumbra));
                        break;
                    }
                }

                if (light.castShadows) {
                    lightArray[index++] = 1;
                    lightArray[index++] = -light.shadowBias; // Left-hand.
                    lightArray[index++] = light.shadowRadius;
                    lightArray[index++] = light.shadowSize;
                    lightArray[index++] = light.shadowSize;

                    switch (light.constructor) {
                        case DirectionalLight:
                            this.directShadowMatrix.set(light.shadowMatrix.rawData, directLightIndex * 16);
                            this.directShadowMaps[directLightIndex++] = light.renderTarget.texture;
                            break;

                        case PointLight:
                            lightArray[index++] = light.shadowCameraNear;
                            lightArray[index++] = light.shadowCameraFar;
                            this.pointShadowMatrix.set(light.shadowMatrix.rawData, pointLightIndex * 16);
                            this.pointShadowMaps[pointLightIndex++] = light.renderTarget.texture;
                            break;

                        case SpotLight:
                            this.spotShadowMatrix.set(light.shadowMatrix.rawData, spotLightIndex * 16);
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
        }

        public updateLightDepth(light: BaseLight) {
            const position = light.gameObject.transform.getPosition();
            //
            this.lightPosition[0] = position.x;
            this.lightPosition[1] = position.y;
            this.lightPosition[2] = position.z;
            //
            this.lightShadowCameraNear = light.shadowCameraNear;
            this.lightShadowCameraFar = light.shadowCameraFar;
        }

        public update(drawCall: DrawCall) {
            const renderer = drawCall.renderer;
            const scene = renderer.gameObject.scene;
            const matrix = drawCall.matrix || renderer.gameObject.transform.worldMatrix;
            this.drawCall = drawCall;
            this.matrix_m.copy(matrix); // clone matrix because getWorldMatrix returns a reference
            this.matrix_mv.multiply(this.matrix_v, this.matrix_m);
            this.matrix_mvp.multiply(this.matrix_vp, this.matrix_m);
            this.matrix_mv_inverse.getNormalMatrix(this.matrix_mv);
            //
            this.shaderContextDefine = "";

            if (
                renderer.lightmapIndex >= 0 &&
                scene.lightmaps.length > renderer.lightmapIndex
            ) {
                this.lightmap = scene.lightmaps[renderer.lightmapIndex];
                this.lightmapUV = drawCall.mesh.glTFMesh.primitives[drawCall.subMeshIndex].attributes.TEXCOORD_1 ? 1 : 0;
                this.lightmapIntensity = scene.lightmapIntensity;
                this.shaderContextDefine += "#define USE_LIGHTMAP \n";
            }

            if (this.lightCount > 0) {
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
                    this.shaderContextDefine += "#define SHADOWMAP_TYPE_PCF \n";
                }
            }
            
            const fog = scene.fog;
            if (fog.mode !== FogMode.NONE) {
                this.fogColor[0] = fog.color.r;
                this.fogColor[1] = fog.color.g;
                this.fogColor[2] = fog.color.b;

                this.shaderContextDefine += "#define USE_FOG \n";
                if (fog.mode === FogMode.FOG_EXP2) {
                    this.fogDensity = fog.density;
                    this.shaderContextDefine += "#define FOG_EXP2 \n";
                }
                else {
                    this.fogNear = fog.near;
                    this.fogFar = fog.far;
                }
            }
        }
    }
}
