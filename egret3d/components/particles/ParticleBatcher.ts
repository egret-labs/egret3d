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
        //时间属性在vbo中的起始位置
        private _vertexStartTimeOffset: number = 0;
        //总的vbo
        private _vertexTimeBuffer: Float32Array;
        private _vertexAttributes: gltf.MeshAttribute[];
        //当前爆发的索引
        private _burstIndex: number = 0;
        //最终重力
        private _finalGravity = new Vector3();

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
            return this._time - this._vertexTimeBuffer[startTimeOffset + 1] + 0.0001 > this._vertexTimeBuffer[startTimeOffset];
        }

        /**
         * 增加一个新的粒子
         * @param position 
         * @param direction 
         * @param time 
         * @param nextCursor 
         */
        private _addParticle(time: number) {
            const comp = this._comp;
            let age = this._emittsionTime / comp.main.duration;
            age = Math.min(age, 1.0);
            comp.main.startColor.evaluate(age, startColorHelper);

            //发射粒子要根据粒子发射器的形状发射
            comp.shape.generatePositionAndDirection(positionHelper, velocityHelper);

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

            const neeedRandomVelocity = comp.velocityOverLifetime.enable && (comp.velocityOverLifetime.mode === CurveMode.TwoConstants || comp.velocityOverLifetime.mode === CurveMode.TwoCurves);
            const randomVelocityX = neeedRandomVelocity ? Math.random() : 0.0;
            const randomVelocityY = neeedRandomVelocity ? Math.random() : 0.0;
            const randomVelocityZ = neeedRandomVelocity ? Math.random() : 0.0;
            const needRandomColor = comp.colorOverLifetime.enable && (comp.colorOverLifetime.color.mode === ColorGradientMode.TwoGradients);
            const randomColor = needRandomColor ? Math.random() : 0.0;
            const needRandomSize = comp.sizeOverLifetime.enable && (comp.sizeOverLifetime.size.mode === CurveMode.TwoConstants || comp.sizeOverLifetime.size.mode === CurveMode.TwoCurves);
            const randomSize = needRandomSize ? Math.random() : 0.0;
            const needRandomRotation = comp.rotationOverLifetime.enable && (comp.rotationOverLifetime.x.mode === CurveMode.TwoConstants || comp.rotationOverLifetime.x.mode === CurveMode.TwoCurves);
            const randomRotation = needRandomRotation ? Math.random() : 0.0;
            const needRandomTextureAnimation = comp.textureSheetAnimation.enable && (comp.textureSheetAnimation.startFrame.mode === CurveMode.TwoConstants || comp.textureSheetAnimation.startFrame.mode === CurveMode.TwoCurves);
            const randomTextureAnimation = needRandomTextureAnimation ? Math.random() : 0.0;

            const needRandom0 = needRandomColor || needRandomSize || needRandomRotation || randomTextureAnimation;

            const transform = comp.gameObject.transform;
            const worldPosition = transform.getPosition();
            const worldRotation = transform.getRotation();

            const startIndex = this._firstAliveCursor * this._vertexStride;
            let meshIndexOffset: number = 0;

            const renderer = this._renderer;
            const isMesh = renderer._renderMode === ParticleRenderMode.Mesh;
            if (isMesh && !renderer.mesh) {
                console.error("Data error.");
            }

            const orginMesh = renderer.mesh as Mesh;
            const subPrimitive = isMesh ? orginMesh.glTFMesh.primitives[0] : null;
            const batchMesh = renderer.batchMesh;
            const vertices = isMesh ? orginMesh.getVertices() : null;
            const colors = isMesh ? orginMesh.getAttributes(gltf.MeshAttributeType.COLOR_0, 0) : null;
            const uvs = isMesh ? orginMesh.getAttributes(gltf.MeshAttributeType.TEXCOORD_0, 0) : null;

            for (let i = startIndex, l = startIndex + this._vertexStride; i < l; i++ , meshIndexOffset++) {
                if (subPrimitive) { // isMesh
                    let index = meshIndexOffset * 3;

                    Vector3.set(vertices[index], vertices[index + 1], vertices[index + 2], helpVec3);
                    batchMesh.setAttribute(i, ParticleMaterialAttribute.POSITION, 0, helpVec3.x, helpVec3.y, helpVec3.z)
                    if (subPrimitive.attributes[gltf.MeshAttributeType.COLOR_0]) {
                        index = meshIndexOffset * 4;
                        Vector4.set(colors[index], colors[index + 1], colors[index + 2], colors[index + 3], helpVec4);
                        batchMesh.setAttribute(i, ParticleMaterialAttribute.COLOR_0, 0, helpVec4.x, helpVec4.y, helpVec4.z, helpVec4.w);
                    }
                    else {
                        batchMesh.setAttribute(i, ParticleMaterialAttribute.COLOR_0, 0, 1.0, 1.0, 1.0, 1.0);
                    }

                    if (subPrimitive.attributes[gltf.MeshAttributeType.TEXCOORD_0]) {
                        index = meshIndexOffset * 2;
                        Vector2.set(uvs[index], uvs[index + 1], helpVec2);
                        batchMesh.setAttribute(i, ParticleMaterialAttribute.TEXCOORD_0, 0, helpVec2.x * uvHelper.x + uvHelper.z, helpVec2.y * uvHelper.y + uvHelper.w);
                    } else {
                        batchMesh.setAttribute(i, ParticleMaterialAttribute.TEXCOORD_0, 0, 0, 0);
                    }
                } else {
                    switch (meshIndexOffset) {
                        case 0:
                            batchMesh.setAttribute(i, ParticleMaterialAttribute.CORNER, 0, -0.5, -0.5);
                            batchMesh.setAttribute(i, ParticleMaterialAttribute.TEXCOORD_0, 0, uvHelper.z, uvHelper.y + uvHelper.w);
                            break;
                        case 1:
                            batchMesh.setAttribute(i, ParticleMaterialAttribute.CORNER, 0, 0.5, -0.5);
                            batchMesh.setAttribute(i, ParticleMaterialAttribute.TEXCOORD_0, 0, uvHelper.x + uvHelper.z, uvHelper.y + uvHelper.w);
                            break;
                        case 2:
                            batchMesh.setAttribute(i, ParticleMaterialAttribute.CORNER, 0, 0.5, 0.5);
                            batchMesh.setAttribute(i, ParticleMaterialAttribute.TEXCOORD_0, 0, uvHelper.x + uvHelper.z, uvHelper.w);
                            break;
                        case 3:
                            batchMesh.setAttribute(i, ParticleMaterialAttribute.CORNER, 0, -0.5, 0.5, uvHelper.z, uvHelper.w);
                            batchMesh.setAttribute(i, ParticleMaterialAttribute.TEXCOORD_0, 0, uvHelper.z, uvHelper.w);
                            break;
                    }
                }

                //
                batchMesh.setAttribute(i, ParticleMaterialAttribute.START_POSITION, 0, positionHelper.x, positionHelper.y, positionHelper.z);
                batchMesh.setAttribute(i, ParticleMaterialAttribute.START_VELOCITY, 0, velocityHelper.x, velocityHelper.y, velocityHelper.z);
                batchMesh.setAttribute(i, ParticleMaterialAttribute.START_COLOR, 0, startColorHelper.r, startColorHelper.g, startColorHelper.b, startColorHelper.a);
                batchMesh.setAttribute(i, ParticleMaterialAttribute.START_SIZE, 0, startSizeHelper.x, startSizeHelper.y, startSizeHelper.z);
                batchMesh.setAttribute(i, ParticleMaterialAttribute.START_ROTATION, 0, startRotationHelper.x, startRotationHelper.y, startRotationHelper.z);
                batchMesh.setAttribute(i, ParticleMaterialAttribute.TIME, 0, lifetime, time);
                //
                if (needRandom0) {
                    batchMesh.setAttribute(i, ParticleMaterialAttribute.RANDOM0, 0, randomColor, randomSize, randomRotation, randomTextureAnimation);
                }
                if (neeedRandomVelocity) {
                    batchMesh.setAttribute(i, ParticleMaterialAttribute.RANDOM1, 0, randomVelocityX, randomVelocityY, randomVelocityZ, 0);
                }
                if (comp.main.simulationSpace === SimulationSpace.World) {
                    batchMesh.setAttribute(i, ParticleMaterialAttribute.WORLD_POSITION, 0, worldPosition.x, worldPosition.y, worldPosition.z);
                    batchMesh.setAttribute(i, ParticleMaterialAttribute.WORLD_ROTATION, 0, worldRotation.x, worldRotation.y, worldRotation.z, worldRotation.w);
                }
            };

            //TODO理论上应该是每帧更新，不过现在没有物理系统，先放到这里
            const gravityModifier = comp.main.gravityModifier.constant;
            this._finalGravity.x = GRAVITY.x * gravityModifier;
            this._finalGravity.y = GRAVITY.y * gravityModifier;
            this._finalGravity.z = GRAVITY.z * gravityModifier;
        }

        private _emit(time: number): boolean {
            const maxParticles = this._comp.main.maxParticles;
            var nextCursor = this._firstAliveCursor + 1 > maxParticles ? 0 : this._firstAliveCursor + 1;
            if (nextCursor >= maxParticles) {
                nextCursor = 0;
            }

            if (!this._isParticleExpired(nextCursor)) {
                return false;
            }

            //
            this._addParticle(time);
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
            this._vertexStartTimeOffset = 0;
            this._vertexTimeBuffer = null;
            this._vertexAttributes = null;
            this._burstIndex = 0;

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

            const maxParticleCount = comp.main.maxParticles;
            if (renderer._renderMode === ParticleRenderMode.None || maxParticleCount <= 0) {
                throw "ParticleSystem : error renderMode or maxParticleCount";
            }

            if (renderer.materials.length !== 1) {
                throw "ParticleSystem : materials.length != 1";
            }

            if (renderer._renderMode === ParticleRenderMode.Mesh) {
                const mesh = renderer.mesh;
                if (mesh.subMeshCount > 1) {
                    throw "ParticleSystem : subMeshCount > 1";
                }
                this._vertexStride = mesh.vertexCount;
                this._vertexStartTimeOffset = this._vertexStride * maxParticleCount * 25;
            } else {
                this._vertexStride = 4;
                this._vertexStartTimeOffset = this._vertexStride * maxParticleCount * 20;
            }

            renderer.batchMesh = createBatchMesh(renderer, maxParticleCount);

            //粒子系统不能用共享材质
            renderer.batchMaterial = renderer.materials[0].clone();
            renderer.batchMesh.uploadSubIndexBuffer();
            this._vertexTimeBuffer = renderer.batchMesh.getAttributes(ParticleMaterialAttribute.TIME);

            const primitive = renderer.batchMesh.glTFMesh.primitives[0];
            this._vertexAttributes = [];
            for (const k in primitive.attributes) {
                this._vertexAttributes.push(k as gltf.MeshAttribute);
            }
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
                if (comp.emission.bursts.length > 0) {
                    let readyEmitCount = 0;
                    readyEmitCount += this._getBurstCount(lastEmittsionTime, this._emittsionTime);
                    readyEmitCount = Math.min(comp.main.maxParticles - this.aliveParticleCount, readyEmitCount);
                    //
                    for (let i = 0; i < readyEmitCount; i++) {
                        this._emit(this._time);
                    }
                }
                //由时间触发的粒子发射
                const rateOverTime = comp.emission.rateOverTime.evaluate();
                if (rateOverTime > 0) {
                    const minEmissionTime: number = 1 / rateOverTime;
                    this._frameRateTime += elapsedTime;

                    while (this._frameRateTime > minEmissionTime) {
                        if (!this._emit(this._time)) {
                            break;
                        }
                        this._frameRateTime -= minEmissionTime;
                    }
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
            if (!renderer) {
                return;
            }
            const comp = this._comp;
            //
            if (this._dirty) {
                //为了性能，不能提交整个buffer，只提交改变的buffer
                const vertexStride = this._vertexStride;
                if (this._firstAliveCursor > this._lastFrameFirstCursor) {
                    const bufferOffset = this._lastFrameFirstCursor * vertexStride;
                    const bufferCount = (this._firstAliveCursor - this._lastFrameFirstCursor) * vertexStride;
                    renderer.batchMesh.uploadVertexSubData(this._vertexAttributes, bufferOffset, bufferCount);
                } else {
                    const addCount = comp.main.maxParticles - this._lastFrameFirstCursor;
                    const bufferOffset = this._lastFrameFirstCursor * vertexStride;
                    //先更新尾部的，再更新头部的
                    renderer.batchMesh.uploadVertexSubData(this._vertexAttributes, this._lastFrameFirstCursor * vertexStride, addCount * vertexStride);
                    renderer.batchMesh.uploadVertexSubData(this._vertexAttributes, 0, this._firstAliveCursor * vertexStride);
                }
                this._lastFrameFirstCursor = this._firstAliveCursor;
                this._dirty = false;
            }

            const transform = comp.gameObject.transform;
            if (comp.main.simulationSpace === SimulationSpace.Local) {
                renderer._setVector3(ParticleMaterialUniform.WORLD_POSITION, transform.getPosition());
                renderer._setVector4(ParticleMaterialUniform.WORLD_ROTATION, transform.getRotation());
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