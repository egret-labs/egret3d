namespace egret3d.particle {
    /**
     * 
     */
    export class ParticleSystem extends paper.BaseSystem {
        protected readonly _interests = [
            {
                componentClass: ParticleComponent,
                listeners: [
                    { type: ParticleCompEventType.StartRotation3DChanged, listener: (comp: ParticleComponent) => { this._onMainUpdate(comp, ParticleCompEventType.StartRotation3DChanged); } },
                    { type: ParticleCompEventType.SimulationSpaceChanged, listener: (comp: ParticleComponent) => { this._onMainUpdate(comp, ParticleCompEventType.SimulationSpaceChanged); } },
                    { type: ParticleCompEventType.ScaleModeChanged, listener: (comp: ParticleComponent) => { this._onMainUpdate(comp, ParticleCompEventType.ScaleModeChanged); } },
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
        private readonly _drawCalls: DrawCalls = paper.GameObject.globalGameObject.getOrAddComponent(DrawCalls);
        /**
        * Buffer改变的时候，有可能是初始化，也有可能是mesh改变，此时全部刷一下
        */
        private _onUpdateBatchMesh(comp: ParticleComponent) {
            const renderer = comp.gameObject.getComponent(ParticleRenderer) as ParticleRenderer;
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

            const material = render.batchMaterial;
            switch (type) {
                case ParticleRendererEventType.RenderMode: {
                    this._onRenderMode(render);
                    break;
                }
                case ParticleRendererEventType.LengthScaleChanged: {
                    material.setFloat(ParticleMaterialUniform.LENGTH_SCALE, render.lengthScale);
                    break;
                }
                case ParticleRendererEventType.VelocityScaleChanged: {
                    material.setFloat(ParticleMaterialUniform.SPEED_SCALE, render.velocityScale);
                    break;
                }
            }
        }

        /**
         * 
         * @param render 渲染模式改变
         */
        private _onRenderMode(render: ParticleRenderer) {
            const material = render.batchMaterial;
            material.removeDefine(ParticleMaterialDefine.SPHERHBILLBOARD);
            material.removeDefine(ParticleMaterialDefine.STRETCHEDBILLBOARD);
            material.removeDefine(ParticleMaterialDefine.HORIZONTALBILLBOARD);
            material.removeDefine(ParticleMaterialDefine.VERTICALBILLBOARD);
            material.removeDefine(ParticleMaterialDefine.RENDERMESH);

            const mode = render.renderMode;
            switch (mode) {
                case ParticleRenderMode.Billboard: {
                    material.addDefine(ParticleMaterialDefine.SPHERHBILLBOARD);
                    break;
                }
                case ParticleRenderMode.Stretch: {
                    material.addDefine(ParticleMaterialDefine.STRETCHEDBILLBOARD);
                    break;
                }
                case ParticleRenderMode.HorizontalBillboard: {
                    material.addDefine(ParticleMaterialDefine.HORIZONTALBILLBOARD);
                    break;
                }
                case ParticleRenderMode.VerticalBillboard: {
                    material.addDefine(ParticleMaterialDefine.VERTICALBILLBOARD);
                    break;
                }
                case ParticleRenderMode.Mesh: {
                    material.addDefine(ParticleMaterialDefine.RENDERMESH);
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

            const renderer = component.gameObject.getComponent(ParticleRenderer) as ParticleRenderer;
            const material = renderer.batchMaterial;
            const mainModule = component.main;
            switch (type) {
                case ParticleCompEventType.StartRotation3DChanged: {
                    material.setBoolean(ParticleMaterialUniform.START_ROTATION3D, mainModule._startRotation3D);
                    break;
                }
                case ParticleCompEventType.SimulationSpaceChanged: {
                    material.setInt(ParticleMaterialUniform.SIMULATION_SPACE, mainModule._simulationSpace);
                    break;
                }
                case ParticleCompEventType.ScaleModeChanged: {
                    material.setInt(ParticleMaterialUniform.SCALING_MODE, mainModule._scaleMode);
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

            const renderer = comp.gameObject.getComponent(ParticleRenderer) as ParticleRenderer;
            const material = renderer.batchMaterial;
            material.removeDefine(ParticleMaterialDefine.SHAPE);
            if (comp.shape.enable) {
                material.addDefine(ParticleMaterialDefine.SHAPE);
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

            const renderer = comp.gameObject.getComponent(ParticleRenderer) as ParticleRenderer;
            const material = renderer.batchMaterial;
            material.removeDefine(ParticleMaterialDefine.VELOCITYCONSTANT);
            material.removeDefine(ParticleMaterialDefine.VELOCITYCURVE);
            material.removeDefine(ParticleMaterialDefine.VELOCITYTWOCONSTANT);
            material.removeDefine(ParticleMaterialDefine.VELOCITYTWOCURVE);
            const velocityModule = comp.velocityOverLifetime;
            if (velocityModule.enable) {
                const mode = velocityModule._mode;
                switch (mode) {
                    case CurveMode.Constant: {
                        material.addDefine(ParticleMaterialDefine.VELOCITYCONSTANT);
                        //
                        const vec3 = new Vector3(velocityModule._x.evaluate(), velocityModule._y.evaluate(), velocityModule._z.evaluate());
                        material.setVector3(ParticleMaterialUniform.VELOCITY_CONST, vec3);
                        break;
                    }
                    case CurveMode.Curve: {
                        material.addDefine(ParticleMaterialDefine.VELOCITYCURVE);
                        //
                        material.setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_X, velocityModule._x.curve.floatValues);
                        material.setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_Y, velocityModule._y.curve.floatValues);
                        material.setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_Z, velocityModule._z.curve.floatValues);
                        break;
                    }
                    case CurveMode.TwoConstants: {
                        material.addDefine(ParticleMaterialDefine.VELOCITYTWOCONSTANT);
                        //
                        const minVec3 = new Vector3(velocityModule._x.constantMin, velocityModule._y.constantMin, velocityModule._z.constantMin);
                        const maxVec3 = new Vector3(velocityModule._x.constantMax, velocityModule._y.constantMax, velocityModule._z.constantMax);
                        material.setVector3(ParticleMaterialUniform.VELOCITY_CONST, minVec3);
                        material.setVector3(ParticleMaterialUniform.VELOCITY_CONST_MAX, maxVec3);
                        break;
                    }
                    case CurveMode.TwoCurves: {
                        material.addDefine(ParticleMaterialDefine.VELOCITYTWOCURVE);
                        //
                        material.setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_X, velocityModule._x.curveMin.floatValues);
                        material.setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_Y, velocityModule._y.curveMin.floatValues);
                        material.setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_Z, velocityModule._z.curveMin.floatValues);
                        material.setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_MAX_X, velocityModule._x.curveMax.floatValues);
                        material.setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_MAX_Y, velocityModule._y.curveMax.floatValues);
                        material.setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_MAX_Z, velocityModule._z.curveMax.floatValues);
                        break;
                    }
                }
                material.setInt(ParticleMaterialUniform.SPACE_TYPE, velocityModule._space);
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

            const renderer = comp.gameObject.getComponent(ParticleRenderer) as ParticleRenderer;
            const material = renderer.batchMaterial;
            material.removeDefine(ParticleMaterialDefine.COLOROGRADIENT);
            material.removeDefine(ParticleMaterialDefine.COLORTWOGRADIENTS);

            const colorModule = comp.colorOverLifetime;
            if (colorModule.enable) {
                const color = colorModule._color;
                switch (color.mode) {
                    case ColorGradientMode.Gradient: {
                        material.addDefine(ParticleMaterialDefine.COLOROGRADIENT);
                        //
                        material.setVector2v(ParticleMaterialUniform.ALPHAS_GRADIENT, color.gradient.alphaValues);
                        material.setVector4v(ParticleMaterialUniform.COLOR_GRADIENT, color.gradient.colorValues);
                        break;
                    }
                    case ColorGradientMode.TwoGradients: {
                        material.addDefine(ParticleMaterialDefine.COLORTWOGRADIENTS);
                        //
                        material.setVector2v(ParticleMaterialUniform.ALPHAS_GRADIENT, color.gradientMin.alphaValues);
                        material.setVector2v(ParticleMaterialUniform.ALPHA_GRADIENT_MAX, color.gradientMax.alphaValues);
                        material.setVector4v(ParticleMaterialUniform.COLOR_GRADIENT, color.gradientMin.colorValues);
                        material.setVector4v(ParticleMaterialUniform.COLOR_GRADIENT_MAX, color.gradientMax.colorValues);
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

            const renderer = comp.gameObject.getComponent(ParticleRenderer) as ParticleRenderer;
            const material = renderer.batchMaterial;
            material.removeDefine(ParticleMaterialDefine.SIZECURVE);
            material.removeDefine(ParticleMaterialDefine.SIZECURVESEPERATE);
            material.removeDefine(ParticleMaterialDefine.SIZETWOCURVES);
            material.removeDefine(ParticleMaterialDefine.SIZETWOCURVESSEPERATE);

            const sizeModule = comp.sizeOverLifetime;
            if (sizeModule.enable) {
                const separateAxes = sizeModule._separateAxes;
                const mode = sizeModule._x.mode;
                switch (mode) {
                    case CurveMode.Curve: {
                        if (separateAxes) {
                            material.addDefine(ParticleMaterialDefine.SIZECURVESEPERATE);
                            //
                            material.setVector2v(ParticleMaterialUniform.SIZE_CURVE_X, sizeModule._x.curve.floatValues);
                            material.setVector2v(ParticleMaterialUniform.SIZE_CURVE_Y, sizeModule._y.curve.floatValues);
                            material.setVector2v(ParticleMaterialUniform.SIZE_CURVE_Z, sizeModule._z.curve.floatValues);
                        }
                        else {
                            material.addDefine(ParticleMaterialDefine.SIZECURVE);
                            //
                            material.setVector2v(ParticleMaterialUniform.SIZE_CURVE, sizeModule._size.curve.floatValues);
                        }
                        break;
                    }
                    case CurveMode.TwoCurves: {
                        if (separateAxes) {
                            material.addDefine(ParticleMaterialDefine.SIZETWOCURVESSEPERATE);
                            //
                            material.setVector2v(ParticleMaterialUniform.SIZE_CURVE_X, sizeModule._x.curveMin.floatValues);
                            material.setVector2v(ParticleMaterialUniform.SIZE_CURVE_Y, sizeModule._y.curveMin.floatValues);
                            material.setVector2v(ParticleMaterialUniform.SIZE_CURVE_Z, sizeModule._z.curveMin.floatValues);
                            material.setVector2v(ParticleMaterialUniform.SIZE_CURVE_MAX_X, sizeModule._x.curveMax.floatValues);
                            material.setVector2v(ParticleMaterialUniform.SIZE_CURVE_MAX_Y, sizeModule._y.curveMax.floatValues);
                            material.setVector2v(ParticleMaterialUniform.SIZE_CURVE_MAX_Z, sizeModule._z.curveMax.floatValues);
                        }
                        else {
                            material.addDefine(ParticleMaterialDefine.SIZETWOCURVES);
                            //
                            material.setVector2v(ParticleMaterialUniform.SIZE_CURVE, sizeModule._size.curveMin.floatValues);
                            material.setVector2v(ParticleMaterialUniform.SIZE_CURVE_MAX, sizeModule._size.curveMax.floatValues);
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

            const renderer = comp.gameObject.getComponent(ParticleRenderer) as ParticleRenderer;
            const material = renderer.batchMaterial;
            material.removeDefine(ParticleMaterialDefine.ROTATIONOVERLIFETIME);
            material.removeDefine(ParticleMaterialDefine.ROTATIONCONSTANT);
            material.removeDefine(ParticleMaterialDefine.ROTATIONTWOCONSTANTS);
            material.removeDefine(ParticleMaterialDefine.ROTATIONSEPERATE);
            material.removeDefine(ParticleMaterialDefine.ROTATIONCURVE);
            material.removeDefine(ParticleMaterialDefine.ROTATIONTWOCURVES);

            const rotationModule = comp.rotationOverLifetime;
            if (rotationModule.enable) {
                const mode = comp.rotationOverLifetime._x.mode;
                const separateAxes = rotationModule._separateAxes;
                if (separateAxes) {
                    material.addDefine(ParticleMaterialDefine.ROTATIONSEPERATE);
                } else {

                    material.addDefine(ParticleMaterialDefine.ROTATIONOVERLIFETIME);
                }
                switch (mode) {
                    case CurveMode.Constant: {
                        material.addDefine(ParticleMaterialDefine.ROTATIONCONSTANT);
                        //
                        if (separateAxes) {
                            material.setVector3(ParticleMaterialUniform.ROTATION_CONST_SEPRARATE, new Vector3(rotationModule._x.constant, rotationModule._y.constant, rotationModule._z.constant));
                        } else {
                            material.setFloat(ParticleMaterialUniform.ROTATION_CONST, rotationModule._z.constant);
                        }
                        break;
                    }
                    case CurveMode.TwoConstants: {
                        material.addDefine(ParticleMaterialDefine.ROTATIONTWOCONSTANTS);
                        //
                        if (separateAxes) {
                            material.setVector3(ParticleMaterialUniform.ROTATION_CONST_SEPRARATE, new Vector3(rotationModule._x.constantMin, rotationModule._y.constantMin, rotationModule._z.constantMin));
                            material.setVector3(ParticleMaterialUniform.ROTATION_CONST_MAX_SEPRARATE, new Vector3(rotationModule._x.constantMax, rotationModule._y.constantMax, rotationModule._z.constantMax));
                        } else {
                            material.setFloat(ParticleMaterialUniform.ROTATION_CONST, rotationModule._z.constantMin);
                            material.setFloat(ParticleMaterialUniform.ROTATION_CONST_MAX, rotationModule._z.constantMax);
                        }
                        break;
                    }
                    case CurveMode.Curve: {
                        material.addDefine(ParticleMaterialDefine.ROTATIONCURVE);
                        //
                        if (separateAxes) {
                            material.setVector2v(ParticleMaterialUniform.ROTATE_CURVE_X, rotationModule._x.curve.floatValues);
                            material.setVector2v(ParticleMaterialUniform.ROTATE_CURVE_y, rotationModule._y.curve.floatValues);
                            material.setVector2v(ParticleMaterialUniform.ROTATE_CURVE_Z, rotationModule._z.curve.floatValues);
                        } else {
                            material.setVector2v(ParticleMaterialUniform.ROTATION_CURVE, rotationModule._z.curve.floatValues);
                        }
                        break;
                    }
                    case CurveMode.TwoCurves: {
                        material.addDefine(ParticleMaterialDefine.ROTATIONTWOCURVES);
                        //
                        if (separateAxes) {
                            material.setVector2v(ParticleMaterialUniform.ROTATE_CURVE_X, rotationModule._x.curveMin.floatValues);
                            material.setVector2v(ParticleMaterialUniform.ROTATE_CURVE_y, rotationModule._y.curveMin.floatValues);
                            material.setVector2v(ParticleMaterialUniform.ROTATE_CURVE_Z, rotationModule._z.curveMin.floatValues);
                            material.setVector2v(ParticleMaterialUniform.ROTATION_CURVE_MAX_X, rotationModule._x.curveMax.floatValues);
                            material.setVector2v(ParticleMaterialUniform.ROTATION_CURVE_MAX_Y, rotationModule._y.curveMax.floatValues);
                            material.setVector2v(ParticleMaterialUniform.ROTATION_CURVE_MAX_Z, rotationModule._z.curveMax.floatValues);
                        } else {
                            material.setVector2v(ParticleMaterialUniform.ROTATION_CURVE, rotationModule._z.curveMin.floatValues);
                            material.setVector2v(ParticleMaterialUniform.ROTATION_CURVE_MAX, rotationModule._z.curveMin.floatValues);
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

            const renderer = comp.gameObject.getComponent(ParticleRenderer) as ParticleRenderer;
            const material = renderer.batchMaterial;
            material.removeDefine(ParticleMaterialDefine.TEXTURESHEETANIMATIONCURVE);
            material.removeDefine(ParticleMaterialDefine.TEXTURESHEETANIMATIONTWOCURVE);

            const module = comp.textureSheetAnimation;
            if (module.enable) {
                const type = module._frameOverTime.mode;
                switch (type) {
                    case CurveMode.Curve: {
                        material.addDefine(ParticleMaterialDefine.TEXTURESHEETANIMATIONCURVE);
                        //
                        material.setVector2v(ParticleMaterialUniform.UV_CURVE, module._frameOverTime.curve.floatValues);
                        break;
                    }
                    case CurveMode.TwoCurves: {
                        material.addDefine(ParticleMaterialDefine.TEXTURESHEETANIMATIONTWOCURVE);
                        //
                        material.setVector2v(ParticleMaterialUniform.UV_CURVE, module._frameOverTime.curveMin.floatValues);
                        material.setVector2v(ParticleMaterialUniform.UV_CURVE_MAX, module._frameOverTime.curveMax.floatValues);
                        break;
                    }
                }

                if (type === CurveMode.Curve || type === CurveMode.TwoCurves) {
                    material.setFloat(ParticleMaterialUniform.CYCLES, module._cycleCount);
                    material.setVector4v(ParticleMaterialUniform.SUB_UV, module.floatValues);
                }
            }
        }

        private _updateDrawCalls(gameObject: paper.GameObject) {
            if (!this._enabled || !this._groups[0].hasGameObject(gameObject)) {
                return;
            }

            const component = gameObject.getComponent(ParticleComponent) as ParticleComponent;
            const renderer = gameObject.getComponent(ParticleRenderer) as ParticleRenderer;
            //
            this._onUpdateBatchMesh(component);
            this._drawCalls.removeDrawCalls(renderer);
            if (!renderer.batchMesh || !renderer.batchMaterial) {
                return;
            }

            if (renderer._renderMode === ParticleRenderMode.None) {
                console.error("ParticleSystem : error renderMode");
            }

            renderer.batchMesh._createBuffer();
            this._drawCalls.renderers.push(renderer);
            //
            let subMeshIndex = 0;
            for (const _primitive of renderer.batchMesh.glTFMesh.primitives) {
                const drawCall: DrawCall = {
                    renderer: renderer,

                    subMeshIndex: subMeshIndex++,
                    mesh: renderer.batchMesh,
                    material: renderer.batchMaterial || DefaultMaterials.MISSING,

                    frustumTest: false,
                    zdist: -1,
                };
                this._drawCalls.drawCalls.push(drawCall);
            }
        }

        public onEnable() {
            for (const gameObject of this._groups[0].gameObjects) {
                this._updateDrawCalls(gameObject);
            }
        }

        public onAddGameObject(gameObject: paper.GameObject, _group: paper.ComponentGroup) {
            this._updateDrawCalls(gameObject);

            const component = gameObject.getComponent(ParticleComponent) as ParticleComponent;
            if (component.main.playOnAwake) {
                component.play();
            }
        }

        public onRemoveGameObject(gameObject: paper.GameObject) {
            this._drawCalls.removeDrawCalls(gameObject.renderer as ParticleRenderer);
            // component.stop();
        }

        public onUpdate(deltaTime: number) {
            for (const gameObject of this._groups[0].gameObjects) {
                (gameObject.getComponent(ParticleComponent) as ParticleComponent).update(deltaTime);
            }
        }

        public onDisable() {
            for (const gameObject of this._groups[0].gameObjects) {
                this._drawCalls.removeDrawCalls(gameObject.renderer as ParticleRenderer);
            }
        }
    }
}