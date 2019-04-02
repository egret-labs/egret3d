namespace egret3d {

    const enum LightSize {
        Directional = 11,
        Spot = 18,
        RectangleArea = 12,
        Point = 15,
        Hemisphere = 9,
    }

    const enum ShadowSize {
        Directional = 16,
        Spot = 16,
        Point = 16,
    }
    /**
     * 相机渲染上下文。
     */
    export class CameraRenderContext {
        /**
         * @internal
         */
        public static create(camera: Camera) {
            return new CameraRenderContext(camera);
        }
        /**
         * 
         */
        public logDepthBufFC: number = 0.0;
        /**
         * 12: dirX, dirY, dirZ, colorR, colorG, colorB, shadow, shadowBias, shadowRadius, shadowMapSizeX, shadowMapSizeY
         * @internal
         */
        public directLightBuffer: Float32Array = new Float32Array(0);
        /**
         * 18: x, y, z, dirX, dirY, dirZ, colorR, colorG, colorB, distance, decay, coneCos, penumbraCos, shadow, shadowBias, shadowRadius, shadowMapSizeX, shadowMapSizeY
         * @internal
         */
        public spotLightBuffer: Float32Array = new Float32Array(0);
        /**
         * @internal
         */
        public rectangleAreaLightBuffer: Float32Array = new Float32Array(0);
        /**
         * 16: x, y, z, colorR, colorG, colorB, distance, decay, shadow, shadowBias, shadowRadius, shadowMapSizeX, shadowMapSizeY, shadowCameraNear, shadowCameraFar,
         * @internal
         */
        public pointLightBuffer: Float32Array = new Float32Array(0);
        /**
         * @internal
         */
        public hemisphereLightBuffer: Float32Array = new Float32Array(0);
        /**
         * @internal
         */
        public directShadowMatrix: Float32Array = new Float32Array(0);
        /**
         * @internal
         */
        public spotShadowMatrix: Float32Array = new Float32Array(0);
        /**
         * @internal
         */
        public pointShadowMatrix: Float32Array = new Float32Array(0);
        /**
         * @internal
         */
        public readonly directShadowMaps: (WebGLTexture | null)[] = [];
        /**
         * @internal
         */
        public readonly spotShadowMaps: (WebGLTexture | null)[] = [];
        /**
         * @internal
         */
        public readonly pointShadowMaps: (WebGLTexture | null)[] = [];
        /**
         * 此帧的非透明绘制信息列表。
         * - 已进行视锥剔除的。
         * TODO
         */
        public readonly opaqueCalls: DrawCall[] = [];
        /**
         * 此帧的透明绘制信息列表。
         * - 已进行视锥剔除的。
         * TODO
         */
        public readonly transparentCalls: DrawCall[] = [];
        /**
         * 此帧的阴影绘制信息列表。
         * - 已进行视锥剔除的。
         * @internal
         */
        public readonly shadowCalls: DrawCall[] = [];

        private readonly _drawCallCollecter: DrawCallCollecter = paper.Application.sceneManager.globalEntity.getComponent(DrawCallCollecter)!;
        private readonly _cameraAndLightCollecter: CameraAndLightCollecter = paper.Application.sceneManager.globalEntity.getComponent(CameraAndLightCollecter)!;
        private readonly _camera: Camera = null!;
        /**
         * 禁止实例化。
         */
        private constructor(camera: Camera) {
            this._camera = camera;
        }
        /**
         * 所有非透明的, 按照从近到远排序
         */
        private _sortOpaque(a: DrawCall, b: DrawCall) {
            const materialA = a.material!;
            const materialB = b.material!;

            if (materialA._renderQueue !== materialB._renderQueue) {
                return materialA._renderQueue - materialB._renderQueue;
            }
            else if (materialA._technique.program !== materialB._technique.program) {//着色器不同，避免频繁切换
                return materialA._technique.program! - materialB._technique.program!;
            }
            else if (materialA._id !== materialB._id) {
                return materialA._id - materialB._id;
            }
            else if (a.mesh._id !== b.mesh._id) {//为了实例化，这里mesh也排序下
                return a.mesh._id - b.mesh._id;
            }
            else {
                return a.zdist - b.zdist;
            }
        }
        /**
         * 所有透明的，按照从远到近排序
         */
        private _sortFromFarToNear(a: DrawCall, b: DrawCall) {
            const materialA = a.material!;
            const materialB = b.material!;

            if (materialA._renderQueue === materialB._renderQueue) {
                return b.zdist - a.zdist;
            }
            else {
                return materialA._renderQueue - materialB._renderQueue;
            }
        }

        private _shadowFrustumCulling() {
            const cullingMask = cameraAndLightCollecter.currentCamera!.cullingMask; // TODO 全局相机
            const camera = this._camera;
            const cameraFrustum = camera.frustum;
            const shadowCalls = this.shadowCalls;

            let shadowIndex = 0;

            for (const drawCall of this._drawCallCollecter.drawCalls) {
                const renderer = drawCall!.renderer!;

                if (!renderer.castShadows) {
                    continue;
                }

                const layer = renderer.gameObject.layer;

                if (
                    renderer.castShadows &&
                    (cullingMask & layer) !== 0 &&
                    // (camera.cullingMask & layer) !== 0 && TODO light cullingMask
                    (!renderer.frustumCulled || math.frustumIntersectsSphere(cameraFrustum, renderer.boundingSphere))
                ) {
                    shadowCalls[shadowIndex++] = drawCall!;
                }
            }

            if (shadowCalls.length !== shadowIndex) {
                shadowCalls.length = shadowIndex;
            }

            shadowCalls.sort(this._sortFromFarToNear);
        }

        private _frustumCulling() {
            const camera = this._camera;
            const cameraPosition = camera.gameObject.transform.position;
            const cameraFrustum = camera.frustum;
            const opaqueCalls = this.opaqueCalls;
            const transparentCalls = this.transparentCalls;

            let opaqueIndex = 0;
            let transparentIndex = 0;

            for (const drawCall of this._drawCallCollecter.drawCalls) {
                const renderer = drawCall!.renderer!;
                if (
                    (camera.cullingMask & renderer.gameObject.layer) !== 0 &&
                    (!renderer.frustumCulled || math.frustumIntersectsSphere(cameraFrustum, renderer.boundingSphere))
                ) {
                    // if (drawCall.material.renderQueue >= paper.RenderQueue.Transparent && drawCall.material.renderQueue <= paper.RenderQueue.Overlay) {
                    if (drawCall!.material!._renderQueue >= RenderQueue.Mask) {
                        transparentCalls[transparentIndex++] = drawCall!;
                    }
                    else {
                        opaqueCalls[opaqueIndex++] = drawCall!;
                    }

                    drawCall!.zdist = Vector3.create().fromMatrixPosition(drawCall!.matrix).getSquaredDistance(cameraPosition);
                }
            }

            if (opaqueCalls.length !== opaqueIndex) {
                opaqueCalls.length = opaqueIndex;
            }

            if (transparentCalls.length !== transparentIndex) {
                transparentCalls.length = transparentIndex;
            }

            opaqueCalls.sort(this._sortOpaque); // TODO 优化，没必要一定每帧排序。
            transparentCalls.sort(this._sortFromFarToNear);
        }

        private _updateLights() {
            const { directionalLights, spotLights, rectangleAreaLights, pointLights, hemisphereLights } = this._cameraAndLightCollecter;
            const directLightCount = directionalLights.length;
            const spotLightCount = spotLights.length;
            const rectangleAreaLightCount = rectangleAreaLights.length;
            const pointLightCount = pointLights.length;
            const hemisphereLightCount = hemisphereLights.length;
            const renderStateCaches = renderState.caches;
            renderStateCaches.castShadows = false;
            //
            if (this.directLightBuffer.length !== directLightCount * LightSize.Directional) {
                this.directLightBuffer = new Float32Array(directLightCount * LightSize.Directional);
            }

            if (this.spotLightBuffer.length !== spotLightCount * LightSize.Spot) {
                this.spotLightBuffer = new Float32Array(spotLightCount * LightSize.Spot);
            }

            if (this.rectangleAreaLightBuffer.length !== rectangleAreaLightCount * LightSize.RectangleArea) {
                this.rectangleAreaLightBuffer = new Float32Array(rectangleAreaLightCount * LightSize.RectangleArea);
            }

            if (this.pointLightBuffer.length !== pointLightCount * LightSize.Point) {
                this.pointLightBuffer = new Float32Array(pointLightCount * LightSize.Point);
            }

            if (this.hemisphereLightBuffer.length !== hemisphereLightCount * LightSize.Hemisphere) {
                this.hemisphereLightBuffer = new Float32Array(hemisphereLightCount * LightSize.Hemisphere);
            }
            //
            if (this.directShadowMatrix.length !== directLightCount * ShadowSize.Directional) {
                this.directShadowMatrix = new Float32Array(directLightCount * ShadowSize.Directional);
            }

            if (this.spotShadowMatrix.length !== spotLightCount * ShadowSize.Spot) {
                this.spotShadowMatrix = new Float32Array(spotLightCount * ShadowSize.Spot);
            }

            if (this.pointShadowMatrix.length !== pointLightCount * ShadowSize.Point) {
                this.pointShadowMatrix = new Float32Array(pointLightCount * ShadowSize.Point);
            }
            //
            const {
                directLightBuffer, spotLightBuffer, rectangleAreaLightBuffer, pointLightBuffer, hemisphereLightBuffer,
                directShadowMatrix, spotShadowMatrix, pointShadowMatrix,
                directShadowMaps, spotShadowMaps, pointShadowMaps,
            } = this;

            if (directShadowMaps.length !== directLightCount) {
                directShadowMaps.length = directLightCount;
            }

            if (spotShadowMaps.length !== spotLightCount) {
                spotShadowMaps.length = spotLightCount;
            }

            if (pointShadowMaps.length !== pointLightCount) {
                pointShadowMaps.length = pointLightCount;
            }

            let index = 0, shadowIndex = 0, offset = 0;
            const helpVector3 = egret3d.Vector3.create().release();
            const worldToCameraMatrix = this._camera.worldToCameraMatrix;

            for (const light of directionalLights) {
                const intensity = light.intensity;
                const color = light.color;
                offset = (index++) * LightSize.Directional;
                //
                light.gameObject.transform.getForward(helpVector3).applyDirection(worldToCameraMatrix);
                directLightBuffer[offset++] = -helpVector3.x; // Left-hand.
                directLightBuffer[offset++] = -helpVector3.y;
                directLightBuffer[offset++] = -helpVector3.z;
                //
                directLightBuffer[offset++] = color.r * intensity;
                directLightBuffer[offset++] = color.g * intensity;
                directLightBuffer[offset++] = color.b * intensity;
                //
                if (light.castShadows) {
                    const shadow = light.shadow;
                    directLightBuffer[offset++] = 1;
                    directLightBuffer[offset++] = shadow.bias;
                    directLightBuffer[offset++] = shadow.radius;
                    directLightBuffer[offset++] = shadow.mapSize;
                    directLightBuffer[offset++] = shadow.mapSize;
                    directShadowMatrix.set(shadow._matrix.rawData, shadowIndex * ShadowSize.Directional);
                    directShadowMaps[shadowIndex++] = shadow._renderTarget;
                    renderStateCaches.castShadows = true;
                }
                else {
                    directLightBuffer[offset++] = 0;
                }
            }

            index = shadowIndex = 0;
            for (const light of spotLights) {
                const intensity = light.intensity;
                const distance = light.distance;
                const color = light.color;
                offset = (index++) * LightSize.Spot;
                //
                helpVector3.applyMatrix(worldToCameraMatrix, light.gameObject.transform.position);
                spotLightBuffer[offset++] = helpVector3.x;
                spotLightBuffer[offset++] = helpVector3.y;
                spotLightBuffer[offset++] = helpVector3.z;
                //
                light.gameObject.transform.getForward(helpVector3).applyDirection(worldToCameraMatrix);
                spotLightBuffer[offset++] = -helpVector3.x; // Left-hand.
                spotLightBuffer[offset++] = -helpVector3.y;
                spotLightBuffer[offset++] = -helpVector3.z;
                //
                spotLightBuffer[offset++] = color.r * intensity;
                spotLightBuffer[offset++] = color.g * intensity;
                spotLightBuffer[offset++] = color.b * intensity;
                //
                spotLightBuffer[offset++] = distance;
                spotLightBuffer[offset++] = distance === 0 ? 0 : light.decay;
                spotLightBuffer[offset++] = Math.cos(light.angle);
                spotLightBuffer[offset++] = Math.cos(light.angle * (1.0 - light.penumbra));
                //
                if (light.castShadows) {
                    const shadow = light.shadow;
                    spotLightBuffer[offset++] = 1;
                    spotLightBuffer[offset++] = shadow.bias;
                    spotLightBuffer[offset++] = shadow.radius;
                    spotLightBuffer[offset++] = shadow.mapSize;
                    spotLightBuffer[offset++] = shadow.mapSize;
                    spotShadowMatrix.set(shadow._matrix.rawData, shadowIndex * ShadowSize.Spot);
                    spotShadowMaps[shadowIndex++] = shadow._renderTarget;
                    renderStateCaches.castShadows = true;
                }
                else {
                    spotLightBuffer[offset++] = 0;
                }
            }

            index = shadowIndex = 0;
            for (const light of rectangleAreaLights) {
                const intensity = light.intensity;
                const color = light.color;
                offset = (index++) * LightSize.RectangleArea;
                //
                helpVector3.applyMatrix(worldToCameraMatrix, light.gameObject.transform.position);
                rectangleAreaLightBuffer[offset++] = helpVector3.x;
                rectangleAreaLightBuffer[offset++] = helpVector3.y;
                rectangleAreaLightBuffer[offset++] = helpVector3.z;
                //
                rectangleAreaLightBuffer[offset++] = color.r * intensity;
                rectangleAreaLightBuffer[offset++] = color.g * intensity;
                rectangleAreaLightBuffer[offset++] = color.b * intensity;
                // TODO 不支持阴影，防止贴图报错
                light.castShadows = false;
            }

            index = shadowIndex = 0;
            for (const light of pointLights) {
                const intensity = light.intensity;
                const distance = light.distance;
                const color = light.color;
                offset = (index++) * LightSize.Point;
                //
                helpVector3.applyMatrix(worldToCameraMatrix, light.gameObject.transform.position);
                pointLightBuffer[offset++] = helpVector3.x;
                pointLightBuffer[offset++] = helpVector3.y;
                pointLightBuffer[offset++] = helpVector3.z;
                //
                pointLightBuffer[offset++] = color.r * intensity;
                pointLightBuffer[offset++] = color.g * intensity;
                pointLightBuffer[offset++] = color.b * intensity;
                //
                pointLightBuffer[offset++] = distance;
                pointLightBuffer[offset++] = distance === 0.0 ? 0.0 : light.decay;
                //
                if (light.castShadows) {
                    const shadow = light.shadow;
                    pointLightBuffer[offset++] = 1;
                    pointLightBuffer[offset++] = shadow.bias;
                    pointLightBuffer[offset++] = shadow.radius;
                    pointLightBuffer[offset++] = shadow.mapSize;
                    pointLightBuffer[offset++] = shadow.mapSize;
                    pointLightBuffer[offset++] = shadow.near;
                    pointLightBuffer[offset++] = shadow.far;

                    pointShadowMatrix.set(shadow._matrix.rawData, shadowIndex * ShadowSize.Point);
                    pointShadowMaps[shadowIndex++] = shadow._renderTarget;
                    renderStateCaches.castShadows = true;
                }
                else {
                    pointLightBuffer[offset++] = 0;
                }
            }

            index = shadowIndex = 0;
            for (const light of hemisphereLights) {
                const intensity = light.intensity;
                const color = light.color;
                const groundColor = light.groundColor;
                offset = (index++) * LightSize.Hemisphere;
                //
                light.gameObject.transform.getForward(helpVector3).applyDirection(worldToCameraMatrix);
                hemisphereLightBuffer[offset++] = -helpVector3.x; // Left-hand.
                hemisphereLightBuffer[offset++] = -helpVector3.y;
                hemisphereLightBuffer[offset++] = -helpVector3.z;
                //
                hemisphereLightBuffer[offset++] = color.r * intensity;
                hemisphereLightBuffer[offset++] = color.g * intensity;
                hemisphereLightBuffer[offset++] = color.b * intensity;
                //
                hemisphereLightBuffer[offset++] = groundColor.r * intensity;
                hemisphereLightBuffer[offset++] = groundColor.g * intensity;
                hemisphereLightBuffer[offset++] = groundColor.b * intensity;

                light.castShadows = false;//TODO 不支持阴影，防止贴图报错
            }
        }
        private _combineInstanced(drawCalls: DrawCall[]) {
            const camera = this._camera;
            // const combineDrawCalls: { [key: string]: egret3d.DrawCall[] } = {};TODO正常的动态合并
            const combineInstanced: { [key: string]: egret3d.DrawCall[] } = {};
            //collect
            for (let i = drawCalls.length - 1; i >= 0; i--) {
                const drawCall = drawCalls[i];
                const renderer = drawCall.renderer;
                if (!renderer) {
                    continue;
                }
                //TODO 考虑lightmap
                const material = drawCall.material;
                const mesh = drawCall.mesh;
                const key = material.uuid + "_" + mesh.uuid + "_" + drawCall.subMeshIndex;

                if (!combineInstanced[key]) {
                    combineInstanced[key] = [];
                }

                combineInstanced[key].unshift(drawCall);
                drawCalls.splice(i, 1);
            }
            //combine
            for (const key in combineInstanced) {
                const calls = combineInstanced[key];

                //
                const drawCall = calls[0];
                const orginMesh = drawCall.mesh;
                const indice = orginMesh.getIndices(drawCall.subMeshIndex);
                const attributeNames = orginMesh.attributeNames.concat();
                if (attributeNames.indexOf(gltf.AttributeSemantics._INSTANCED_MODEL) < 0) {
                    attributeNames.push(gltf.AttributeSemantics._INSTANCED_MODEL);
                    attributeNames.push(gltf.AttributeSemantics._INSTANCED_MODEL_VIEW);
                }
                // const 
                const mesh = Mesh.create(orginMesh.vertexCount, indice ? indice.length : 0, attributeNames as gltf.AttributeSemantics[]);
                // mesh.glTFMesh.primitives[drawCall.subMeshIndex].attributes
                const models = mesh.getAttributes(gltf.AttributeSemantics._INSTANCED_MODEL)!;
                const modelViews = mesh.getAttributes(gltf.AttributeSemantics._INSTANCED_MODEL_VIEW)!;
                const _modelViewMatrix = egret3d.Matrix.create().release();
                for (let i = 0, l = calls.length; i < l; i++) {
                    const call = calls[i];
                    const matrix = call.matrix;
                    _modelViewMatrix.multiply(camera.worldToCameraMatrix, matrix);
                    models.set(call.matrix.rawData, i * 16);
                    modelViews.set(_modelViewMatrix.rawData, i * 16);
                }

                const newDrawCall = egret3d.DrawCall.create().release();
                newDrawCall.entity = drawCall.entity;
                newDrawCall.renderer = drawCall.renderer;
                newDrawCall.material = drawCall.material;
                newDrawCall.mesh = mesh;
                newDrawCall.subMeshIndex = drawCall.subMeshIndex;
                drawCalls.push(newDrawCall);
            }
        }
        /**
         * @internal
         */
        public _update() {
            this.logDepthBufFC = 2.0 / (Math.log(this._camera.far + 1.0) / Math.LN2);

            if (this._cameraAndLightCollecter.currentShadowLight) {
                this._shadowFrustumCulling();
            }
            else {
                this._frustumCulling();
                this._updateLights();
            }
        }
    }
}
