namespace egret3d.particle {
    /**
     * 
     */
    export class ParticleSystem extends paper.BaseSystem {
        protected readonly _interests = [
            {
                componentClass: ParticleComponent,
                listeners: [
                    { type: onStartRotation3DChanged, listener: (comp: ParticleComponent) => { this._onMainUpdate(comp, onStartRotation3DChanged); } },
                    { type: onSimulationSpaceChanged, listener: (comp: ParticleComponent) => { this._onMainUpdate(comp, onSimulationSpaceChanged); } },
                    { type: onScaleModeChanged, listener: (comp: ParticleComponent) => { this._onMainUpdate(comp, onScaleModeChanged); } },
                    { type: onVelocityChanged, listener: this._onVelocityOverLifetime.bind(this) },
                    { type: onColorChanged, listener: this._onColorOverLifetime.bind(this) },
                    { type: onSizeChanged, listener: this._onSizeOverLifetime.bind(this) },
                    { type: onRotationChanged, listener: this._onRotationOverLifetime.bind(this) },
                    { type: onTextureSheetChanged, listener: this._onTextureSheetAnimation.bind(this) },
                ]
            },
            {
                componentClass: ParticleRenderer,
                listeners: [
                    { type: ParticleRenderer.onMeshChanged, listener: (comp: ParticleRenderer) => { this._updateDrawCalls(comp.gameObject); } },
                    { type: ParticleRenderer.onMaterialsChanged, listener: (comp: ParticleRenderer) => { this._updateDrawCalls(comp.gameObject); } },
                    // { type: ParticleRendererEventType.LengthScaleChanged, listener: (comp: ParticleRenderer) => { this._onRenderUpdate(comp, ParticleRendererEventType.LengthScaleChanged); } },
                    // { type: ParticleRendererEventType.VelocityScaleChanged, listener: (comp: ParticleRenderer) => { this._onRenderUpdate(comp, ParticleRendererEventType.VelocityScaleChanged); } },
                    { type: ParticleRenderer.onRenderModeChanged, listener: (comp: ParticleRenderer) => { this._onRenderUpdate(comp, ParticleRenderer.onRenderModeChanged); } },
                ]
            }
        ];
        private readonly _drawCallCollecter: DrawCallCollecter = paper.GameObject.globalGameObject.getOrAddComponent(DrawCallCollecter);
        /**
        * Buffer改变的时候，有可能是初始化，也有可能是mesh改变，此时全部刷一下
        */
        private _onUpdateBatchMesh(comp: ParticleComponent) {
            const renderer = comp.gameObject.getComponent(ParticleRenderer) as ParticleRenderer;
            comp.initBatcher();
            //
            this._onRenderUpdate(renderer, ParticleRenderer.onRenderModeChanged);
            this._onRenderUpdate(renderer, ParticleRenderer.onVelocityScaleChanged);
            this._onRenderUpdate(renderer, ParticleRenderer.onLengthScaleChanged);
            //
            this._onMainUpdate(comp, onStartRotation3DChanged);
            this._onMainUpdate(comp, onSimulationSpaceChanged);
            this._onMainUpdate(comp, onScaleModeChanged);

            this._onShapeChanged(comp);
            this._onVelocityOverLifetime(comp);
            this._onColorOverLifetime(comp);
            this._onSizeOverLifetime(comp);
            this._onRotationOverLifetime(comp);
            this._onTextureSheetAnimation(comp);
        }

