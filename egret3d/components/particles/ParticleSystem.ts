namespace egret3d.particle {
    export class ParticleSystem extends paper.BaseSystem<ParticleComponent | ParticleRenderer>{
        /**
         * @inheritDoc
         */
        protected readonly _interests = [
            {
                componentClass: ParticleComponent,
                listeners: [
                    { type: ParticleComponenetEventType.VelocityOverLifetime, listener: this._onVelocityOverLifetime },
                    { type: ParticleComponenetEventType.ColorOverLifetime, listener: this._onColorOverLifetime },
                    { type: ParticleComponenetEventType.SizeOverLifetime, listener: this._onSizeOverLifetime },
                    { type: ParticleComponenetEventType.RotationOverLifetime, listener: this._onRotationOverLifetime },
                    { type: ParticleComponenetEventType.TextureSheetAnimation, listener: this._onTextureSheetAnimation },
                ]
            },
            {
                componentClass: ParticleRenderer,
                listeners: [
                    { type: ParticleRendererEventType.Mesh, listener: (comp: ParticleRenderer) => { this._onUpdateDrawCall(comp.gameObject, this._drawCallList); } },
                    { type: ParticleRendererEventType.Materials, listener: (comp: ParticleRenderer) => { this._onUpdateDrawCall(comp.gameObject, this._drawCallList); } },
                    { type: ParticleRendererEventType.RenderMode, listener: this._onRenderMode },
                ]
            }
        ];

        private readonly _createDrawCalls = ((gameObject: paper.GameObject) => {
            const renderer = gameObject.getComponent(ParticleRenderer);
            //粒子系统不支持多材质
            if (renderer && renderer.batchMesh && renderer.batchMaterial) {
                let subMeshIndex = 0;
                const drawCalls: DrawCall[] = [];
                const primitives = renderer.batchMesh.glTFMesh.primitives;

                if (primitives.length !== 1) {
                    console.error("ParticleSystem : materials.length != 1");
                }

                if (renderer._renderMode === ParticleRenderMode.None) {
                    console.error("ParticleSystem : error renderMode");
                }

                for (const primitive of primitives) {
                    drawCalls.push({
                        subMeshInfo: subMeshIndex,
                        mesh: renderer.batchMesh,
                        material: renderer.batchMaterial,
                        lightMapIndex: -1,
                        lightMapScaleOffset: null,
                        boneData: null,
                        gameObject: gameObject,
                        transform: gameObject.transform,
                        frustumTest: false,
                        zdist: -1
                    });

                    subMeshIndex++;
                }

                return drawCalls;
            }

            return null;
        });

        private readonly _drawCallList: DrawCallList = new DrawCallList(this._createDrawCalls);
        private _globalTimer: number;

        private _onUpdateDrawCall(gameObject: paper.GameObject, drawCalls: DrawCallList) {
            const comp = gameObject.getComponent(ParticleComponent);
            const renderer = gameObject.getComponent(ParticleRenderer);
            if (comp && renderer) {
                if (comp.enabled && renderer.enabled) {
                    this._onUpdateBatchMesh(comp);
                    comp.main.playOnAwake && comp.play();
                } else {
                    comp.stop();
                }
            }
            drawCalls.updateDrawCalls(gameObject, false);
        }
        /**
        * Buffer改变的时候，有可能是初始化，也有可能是mesh改变，此时全部刷一下
        */
        private _onUpdateBatchMesh(comp: ParticleComponent) {
            const renderer = comp.gameObject.getComponent(ParticleRenderer);
            if (!comp || !renderer) {
                return;
            }

            comp.initBatcher();
            //
            this._onRenderMode(renderer);
            this._onShapeChanged(comp);
            this._onVelocityOverLifetime(comp);
            this._onColorOverLifetime(comp);
            this._onSizeOverLifetime(comp);
            this._onRotationOverLifetime(comp);
            this._onTextureSheetAnimation(comp);
        }

        /**
         * 
         * @param component 渲染模式改变
         */
        private _onRenderMode(component: ParticleRenderer) {
            component._removeShaderDefine(ParticleMaterialDefine.SPHERHBILLBOARD);
            component._removeShaderDefine(ParticleMaterialDefine.STRETCHEDBILLBOARD);
            component._removeShaderDefine(ParticleMaterialDefine.HORIZONTALBILLBOARD);
            component._removeShaderDefine(ParticleMaterialDefine.VERTICALBILLBOARD);
            component._removeShaderDefine(ParticleMaterialDefine.RENDERMESH);

            const mode = component.renderMode;
            switch (mode) {
                case ParticleRenderMode.Billboard: {
                    component._addShaderDefine(ParticleMaterialDefine.SPHERHBILLBOARD);
                    break;
                }
                case ParticleRenderMode.Stretch: {
                    component._addShaderDefine(ParticleMaterialDefine.STRETCHEDBILLBOARD);
                    break;
                }
                case ParticleRenderMode.HorizontalBillboard: {
                    component._addShaderDefine(ParticleMaterialDefine.HORIZONTALBILLBOARD);
                    break;
                }
                case ParticleRenderMode.VerticalBillboard: {
                    component._addShaderDefine(ParticleMaterialDefine.VERTICALBILLBOARD);
                    break;
                }
                case ParticleRenderMode.Mesh: {
                    component._addShaderDefine(ParticleMaterialDefine.RENDERMESH);
                    break;
                }
                default: {
                    throw "_onRenderMode:invalid renderMode";
                }
            }
        }
        /**
         * 更新速率模块
         * @param component 
         */
        private _onShapeChanged(component: ParticleComponent) {
            const renderer = component.gameObject.getComponent(ParticleRenderer);
            renderer._removeShaderDefine(ParticleMaterialDefine.SHAPE);
            if (component.shape.enable) {
                renderer._addShaderDefine(ParticleMaterialDefine.SHAPE);
            }
        }
        /**
         * 更新速率模块
         * @param component 
         */
        private _onVelocityOverLifetime(component: ParticleComponent) {
            const renderer = component.gameObject.getComponent(ParticleRenderer);
            renderer._removeShaderDefine(ParticleMaterialDefine.VELOCITYCONSTANT);
            renderer._removeShaderDefine(ParticleMaterialDefine.VELOCITYCURVE);
            renderer._removeShaderDefine(ParticleMaterialDefine.VELOCITYTWOCONSTANT);
            renderer._removeShaderDefine(ParticleMaterialDefine.VELOCITYTWOCURVE);
            const velocityModule = component.velocityOverLifetime;
            if (velocityModule.enable) {
                const mode = velocityModule.mode;
                switch (mode) {
                    case CurveMode.Constant: {
                        renderer._addShaderDefine(ParticleMaterialDefine.VELOCITYCONSTANT);
                        //
                        const vec3 = new Vector3(velocityModule.x.evaluate(), velocityModule.y.evaluate(), velocityModule.z.evaluate());
                        renderer._setVector3(ParticleMaterialUniform.VELOCITY_CONST, vec3);
                        break;
                    }
                    case CurveMode.Curve: {
                        renderer._addShaderDefine(ParticleMaterialDefine.VELOCITYCURVE);
                        //
                        renderer._setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_X, velocityModule.x.curve.floatValues);
                        renderer._setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_Y, velocityModule.y.curve.floatValues);
                        renderer._setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_Z, velocityModule.z.curve.floatValues);
                        break;
                    }
                    case CurveMode.TwoConstants: {
                        renderer._addShaderDefine(ParticleMaterialDefine.VELOCITYTWOCONSTANT);
                        //
                        const minVec3 = new Vector3(velocityModule.x.constantMin, velocityModule.y.constantMin, velocityModule.z.constantMin);
                        const maxVec3 = new Vector3(velocityModule.x.constantMax, velocityModule.y.constantMax, velocityModule.z.constantMax);
                        renderer._setVector3(ParticleMaterialUniform.VELOCITY_CONST, minVec3);
                        renderer._setVector3(ParticleMaterialUniform.VELOCITY_CONST_MAX, maxVec3);
                        break;
                    }
                    case CurveMode.TwoCurves: {
                        renderer._addShaderDefine(ParticleMaterialDefine.VELOCITYTWOCURVE);
                        //
                        renderer._setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_X, velocityModule.x.curveMin.floatValues);
                        renderer._setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_Y, velocityModule.y.curveMin.floatValues);
                        renderer._setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_Z, velocityModule.z.curveMin.floatValues);
                        renderer._setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_MAX_X, velocityModule.x.curveMax.floatValues);
                        renderer._setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_MAX_Y, velocityModule.y.curveMax.floatValues);
                        renderer._setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_MAX_Z, velocityModule.z.curveMax.floatValues);
                        break;
                    }
                }
                renderer._setInt(ParticleMaterialUniform.SPACE_TYPE, velocityModule.space);
            }
        }
        /**
         * 更新颜色模块
         * @param component 
         */
        private _onColorOverLifetime(component: ParticleComponent) {
            const renderer = component.gameObject.getComponent(ParticleRenderer);
            renderer._removeShaderDefine(ParticleMaterialDefine.COLOROGRADIENT);
            renderer._removeShaderDefine(ParticleMaterialDefine.COLORTWOGRADIENTS);

            const colorModule = component.colorOverLifetime;
            if (colorModule.enable) {
                const color = colorModule.color;
                switch (color.mode) {
                    case ColorGradientMode.Gradient: {
                        renderer._addShaderDefine(ParticleMaterialDefine.COLOROGRADIENT);
                        //
                        renderer._setVector2v(ParticleMaterialUniform.ALPHAS_GRADIENT, color.gradient.alphaValues);
                        renderer._setVector4v(ParticleMaterialUniform.COLOR_GRADIENT, color.gradient.colorValues);
                        break;
                    }
                    case ColorGradientMode.TwoGradients: {
                        renderer._addShaderDefine(ParticleMaterialDefine.COLORTWOGRADIENTS);
                        //
                        renderer._setVector2v(ParticleMaterialUniform.ALPHAS_GRADIENT, color.gradientMin.alphaValues);
                        renderer._setVector2v(ParticleMaterialUniform.ALPHA_GRADIENT_MAX, color.gradientMax.alphaValues);
                        renderer._setVector4v(ParticleMaterialUniform.COLOR_GRADIENT, color.gradientMin.colorValues);
                        renderer._setVector4v(ParticleMaterialUniform.COLOR_GRADIENT_MAX, color.gradientMax.colorValues);
                        break;
                    }
                }
            }
        }

        /**
         * 更新大小模块
         * @param component
         */
        private _onSizeOverLifetime(component: ParticleComponent) {
            const renderer = component.gameObject.getComponent(ParticleRenderer);
            renderer._removeShaderDefine(ParticleMaterialDefine.SIZECURVE);
            renderer._removeShaderDefine(ParticleMaterialDefine.SIZECURVESEPERATE);
            renderer._removeShaderDefine(ParticleMaterialDefine.SIZETWOCURVES);
            renderer._removeShaderDefine(ParticleMaterialDefine.SIZETWOCURVESSEPERATE);

            const sizeModule = component.sizeOverLifetime;
            if (sizeModule.enable) {
                const separateAxes = sizeModule.separateAxes;
                const mode = sizeModule.x.mode;
                switch (mode) {
                    case CurveMode.Curve: {
                        if (separateAxes) {
                            renderer._addShaderDefine(ParticleMaterialDefine.SIZECURVESEPERATE);
                            //
                            renderer._setVector2v(ParticleMaterialUniform.SIZE_CURVE_X, sizeModule.x.curve.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.SIZE_CURVE_Y, sizeModule.y.curve.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.SIZE_CURVE_Z, sizeModule.z.curve.floatValues);
                        } else {
                            renderer._addShaderDefine(ParticleMaterialDefine.SIZECURVE);
                            //
                            renderer._setVector2v(ParticleMaterialUniform.SIZE_CURVE, sizeModule.size.curve.floatValues);
                        }
                        break;
                    }
                    case CurveMode.TwoCurves: {
                        if (separateAxes) {
                            renderer._addShaderDefine(ParticleMaterialDefine.SIZETWOCURVESSEPERATE);
                            //
                            renderer._setVector2v(ParticleMaterialUniform.SIZE_CURVE_X, sizeModule.x.curveMin.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.SIZE_CURVE_Y, sizeModule.y.curveMin.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.SIZE_CURVE_Z, sizeModule.z.curveMin.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.SIZE_CURVE_MAX_X, sizeModule.x.curveMax.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.SIZE_CURVE_MAX_Y, sizeModule.y.curveMax.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.SIZE_CURVE_MAX_Z, sizeModule.z.curveMax.floatValues);
                        } else {
                            renderer._addShaderDefine(ParticleMaterialDefine.SIZETWOCURVES);
                            //
                            renderer._setVector2v(ParticleMaterialUniform.SIZE_CURVE, sizeModule.size.curveMin.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.SIZE_CURVE_MAX, sizeModule.size.curveMax.floatValues);
                        }
                        break;
                    }
                }
            }
        }
        /**
         * 更新旋转模块
         * @param component
         */
        private _onRotationOverLifetime(component: ParticleComponent) {
            const renderer = component.gameObject.getComponent(ParticleRenderer);
            renderer._removeShaderDefine(ParticleMaterialDefine.ROTATIONOVERLIFETIME);
            renderer._removeShaderDefine(ParticleMaterialDefine.ROTATIONCONSTANT);
            renderer._removeShaderDefine(ParticleMaterialDefine.ROTATIONTWOCONSTANTS);
            renderer._removeShaderDefine(ParticleMaterialDefine.ROTATIONSEPERATE);
            renderer._removeShaderDefine(ParticleMaterialDefine.ROTATIONCURVE);
            renderer._removeShaderDefine(ParticleMaterialDefine.ROTATIONTWOCURVES);

            const rotationModule = component.rotationOverLifetime;
            if (rotationModule.enable) {
                const mode = component.rotationOverLifetime.x.mode;
                const separateAxes = rotationModule.separateAxes;
                if (separateAxes) {
                    renderer._addShaderDefine(ParticleMaterialDefine.ROTATIONSEPERATE);
                } else {

                    renderer._addShaderDefine(ParticleMaterialDefine.ROTATIONOVERLIFETIME);
                }
                switch (mode) {
                    case CurveMode.Constant: {
                        renderer._addShaderDefine(ParticleMaterialDefine.ROTATIONCONSTANT);
                        //
                        if (separateAxes) {
                            renderer._setVector3(ParticleMaterialUniform.ROTATION_CONST_SEPRARATE, new Vector3(rotationModule.x.constant, rotationModule.y.constant, rotationModule.z.constant));
                        } else {
                            renderer._setFloat(ParticleMaterialUniform.ROTATION_CONST, rotationModule.z.constant);
                        }
                        break;
                    }
                    case CurveMode.TwoConstants: {
                        renderer._addShaderDefine(ParticleMaterialDefine.ROTATIONTWOCONSTANTS);
                        //
                        if (separateAxes) {
                            renderer._setVector3(ParticleMaterialUniform.ROTATION_CONST_SEPRARATE, new Vector3(rotationModule.x.constantMin, rotationModule.y.constantMin, rotationModule.z.constantMin));
                            renderer._setVector3(ParticleMaterialUniform.ROTATION_CONST_MAX_SEPRARATE, new Vector3(rotationModule.x.constantMax, rotationModule.y.constantMax, rotationModule.z.constantMax));
                        } else {
                            renderer._setFloat(ParticleMaterialUniform.ROTATION_CONST, rotationModule.z.constantMin);
                            renderer._setFloat(ParticleMaterialUniform.ROTATION_CONST_MAX, rotationModule.z.constantMax);
                        }
                        break;
                    }
                    case CurveMode.Curve: {
                        renderer._addShaderDefine(ParticleMaterialDefine.ROTATIONCURVE);
                        //
                        if (separateAxes) {
                            renderer._setVector2v(ParticleMaterialUniform.ROTATE_CURVE_X, rotationModule.x.curve.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.ROTATE_CURVE_y, rotationModule.y.curve.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.ROTATE_CURVE_Z, rotationModule.z.curve.floatValues);
                        } else {
                            renderer._setVector2v(ParticleMaterialUniform.ROTATION_CURVE, rotationModule.z.curve.floatValues);
                        }
                        break;
                    }
                    case CurveMode.TwoCurves: {
                        renderer._addShaderDefine(ParticleMaterialDefine.ROTATIONTWOCURVES);
                        //
                        if (separateAxes) {
                            renderer._setVector2v(ParticleMaterialUniform.ROTATE_CURVE_X, rotationModule.x.curveMin.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.ROTATE_CURVE_y, rotationModule.y.curveMin.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.ROTATE_CURVE_Z, rotationModule.z.curveMin.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.ROTATION_CURVE_MAX_X, rotationModule.x.curveMax.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.ROTATION_CURVE_MAX_Y, rotationModule.y.curveMax.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.ROTATION_CURVE_MAX_Z, rotationModule.z.curveMax.floatValues);
                        } else {
                            renderer._setVector2v(ParticleMaterialUniform.ROTATION_CURVE, rotationModule.z.curveMin.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.ROTATION_CURVE_MAX, rotationModule.z.curveMin.floatValues);
                        }
                        break;
                    }
                }
            }
        }
        private _onTextureSheetAnimation(component: ParticleComponent) {
            const renderer = component.gameObject.getComponent(ParticleRenderer);
            renderer._removeShaderDefine(ParticleMaterialDefine.TEXTURESHEETANIMATIONCURVE);
            renderer._removeShaderDefine(ParticleMaterialDefine.TEXTURESHEETANIMATIONTWOCURVE);

            const module = component.textureSheetAnimation;
            if (module.enable) {
                const type = module.frameOverTime.mode;
                switch (type) {
                    case CurveMode.Curve: {
                        renderer._addShaderDefine(ParticleMaterialDefine.TEXTURESHEETANIMATIONCURVE);
                        //
                        renderer._setVector2v(ParticleMaterialUniform.UV_CURVE, module.frameOverTime.curve.floatValues);
                        break;
                    }
                    case CurveMode.TwoCurves: {
                        renderer._addShaderDefine(ParticleMaterialDefine.TEXTURESHEETANIMATIONTWOCURVE);
                        //
                        renderer._setVector2v(ParticleMaterialUniform.UV_CURVE, module.frameOverTime.curveMin.floatValues);
                        renderer._setVector2v(ParticleMaterialUniform.UV_CURVE_MAX, module.frameOverTime.curveMax.floatValues);
                        break;
                    }
                }

                if (type === CurveMode.Curve || type === CurveMode.TwoCurves) {
                    renderer._setFloat(ParticleMaterialUniform.CYCLES, module.cycleCount);
                    renderer._setVector2(ParticleMaterialUniform.SUB_UV_SIZE, new Vector2(1.0 / module.numTilesX, 1.0 / module.numTilesY));
                }
            }
        }
        /**
         * @inheritDoc
         */
        protected _onAddComponent(component: ParticleComponent | ParticleRenderer) {
            if (!super._onAddComponent(component)) {
                return false;
            }

            this._onUpdateDrawCall(component.gameObject, this._drawCallList);
            return true;
        }

        /**
         * @inheritDoc
         */
        protected _onRemoveComponent(component: ParticleComponent | ParticleRenderer) {
            if (!super._onRemoveComponent(component)) {
                return false;
            }

            this._drawCallList.removeDrawCalls(component.gameObject);
            return true;
        }

        /**
             * @inheritDoc
             */
        public update() {
            if (this._globalTimer !== this._globalTimer) {
                this._globalTimer = paper.Time.time;
            }

            const elapsedTime = paper.Time.time - this._globalTimer;
            for (let i = 0, l = this._components.length; i < l; i += 2) {
                const particleComp = this._components[i] as ParticleComponent;


                particleComp.update(elapsedTime);
            }

            this._globalTimer = paper.Time.time;
        }
    }
}