namespace egret3d.particle {
    /**
     * 粒子组件。
     */
    export class ParticleComponent extends paper.BaseComponent {
        /**
         * 主模块。 
         */
        @paper.serializedField
        public readonly main: MainModule = new MainModule(this);
        /**
         * 发射模块。 
         */
        @paper.serializedField
        public readonly emission: EmissionModule = new EmissionModule(this);
        /**
         * 发射形状模块。 
         */
        @paper.serializedField
        public readonly shape: ShapeModule = new ShapeModule(this);
        /**
         * 速率变换模块。 
         */
        @paper.serializedField
        public readonly velocityOverLifetime: VelocityOverLifetimeModule = new VelocityOverLifetimeModule(this);
        /**
         * 旋转变换模块。 
         */
        @paper.serializedField
        public readonly rotationOverLifetime: RotationOverLifetimeModule = new RotationOverLifetimeModule(this);
        /**
         * 尺寸变化模块。 
         */
        @paper.serializedField
        public readonly sizeOverLifetime: SizeOverLifetimeModule = new SizeOverLifetimeModule(this);
        /**
         * 颜色变化模块。 
         */
        @paper.serializedField
        public readonly colorOverLifetime: ColorOverLifetimeModule = new ColorOverLifetimeModule(this);
        /**
         * 序列帧变化模块。 
         */
        @paper.serializedField
        public readonly textureSheetAnimation: TextureSheetAnimationModule = new TextureSheetAnimationModule(this);
        /**
         * @internal
         */
        public _isPlaying: boolean = false;
        /**
         * @internal
         */
        public _isPaused: boolean = false;

        private _timeScale: number = 1.0;
        private readonly _batcher: ParticleBatcher = new ParticleBatcher();

        private _clean(cleanPlayState: boolean = false) {//TODO
            if (cleanPlayState) {
                this._isPlaying = false;
                this._isPaused = false;
            }

            this._batcher.clean();
        }

        public initialize() {
            super.initialize();
            this._clean();
        }

        public uninitialize() {
            super.uninitialize();
            this._clean();
        }
        /**
         * @internal 
         */
        public initBatcher(cleanPlayState: boolean = false) {
            this._clean(cleanPlayState);
            this._batcher.init(this, this.gameObject.getComponent(ParticleRenderer)!);
        }
        /**
         * @internal 
         */
        public update(elapsedTime: number) {
            this._batcher.update(elapsedTime * this._timeScale);
        }

        public play(withChildren: boolean = true) {
            if (this._isPaused) {
                this._isPaused = false;
            } else {
                this._isPlaying = true;
                this._isPaused = false;
                this._batcher.resetTime();
            }
            //
            if (withChildren) {
                const children = this.gameObject.transform.children;
                for (const child of children) {
                    const particleComp = child.gameObject.getComponent(ParticleComponent);
                    if (particleComp && particleComp.isActiveAndEnabled) {
                        particleComp.play(withChildren);
                    }
                }
            }
        }

        public pause(withChildren: boolean = true): void {
            this._isPaused = true;
            //
            if (withChildren) {
                const children = this.gameObject.transform.children;
                for (const child of children) {
                    const particleComp = child.gameObject.getComponent(ParticleComponent);
                    if (particleComp && particleComp.isActiveAndEnabled) {
                        particleComp.pause(withChildren);
                    }
                }
            }
        }

        public stop(withChildren: boolean = true): void {
            this._isPlaying = false;
            this._batcher.resetTime();
            //
            if (withChildren) {
                const children = this.gameObject.transform.children;
                for (const child of children) {
                    const particleComp = child.gameObject.getComponent(ParticleComponent);
                    if (particleComp && particleComp.isActiveAndEnabled) {
                        particleComp.stop(withChildren);
                    }
                }
            }
        }

        public clear(withChildren: boolean = true) {
            if (withChildren) {
                const children = this.gameObject.transform.children;
                for (const child of children) {
                    const particleComp = child.gameObject.getComponent(ParticleComponent);
                    if (particleComp && particleComp.isActiveAndEnabled) {
                        particleComp.stop(withChildren);
                    }
                }
            }
        }
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public set timeScale(value: number) {
            this._timeScale = value;
        }

        public get timeScale() {
            return this._timeScale;
        }

        public get isPlaying() {
            return this._isPlaying;
        }

        public get isPaused() {
            return this._isPaused;
        }

        public get isAlive() {
            return this._batcher.aliveParticleCount > 0 || this._isPlaying;
        }

        public get loop() {
            return this.main.loop;
        }
    }
}