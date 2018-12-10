namespace egret3d.particle {
    //
    const positionHelper: Vector3 = new Vector3();
    const velocityHelper: Vector3 = new Vector3();
    const startSizeHelper: Vector3 = new Vector3();
    const startColorHelper: Color = Color.create();
    const startRotationHelper: Vector3 = new Vector3();

    const GRAVITY: Readonly<Vector3> = new Vector3(0, -9.81, 0);//TODO没有物理系统，暂时先放到这里
    /**
     * @internal
     */
    export class ParticleBatcher {
        private _dirty: boolean = false;
        private _time: number = 0.0;
        private _emittsionTime: number = 0;
        private _frameRateTime: number = 0;
        //最新存活位置
        private _firstAliveCursor: number = 0;
        private _lastFrameFirstCursor: number = 0;
        //最后存活位置
        private _lastAliveCursor: number = 0;
        private _forceUpdate: boolean = false;
        //原始顶点数量
        private _vertexStride: number = 0;
        //当前爆发的索引
        private _burstIndex: number = 0;
        //
        private _readEmitCount: number = 0;
        //最终重力
        private _finalGravity = new Vector3();
        private _vertexAttributes: gltf.MeshAttribute[];

        //vbo缓存
        private _startPositionBuffer: Float32Array;
        private _startVelocityBuffer: Float32Array;
        private _startColorBuffer: Float32Array;
        private _startSizeBuffer: Float32Array;
        private _startRotationBuffer: Float32Array;
        private _startTimeBuffer: Float32Array;
        private _random0Buffer: Float32Array;
        private _random1Buffer: Float32Array;
        private _worldPostionBuffer: Float32Array;
        private _worldRoationBuffer: Float32Array;

        private _worldPostionCache: Vector3;
        private _worldRotationCache: Quaternion;

        private _comp: ParticleComponent;
        private _renderer: ParticleRenderer;

        /**
        * 计算粒子爆发数量
        * @param startTime 
        * @param endTime 
        */
        private _getBurstCount(startTime: number, endTime: number): number {
            let totalEmitCount: number = 0;
            const bursts = this._comp.emission.bursts;
            for (const l = bursts.length; this._burstIndex < l; this._burstIndex++) {
                const burst: Burst = bursts[this._burstIndex];
                if (burst.time >= startTime && burst.time < endTime) {
                    // totalEmitCount += numberLerp(burst.minCount, burst.maxCount, Math.random());
                    totalEmitCount += burst.maxCount;
                } else {
                    break;
                }
            }

            return totalEmitCount;
        }
        /**
         * 判断粒子是否已经过期
         * @param particleIndex 
         */
        private _isParticleExpired(particleIndex: number): boolean {
            const startTimeOffset = particleIndex * this._vertexStride * 2;
            return this._time - this._startTimeBuffer[startTimeOffset + 1] + 0.0001 > this._startTimeBuffer[startTimeOffset];
        }
        /**
         * 
         * @param time 批量增加粒子
         * @param startCursor 
         * @param endCursor 
         */
        private _addParticles(time: number, startCursor: number, count: number, lastEmittsionTime: number) {
            const comp = this._comp;
            const main = comp.main;
            const velocityModule = comp.velocityOverLifetime;
            const colorModule = comp.colorOverLifetime;
            const sizeModule = comp.sizeOverLifetime;
            const rotationModule = comp.rotationOverLifetime;
            const textureSheetModule = comp.textureSheetAnimation;

            const isVelocityRandom = velocityModule.enable && (velocityModule.mode === CurveMode.TwoConstants || velocityModule.mode === CurveMode.TwoCurves);
            const isColorRandom = colorModule.enable && colorModule.color.mode === ColorGradientMode.TwoGradients;
            const isSizeRandom = sizeModule.enable && (sizeModule.size.mode === CurveMode.TwoConstants || sizeModule.size.mode === CurveMode.TwoCurves);
            const isRotationRandom = rotationModule.enable && (rotationModule.x.mode === CurveMode.TwoConstants || rotationModule.x.mode === CurveMode.TwoCurves);
            const isTextureRandom = textureSheetModule.enable && (textureSheetModule.startFrame.mode === CurveMode.TwoConstants || textureSheetModule.startFrame.mode === CurveMode.TwoCurves);

            const needRandom0 = isColorRandom || isSizeRandom || isRotationRandom || isTextureRandom;

            const worldPosition = this._worldPostionCache;
            const worldRotation = this._worldRotationCache;
            const isWorldSpace = main.simulationSpace === SimulationSpace.World;

            const startPositionBuffer = this._startPositionBuffer;
            const startVelocityBuffer = this._startVelocityBuffer;
            const startColorBuffer = this._startColorBuffer;
            const startSizeBuffer = this._startSizeBuffer;
            const startRotationBuffer = this._startRotationBuffer;
            const startTimeBuffer = this._startTimeBuffer;
            const random0Buffer = this._random0Buffer;
            const random1Buffer = this._random1Buffer;
            const worldPostionBuffer = this._worldPostionBuffer;
            const worldRoationBuffer = this._worldRoationBuffer;

            const isSize3D = main.startSize3D;
            const isRotation3D = main.startRotation3D;

            const age = Math.min(lastEmittsionTime / main.duration, 1.0);
            const vertexStride = this._vertexStride;

            let addCount = 0, startIndex = 0, endIndex = 0;
            let lifetime = 0.0;
            let startSpeed = 0.0;
            let startSize = 0.0;
            let randomVelocityX = 0.0, randomVelocityY = 0.0, randomVelocityZ = 0.0;
            let randomColor = 0.0, randomSize = 0.0, randomRotation = 0.0, randomTextureAnimation = 0.0;
            let vector2Offset = 0, vector3Offset = 0, vector4Offset = 0;
            while (addCount !== count) {
                comp.shape.generatePositionAndDirection(positionHelper, velocityHelper);
                main.startColor.evaluate(age, startColorHelper);

                lifetime = main.startLifetime.evaluate(age);
                startSpeed = main.startSpeed.evaluate(age);
                velocityHelper.x *= startSpeed;
                velocityHelper.y *= startSpeed;
                velocityHelper.z *= startSpeed;

                if (isSize3D) {
                    startSizeHelper.x = main.startSizeX.evaluate(age);
                    startSizeHelper.y = main.startSizeY.evaluate(age);
                    startSizeHelper.z = main.startSizeZ.evaluate(age);
                }
                else {
                    startSize = main.startSizeX.evaluate(age);
                    startSizeHelper.x = startSize;
                    startSizeHelper.y = startSize;
                    startSizeHelper.z = startSize;
                }

                if (isRotation3D) {
                    startRotationHelper.x = main.startRotationX.evaluate(age);
                    startRotationHelper.y = main.startRotationY.evaluate(age);
                    startRotationHelper.z = main.startRotationZ.evaluate(age);
                }
                else {
                    startRotationHelper.x = main.startRotationX.evaluate(age);
                }

                randomVelocityX = isVelocityRandom ? Math.random() : 0.0;
                randomVelocityY = isVelocityRandom ? Math.random() : 0.0;
                randomVelocityZ = isVelocityRandom ? Math.random() : 0.0;

                randomColor = isColorRandom ? Math.random() : 0.0;
                randomSize = isSizeRandom ? Math.random() : 0.0;
                randomRotation = isRotationRandom ? Math.random() : 0.0;
                randomTextureAnimation = isTextureRandom ? Math.random() : 0.0;

                for (startIndex = startCursor * vertexStride, endIndex = startIndex + vertexStride; startIndex < endIndex; startIndex++) {
                    vector2Offset = startIndex * 2;
                    vector3Offset = startIndex * 3;
                    vector4Offset = startIndex * 4;
                    //
                    startPositionBuffer[vector3Offset] = positionHelper.x;
                    startPositionBuffer[vector3Offset + 1] = positionHelper.y;
                    startPositionBuffer[vector3Offset + 2] = positionHelper.z;

                    startVelocityBuffer[vector3Offset] = velocityHelper.x;
                    startVelocityBuffer[vector3Offset + 1] = velocityHelper.y;
                    startVelocityBuffer[vector3Offset + 2] = velocityHelper.z;

                    startColorBuffer[vector4Offset] = startColorHelper.r;
                    startColorBuffer[vector4Offset + 1] = startColorHelper.g;
                    startColorBuffer[vector4Offset + 2] = startColorHelper.b;
                    startColorBuffer[vector4Offset + 3] = startColorHelper.a;

                    startSizeBuffer[vector3Offset] = startSizeHelper.x;
                    startSizeBuffer[vector3Offset + 1] = startSizeHelper.y;
                    startSizeBuffer[vector3Offset + 2] = startSizeHelper.z;

                    startRotationBuffer[vector3Offset] = startRotationHelper.x;
                    startRotationBuffer[vector3Offset + 1] = startRotationHelper.y;
                    startRotationBuffer[vector3Offset + 2] = startRotationHelper.z;

                    startTimeBuffer[vector2Offset] = lifetime;
                    startTimeBuffer[vector2Offset + 1] = time;
                    //
                    if (needRandom0) {
                        random0Buffer[vector4Offset] = randomColor;
                        random0Buffer[vector4Offset + 1] = randomSize;
                        random0Buffer[vector4Offset + 2] = randomRotation;
                        random0Buffer[vector4Offset + 3] = randomTextureAnimation;
                    }
                    if (isVelocityRandom) {
                        random1Buffer[vector4Offset] = randomVelocityX;
                        random1Buffer[vector4Offset + 1] = randomVelocityY;
                        random1Buffer[vector4Offset + 2] = randomVelocityZ;
                        random1Buffer[vector4Offset + 3] = 0;
                    }
                    if (isWorldSpace) {
                        worldPostionBuffer[vector3Offset] = worldPosition.x;
                        worldPostionBuffer[vector3Offset + 1] = worldPosition.y;
                        worldPostionBuffer[vector3Offset + 2] = worldPosition.z;

                        worldRoationBuffer[vector4Offset] = worldRotation.x;
                        worldRoationBuffer[vector4Offset + 1] = worldRotation.y;
                        worldRoationBuffer[vector4Offset + 2] = worldRotation.z;
                        worldRoationBuffer[vector4Offset + 3] = worldRotation.w;
                    }
                }
                startCursor++;
                if (startCursor >= main.maxParticles) {
                    startCursor = 0;
                }
                addCount++;
            }

            //TODO理论上应该是每帧更新，不过现在没有物理系统，先放到这里
            const gravityModifier = main.gravityModifier.constant;
            this._finalGravity.x = GRAVITY.x * gravityModifier;
            this._finalGravity.y = GRAVITY.y * gravityModifier;
            this._finalGravity.z = GRAVITY.z * gravityModifier;
        }

        private _tryEmit(): boolean {
            if (!this._isParticleExpired(this._firstAliveCursor)) {
                return false;
            }
            //
            const maxParticles = this._comp.main.maxParticles;
            const nextCursor = this._firstAliveCursor + 1 >= maxParticles ? 0 : this._firstAliveCursor + 1;
            //
            if (nextCursor === this._lastAliveCursor) {
                this._forceUpdate = true;
            }
            this._firstAliveCursor = nextCursor;
            return true;
        }

        public clean() {
            this._time = 0.0;
            this._dirty = false;
            this._emittsionTime = 0.0;
            this._frameRateTime = 0.0;
            this._firstAliveCursor = 0;
            this._lastFrameFirstCursor = 0;
            this._lastAliveCursor = 0;
            this._forceUpdate = false;
            this._vertexStride = 0;
            this._vertexAttributes = null!;
            this._burstIndex = 0;
            this._readEmitCount = 0;
            this._startPositionBuffer = null!;
            this._startVelocityBuffer = null!;
            this._startColorBuffer = null!;
            this._startSizeBuffer = null!;
            this._startRotationBuffer = null!;
            this._startTimeBuffer = null!;
            this._random0Buffer = null!;
            this._random1Buffer = null!;
            this._worldPostionBuffer = null!;
            this._worldRoationBuffer = null!;

            this._worldPostionCache = null!;
            this._worldRotationCache = null!;

            this._comp = null!;
            this._renderer = null!;
        }

        public resetTime() {
            this._burstIndex = 0;
            this._emittsionTime = 0;
            this._readEmitCount = 0;
        }

        public init(comp: ParticleComponent, renderer: ParticleRenderer) {
            this._comp = comp;
            this._renderer = renderer;

            const mesh = createBatchMesh(renderer, comp.main.maxParticles);
            this._vertexStride = renderer.renderMode === ParticleRenderMode.Mesh ? renderer.mesh!.vertexCount : 4;

            this._startPositionBuffer = mesh.getAttributes(gltf.AttributeSemanticType._START_POSITION)!;
            this._startVelocityBuffer = mesh.getAttributes(gltf.AttributeSemanticType._START_VELOCITY)!;
            this._startColorBuffer = mesh.getAttributes(gltf.AttributeSemanticType._START_COLOR)!;
            this._startSizeBuffer = mesh.getAttributes(gltf.AttributeSemanticType._START_SIZE)!;
            this._startRotationBuffer = mesh.getAttributes(gltf.AttributeSemanticType._START_ROTATION)!;
            this._startTimeBuffer = mesh.getAttributes(gltf.AttributeSemanticType._TIME)!;
            this._random0Buffer = mesh.getAttributes(gltf.AttributeSemanticType._RANDOM0)!;
            this._random1Buffer = mesh.getAttributes(gltf.AttributeSemanticType._RANDOM1)!;
            this._worldPostionBuffer = mesh.getAttributes(gltf.AttributeSemanticType._WORLD_POSITION)!;
            this._worldRoationBuffer = mesh.getAttributes(gltf.AttributeSemanticType._WORLD_ROTATION)!;

            const primitive = mesh.glTFMesh.primitives[0];
            this._vertexAttributes = [];
            for (const k in primitive.attributes) {
                this._vertexAttributes.push(k as gltf.MeshAttribute);
            }

            renderer.batchMesh = mesh;
            renderer.batchMaterial = renderer.materials[0]!.clone();
            mesh.uploadSubIndexBuffer();
        }

        public update(elapsedTime: number) {
            if (!this._comp || this._comp.isPaused) {
                return;
            }

            //
            this._time += elapsedTime;
            const comp = this._comp;
            const mainModule = comp.main;
            //
            while (this._lastAliveCursor !== this._firstAliveCursor || this._forceUpdate) {
                if (!this._isParticleExpired(this._lastAliveCursor)) {
                    break;
                }
                this._forceUpdate = false;
                this._lastAliveCursor++;
                if (this._lastAliveCursor >= mainModule.maxParticles) {
                    this._lastAliveCursor = 0;
                }
            }

            const transform = comp.gameObject.transform;
            this._worldPostionCache = transform.position.clone();
            this._worldRotationCache = transform.rotation.clone();
            if (comp._isPlaying && this._time >= mainModule.startDelay.constant && comp.emission.enable) {
                this._updateEmission(elapsedTime);
            }

            this._updateRender();
        }

        private _updateEmission(elapsedTime: number) {
            const comp = this._comp;
            const mainModule = comp.main;
            const lastEmittsionTime = this._emittsionTime;
            this._emittsionTime += elapsedTime;
            const isOver = this._emittsionTime > mainModule.duration;
            const aliveParticleCount = this.aliveParticleCount;
            let totalEmitCount = 0;
            if (!isOver) {
                if (comp.emission.bursts.length > 0) {
                    this._readEmitCount += this._getBurstCount(lastEmittsionTime, this._emittsionTime);
                }
            }
            else {
                if (mainModule.loop) {
                    this._readEmitCount = 0;
                    this._readEmitCount += this._getBurstCount(lastEmittsionTime, this._emittsionTime);
                    this._emittsionTime -= mainModule.duration;
                    this._burstIndex = 0;
                    this._readEmitCount += this._getBurstCount(0, this._emittsionTime);
                }
                else {
                    comp.stop(false);
                }
            }
            //
            for (let i = 0; i < this._readEmitCount; i++) {
                if (this._tryEmit()) {
                    totalEmitCount++;
                    this._readEmitCount--;
                }
            }
            const rateOverTime = comp.emission.rateOverTime.constant;
            if (rateOverTime > 0) {
                const minEmissionTime: number = 1 / rateOverTime;
                this._frameRateTime += elapsedTime;
                while (this._frameRateTime > minEmissionTime) {
                    if (!this._tryEmit()) {
                        break;
                    }
                    totalEmitCount++;
                    this._frameRateTime -= minEmissionTime;
                }
            }

            totalEmitCount = Math.min(mainModule.maxParticles - aliveParticleCount, totalEmitCount);
            if (totalEmitCount > 0) {
                this._addParticles(this._time, this._lastFrameFirstCursor, totalEmitCount, lastEmittsionTime);
                this._dirty = true;
            }
        }

        private _updateRender() {
            const renderer = this._renderer;
            const comp = this._comp;
            const mainModule = comp.main;
            //
            if (this._dirty) {
                // renderer.batchMesh.uploadVertexBuffer(this._vertexAttributes);
                const bufferOffset = this._lastFrameFirstCursor * this._vertexStride;
                if (this._firstAliveCursor > this._lastFrameFirstCursor) {
                    const bufferCount = (this._firstAliveCursor - this._lastFrameFirstCursor) * this._vertexStride;
                    renderer.batchMesh.uploadVertexBuffer(this._vertexAttributes, bufferOffset, bufferCount);
                }
                else {
                    const addCount = mainModule.maxParticles - this._lastFrameFirstCursor;
                    renderer.batchMesh.uploadVertexBuffer(this._vertexAttributes, bufferOffset, addCount * this._vertexStride);
                    renderer.batchMesh.uploadVertexBuffer(this._vertexAttributes, 0, this._firstAliveCursor * this._vertexStride);
                }
                this._lastFrameFirstCursor = this._firstAliveCursor;
                this._dirty = false;
            }

            const transform = comp.gameObject.transform;
            const material = renderer.batchMaterial;
            if (mainModule.simulationSpace === SimulationSpace.Local) {
                material.setVector3(ParticleMaterialUniform.WORLD_POSITION, this._worldPostionCache);
                material.setVector4(ParticleMaterialUniform.WORLD_ROTATION, this._worldRotationCache);
            }
            //
            switch (mainModule.scaleMode) {
                case ScalingMode.Local:
                    {
                        const scale = transform.localScale;
                        material.setVector3(ParticleMaterialUniform.POSITION_SCALE, scale);
                        material.setVector3(ParticleMaterialUniform.SIZE_SCALE, scale);
                    }
                    break;
                case ScalingMode.Shape:
                    {
                        const scale = transform.scale;
                        material.setVector3(ParticleMaterialUniform.POSITION_SCALE, scale);
                        material.setVector3(ParticleMaterialUniform.SIZE_SCALE, Vector3.ONE);
                    }
                    break;
                case ScalingMode.Hierarchy:
                    {
                        const scale = transform.scale;
                        material.setVector3(ParticleMaterialUniform.POSITION_SCALE, scale);
                        material.setVector3(ParticleMaterialUniform.SIZE_SCALE, scale);
                    }
                    break;
            }

            material.setFloat(ParticleMaterialUniform.CURRENTTIME, this._time);
            material.setVector3(ParticleMaterialUniform.GRAVIT, this._finalGravity);
        }

        public get aliveParticleCount(): number {
            if (this._firstAliveCursor >= this._lastAliveCursor) {
                return this._firstAliveCursor - this._lastAliveCursor;
            } else {
                return this._comp.main.maxParticles - this._lastAliveCursor + this._firstAliveCursor;
            }
        }
    }
}