        private _onRenderUpdate(render: ParticleRenderer, type: signals.Signal) {
            if (!this._enabled || !this._groups[0].hasGameObject(render.gameObject)) {
                return;
            }

            const material = render.batchMaterial;
            switch (type) {
                case ParticleRenderer.onRenderModeChanged: {
                    this._onRenderMode(render);
                    break;
                }
                case ParticleRenderer.onLengthScaleChanged: {
                    material.setFloat(ParticleMaterialUniform.LENGTH_SCALE, render.lengthScale);
                    break;
                }
                case ParticleRenderer.onVelocityScaleChanged: {
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
        private _onMainUpdate(component: ParticleComponent, type: signals.Signal) {
            if (!this._enabled || !this._groups[0].hasGameObject(component.gameObject)) {
                return;
            }

            const renderer = component.gameObject.getComponent(ParticleRenderer) as ParticleRenderer;
            const material = renderer.batchMaterial;
            const mainModule = component.main;
            switch (type) {
                case onStartRotation3DChanged: {
                    material.setBoolean(ParticleMaterialUniform.START_ROTATION3D, mainModule.startRotation3D);
                    break;
                }
                case onSimulationSpaceChanged: {
                    material.setInt(ParticleMaterialUniform.SIMULATION_SPACE, mainModule.simulationSpace);
                    break;
                }
                case onScaleModeChanged: {
                    material.setInt(ParticleMaterialUniform.SCALING_MODE, mainModule.scaleMode);
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
                const mode = velocityModule.mode;
                switch (mode) {
                    case CurveMode.Constant: {
                        material.addDefine(ParticleMaterialDefine.VELOCITYCONSTANT);
                        //
                        const vec3 = new Vector3(velocityModule.x.evaluate(), velocityModule.y.evaluate(), velocityModule.z.evaluate());
                        material.setVector3(ParticleMaterialUniform.VELOCITY_CONST, vec3);
                        break;
                    }
                    case CurveMode.Curve: {
                        material.addDefine(ParticleMaterialDefine.VELOCITYCURVE);
                        //
                        material.setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_X, velocityModule.x.curve.floatValues);
                        material.setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_Y, velocityModule.y.curve.floatValues);
                        material.setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_Z, velocityModule.z.curve.floatValues);
                        break;
                    }
                    case CurveMode.TwoConstants: {
                        material.addDefine(ParticleMaterialDefine.VELOCITYTWOCONSTANT);
                        //
                        const minVec3 = new Vector3(velocityModule.x.constantMin, velocityModule.y.constantMin, velocityModule.z.constantMin);
                        const maxVec3 = new Vector3(velocityModule.x.constantMax, velocityModule.y.constantMax, velocityModule.z.constantMax);
                        material.setVector3(ParticleMaterialUniform.VELOCITY_CONST, minVec3);
                        material.setVector3(ParticleMaterialUniform.VELOCITY_CONST_MAX, maxVec3);
                        break;
                    }
                    case CurveMode.TwoCurves: {
                        material.addDefine(ParticleMaterialDefine.VELOCITYTWOCURVE);
                        //
                        material.setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_X, velocityModule.x.curveMin.floatValues);
                        material.setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_Y, velocityModule.y.curveMin.floatValues);
                        material.setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_Z, velocityModule.z.curveMin.floatValues);
                        material.setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_MAX_X, velocityModule.x.curveMax.floatValues);
                        material.setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_MAX_Y, velocityModule.y.curveMax.floatValues);
                        material.setVector2v(ParticleMaterialUniform.VELOCITY_CURVE_MAX_Z, velocityModule.z.curveMax.floatValues);
                        break;
                    }
                }
                material.setInt(ParticleMaterialUniform.SPACE_TYPE, velocityModule.space);
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
                const color = colorModule.color;
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
                const separateAxes = sizeModule.separateAxes;
                const mode = sizeModule.x.mode;
                switch (mode) {
                    case CurveMode.Curve: {
                        if (separateAxes) {
                            material.addDefine(ParticleMaterialDefine.SIZECURVESEPERATE);
                            //
                            material.setVector2v(ParticleMaterialUniform.SIZE_CURVE_X, sizeModule.x.curve.floatValues);
                            material.setVector2v(ParticleMaterialUniform.SIZE_CURVE_Y, sizeModule.y.curve.floatValues);
                            material.setVector2v(ParticleMaterialUniform.SIZE_CURVE_Z, sizeModule.z.curve.floatValues);
                        }
                        else {
                            material.addDefine(ParticleMaterialDefine.SIZECURVE);
                            //
                            material.setVector2v(ParticleMaterialUniform.SIZE_CURVE, sizeModule.size.curve.floatValues);
                        }
                        break;
                    }
                    case CurveMode.TwoCurves: {
                        if (separateAxes) {
                            material.addDefine(ParticleMaterialDefine.SIZETWOCURVESSEPERATE);
                            //
                            material.setVector2v(ParticleMaterialUniform.SIZE_CURVE_X, sizeModule.x.curveMin.floatValues);
                            material.setVector2v(ParticleMaterialUniform.SIZE_CURVE_Y, sizeModule.y.curveMin.floatValues);
                            material.setVector2v(ParticleMaterialUniform.SIZE_CURVE_Z, sizeModule.z.curveMin.floatValues);
                            material.setVector2v(ParticleMaterialUniform.SIZE_CURVE_MAX_X, sizeModule.x.curveMax.floatValues);
                            material.setVector2v(ParticleMaterialUniform.SIZE_CURVE_MAX_Y, sizeModule.y.curveMax.floatValues);
                            material.setVector2v(ParticleMaterialUniform.SIZE_CURVE_MAX_Z, sizeModule.z.curveMax.floatValues);
                        }
                        else {
                            material.addDefine(ParticleMaterialDefine.SIZETWOCURVES);
                            //
                            material.setVector2v(ParticleMaterialUniform.SIZE_CURVE, sizeModule.size.curveMin.floatValues);
                            material.setVector2v(ParticleMaterialUniform.SIZE_CURVE_MAX, sizeModule.size.curveMax.floatValues);
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
                const mode = comp.rotationOverLifetime.x.mode;
                const separateAxes = rotationModule.separateAxes;
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
                            material.setVector3(ParticleMaterialUniform.ROTATION_CONST_SEPRARATE, new Vector3(rotationModule.x.constant, rotationModule.y.constant, rotationModule.z.constant));
                        } else {
                            material.setFloat(ParticleMaterialUniform.ROTATION_CONST, rotationModule.z.constant);
                        }
                        break;
                    }
                    case CurveMode.TwoConstants: {
                        material.addDefine(ParticleMaterialDefine.ROTATIONTWOCONSTANTS);
                        //
                        if (separateAxes) {
                            material.setVector3(ParticleMaterialUniform.ROTATION_CONST_SEPRARATE, new Vector3(rotationModule.x.constantMin, rotationModule.y.constantMin, rotationModule.z.constantMin));
                            material.setVector3(ParticleMaterialUniform.ROTATION_CONST_MAX_SEPRARATE, new Vector3(rotationModule.x.constantMax, rotationModule.y.constantMax, rotationModule.z.constantMax));
                        } else {
                            material.setFloat(ParticleMaterialUniform.ROTATION_CONST, rotationModule.z.constantMin);
                            material.setFloat(ParticleMaterialUniform.ROTATION_CONST_MAX, rotationModule.z.constantMax);
                        }
                        break;
                    }
                    case CurveMode.Curve: {
                        material.addDefine(ParticleMaterialDefine.ROTATIONCURVE);
                        //
                        if (separateAxes) {
                            material.setVector2v(ParticleMaterialUniform.ROTATE_CURVE_X, rotationModule.x.curve.floatValues);
                            material.setVector2v(ParticleMaterialUniform.ROTATE_CURVE_y, rotationModule.y.curve.floatValues);
                            material.setVector2v(ParticleMaterialUniform.ROTATE_CURVE_Z, rotationModule.z.curve.floatValues);
                        } else {
                            material.setVector2v(ParticleMaterialUniform.ROTATION_CURVE, rotationModule.z.curve.floatValues);
                        }
                        break;
                    }
                    case CurveMode.TwoCurves: {
                        material.addDefine(ParticleMaterialDefine.ROTATIONTWOCURVES);
                        //
                        if (separateAxes) {
                            material.setVector2v(ParticleMaterialUniform.ROTATE_CURVE_X, rotationModule.x.curveMin.floatValues);
                            material.setVector2v(ParticleMaterialUniform.ROTATE_CURVE_y, rotationModule.y.curveMin.floatValues);
                            material.setVector2v(ParticleMaterialUniform.ROTATE_CURVE_Z, rotationModule.z.curveMin.floatValues);
                            material.setVector2v(ParticleMaterialUniform.ROTATION_CURVE_MAX_X, rotationModule.x.curveMax.floatValues);
                            material.setVector2v(ParticleMaterialUniform.ROTATION_CURVE_MAX_Y, rotationModule.y.curveMax.floatValues);
                            material.setVector2v(ParticleMaterialUniform.ROTATION_CURVE_MAX_Z, rotationModule.z.curveMax.floatValues);
                        } else {
                            material.setVector2v(ParticleMaterialUniform.ROTATION_CURVE, rotationModule.z.curveMin.floatValues);
                            material.setVector2v(ParticleMaterialUniform.ROTATION_CURVE_MAX, rotationModule.z.curveMin.floatValues);
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
                const type = module.frameOverTime.mode;
                switch (type) {
                    case CurveMode.Curve: {
                        material.addDefine(ParticleMaterialDefine.TEXTURESHEETANIMATIONCURVE);
                        //
                        material.setVector2v(ParticleMaterialUniform.UV_CURVE, module.frameOverTime.curve.floatValues);
                        break;
                    }
                    case CurveMode.TwoCurves: {
                        material.addDefine(ParticleMaterialDefine.TEXTURESHEETANIMATIONTWOCURVE);
                        //
                        material.setVector2v(ParticleMaterialUniform.UV_CURVE, module.frameOverTime.curveMin.floatValues);
                        material.setVector2v(ParticleMaterialUniform.UV_CURVE_MAX, module.frameOverTime.curveMax.floatValues);
                        break;
                    }
                }

                if (type === CurveMode.Curve || type === CurveMode.TwoCurves) {
                    material.setFloat(ParticleMaterialUniform.CYCLES, module.cycleCount);
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
            this._drawCallCollecter.removeDrawCalls(renderer);
            if (!renderer.batchMesh || !renderer.batchMaterial) {
                return;
            }

            if (renderer.renderMode === ParticleRenderMode.None) {
                console.error("ParticleSystem : error renderMode");
            }

            renderer.batchMesh._createBuffer();
            this._drawCallCollecter.renderers.push(renderer);
            //
            let subMeshIndex = 0;
            for (const _primitive of renderer.batchMesh.glTFMesh.primitives) {
                const drawCall: DrawCall = {
                    renderer: renderer,

                    subMeshIndex: subMeshIndex++,
                    mesh: renderer.batchMesh,
                    material: renderer.batchMaterial || DefaultMaterials.MISSING,

                    zdist: -1,
                };
                this._drawCallCollecter.drawCalls.push(drawCall);
            }
        }

        public onEnable() {
            for (const gameObject of this._groups[0].gameObjects) {
                this._updateDrawCalls(gameObject);
            }
        }

        public onAddGameObject(gameObject: paper.GameObject, _group: paper.GameObjectGroup) {
            this._updateDrawCalls(gameObject);

            const component = gameObject.getComponent(ParticleComponent) as ParticleComponent;
            if (component.main.playOnAwake) {
                component.play();
            }
        }

        public onRemoveGameObject(gameObject: paper.GameObject) {
            this._drawCallCollecter.removeDrawCalls(gameObject.renderer as ParticleRenderer);
            // component.stop();
        }

        public onUpdate(deltaTime: number) {
            for (const gameObject of this._groups[0].gameObjects) {
                (gameObject.getComponent(ParticleComponent) as ParticleComponent).update(deltaTime);
            }
        }

        public onDisable() {
            for (const gameObject of this._groups[0].gameObjects) {
                this._drawCallCollecter.removeDrawCalls(gameObject.renderer as ParticleRenderer);
            }
        }
    }
}