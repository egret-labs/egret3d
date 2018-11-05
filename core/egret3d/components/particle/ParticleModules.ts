namespace egret3d.particle {
    export const onMainChanged: signals.Signal = new signals.Signal();
    export const onColorChanged: signals.Signal = new signals.Signal();
    export const onVelocityChanged: signals.Signal = new signals.Signal();
    export const onSizeChanged: signals.Signal = new signals.Signal();
    export const onRotationChanged: signals.Signal = new signals.Signal();
    export const onTextureSheetChanged: signals.Signal = new signals.Signal();
    export const onShapeChanged: signals.Signal = new signals.Signal();
    export const onStartSize3DChanged: signals.Signal = new signals.Signal();
    export const onStartRotation3DChanged: signals.Signal = new signals.Signal();
    export const onSimulationSpaceChanged: signals.Signal = new signals.Signal();
    export const onScaleModeChanged: signals.Signal = new signals.Signal();
    export const onMaxParticlesChanged: signals.Signal = new signals.Signal();
    /**
     * 
     */
    export const enum CurveMode {
        Constant = 0,
        Curve = 1,
        TwoCurves = 2,
        TwoConstants = 3
    }
    /**
     * 
     */
    export const enum ColorGradientMode {
        Color = 0,
        Gradient = 1,
        TwoColors = 2,
        TwoGradients = 3,
        RandomColor = 4
    }
    /**
     * 
     */
    export const enum SimulationSpace {
        Local = 0,
        World = 1,
        Custom = 2
    }
    /**
     * 
     */
    export const enum ScalingMode {
        Hierarchy = 0,
        Local = 1,
        Shape = 2
    }
    /**
     * 
     */
    export const enum ShapeType {
        None = -1,
        Sphere = 0,
        SphereShell = 1,
        Hemisphere = 2,
        HemisphereShell = 3,
        Cone = 4,
        Box = 5,
        Mesh = 6,
        ConeShell = 7,
        ConeVolume = 8,
        ConeVolumeShell = 9,
        Circle = 10,
        CircleEdge = 11,
        SingleSidedEdge = 12,
        MeshRenderer = 13,
        SkinnedMeshRenderer = 14,
        BoxShell = 15,
        BoxEdge = 16
    }
    /**
     * 
     */
    export const enum ShapeMultiModeValue {
        Random = 0,
        Loop = 1,
        PingPong = 2,
        BurstSpread = 3
    }
    /**
     * 
     */
    export const enum AnimationType {
        WholeSheet = 0,
        SingleRow = 1
    }
    /**
     * 
     */
    export const enum UVChannelFlags {
        UV0 = 1,
        UV1 = 2,
        UV2 = 4,
        UV3 = 8
    }
    /**
     * 
     */
    export const enum GradientMode {
        Blend = 0,
        Fixed = 1
    }

    const _helpColorA: Color = Color.create();
    const _helpColorB: Color = Color.create();
    /**
     * TODO
     */
    export class Keyframe implements paper.ISerializable {
        public time: number;
        public value: number;

        public serialize() {
            return [this.time, this.value];
        }

        public deserialize(element: Readonly<[number, number]>) {
            this.time = element[0];
            this.value = element[1];

            return this;
        }

        public copy(source: Readonly<Keyframe>) {
            this.time = source.time;
            this.value = source.value;
        }
    }
    /**
     * TODO
     */
    export class AnimationCurve implements paper.ISerializable {
        /**
         * 功能与效率平衡长度取4
         */
        private readonly _keys: Array<Keyframe> = new Array<Keyframe>();

        private readonly _floatValues: Float32Array = new Float32Array(8);
        public serialize() {
            return this._keys.map(keyFrame => keyFrame.serialize());
        }

        public deserialize(element: any) {
            this._keys.length = 0;
            for (let i = 0, l = element.length; i < l; i++) {
                var keyframe = new Keyframe();
                keyframe.deserialize(element[i]);
                this._keys.push(keyframe);
            }

            return this;
        }

        public evaluate(t: number = 0): number {
            for (let i = 0, l = this._keys.length; i < l; i++) {
                const curKeyFrame = this._keys[i];
                if (curKeyFrame.time < t) {
                    continue;
                }
                //
                const lastIndex = i === 0 ? 0 : i - 1;
                const lastKeyFrame = this._keys[lastIndex];
                const tt = (t - lastKeyFrame.time) / (curKeyFrame.time - lastKeyFrame.time);
                return numberLerp(lastKeyFrame.value, curKeyFrame.value, tt);
            }

            throw "AnimationCurve: invalid t or keys.length is 0";
        }

        public get floatValues(): Readonly<Float32Array> {
            let res = this._floatValues;
            let offset = 0;
            for (let keyFrame of this._keys) {
                res[offset++] = keyFrame.time;
                res[offset++] = keyFrame.value;
            }

            return res;
        }

        public copy(source: AnimationCurve) {
            this._keys.length = 0;

            const sourceKeys = source._keys;
            for (let i = 0, l = sourceKeys.length; i < l; i++) {
                var keyframe = new Keyframe();
                keyframe.time = sourceKeys[i].time;
                keyframe.value = sourceKeys[i].value;
                this._keys.push(keyframe);
            }
        }
    }
    /**
     * TODO
     */
    export class Burst implements paper.ISerializable {
        public time: number = 0.0;
        public minCount: number = 0;
        public maxCount: number = 100;
        public cycleCount: number = 1;
        public repeatInterval: number = 1.0;

        public serialize() {
            return [this.time, this.minCount, this.maxCount, this.cycleCount, this.repeatInterval];
        }

        public deserialize(element: Readonly<[number, number, number, number, number]>) {
            this.time = element[0];
            this.minCount = element[1];
            this.maxCount = element[2];
            this.cycleCount = element[3];
            this.repeatInterval = element[4];

            return this;
        }
    }
    /**
     * TODO
     */
    export class GradientColorKey implements paper.ISerializable {
        public time: number = 0.0;
        public readonly color: Color = Color.create();

        public serialize() {
            return { time: this.time, color: this.color.serialize() };
        }

        public deserialize(element: any) {
            this.time = element.time;
            this.color.deserialize(element.color);

            return this;
        }
    }
    /**
     * TODO
     */
    export class GradientAlphaKey implements paper.ISerializable {
        public time: number = 0.0;
        public alpha: number = 0.0;

        public serialize() {
            return { time: this.time, alpha: this.alpha };
        }

        public deserialize(element: any) {
            this.alpha = element.alpha;
            this.time = element.time;

            return this;
        }
    }
    /**
     * TODO
     */
    export class Gradient implements paper.ISerializable {
        public mode: GradientMode = GradientMode.Blend;
        private readonly alphaKeys: Array<GradientAlphaKey> = new Array<GradientAlphaKey>();
        private readonly colorKeys: Array<GradientColorKey> = new Array<GradientColorKey>();

        private readonly _alphaValue: Float32Array = new Float32Array(8);
        private readonly _colorValue: Float32Array = new Float32Array(16);

        public serialize() {
            return {
                mode: this.mode,
                alphaKeys: this.alphaKeys.map(v => v.serialize()),
                colorKeys: this.colorKeys.map(v => v.serialize()),
            };
        }

        public deserialize(element: any) {
            this.colorKeys.length = 0;
            for (let i = 0, l = element.colorKeys.length; i < l; i++) {
                var color = new GradientColorKey();
                color.deserialize(element.colorKeys[i]);
                this.colorKeys.push(color);
            }
            //
            this.alphaKeys.length = 0;
            for (let i = 0, l = element.alphaKeys.length; i < l; i++) {
                var alpha = new GradientAlphaKey();
                alpha.deserialize(element.alphaKeys[i]);
                this.alphaKeys.push(alpha);
            }

            return this;
        }

        public evaluate(t: number = 0, out: Color): Color {
            for (let i = 0, l = this.alphaKeys.length; i < l; i++) {
                const curKeyFrame = this.alphaKeys[i];
                if (curKeyFrame.time > t) {
                    const lastIndex = i === 0 ? 0 : i - 1;
                    const lastKeyFrame = this.alphaKeys[lastIndex];
                    const tt = (t - lastKeyFrame.time) / (curKeyFrame.time - lastKeyFrame.time);
                    out.a = numberLerp(lastKeyFrame.alpha, curKeyFrame.alpha, tt);
                    break;
                }
            }

            for (let i = 0, l = this.colorKeys.length; i < l; i++) {
                const colorKey = this.colorKeys[i];
                if (colorKey.time > t) {
                    const lastIndex = i === 0 ? 0 : i - 1;
                    const lastKeyFrame = this.colorKeys[lastIndex];
                    const tt = (t - lastKeyFrame.time) / (colorKey.time - lastKeyFrame.time);
                    out.r = numberLerp(lastKeyFrame.color.r, colorKey.color.r, tt);
                    out.g = numberLerp(lastKeyFrame.color.g, colorKey.color.g, tt);
                    out.b = numberLerp(lastKeyFrame.color.b, colorKey.color.b, tt);
                    break;
                }
            }

            return out;
        }

        public get alphaValues(): Readonly<Float32Array> {
            let res = this._alphaValue;
            let offset = 0;
            for (let alpha of this.alphaKeys) {
                res[offset++] = alpha.time;
                res[offset++] = alpha.alpha;
            }

            return res;
        }

        public get colorValues(): Readonly<Float32Array> {
            let res = this._colorValue;
            let offset = 0;
            for (let color of this.colorKeys) {
                res[offset++] = color.time;
                res[offset++] = color.color.r;
                res[offset++] = color.color.g;
                res[offset++] = color.color.b;
            }

            return res;
        }
    }
    /**
     * TODO create
     */
    export class MinMaxCurve implements paper.ISerializable {
        public mode: CurveMode = CurveMode.Constant;
        public constant: number = 0.0;
        public constantMin: number = 0.0;
        public constantMax: number = 1.0;
        public readonly curve: AnimationCurve = new AnimationCurve();
        public readonly curveMin: AnimationCurve = new AnimationCurve();
        public readonly curveMax: AnimationCurve = new AnimationCurve();

        public serialize() {
            return {
                mode: this.mode,
                constant: this.constant,
                constantMin: this.constantMin,
                constantMax: this.constantMax,
                curve: this.curve.serialize(),
                curveMin: this.curveMin.serialize(),
                curveMax: this.curveMax.serialize(),
            };
        }

        public deserialize(element: any) {
            // 该兼容代码可以在插件导出全数据后移除。
            this.mode = element.mode;
            this.constant = element.constant || 0;
            this.constantMin = element.constantMin || 0;
            this.constantMax = element.constantMax || 0;
            element.curve && this.curve.deserialize(element.curve);
            element.curveMin && this.curveMin.deserialize(element.curveMin);
            element.curveMax && this.curveMax.deserialize(element.curveMax);

            return this;
        }

        public evaluate(t: number = 0): number {
            if (this.mode === CurveMode.Constant) {
                return this.constant;
            }
            else if (this.mode === CurveMode.TwoConstants) {
                return (Math.random() * (this.constantMax - this.constantMin) + this.constantMin);
            }
            else if (this.mode === CurveMode.Curve) {
                return this.curve.evaluate(t);
            }
            else { //Two Curves
                const min = this.curveMin.evaluate(t);
                const max = this.curveMax.evaluate(t);
                return (Math.random() * (min - max) + min);
            }
        }

        public copy(source: Readonly<MinMaxCurve>) {
            this.mode = source.mode;
            this.constant = source.constant;
            this.constantMin = source.constantMin;
            this.constantMax = source.constantMax;
            this.curve.copy(source.curve);
            this.curveMin.copy(source.curveMin);
            this.curveMax.copy(source.curveMax);
        }
    }
    /**
     * TODO create
     */
    export class MinMaxGradient implements paper.ISerializable {
        public mode: ColorGradientMode = ColorGradientMode.Gradient;
        public readonly color: Color = Color.create();
        public readonly colorMin: Color = Color.create();
        public readonly colorMax: Color = Color.create();
        public readonly gradient: Gradient = new Gradient();
        public readonly gradientMin: Gradient = new Gradient();
        public readonly gradientMax: Gradient = new Gradient();

        public serialize() {
            return {
                mode: this.mode,
                color: this.color.serialize(),
                colorMin: this.colorMin.serialize(),
                colorMax: this.colorMax.serialize(),
                gradient: this.gradient.serialize(),
                gradientMin: this.gradientMin.serialize(),
                gradientMax: this.gradientMax.serialize(),
            };
        }

        public deserialize(element: any) {
            // 该兼容代码可以在插件导出全数据后移除。
            this.mode = element.mode;
            if (element.color) {
                this.color.deserialize(element.color);
            }
            if (element.colorMin) {
                this.colorMin.deserialize(element.colorMin);
            }
            if (element.colorMax) {
                this.colorMax.deserialize(element.colorMax);
            }
            if (element.gradient) {
                this.gradient.deserialize(element.gradient);
            }
            if (element.gradientMin) {
                this.gradientMin.deserialize(element.gradientMin);
            }
            if (element.gradientMax) {
                this.gradientMax.deserialize(element.gradientMax);
            }

            return this;
        }

        public evaluate(t: number = 0, out: Color): Color {
            if (this.mode === ColorGradientMode.Color) {
                out.r = this.color.r;
                out.g = this.color.g;
                out.b = this.color.b;
                out.a = this.color.a;
            }
            else if (this.mode === ColorGradientMode.TwoColors) {
                out.r = Math.random() * (this.colorMax.r - this.colorMin.r) + this.colorMin.r;
                out.g = Math.random() * (this.colorMax.g - this.colorMin.g) + this.colorMin.g;
                out.b = Math.random() * (this.colorMax.b - this.colorMin.b) + this.colorMin.b;
                out.a = Math.random() * (this.colorMax.a - this.colorMin.a) + this.colorMin.a;
            }
            else if (this.mode === ColorGradientMode.Gradient) {
                return this.gradient.evaluate(t, out);
            }
            else if (this.mode === ColorGradientMode.TwoGradients) {
                this.gradientMin.evaluate(t, _helpColorA);
                this.gradientMax.evaluate(t, _helpColorB);
                out.r = (Math.random() * (_helpColorA.r - _helpColorB.r) + _helpColorA.r);
                out.g = (Math.random() * (_helpColorA.g - _helpColorB.g) + _helpColorA.g);
                out.b = (Math.random() * (_helpColorA.b - _helpColorB.b) + _helpColorA.b);
                out.a = (Math.random() * (_helpColorA.a - _helpColorB.a) + _helpColorA.a);
            }
            else {
                out.r = Math.random();
                out.g = Math.random();
                out.b = Math.random();
                out.a = Math.random();
            }

            return out;
        }
    }
    /**
     * 粒子模块基类。
     */
    export abstract class ParticleModule extends paper.BaseObject {
        @paper.serializedField
        public enable: boolean = false;

        protected readonly _component: ParticleComponent;

        public constructor(component: ParticleComponent) {
            super();

            this._component = component;
        }

        public deserialize(_element: any) { // TODO
            this.enable = true;

            return this;
        }
    }
    /**
     * 
     */
    export class MainModule extends ParticleModule {
        /**
         * 
         */
        @paper.serializedField
        public loop: boolean = false;
        /**
         * 
         */
        @paper.serializedField
        public playOnAwake: boolean = false;
        /**
         * 
         */
        @paper.serializedField
        public duration: number = 0.0;
        /**
         * 
         */
        @paper.serializedField
        public readonly startDelay: MinMaxCurve = new MinMaxCurve();
        /**
         * 
         */
        @paper.serializedField
        public readonly startLifetime: MinMaxCurve = new MinMaxCurve();
        /**
         * 
         */
        @paper.serializedField
        public readonly startSpeed: MinMaxCurve = new MinMaxCurve();
        /**
         * 
         */
        @paper.serializedField
        public readonly startSizeX: MinMaxCurve = new MinMaxCurve();
        /**
         * 
         */
        @paper.serializedField
        public readonly startSizeY: MinMaxCurve = new MinMaxCurve();
        /**
         * 
         */
        @paper.serializedField
        public readonly startSizeZ: MinMaxCurve = new MinMaxCurve();
        /**
         * 
         */
        @paper.serializedField
        public readonly startRotationX: MinMaxCurve = new MinMaxCurve();
        /**
         * 
         */
        @paper.serializedField
        public readonly startRotationY: MinMaxCurve = new MinMaxCurve();
        /**
         * 
         */
        @paper.serializedField
        public readonly startRotationZ: MinMaxCurve = new MinMaxCurve();
        /**
         * 
         */
        @paper.serializedField
        public readonly startColor: MinMaxGradient = new MinMaxGradient();
        /**
         * 
         */
        @paper.serializedField
        public readonly gravityModifier: MinMaxCurve = new MinMaxCurve(); //TODO

        @paper.serializedField
        private _startSize3D: boolean = false;
        @paper.serializedField
        private _startRotation3D: boolean = false;
        @paper.serializedField
        private _simulationSpace: SimulationSpace = SimulationSpace.Local;
        @paper.serializedField
        private _scaleMode: ScalingMode = ScalingMode.Hierarchy;
        @paper.serializedField
        private _maxParticles: number = 0;

        public deserialize(element: any) { // TODO
            super.deserialize(element);
            this.duration = element.duration;
            this.loop = element.loop || element.looping; // TODO 兼容代码 looping。
            this.startDelay.deserialize(element.startDelay);
            this.startLifetime.deserialize(element.startLifetime);
            this.startSpeed.deserialize(element.startSpeed);
            this._startSize3D = element.startSize3D || false;
            this.startSizeX.deserialize(element.startSizeX);
            this.startSizeY.deserialize(element.startSizeY);
            this.startSizeZ.deserialize(element.startSizeZ);
            this._startRotation3D = (element._startRotation3D || element.startRotation3D) || false;
            this.startRotationX.deserialize(element.startRotationX);
            this.startRotationY.deserialize(element.startRotationY);
            this.startRotationZ.deserialize(element.startRotationZ);
            this.startColor.deserialize(element.startColor);
            this.gravityModifier.deserialize(element.gravityModifier);
            this._simulationSpace = (element._simulationSpace || element.simulationSpace) || 0;
            this._scaleMode = (element._scaleMode || element.scaleMode) || ScalingMode.Hierarchy;
            this.playOnAwake = element.playOnAwake;
            this._maxParticles = (element._maxParticles || element.maxParticles) || 0;

            return this;
        }
        public get startSize3D() {
            return this._startSize3D;
        }
        public set startSize3D(value: boolean) {
            if (this._startSize3D === value) {
                return;
            }

            this._startSize3D = value;
            onStartSize3DChanged.dispatch(this._component);
        }
        /**
         * 
         */
        public get startRotation3D() {
            return this._startRotation3D;
        }
        public set startRotation3D(value: boolean) {
            if (this._startRotation3D === value) {
                return;
            }

            this._startRotation3D = value;
            onStartRotation3DChanged.dispatch(this._component);
        }
        /**
         * 
         */
        public get simulationSpace() {
            return this._simulationSpace;
        }
        public set simulationSpace(value: SimulationSpace) {
            if (this._simulationSpace === value) {
                return;
            }

            this._simulationSpace = value;
            onSimulationSpaceChanged.dispatch(this._component);
        }
        /**
         * 
         */
        public get scaleMode() {
            return this._scaleMode;
        }
        public set scaleMode(value: ScalingMode) {
            if (this._scaleMode === value) {
                return;
            }

            this._scaleMode = value;
            onScaleModeChanged.dispatch(this._component);
        }
        /**
         * 
         */
        public get maxParticles() {
            return this._maxParticles;
        }
        public set maxParticles(value: number) {
            if (this._maxParticles === value) {
                return;
            }

            this._maxParticles = value;
            onMaxParticlesChanged.dispatch(this._component);
        }
    }
    /**
     * 
     */
    export class EmissionModule extends ParticleModule {
        /**
         * 
         */
        @paper.serializedField
        public readonly rateOverTime: MinMaxCurve = new MinMaxCurve();
        /**
         * 
         */
        @paper.serializedField
        public readonly bursts: Burst[] = [];

        public deserialize(element: any) { // 兼容
            super.deserialize(element);
            this.rateOverTime.deserialize(element.rateOverTime);
            if (element.bursts) {
                this.bursts.length = 0;
                for (let i = 0, l = element.bursts.length; i < l; i++) {
                    var burst = new Burst();
                    burst.deserialize(element.bursts[i]);
                    this.bursts.push(burst);
                }
            }

            return this;
        }
    }
    /**
     * 
     */
    export class ShapeModule extends ParticleModule {
        /**
         * 
         */
        @paper.serializedField
        public shapeType: ShapeType = ShapeType.Sphere;
        /**
         * 
         */
        @paper.serializedField
        public radius: number = 0.0;
        /**
         * 
         */
        @paper.serializedField
        public angle: number = 0.0;
        /**
         * 
         */
        @paper.serializedField
        public length: number = 0.0;
        /**
         * 
         */
        @paper.serializedField
        public readonly arcSpeed: MinMaxCurve = new MinMaxCurve();
        /**
         * 
         */
        @paper.serializedField
        public arcMode: ShapeMultiModeValue = ShapeMultiModeValue.Random;
        /**
         * 
         */
        @paper.serializedField
        public radiusSpread: number = 0.0;
        /**
         * 
         */
        @paper.serializedField
        public radiusMode: ShapeMultiModeValue = ShapeMultiModeValue.Random;
        /**
         * 
         */
        @paper.serializedField
        public readonly box: egret3d.Vector3 = Vector3.create();
        /**
         * 
         */
        @paper.serializedField
        public randomDirection: boolean = false;
        /**
         * 
         */
        @paper.serializedField
        public spherizeDirection: boolean = false;

        public deserialize(element: any) { // TODO
            super.deserialize(element);
            this.shapeType = element.shapeType;
            this.radius = element.radius;
            this.angle = element.angle;
            this.length = element.length;
            this.arcSpeed.deserialize(element.arcSpeed);
            this.arcMode = element.arcMode;
            this.radiusSpread = element.radiusSpread;
            this.radiusMode = element.radiusMode;
            this.box.deserialize(element.box);
            this.randomDirection = element.randomDirection;
            this.spherizeDirection = element.spherizeDirection;

            return this;
        }
        /**
         * @internal
         */
        public invalidUpdate(): void {
            onShapeChanged.dispatch(this._component);
        }
        /**
         * @internal
         */
        public generatePositionAndDirection(position: Vector3, direction: Vector3) {
            generatePositionAndDirection(position, direction, this);
        }
    }
    /**
     * 
     */
    export class VelocityOverLifetimeModule extends ParticleModule {
        @paper.serializedField
        private _mode: CurveMode = CurveMode.Constant;
        @paper.serializedField
        private _space: SimulationSpace = SimulationSpace.Local;
        @paper.serializedField
        private readonly _x: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        private readonly _y: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        private readonly _z: MinMaxCurve = new MinMaxCurve();

        public deserialize(element: any) { // TODO
            super.deserialize(element);
            this._mode = (element._mode || element.mode) || CurveMode.Constant;
            this._space = (element._space || element.space) || SimulationSpace.Local;
            this._x.deserialize(element._x || element.x);
            this._y.deserialize(element._y || element.y);
            this._z.deserialize(element._z || element.z);

            return this;
        }
        /**
         * 
         */
        public get mode() {
            return this._mode;
        }
        public set mode(value: CurveMode) {
            if (this._mode === value) {
                return;
            }

            this._mode = value;
            onVelocityChanged.dispatch(this._component);
        }
        /**
         * 
         */
        public get space() {
            return this._space;
        }
        public set space(value: SimulationSpace) {
            if (this._space === value) {
                return;
            }

            this._space = value;
            onVelocityChanged.dispatch(this._component);
        }
        /**
         * 
         */
        public get x(): Readonly<MinMaxCurve> {
            return this._x;
        }
        public set x(value: Readonly<MinMaxCurve>) {
            this._x.copy(value);
            onVelocityChanged.dispatch(this._component);
        }
        /**
         * 
         */
        public get y(): Readonly<MinMaxCurve> {
            return this._y;
        }
        public set y(value: Readonly<MinMaxCurve>) {
            this._y.copy(value);
            onVelocityChanged.dispatch(this._component);
        }
        /**
         * 
         */
        public get z(): Readonly<MinMaxCurve> {
            return this._z;
        }
        public set z(value: Readonly<MinMaxCurve>) {
            this._z.copy(value);
            onVelocityChanged.dispatch(this._component);
        }
    }
    /**
     * 
     */
    export class ColorOverLifetimeModule extends ParticleModule {
        @paper.serializedField
        private _color: MinMaxGradient = new MinMaxGradient(); // TODO readonly

        public deserialize(element: any) { // TODO
            super.deserialize(element);
            this._color.deserialize(element._color || element.color);

            return this;
        }
        /**
         * 
         */
        public get color(): Readonly<MinMaxGradient> {
            return this._color;
        }
        public set color(value: Readonly<MinMaxGradient>) {
            this._color = value; // TODO copy
            onColorChanged.dispatch(this._component);
        }
    }
    /**
     * 
     */
    export class SizeOverLifetimeModule extends ParticleModule {
        @paper.serializedField
        private _separateAxes: boolean = false;
        @paper.serializedField
        private readonly _size: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        private readonly _x: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        private readonly _y: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        private readonly _z: MinMaxCurve = new MinMaxCurve();

        public deserialize(element: any) { // TODO
            super.deserialize(element);
            this._separateAxes = (element._separateAxes || element.separateAxes) || false;
            this._size.deserialize(element._size || element.size);
            this._x.deserialize(element._x || element.x);
            this._y.deserialize(element._y || element.y);
            this._z.deserialize(element._z || element.z);

            return this;
        }
        /**
         * 
         */
        public get separateAxes() {
            return this._separateAxes;
        }
        public set separateAxes(value: boolean) {
            if (this._separateAxes === value) {
                return;
            }

            this._separateAxes = value;
            onSizeChanged.dispatch(this._component);
        }
        /**
         * 
         */
        public get size(): Readonly<MinMaxCurve> {
            return this._size;
        }
        public set size(value: Readonly<MinMaxCurve>) {
            this._size.copy(value);
            onSizeChanged.dispatch(this._component);
        }
        /**
         * 
         */
        public get x(): Readonly<MinMaxCurve> {
            return this._x;
        }
        public set x(value: Readonly<MinMaxCurve>) {
            this._x.copy(value);
            onSizeChanged.dispatch(this._component);
        }
        /**
         * 
         */
        public get y(): Readonly<MinMaxCurve> {
            return this._y;
        }
        public set y(value: Readonly<MinMaxCurve>) {
            this._y.copy(value);
            onSizeChanged.dispatch(this._component);
        }
        /**
         * 
         */
        public get z(): Readonly<MinMaxCurve> {
            return this._z;
        }
        public set z(value: Readonly<MinMaxCurve>) {
            this._z.copy(value);
            onSizeChanged.dispatch(this._component);
        }
    }
    /**
     * 
     */
    export class RotationOverLifetimeModule extends ParticleModule {
        @paper.serializedField
        private _separateAxes: boolean = false;
        @paper.serializedField
        private readonly _x: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        private readonly _y: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        private readonly _z: MinMaxCurve = new MinMaxCurve();

        public deserialize(element: any) { // TODO
            super.deserialize(element);
            this._separateAxes = (element._separateAxes || element.separateAxes) || false;
            this._x.deserialize(element._x || element.x);
            this._y.deserialize(element._y || element.y);
            this._z.deserialize(element._z || element.z);

            return this;
        }
        /**
         * 
         */
        public get separateAxes() {
            return this._separateAxes;
        }
        public set separateAxes(value: boolean) {
            if (this._separateAxes === value) {
                return;
            }

            this._separateAxes = value;
            onRotationChanged.dispatch(this._component);
        }
        /**
         * 
         */
        public get x(): Readonly<MinMaxCurve> {
            return this._x;
        }
        public set x(value: Readonly<MinMaxCurve>) {
            this._x.copy(value);
            onRotationChanged.dispatch(this._component);
        }
        /**
         * 
         */
        public get y(): Readonly<MinMaxCurve> {
            return this._y;
        }
        public set y(value: Readonly<MinMaxCurve>) {
            this._y.copy(value);
            onRotationChanged.dispatch(this._component);
        }
        /**
         * 
         */
        public get z(): Readonly<MinMaxCurve> {
            return this._z;
        }
        public set z(value: Readonly<MinMaxCurve>) {
            this._z.copy(value);
            onRotationChanged.dispatch(this._component);
        }
    }
    /**
     * 
     */
    export class TextureSheetAnimationModule extends ParticleModule {
        @paper.serializedField
        private _useRandomRow: boolean = false;
        @paper.serializedField
        private _animation: AnimationType = AnimationType.WholeSheet;
        @paper.serializedField
        private _numTilesX: uint = 1;
        @paper.serializedField
        private _numTilesY: uint = 1;
        @paper.serializedField
        private _cycleCount: uint = 1;
        @paper.serializedField
        private _rowIndex: uint = 0;
        @paper.serializedField
        private readonly _frameOverTime: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        private readonly _startFrame: MinMaxCurve = new MinMaxCurve();
        private readonly _floatValues: Float32Array = new Float32Array(4);

        public deserialize(element: any) { // TODO
            super.deserialize(element);
            this._numTilesX = (element._numTilesX || element.numTilesX) || 0;
            this._numTilesY = (element._numTilesY || element.numTilesY) || 0;
            this._animation = (element._animation || element.animation) || AnimationType.WholeSheet;
            this._useRandomRow = (element._useRandomRow || element.useRandomRow) || false;
            this._frameOverTime.deserialize(element._frameOverTime || element.frameOverTime);
            this._startFrame.deserialize(element._startFrame || element.startFrame);
            this._cycleCount = (element._cycleCount || element.cycleCount) || 0;
            this._rowIndex = (element._rowIndex || element.rowIndex) || 0;

            return this;
        }
        /**
         * 
         */
        public get numTilesX() {
            return this._numTilesX;
        }
        public set numTilesX(value: number) {
            if (this._numTilesX === value) {
                return;
            }

            this._numTilesX = value;
            onTextureSheetChanged.dispatch(this._component);
        }
        /**
         * 
         */
        public get numTilesY() {
            return this._numTilesY;
        }
        public set numTilesY(value: number) {
            if (this._numTilesY === value) {
                return;
            }

            this._numTilesY = value;
            onTextureSheetChanged.dispatch(this._component);
        }
        /**
         * 
         */
        public get animation() {
            return this._animation;
        }
        public set animation(value: AnimationType) {
            if (this._animation === value) {
                return;
            }

            this._animation = value;
            onTextureSheetChanged.dispatch(this._component);
        }
        /**
         * 
         */
        public get useRandomRow() {
            return this._useRandomRow;
        }
        public set useRandomRow(value: boolean) {
            if (this._useRandomRow === value) {
                return;
            }

            this._useRandomRow = value;
            onTextureSheetChanged.dispatch(this._component);
        }
        /**
         * 
         */
        public get frameOverTime(): Readonly<MinMaxCurve> {
            return this._frameOverTime;
        }
        public set frameOverTime(value: Readonly<MinMaxCurve>) {
            this._frameOverTime.copy(value);
            onTextureSheetChanged.dispatch(this._component);
        }
        /**
         * 
         */
        public get startFrame(): Readonly<MinMaxCurve> {
            return this._startFrame;
        }
        public set startFrame(value: Readonly<MinMaxCurve>) {
            this._startFrame.copy(value);
            onTextureSheetChanged.dispatch(this._component);
        }
        /**
         * 
         */
        public get cycleCount() {
            return this._cycleCount;
        }
        public set cycleCount(value: number) {
            if (this._cycleCount === value) {
                return;
            }

            this._cycleCount = value;
            onTextureSheetChanged.dispatch(this._component);
        }
        /**
         * 
         */
        public get rowIndex() {
            return this._rowIndex;
        }
        public set rowIndex(value: number) {
            if (this._rowIndex === value) {
                return;
            }

            this._rowIndex = value;
            onTextureSheetChanged.dispatch(this._component);
        }

        public get floatValues(): Readonly<Float32Array> {
            let res = this._floatValues;
            if (this.enable) {
                const subU: number = 1.0 / this._numTilesX;
                const subV: number = 1.0 / this._numTilesY;

                let startFrmaeCount = Math.floor(this._startFrame.constant);
                let startRow = 0;
                switch (this._animation) {
                    case AnimationType.SingleRow:
                        {
                            if (this._useRandomRow) {
                                startRow = Math.floor(Math.random() * this._numTilesY);
                            } else {
                                startRow = this._rowIndex;
                            }
                            break;
                        }
                    case AnimationType.WholeSheet:
                        {
                            startRow = Math.floor(startFrmaeCount / this._numTilesX);
                            break;
                        }
                }
                const startCol = Math.floor(startFrmaeCount % this._numTilesX);
                res[0] = subU;
                res[1] = subV;
                res[2] = startCol * subU;
                res[3] = startRow * subV;
            } else {
                res[0] = 1.0;
                res[1] = 1.0;
                res[2] = 0.0;
                res[3] = 0.0;
            }

            return res;
        }
    }
}
