namespace egret3d.particle {
    //
    const positionHelper: Vector3 = new Vector3();
    const velocityHelper: Vector3 = new Vector3();
    const startSizeHelper: Vector3 = new Vector3();
    const startColorHelper: Color = new Color();
    const startRotationHelper: Vector3 = new Vector3();
    const uvHelper: Vector4 = new Vector4();
    const helpVec2: Vector2 = new Vector2();
    const helpVec3: Vector3 = new Vector3();
    const helpVec4: Vector4 = new Vector4();

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
        //原始顶点数量
        private _vertexStride: number = 0;
        //当前爆发的索引
        private _burstIndex: number = 0;
        //最终重力
        private _finalGravity = new Vector3();
        private _vertexAttributes: gltf.MeshAttribute[];

        //vbo缓存
        private _positionBufferCache: Float32Array;
        private _colorBufferCache: Float32Array;
        private _uvBufferCache: Float32Array;
        private _cornerBufferCache: Float32Array;
        private _startPositionBufferCache: Float32Array;
        private _startVelocityBufferCache: Float32Array;
        private _startColorBufferCache: Float32Array;
        private _startSizeBufferCache: Float32Array;
        private _startRotationBufferCache: Float32Array;
        private _startTimeBufferCache: Float32Array;
        private _random0BufferCache: Float32Array;
        private _random1BufferCache: Float32Array;
        private _worldPostionBufferCache: Float32Array;
        private _worldRoationBufferCache: Float32Array;

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
            for (let l = bursts.length; this._burstIndex < l; this._burstIndex++) {
                const burst: Burst = bursts[this._burstIndex];
                if (burst.time >= startTime && burst.time < endTime) {
                    totalEmitCount += numberLerp(burst.minCount, burst.maxCount, Math.random());
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
            return this._time - this._startTimeBufferCache[startTimeOffset + 1] + 0.0001 > this._startTimeBufferCache[startTimeOffset];
        }
        /**
         * 
         * @param time 批量增加粒子
         * @param startCursor 
         * @param endCursor 
         */
        private _addParticles(time: number, startCursor: number, endCursor: number) {
            const comp = this._comp;
            let age = this._emittsionTime / comp.main.duration;
            age = Math.min(age, 1.0);

            const neeedRandomVelocity = comp.velocityOverLifetime.enable && (comp.velocityOverLifetime.mode === CurveMode.TwoConstants || comp.velocityOverLifetime.mode === CurveMode.TwoCurves);
            const needRandomColor = comp.colorOverLifetime.enable && (comp.colorOverLifetime.color.mode === ColorGradientMode.TwoGradients);
            const needRandomSize = comp.sizeOverLifetime.enable && (comp.sizeOverLifetime.size.mode === CurveMode.TwoConstants || comp.sizeOverLifetime.size.mode === CurveMode.TwoCurves);
            const needRandomRotation = comp.rotationOverLifetime.enable && (comp.rotationOverLifetime.x.mode === CurveMode.TwoConstants || comp.rotationOverLifetime.x.mode === CurveMode.TwoCurves);
            const needRandomTextureAnimation = comp.textureSheetAnimation.enable && (comp.textureSheetAnimation.startFrame.mode === CurveMode.TwoConstants || comp.textureSheetAnimation.startFrame.mode === CurveMode.TwoCurves);

            const needRandom0 = needRandomColor || needRandomSize || needRandomRotation || needRandomTextureAnimation;

            const worldPosition = this._worldPostionCache;
            const worldRotation = this._worldRotationCache;

            const renderer = this._renderer;
            const isMesh = renderer._renderMode === ParticleRenderMode.Mesh;
            const orginMesh = renderer.mesh as Mesh;
            const subPrimitive = isMesh ? orginMesh.glTFMesh.primitives[0] : null;
            const uvs = isMesh ? orginMesh.getAttributes(gltf.MeshAttributeType.TEXCOORD_0, 0) : null;
            while (startCursor !== endCursor) {
                //发射粒子要根据粒子发射器的形状发射
                comp.shape.generatePositionAndDirection(positionHelper, velocityHelper);
                comp.main.startColor.evaluate(age, startColorHelper);

                const lifetime = comp.main.startLifetime.evaluate(age);
                const startSpeed = comp.main.startSpeed.evaluate(age);
                velocityHelper.x *= startSpeed;
                velocityHelper.y *= startSpeed;
                velocityHelper.z *= startSpeed;

                startSizeHelper.x = comp.main.startSizeX.evaluate(age);
                startSizeHelper.y = comp.main.startSizeY.evaluate(age);
                startSizeHelper.z = comp.main.startSizeZ.evaluate(age);
                startRotationHelper.x = comp.main.startRotationX.evaluate(age);
                startRotationHelper.y = comp.main.startRotationY.evaluate(age);
                startRotationHelper.z = comp.main.startRotationZ.evaluate(age);
                comp.textureSheetAnimation.evaluate(age, uvHelper);

                const randomVelocityX = neeedRandomVelocity ? Math.random() : 0.0;
                const randomVelocityY = neeedRandomVelocity ? Math.random() : 0.0;
                const randomVelocityZ = neeedRandomVelocity ? Math.random() : 0.0;
                const randomColor = needRandomColor ? Math.random() : 0.0;
                const randomSize = needRandomSize ? Math.random() : 0.0;
                const randomRotation = needRandomRotation ? Math.random() : 0.0;
                const randomTextureAnimation = needRandomTextureAnimation ? Math.random() : 0.0;

                const startIndex = startCursor * this._vertexStride;
                for (let i = startIndex, meshIndexOffset = 0, l = startIndex + this._vertexStride; i < l; i++ , meshIndexOffset++) {
                    const vector2Offset = i * 2;
                    const vector3Offset = i * 3;
                    const vector4Offset = i * 4;
                    if (subPrimitive) { // isMesh
                        if (uvs) {
                            const index = meshIndexOffset * 2;
                            this._uvBufferCache[vector2Offset] = uvs[index] * uvHelper.x + uvHelper.z;
                            this._uvBufferCache[vector2Offset + 1] = uvs[index + 1] * uvHelper.y + uvHelper.w;
                        }
                    } else {
                        switch (meshIndexOffset) {
                            case 0:
                                this._uvBufferCache[vector2Offset] = uvHelper.z;
                                this._uvBufferCache[vector2Offset + 1] = uvHelper.y + uvHelper.w;
                                break;
                            case 1:
                                this._uvBufferCache[vector2Offset] = uvHelper.x + uvHelper.z;
                                this._uvBufferCache[vector2Offset + 1] = uvHelper.y + uvHelper.w;
                                break;
                            case 2:
                                this._uvBufferCache[vector2Offset] = uvHelper.x + uvHelper.z;
                                this._uvBufferCache[vector2Offset + 1] = uvHelper.w;
                                break;
                            case 3:
                                this._uvBufferCache[vector2Offset] = uvHelper.z;
                                this._uvBufferCache[vector2Offset + 1] = uvHelper.w;
                                break;
                        }
                    }

                    //
                    this._startPositionBufferCache[vector3Offset] = positionHelper.x;
                    this._startPositionBufferCache[vector3Offset + 1] = positionHelper.y;
                    this._startPositionBufferCache[vector3Offset + 2] = positionHelper.z;

                    this._startVelocityBufferCache[vector3Offset] = velocityHelper.x;
                    this._startVelocityBufferCache[vector3Offset + 1] = velocityHelper.y;
                    this._startVelocityBufferCache[vector3Offset + 2] = velocityHelper.z;

                    this._startColorBufferCache[vector4Offset] = startColorHelper.r;
                    this._startColorBufferCache[vector4Offset + 1] = startColorHelper.g;
                    this._startColorBufferCache[vector4Offset + 2] = startColorHelper.b;
                    this._startColorBufferCache[vector4Offset + 3] = startColorHelper.a;

                    this._startSizeBufferCache[vector3Offset] = startSizeHelper.x;
                    this._startSizeBufferCache[vector3Offset + 1] = startSizeHelper.y;
                    this._startSizeBufferCache[vector3Offset + 2] = startSizeHelper.z;

                    this._startRotationBufferCache[vector3Offset] = startRotationHelper.x;
                    this._startRotationBufferCache[vector3Offset + 1] = startRotationHelper.y;
                    this._startRotationBufferCache[vector3Offset + 2] = startRotationHelper.z;

                    this._startTimeBufferCache[vector2Offset] = lifetime;
                    this._startTimeBufferCache[vector2Offset + 1] = time;
                    //
                    if (needRandom0) {
                        this._random0BufferCache[vector4Offset] = randomColor;
                        this._random0BufferCache[vector4Offset + 1] = randomSize;
                        this._random0BufferCache[vector4Offset + 2] = randomRotation;
                        this._random0BufferCache[vector4Offset + 3] = randomTextureAnimation;
                    }
                    if (neeedRandomVelocity) {
                        this._random1BufferCache[vector4Offset] = randomVelocityX;
                        this._random1BufferCache[vector4Offset + 1] = randomVelocityY;
                        this._random1BufferCache[vector4Offset + 2] = randomVelocityZ;
                        this._random1BufferCache[vector4Offset + 3] = 0;
                    }
                    if (comp.main.simulationSpace === SimulationSpace.World) {
                        this._worldPostionBufferCache[vector3Offset] = worldPosition.x;
                        this._worldPostionBufferCache[vector3Offset + 1] = worldPosition.y;
                        this._worldPostionBufferCache[vector3Offset + 2] = worldPosition.z;

                        this._worldRoationBufferCache[vector4Offset] = worldRotation.x;
                        this._worldRoationBufferCache[vector4Offset + 1] = worldRotation.y;
                        this._worldRoationBufferCache[vector4Offset + 2] = worldRotation.z;
                        this._worldRoationBufferCache[vector4Offset + 3] = worldRotation.w;
                    }
                };

                startCursor++;
                if (startCursor >= comp.main.maxParticles) {
                    startCursor = 0;
                }
            }

            //TODO理论上应该是每帧更新，不过现在没有物理系统，先放到这里
            const gravityModifier = comp.main.gravityModifier.constant;
            this._finalGravity.x = GRAVITY.x * gravityModifier;
            this._finalGravity.y = GRAVITY.y * gravityModifier;
            this._finalGravity.z = GRAVITY.z * gravityModifier;
        }

        private _tryEmit(time: number): boolean {
            const maxParticles = this._comp.main.maxParticles;
            var nextCursor = this._firstAliveCursor + 1 > maxParticles ? 0 : this._firstAliveCursor + 1;
            if (nextCursor >= maxParticles) {
                nextCursor = 0;
            }

            if (!this._isParticleExpired(nextCursor)) {
                return false;
            }

            //
            // this._addParticle(time);
            this._firstAliveCursor = nextCursor;
            this._dirty = true;
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
            this._vertexStride = 0;
            this._vertexAttributes = null;
            this._burstIndex = 0;
            this._positionBufferCache = null;
            this._colorBufferCache = null;
            this._uvBufferCache = null;
            this._cornerBufferCache = null;
            this._startPositionBufferCache = null;
            this._startVelocityBufferCache = null;
            this._startColorBufferCache = null;
            this._startSizeBufferCache = null;
            this._startRotationBufferCache = null;
            this._startTimeBufferCache = null;
            this._random0BufferCache = null;
            this._random1BufferCache = null;
            this._worldPostionBufferCache = null;
            this._worldRoationBufferCache = null;

            this._worldPostionCache = null;
            this._worldRotationCache = null;

            this._comp = null;
            this._renderer = null;
        }

        public resetTime() {
            this._burstIndex = 0;
            this._emittsionTime = 0;
        }

        public init(comp: ParticleComponent, renderer: ParticleRenderer) {
            this._comp = comp;
            this._renderer = renderer;

            const mesh = createBatchMesh(renderer, comp.main.maxParticles);
            if (renderer._renderMode === ParticleRenderMode.Mesh) {
                this._vertexStride = renderer.mesh.vertexCount;
                this._positionBufferCache = mesh.getAttributes(ParticleMaterialAttribute.POSITION);
                this._colorBufferCache = mesh.getAttributes(ParticleMaterialAttribute.COLOR_0);
            } else {
                this._vertexStride = 4;
                this._cornerBufferCache = mesh.getAttributes(ParticleMaterialAttribute.CORNER);
            }
            this._uvBufferCache = mesh.getAttributes(ParticleMaterialAttribute.TEXCOORD_0);
            this._startPositionBufferCache = mesh.getAttributes(ParticleMaterialAttribute.START_POSITION);
            this._startVelocityBufferCache = mesh.getAttributes(ParticleMaterialAttribute.START_VELOCITY);
            this._startColorBufferCache = mesh.getAttributes(ParticleMaterialAttribute.START_COLOR);
            this._startSizeBufferCache = mesh.getAttributes(ParticleMaterialAttribute.START_SIZE);
            this._startRotationBufferCache = mesh.getAttributes(ParticleMaterialAttribute.START_ROTATION);
            this._startTimeBufferCache = mesh.getAttributes(ParticleMaterialAttribute.TIME);
            this._random0BufferCache = mesh.getAttributes(ParticleMaterialAttribute.RANDOM0);
            this._random1BufferCache = mesh.getAttributes(ParticleMaterialAttribute.RANDOM1);
            this._worldPostionBufferCache = mesh.getAttributes(ParticleMaterialAttribute.WORLD_POSITION);
            this._worldRoationBufferCache = mesh.getAttributes(ParticleMaterialAttribute.WORLD_ROTATION);

            const primitive = mesh.glTFMesh.primitives[0];
            this._vertexAttributes = [];
            for (const k in primitive.attributes) {
                this._vertexAttributes.push(k as gltf.MeshAttribute);
            }

            renderer.batchMesh = mesh;
            //粒子系统不能用共享材质
            renderer.batchMaterial = renderer.materials[0].clone();
            mesh.uploadSubIndexBuffer();
        }

        public update(elapsedTime: number) {
            if (this._comp.isPaused) {
                return;
            }
            //
            this._time += elapsedTime;
            const comp = this._comp;
            //
            while (this._lastAliveCursor != this._firstAliveCursor) {
                if (!this._isParticleExpired(this._lastAliveCursor)) {
                    break;
                }
                this._lastAliveCursor++;
                if (this._lastAliveCursor >= comp.main.maxParticles) {
                    this._lastAliveCursor = 0;
                }
            }

            const transform = comp.gameObject.transform;
            this._worldPostionCache = transform.getPosition();
            this._worldRotationCache = transform.getRotation();
            //检测是否已经过了Delay时间，否则不能发射
            if (comp._isPlaying && this._time >= comp.main.startDelay.constant && comp.emission.enable) {
                this._updateEmission(elapsedTime);
            }

            this._updateRender();
        }

        private _updateEmission(elapsedTime: number) {
            const comp = this._comp;
            //根据时间判断
            const lastEmittsionTime = this._emittsionTime;
            this._emittsionTime += elapsedTime;
            const isOver = this._emittsionTime > comp.main.duration;
            if (!isOver) {
                //由爆发触发的粒子发射
                let totalEmitCount = 0;
                if (comp.emission.bursts.length > 0) {
                    let readyEmitCount = 0;
                    readyEmitCount += this._getBurstCount(lastEmittsionTime, this._emittsionTime);
                    readyEmitCount = Math.min(comp.main.maxParticles - this.aliveParticleCount, readyEmitCount);
                    //
                    for (let i = 0; i < readyEmitCount; i++) {
                        if (this._tryEmit(this._time)) {
                            totalEmitCount++;
                        }
                        // this._emit(this._time);
                    }
                }
                //由时间触发的粒子发射,不支持曲线
                const rateOverTime = comp.emission.rateOverTime.constant;
                if (rateOverTime > 0) {
                    const minEmissionTime: number = 1 / rateOverTime;
                    this._frameRateTime += elapsedTime;

                    while (this._frameRateTime > minEmissionTime) {
                        if (!this._tryEmit(this._time)) {
                            break;
                        }
                        totalEmitCount++;
                        this._frameRateTime -= minEmissionTime;
                    }
                }

                if(this._lastFrameFirstCursor !== this._firstAliveCursor){
                    this._addParticles(this._time, this._lastFrameFirstCursor, this._firstAliveCursor);
                }                
            } else {
                //一个生命周期结束
                if (comp.main.loop) {
                    //直接置零，对时间敏感的可能有问题
                    this._emittsionTime = 0;
                    this._burstIndex = 0;
                } else {
                    //自己停止，不要影响子粒子播放状态
                    comp.stop(false);
                }
            }
        }

        private _updateRender() {
            const renderer = this._renderer;
            const comp = this._comp;
            //
            if (this._dirty) {
                //为了性能，不能提交整个buffer，只提交改变的buffer
                const bufferOffset = this._lastFrameFirstCursor * this._vertexStride;
                if (this._firstAliveCursor > this._lastFrameFirstCursor) {
                    const bufferCount = (this._firstAliveCursor - this._lastFrameFirstCursor) * this._vertexStride;
                    renderer.batchMesh.uploadVertexSubData(this._vertexAttributes, bufferOffset, bufferCount);
                } else {
                    const addCount = comp.main.maxParticles - this._lastFrameFirstCursor;
                    //先更新尾部的，再更新头部的
                    renderer.batchMesh.uploadVertexSubData(this._vertexAttributes, bufferOffset, addCount * this._vertexStride);
                    renderer.batchMesh.uploadVertexSubData(this._vertexAttributes, 0, this._firstAliveCursor * this._vertexStride);
                }
                this._lastFrameFirstCursor = this._firstAliveCursor;
                this._dirty = false;
            }

            const transform = comp.gameObject.transform;
            if (comp.main.simulationSpace === SimulationSpace.Local) {
                renderer._setVector3(ParticleMaterialUniform.WORLD_POSITION, this._worldPostionCache);
                renderer._setVector4(ParticleMaterialUniform.WORLD_ROTATION, this._worldRotationCache);
            }
            //
            switch (comp.main.scaleMode) {
                case ScalingMode.Local:
                    {
                        const scale = transform.getLocalScale();
                        renderer._setVector3(ParticleMaterialUniform.POSITION_SCALE, scale);
                        renderer._setVector3(ParticleMaterialUniform.SIZE_SCALE, scale);
                    }
                    break;
                case ScalingMode.Shape:
                    {
                        const scale = transform.getScale();
                        renderer._setVector3(ParticleMaterialUniform.POSITION_SCALE, scale);
                        renderer._setVector3(ParticleMaterialUniform.SIZE_SCALE, Vector3.ONE);
                    }
                    break;
                case ScalingMode.Hierarchy:
                    {
                        const scale = transform.getScale();
                        renderer._setVector3(ParticleMaterialUniform.POSITION_SCALE, scale);
                        renderer._setVector3(ParticleMaterialUniform.SIZE_SCALE, scale);
                    }
                    break;
            }

            renderer._setBoolean(ParticleMaterialUniform.START_SIZE3D, comp.main.startRotation3D);
            renderer._setInt(ParticleMaterialUniform.SIMULATION_SPACE, comp.main.simulationSpace);
            renderer._setInt(ParticleMaterialUniform.SCALING_MODE, comp.main.scaleMode);
            renderer._setFloat(ParticleMaterialUniform.CURRENTTIME, this._time);
            renderer._setFloat(ParticleMaterialUniform.LENGTH_SCALE, renderer.lengthScale);
            renderer._setFloat(ParticleMaterialUniform.SPEED_SCALE, renderer.velocityScale);
            renderer._setVector3(ParticleMaterialUniform.GRAVIT, this._finalGravity);
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