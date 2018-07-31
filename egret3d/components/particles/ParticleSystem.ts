namespace egret3d.particle {
    /**
     * 
     */
    export class ParticleSystem extends paper.BaseSystem {
        protected readonly _interests = [
            {
                componentClass: ParticleComponent,
                listeners: [
                    { type: ParticleCompEventType.StartRotation3DChanged, listener: (comp: ParticleComponent) => { this._onMainUpdate(comp, ParticleCompEventType.StartRotation3DChanged) } },
                    { type: ParticleCompEventType.SimulationSpaceChanged, listener: (comp: ParticleComponent) => { this._onMainUpdate(comp, ParticleCompEventType.SimulationSpaceChanged) } },
                    { type: ParticleCompEventType.ScaleModeChanged, listener: (comp: ParticleComponent) => { this._onMainUpdate(comp, ParticleCompEventType.ScaleModeChanged) } },
                    { type: ParticleCompEventType.VelocityChanged, listener: this._onVelocityOverLifetime.bind(this) },
                    { type: ParticleCompEventType.ColorChanged, listener: this._onColorOverLifetime.bind(this) },
                    { type: ParticleCompEventType.SizeChanged, listener: this._onSizeOverLifetime.bind(this) },
                    { type: ParticleCompEventType.RotationChanged, listener: this._onRotationOverLifetime.bind(this) },
                    { type: ParticleCompEventType.TextureSheetChanged, listener: this._onTextureSheetAnimation.bind(this) },
                ]
            },
            {
                componentClass: ParticleRenderer,
                listeners: [
                    { type: ParticleRendererEventType.Mesh, listener: (comp: ParticleRenderer) => { this._updateDrawCalls(comp.gameObject); } },
                    { type: ParticleRendererEventType.Materials, listener: (comp: ParticleRenderer) => { this._updateDrawCalls(comp.gameObject); } },
                    { type: ParticleRendererEventType.LengthScaleChanged, listener: (comp: ParticleRenderer) => { this._onRenderUpdate(comp, ParticleRendererEventType.LengthScaleChanged); } },
                    { type: ParticleRendererEventType.VelocityScaleChanged, listener: (comp: ParticleRenderer) => { this._onRenderUpdate(comp, ParticleRendererEventType.VelocityScaleChanged); } },
                    { type: ParticleRendererEventType.RenderMode, listener: (comp: ParticleRenderer) => { this._onRenderUpdate(comp, ParticleRendererEventType.RenderMode); } },
                ]
            }
        ];
        private readonly _drawCalls: DrawCalls = this._globalGameObject.getOrAddComponent(DrawCalls);
        /**
        * Buffer改变的时候，有可能是初始化，也有可能是mesh改变，此时全部刷一下
        */
        private _onUpdateBatchMesh(comp: ParticleComponent) {
            const renderer = this._groups[0].getComponent(comp.gameObject, 1) as ParticleRenderer;
            comp.initBatcher();
            //
            this._onRenderUpdate(renderer, ParticleRendererEventType.RenderMode);
            this._onRenderUpdate(renderer, ParticleRendererEventType.LengthScaleChanged);
            this._onRenderUpdate(renderer, ParticleRendererEventType.VelocityScaleChanged);
            //
            this._onMainUpdate(comp, ParticleCompEventType.StartRotation3DChanged);
            this._onMainUpdate(comp, ParticleCompEventType.SimulationSpaceChanged);
            this._onMainUpdate(comp, ParticleCompEventType.ScaleModeChanged);

            this._onShapeChanged(comp);
            this._onVelocityOverLifetime(comp);
            this._onColorOverLifetime(comp);
            this._onSizeOverLifetime(comp);
            this._onRotationOverLifetime(comp);
            this._onTextureSheetAnimation(comp);
        }

        private _onRenderUpdate(render: ParticleRenderer, type: ParticleRendererEventType) {
            if (!this._enabled || !this._groups[0].hasGameObject(render.gameObject)) {
                return;
            }

            switch (type) {
                case ParticleRendererEventType.RenderMode: {
                    this._onRenderMode(render);
                    break;
                }
                case ParticleRendererEventType.LengthScaleChanged: {
                    render._setFloat(ParticleMaterialUniform.LENGTH_SCALE, render.lengthScale);
                    break;
                }
                case ParticleRendererEventType.VelocityScaleChanged: {
                    render._setFloat(ParticleMaterialUniform.SPEED_SCALE, render.velocityScale);
                    break;
                }
            }
        }

        /**
         * 
         * @param render 渲染模式改变
         */
        private _onRenderMode(render: ParticleRenderer) {
            render._removeShaderDefine(ParticleMaterialDefine.SPHERHBILLBOARD);
            render._removeShaderDefine(ParticleMaterialDefine.STRETCHEDBILLBOARD);
            render._removeShaderDefine(ParticleMaterialDefine.HORIZONTALBILLBOARD);
            render._removeShaderDefine(ParticleMaterialDefine.VERTICALBILLBOARD);
            render._removeShaderDefine(ParticleMaterialDefine.RENDERMESH);

            const mode = render.renderMode;
            switch (mode) {
                case ParticleRenderMode.Billboard: {
                    render._addShaderDefine(ParticleMaterialDefine.SPHERHBILLBOARD);
                    break;
                }
                case ParticleRenderMode.Stretch: {
                    render._addShaderDefine(ParticleMaterialDefine.STRETCHEDBILLBOARD);
                    break;
                }
                case ParticleRenderMode.HorizontalBillboard: {
                    render._addShaderDefine(ParticleMaterialDefine.HORIZONTALBILLBOARD);
                    break;
                }
                case ParticleRenderMode.VerticalBillboard: {
                    render._addShaderDefine(ParticleMaterialDefine.VERTICALBILLBOARD);
                    break;
                }
                case ParticleRenderMode.Mesh: {
                    render._addShaderDefine(ParticleMaterialDefine.RENDERMESH);
                    break;
                }
                default: {
                    throw "_onRenderMode:invalid renderMode";
                }
            }
        }
        private _onMainUpdate(component: ParticleComponent, type: ParticleCompEventType) {
            if (!this._enabled || !this._groups[0].hasGameObject(component.gameObject)) {
                return;
            }

            const renderer = this._groups[0].getComponent(component.gameObject, 1) as ParticleRenderer;
            const mainModule = component.main;
            switch (type) {
                case ParticleCompEventType.StartRotation3DChanged: {
                    renderer._setBoolean(ParticleMaterialUniform.START_ROTATION3D, mainModule._startRotation3D);
                    break;
                }
                case ParticleCompEventType.SimulationSpaceChanged: {
                    renderer._setInt(ParticleMaterialUniform.SIMULATION_SPACE, mainModule._simulationSpace);
                    break;
                }
                case ParticleCompEventType.ScaleModeChanged: {
                    renderer._setInt(ParticleMaterialUniform.SCALING_MODE, mainModule._scaleMode);
                    break;
                }
            }
        }
        /**
         * 更新速率模块
         * @param component 
         */
        private _onShapeChanged(comp: ParticleComponent) {
            if (!this._enabled || !this._groups[0].hasGameObject(comp.gameObject)) {
                return;
            }

            const renderer = this._groups[0].getComponent(comp.gameObject, 1) as ParticleRenderer;
            renderer._removeShaderDefine(ParticleMaterialDefine.SHAPE);
            if (comp.shape.enable) {
                renderer._addShaderDefine(ParticleMaterialDefine.SHAPE);
            }
        }
        /**
         * 更新速率模块
         * @param component 
         */
        private _onVelocityOverLifetime(comp: ParticleComponent) {
            if (!this._enabled || !this._groups[0].hasGameObject(comp.gameObject)) {
                return;
            }

            const renderer = this._groups[0].getComponent(comp.gameObject, 1) as ParticleRenderer;
            renderer._removeShaderDefine(ParticleMaterialDefine.VELOCITYCONSTANT);
            renderer._removeShaderDefine(ParticleMaterialDefine.VELOCITYCURVE);
            renderer._removeShaderDefine(ParticleMaterialDefine.VELOCITYTWOCONSTANT);
            renderer._removeShaderDefine(ParticleMaterialDefine.VELOCITYTWOCURVE);
            const velocityModule = comp.velocityOverLifetime;
            if (velocityModule.enable) {
                const mode = velocityModule._mode;
                switch (mode) {
                    case CurveMode.Constant: {
                        renderer._addShaderDefine(ParticleMaterialDefine.VELOCITYCONSTANT);
                        //
                        const vec3 = new Vector3(velocityModule._x.evaluate(), velocityModule._y.evaluate(), velocityModule._z.evaluate());
                        renderer._setVector3(ParticleMaterialUniform.VELOCITY_CONST, vec3);
                        break;
                    }
                    case CurveMode.Curve: {
                        renderer._addShaderDefine(ParticleMaterialDefine.VELOCITYCURVE);
                        //
                        renderer._setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_X, velocityModule._x.curve.floatValues);
                        renderer._setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_Y, velocityModule._y.curve.floatValues);
                        renderer._setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_Z, velocityModule._z.curve.floatValues);
                        break;
                    }
                    case CurveMode.TwoConstants: {
                        renderer._addShaderDefine(ParticleMaterialDefine.VELOCITYTWOCONSTANT);
                        //
                        const minVec3 = new Vector3(velocityModule._x.constantMin, velocityModule._y.constantMin, velocityModule._z.constantMin);
                        const maxVec3 = new Vector3(velocityModule._x.constantMax, velocityModule._y.constantMax, velocityModule._z.constantMax);
                        renderer._setVector3(ParticleMaterialUniform.VELOCITY_CONST, minVec3);
                        renderer._setVector3(ParticleMaterialUniform.VELOCITY_CONST_MAX, maxVec3);
                        break;
                    }
                    case CurveMode.TwoCurves: {
                        renderer._addShaderDefine(ParticleMaterialDefine.VELOCITYTWOCURVE);
                        //
                        renderer._setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_X, velocityModule._x.curveMin.floatValues);
                        renderer._setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_Y, velocityModule._y.curveMin.floatValues);
                        renderer._setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_Z, velocityModule._z.curveMin.floatValues);
                        renderer._setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_MAX_X, velocityModule._x.curveMax.floatValues);
                        renderer._setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_MAX_Y, velocityModule._y.curveMax.floatValues);
                        renderer._setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_MAX_Z, velocityModule._z.curveMax.floatValues);
                        break;
                    }
                }
                renderer._setInt(ParticleMaterialUniform.SPACE_TYPE, velocityModule._space);
            }
        }
        /**
         * 更新颜色模块
         * @param component 
         */
        private _onColorOverLifetime(comp: ParticleComponent) {
            if (!this._enabled || !this._groups[0].hasGameObject(comp.gameObject)) {
                return;
            }

            const renderer = this._groups[0].getComponent(comp.gameObject, 1) as ParticleRenderer;
            renderer._removeShaderDefine(ParticleMaterialDefine.COLOROGRADIENT);
            renderer._removeShaderDefine(ParticleMaterialDefine.COLORTWOGRADIENTS);

            const colorModule = comp.colorOverLifetime;
            if (colorModule.enable) {
                const color = colorModule._color;
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
        private _onSizeOverLifetime(comp: ParticleComponent) {
            if (!this._enabled || !this._groups[0].hasGameObject(comp.gameObject)) {
                return;
            }

            const renderer = this._groups[0].getComponent(comp.gameObject, 1) as ParticleRenderer;
            renderer._removeShaderDefine(ParticleMaterialDefine.SIZECURVE);
            renderer._removeShaderDefine(ParticleMaterialDefine.SIZECURVESEPERATE);
            renderer._removeShaderDefine(ParticleMaterialDefine.SIZETWOCURVES);
            renderer._removeShaderDefine(ParticleMaterialDefine.SIZETWOCURVESSEPERATE);

            const sizeModule = comp.sizeOverLifetime;
            if (sizeModule.enable) {
                const separateAxes = sizeModule._separateAxes;
                const mode = sizeModule._x.mode;
                switch (mode) {
                    case CurveMode.Curve: {
                        if (separateAxes) {
                            renderer._addShaderDefine(ParticleMaterialDefine.SIZECURVESEPERATE);
                            //
                            renderer._setVector2v(ParticleMaterialUniform.SIZE_CURVE_X, sizeModule._x.curve.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.SIZE_CURVE_Y, sizeModule._y.curve.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.SIZE_CURVE_Z, sizeModule._z.curve.floatValues);
                        } else {
                            renderer._addShaderDefine(ParticleMaterialDefine.SIZECURVE);
                            //
                            renderer._setVector2v(ParticleMaterialUniform.SIZE_CURVE, sizeModule._size.curve.floatValues);
                        }
                        break;
                    }
                    case CurveMode.TwoCurves: {
                        if (separateAxes) {
                            renderer._addShaderDefine(ParticleMaterialDefine.SIZETWOCURVESSEPERATE);
                            //
                            renderer._setVector2v(ParticleMaterialUniform.SIZE_CURVE_X, sizeModule._x.curveMin.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.SIZE_CURVE_Y, sizeModule._y.curveMin.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.SIZE_CURVE_Z, sizeModule._z.curveMin.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.SIZE_CURVE_MAX_X, sizeModule._x.curveMax.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.SIZE_CURVE_MAX_Y, sizeModule._y.curveMax.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.SIZE_CURVE_MAX_Z, sizeModule._z.curveMax.floatValues);
                        } else {
                            renderer._addShaderDefine(ParticleMaterialDefine.SIZETWOCURVES);
                            //
                            renderer._setVector2v(ParticleMaterialUniform.SIZE_CURVE, sizeModule._size.curveMin.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.SIZE_CURVE_MAX, sizeModule._size.curveMax.floatValues);
                        }
                        break;
                    }
                }
            }
        }
        /**
         * 更新旋转模块
         * @param comp
         */
        private _onRotationOverLifetime(comp: ParticleComponent) {
            if (!this._enabled || !this._groups[0].hasGameObject(comp.gameObject)) {
                return;
            }

            const renderer = this._groups[0].getComponent(comp.gameObject, 1) as ParticleRenderer;
            renderer._removeShaderDefine(ParticleMaterialDefine.ROTATIONOVERLIFETIME);
            renderer._removeShaderDefine(ParticleMaterialDefine.ROTATIONCONSTANT);
            renderer._removeShaderDefine(ParticleMaterialDefine.ROTATIONTWOCONSTANTS);
            renderer._removeShaderDefine(ParticleMaterialDefine.ROTATIONSEPERATE);
            renderer._removeShaderDefine(ParticleMaterialDefine.ROTATIONCURVE);
            renderer._removeShaderDefine(ParticleMaterialDefine.ROTATIONTWOCURVES);

            const rotationModule = comp.rotationOverLifetime;
            if (rotationModule.enable) {
                const mode = comp.rotationOverLifetime._x.mode;
                const separateAxes = rotationModule._separateAxes;
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
                            renderer._setVector3(ParticleMaterialUniform.ROTATION_CONST_SEPRARATE, new Vector3(rotationModule._x.constant, rotationModule._y.constant, rotationModule._z.constant));
                        } else {
                            renderer._setFloat(ParticleMaterialUniform.ROTATION_CONST, rotationModule._z.constant);
                        }
                        break;
                    }
                    case CurveMode.TwoConstants: {
                        renderer._addShaderDefine(ParticleMaterialDefine.ROTATIONTWOCONSTANTS);
                        //
                        if (separateAxes) {
                            renderer._setVector3(ParticleMaterialUniform.ROTATION_CONST_SEPRARATE, new Vector3(rotationModule._x.constantMin, rotationModule._y.constantMin, rotationModule._z.constantMin));
                            renderer._setVector3(ParticleMaterialUniform.ROTATION_CONST_MAX_SEPRARATE, new Vector3(rotationModule._x.constantMax, rotationModule._y.constantMax, rotationModule._z.constantMax));
                        } else {
                            renderer._setFloat(ParticleMaterialUniform.ROTATION_CONST, rotationModule._z.constantMin);
                            renderer._setFloat(ParticleMaterialUniform.ROTATION_CONST_MAX, rotationModule._z.constantMax);
                        }
                        break;
                    }
                    case CurveMode.Curve: {
                        renderer._addShaderDefine(ParticleMaterialDefine.ROTATIONCURVE);
                        //
                        if (separateAxes) {
                            renderer._setVector2v(ParticleMaterialUniform.ROTATE_CURVE_X, rotationModule._x.curve.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.ROTATE_CURVE_y, rotationModule._y.curve.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.ROTATE_CURVE_Z, rotationModule._z.curve.floatValues);
                        } else {
                            renderer._setVector2v(ParticleMaterialUniform.ROTATION_CURVE, rotationModule._z.curve.floatValues);
                        }
                        break;
                    }
                    case CurveMode.TwoCurves: {
                        renderer._addShaderDefine(ParticleMaterialDefine.ROTATIONTWOCURVES);
                        //
                        if (separateAxes) {
                            renderer._setVector2v(ParticleMaterialUniform.ROTATE_CURVE_X, rotationModule._x.curveMin.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.ROTATE_CURVE_y, rotationModule._y.curveMin.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.ROTATE_CURVE_Z, rotationModule._z.curveMin.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.ROTATION_CURVE_MAX_X, rotationModule._x.curveMax.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.ROTATION_CURVE_MAX_Y, rotationModule._y.curveMax.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.ROTATION_CURVE_MAX_Z, rotationModule._z.curveMax.floatValues);
                        } else {
                            renderer._setVector2v(ParticleMaterialUniform.ROTATION_CURVE, rotationModule._z.curveMin.floatValues);
                            renderer._setVector2v(ParticleMaterialUniform.ROTATION_CURVE_MAX, rotationModule._z.curveMin.floatValues);
                        }
                        break;
                    }
                }
            }
        }

        private _onTextureSheetAnimation(comp: ParticleComponent) {
            if (!this._enabled || !this._groups[0].hasGameObject(comp.gameObject)) {
                return;
            }

            const renderer = this._groups[0].getComponent(comp.gameObject, 1) as ParticleRenderer;
            renderer._removeShaderDefine(ParticleMaterialDefine.TEXTURESHEETANIMATIONCURVE);
            renderer._removeShaderDefine(ParticleMaterialDefine.TEXTURESHEETANIMATIONTWOCURVE);

            const module = comp.textureSheetAnimation;
            if (module.enable) {
                const type = module._frameOverTime.mode;
                switch (type) {
                    case CurveMode.Curve: {
                        renderer._addShaderDefine(ParticleMaterialDefine.TEXTURESHEETANIMATIONCURVE);
                        //
                        renderer._setVector2v(ParticleMaterialUniform.UV_CURVE, module._frameOverTime.curve.floatValues);
                        break;
                    }
                    case CurveMode.TwoCurves: {
                        renderer._addShaderDefine(ParticleMaterialDefine.TEXTURESHEETANIMATIONTWOCURVE);
                        //
                        renderer._setVector2v(ParticleMaterialUniform.UV_CURVE, module._frameOverTime.curveMin.floatValues);
                        renderer._setVector2v(ParticleMaterialUniform.UV_CURVE_MAX, module._frameOverTime.curveMax.floatValues);
                        break;
                    }
                }

                if (type === CurveMode.Curve || type === CurveMode.TwoCurves) {
                    renderer._setFloat(ParticleMaterialUniform.CYCLES, module._cycleCount);
                    renderer._setVector4v(ParticleMaterialUniform.SUB_UV, module.floatValues);
                }
            }
        }

        private _updateDrawCalls(gameObject: paper.GameObject) {
            if (!this._enabled || !this._groups[0].hasGameObject(gameObject)) {
                return;
            }

            const component = this._groups[0].getComponent(gameObject, 0) as ParticleComponent;
            const renderer = this._groups[0].getComponent(gameObject, 1) as ParticleRenderer;
            //
            this._onUpdateBatchMesh(component);
            if (!renderer.batchMesh || !renderer.batchMaterial) {
                return;
            }
            //
            this._drawCalls.removeDrawCalls(renderer);
            //
            this._drawCalls.renderers.push(renderer);
            //
            let subMeshIndex = 0;
            const primitives = renderer.batchMesh.glTFMesh.primitives;

            if (primitives.length !== 1) {
                console.error("ParticleSystem : materials.length != 1");
            }

            if (renderer._renderMode === ParticleRenderMode.None) {
                console.error("ParticleSystem : error renderMode");
            }

            for (const primitive of primitives) {
                const drawCall: DrawCall = {
                    renderer: renderer,

                    subMeshIndex: subMeshIndex++,
                    mesh: renderer.batchMesh,
                    material: renderer.batchMaterial || DefaultMaterials.MissingMaterial,

                    frustumTest: false,
                    zdist: -1,

                    disable: false,
                };

                this._drawCalls.drawCalls.push(drawCall);
            }
        }

        public onEnable() {
            const components = this._groups[0].components as ReadonlyArray<ParticleComponent | ParticleRenderer>;
            for (let i = 0, l = components.length; i < l; i += 2) {
                this._updateDrawCalls(components[i].gameObject);
            }
        }

        public onAddGameObject(gameObject: paper.GameObject, group: paper.Group) {
            this._updateDrawCalls(gameObject);

            const component = group.getComponent(gameObject, 0) as ParticleComponent;
            if (component.main.playOnAwake) {
                component.play();
            }
        }

        public onRemoveGameObject(gameObject: paper.GameObject) {
            this._drawCalls.removeDrawCalls(gameObject.renderer);
            // component.stop();
        }

        public onUpdate(deltaTime: number) {
            const components = this._groups[0].components as ReadonlyArray<ParticleComponent | ParticleRenderer>;
            for (let i = 0, l = components.length; i < l; i += 2) {
                const particleComp = components[i] as ParticleComponent;
                particleComp.update(deltaTime);
            }
        }

        public onDisable() {
            const components = this._groups[0].components as ReadonlyArray<ParticleComponent | ParticleRenderer>;
            for (let i = 0, l = components.length; i < l; i += 2) {
                const renderer = components[i + 1] as ParticleRenderer;
                this._drawCalls.removeDrawCalls(renderer);
            }
        }
    }
}