namespace egret3d.particle {

    const colorHelper1: Color = new Color();
    const colorHelper2: Color = new Color();

    export const enum CurveMode {
        Constant = 0,
        Curve = 1,
        TwoCurves = 2,
        TwoConstants = 3
    }

    export const enum ColorGradientMode {
        Color = 0,
        Gradient = 1,
        TwoColors = 2,
        TwoGradients = 3,
        RandomColor = 4
    }

    export const enum SimulationSpace {
        Local = 0,
        World = 1,
        Custom = 2
    }

    export const enum ScalingMode {
        Hierarchy = 0,
        Local = 1,
        Shape = 2
    }

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

    export const enum ShapeMultiModeValue {
        Random = 0,
        Loop = 1,
        PingPong = 2,
        BurstSpread = 3
    }

    export const enum AnimationType {
        WholeSheet = 0,
        SingleRow = 1
    }

    export const enum UVChannelFlags {
        UV0 = 1,
        UV1 = 2,
        UV2 = 4,
        UV3 = 8
    }

    export const enum GradientMode {
        Blend = 0,
        Fixed = 1
    }

    export class Keyframe implements paper.ISerializable {
        public time: number;
        public value: number;

        public serialize() {
            return [this.time, this.value];
        }

        public deserialize(element: any) {
            this.time = element[0];
            this.value = element[1];
        }
        public clone(source: Keyframe) {
            this.time = source.time;
            this.value = source.value;
        }
    }

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

        public clone(source: AnimationCurve) {
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

    export class GradientColorKey extends paper.SerializableObject {
        @paper.serializedField
        public color: Color = new Color();
        @paper.serializedField
        public time: number;

        public deserialize(element: any) {
            this.color.deserialize(element.color);
            this.time = element.time;
        }
    }

    export class GradientAlphaKey extends paper.SerializableObject {
        @paper.serializedField
        public alpha: number;
        @paper.serializedField
        public time: number;

        public deserialize(element: any) {
            this.alpha = element.alpha;
            this.time = element.time;
        }
    }

    export class Gradient extends paper.SerializableObject {
        @paper.serializedField
        public mode: GradientMode = GradientMode.Blend;
        @paper.serializedField
        private readonly alphaKeys: Array<GradientAlphaKey> = new Array<GradientAlphaKey>();
        @paper.serializedField
        private readonly colorKeys: Array<GradientColorKey> = new Array<GradientColorKey>();

        private readonly _alphaValue: Float32Array = new Float32Array(8);
        private readonly _colorValue: Float32Array = new Float32Array(16);

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
        }

        public evaluate(t: number = 0, out: Color): Color {
            for (let i = 0, l = this.alphaKeys.length; i < l; i++) {
                const curKeyFrame = this.alphaKeys[i];
                if (curKeyFrame.time > t) {
                    const lastIndex = i == 0 ? 0 : i - 1;
                    const lastKeyFrame = this.alphaKeys[lastIndex];
                    const tt = (t - lastKeyFrame.time) / (curKeyFrame.time - lastKeyFrame.time);
                    out.a = numberLerp(lastKeyFrame.alpha, curKeyFrame.alpha, tt);
                    break;
                }
            }

            for (let i = 0, l = this.colorKeys.length; i < l; i++) {
                const colorKey = this.colorKeys[i];
                if (colorKey.time > t) {
                    const lastIndex = i == 0 ? 0 : i - 1;
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

    export class MinMaxCurve extends paper.SerializableObject {
        @paper.serializedField
        public mode: CurveMode = CurveMode.Constant;
        @paper.serializedField
        public constant: number;
        @paper.serializedField
        public constantMin: number;
        @paper.serializedField
        public constantMax: number;
        @paper.serializedField
        public readonly curve: AnimationCurve = new AnimationCurve();
        @paper.serializedField
        public readonly curveMin: AnimationCurve = new AnimationCurve();
        @paper.serializedField
        public readonly curveMax: AnimationCurve = new AnimationCurve();

        public deserialize(element: any) {
            this.mode = element.mode;
            this.constant = element.constant || 0;
            this.constantMin = element.constantMin || 0;
            this.constantMax = element.constantMax || 0;
            element.curve && this.curve.deserialize(element.curve);
            element.curveMin && this.curveMin.deserialize(element.curveMin);
            element.curveMax && this.curveMax.deserialize(element.curveMax);
        }

        public evaluate(t: number = 0): number {
            if (this.mode === CurveMode.Constant) {
                return this.constant;
            } else if (this.mode === CurveMode.TwoConstants) {
                return (Math.random() * (this.constantMax - this.constantMin) + this.constantMin);
            } else if (this.mode === CurveMode.Curve) {
                return this.curve.evaluate(t);
            } else { //Two Curves
                const min = this.curveMin.evaluate(t);
                const max = this.curveMax.evaluate(t);
                return (Math.random() * (min - max) + min);
            }
        }

        public clone(source: MinMaxCurve) {
            this.mode = source.mode;
            this.constant = source.constant;
            this.constantMin = source.constantMin;
            this.constantMax = source.constantMax;
            this.curve.clone(source.curve);
            this.curveMin.clone(source.curveMin);
            this.curveMax.clone(source.curveMax);
        }
    }

    export class MinMaxGradient extends paper.SerializableObject {
        @paper.serializedField
        public mode: ColorGradientMode = ColorGradientMode.Gradient;
        @paper.serializedField
        public readonly color: Color = new Color();
        @paper.serializedField
        public readonly colorMin: Color = new Color();
        @paper.serializedField
        public readonly colorMax: Color = new Color();
        @paper.serializedField
        public readonly gradient: Gradient = new Gradient();
        @paper.serializedField
        public readonly gradientMin: Gradient = new Gradient();
        @paper.serializedField
        public readonly gradientMax: Gradient = new Gradient();

        public deserialize(element: any) {
            // super.deserialize(element);
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
        }

        public evaluate(t: number = 0, out: Color): Color {
            if (this.mode === ColorGradientMode.Color) {
                out.r = this.color.r;
                out.g = this.color.g;
                out.b = this.color.b;
                out.a = this.color.a;
            } else if (this.mode === ColorGradientMode.TwoColors) {
                out.r = Math.random() * (this.colorMax.r - this.colorMin.r) + this.colorMin.r;
                out.g = Math.random() * (this.colorMax.g - this.colorMin.g) + this.colorMin.g;
                out.b = Math.random() * (this.colorMax.b - this.colorMin.b) + this.colorMin.b;
                out.a = Math.random() * (this.colorMax.a - this.colorMin.a) + this.colorMin.a;
            } else if (this.mode === ColorGradientMode.Gradient) {
                return this.gradient.evaluate(t, out);
            } else if (this.mode === ColorGradientMode.TwoGradients) {
                this.gradientMin.evaluate(t, colorHelper1);
                this.gradientMax.evaluate(t, colorHelper2);
                out.r = (Math.random() * (colorHelper1.r - colorHelper2.r) + colorHelper1.r);
                out.g = (Math.random() * (colorHelper1.g - colorHelper2.g) + colorHelper1.g);
                out.b = (Math.random() * (colorHelper1.b - colorHelper2.b) + colorHelper1.b);
                out.a = (Math.random() * (colorHelper1.a - colorHelper2.a) + colorHelper1.a);
            } else {
                out.r = Math.random();
                out.g = Math.random();
                out.b = Math.random();
                out.a = Math.random();
            }

            return out;
        }
    }

    export class Burst implements paper.ISerializable {
        public time: number;
        public minCount: number;
        public maxCount: number;
        public cycleCount: number;
        public repeatInterval: number;

        public serialize() {
            return [this.time, this.minCount, this.maxCount, this.cycleCount, this.repeatInterval];
        }

        public deserialize(element: any) {
            this.time = element[0];
            this.minCount = element[1];
            this.maxCount = element[2];
            this.cycleCount = element[3];
            this.repeatInterval = element[4];
        }
    }

    export abstract class ParticleSystemModule extends paper.SerializableObject {
        @paper.serializedField
        public enable: boolean = false;

        protected _comp: ParticleComponent;
        public constructor(comp: ParticleComponent) {
            super();

            this._comp = comp;
        }
        /**
         * @internal
         */
        public initialize(): void { }

        public deserialize(element: any) {
            this.enable = true;
        }
    }

    export class MainModule extends ParticleSystemModule {
        @paper.serializedField
        public duration: number = 0.0;
        @paper.serializedField
        public loop: boolean = false;
        //
        @paper.serializedField
        public readonly startDelay: MinMaxCurve = new MinMaxCurve();
        //
        @paper.serializedField
        public readonly startLifetime: MinMaxCurve = new MinMaxCurve();
        //
        @paper.serializedField
        public readonly startSpeed: MinMaxCurve = new MinMaxCurve();
        //
        @paper.serializedField
        public readonly startSizeX: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        public readonly startSizeY: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        public readonly startSizeZ: MinMaxCurve = new MinMaxCurve();
        /**
         * @internal
         */
        @paper.serializedField
        public _startRotation3D: boolean = false;
        @paper.serializedField
        public readonly startRotationX: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        public readonly startRotationY: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        public readonly startRotationZ: MinMaxCurve = new MinMaxCurve();
        //
        @paper.serializedField
        public readonly startColor: MinMaxGradient = new MinMaxGradient();
        //
        @paper.serializedField
        public readonly gravityModifier: MinMaxCurve = new MinMaxCurve(); //TODO
        /**
         * @internal
         */
        @paper.serializedField
        public _simulationSpace: SimulationSpace = SimulationSpace.Local;
        /**
         * @internal
         */
        @paper.serializedField
        public _scaleMode: ScalingMode = ScalingMode.Hierarchy;
        //
        @paper.serializedField
        public playOnAwake: boolean = false;
        /**
         * @internal
         */
        @paper.serializedField
        public _maxParticles: number = 0;

        public deserialize(element: any) {
            super.deserialize(element);
            this.duration = element.duration;
            this.loop = element.loop || element.looping; // TODO 兼容代码 looping。
            this.startDelay.deserialize(element.startDelay);
            this.startLifetime.deserialize(element.startLifetime);
            this.startSpeed.deserialize(element.startSpeed);
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
        }

        public set startRotation3D(value: boolean) {
            if (this._startRotation3D !== value) {
                this._startRotation3D = value;
                paper.EventPool.dispatchEvent(ParticleCompEventType.StartRotation3DChanged, this._comp);
            }
        }
        public get startRotation3D() {
            return this._startRotation3D;
        }
        public set simulationSpace(value: SimulationSpace) {
            if (this._simulationSpace !== value) {
                this._simulationSpace = value;
                paper.EventPool.dispatchEvent(ParticleCompEventType.SimulationSpaceChanged, this._comp);
            }
        }
        public get simulationSpace() {
            return this._simulationSpace;
        }
        public set scaleMode(value: ScalingMode) {
            if (this._scaleMode !== value) {
                this._scaleMode = value;
                paper.EventPool.dispatchEvent(ParticleCompEventType.ScaleModeChanged, this._comp);
            }
        }
        public get scaleMode() {
            return this._scaleMode;
        }
        public set maxParticles(value: number) {
            if (this._maxParticles !== value) {
                this._maxParticles = value;
                paper.EventPool.dispatchEvent(ParticleCompEventType.MaxParticlesChanged, this._comp);
            }
        }
        public get maxParticles() {
            return this._maxParticles;
        }
    }

    export class EmissionModule extends ParticleSystemModule {
        @paper.serializedField
        public readonly rateOverTime: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        public readonly bursts: Array<Burst> = new Array<Burst>();

        public deserialize(element: any) {
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
        }
    }

    export class ShapeModule extends ParticleSystemModule {
        @paper.serializedField
        public shapeType: ShapeType = ShapeType.Sphere;
        @paper.serializedField
        public radius: number = 0.0;
        @paper.serializedField
        public angle: number = 0.0;
        @paper.serializedField
        public length: number = 0.0;
        @paper.serializedField
        public readonly arcSpeed: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        public arcMode: ShapeMultiModeValue = ShapeMultiModeValue.Random;
        @paper.serializedField
        public radiusSpread: number;
        @paper.serializedField
        public radiusMode: ShapeMultiModeValue = ShapeMultiModeValue.Random;
        @paper.serializedField
        public readonly box: egret3d.Vector3 = new egret3d.Vector3();
        @paper.serializedField
        public randomDirection: boolean = false;
        @paper.serializedField
        public spherizeDirection: boolean = false;

        public deserialize(element: any) {
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
        }
        public invalidUpdate(): void {
            paper.EventPool.dispatchEvent(ParticleCompEventType.ShapeChanged, this._comp);
        }

        public generatePositionAndDirection(position: Vector3, direction: Vector3) {
            generatePositionAndDirection(position, direction, this);
        }
    }

    export class VelocityOverLifetimeModule extends ParticleSystemModule {
        /**
         * @internal
         */
        @paper.serializedField
        public _mode: CurveMode = CurveMode.Constant;
        /**
         * @internal
         */
        @paper.serializedField
        public _space: SimulationSpace = SimulationSpace.Local;
        /**
         * @internal
         */
        @paper.serializedField
        public readonly _x: MinMaxCurve = new MinMaxCurve();
        /**
         * @internal
         */
        @paper.serializedField
        public readonly _y: MinMaxCurve = new MinMaxCurve();
        /**
         * @internal
         */
        @paper.serializedField
        public readonly _z: MinMaxCurve = new MinMaxCurve();

        public deserialize(element: any) {
            super.deserialize(element);
            this._mode = (element._mode || element.mode) || CurveMode.Constant;
            this._space = (element._space || element.space) || SimulationSpace.Local;
            this._x.deserialize(element._x || element.x);
            this._y.deserialize(element._y || element.y);
            this._z.deserialize(element._z || element.z);
        }

        public set mode(value: CurveMode) {
            if (this._mode !== value) {
                this._mode = value;
                paper.EventPool.dispatchEvent(ParticleCompEventType.VelocityChanged, this._comp);
            }
        }
        public get mode() {
            return this._mode;
        }
        public set space(value: SimulationSpace) {
            if (this._space !== value) {
                this._space = value;
                paper.EventPool.dispatchEvent(ParticleCompEventType.VelocityChanged, this._comp);
            }
        }
        public get space() {
            return this._space;
        }
        public set x(value: Readonly<MinMaxCurve>) {
            if (this._x !== value) {
                this._x.clone(value);
                paper.EventPool.dispatchEvent(ParticleCompEventType.VelocityChanged, this._comp);
            }
        }
        public get x() {
            return this._x;
        }
        public set y(value: Readonly<MinMaxCurve>) {
            if (this._y !== value) {
                this._y.clone(value);
                paper.EventPool.dispatchEvent(ParticleCompEventType.VelocityChanged, this._comp);
            }
        }
        public get y() {
            return this._y;
        }
        public set z(value: Readonly<MinMaxCurve>) {
            if (this._z !== value) {
                this._z.clone(value);
                paper.EventPool.dispatchEvent(ParticleCompEventType.VelocityChanged, this._comp);
            }
        }
        public get z() {
            return this._z;
        }
    }

    export class ColorOverLifetimeModule extends ParticleSystemModule {
        /**
         * @internal
         */
        @paper.serializedField
        public _color: MinMaxGradient = new MinMaxGradient();

        public deserialize(element: any) {
            super.deserialize(element);
            this._color.deserialize(element._color || element.color);
        }
        public set color(value: Readonly<MinMaxGradient>) {
            if (this._color !== value) {
                this._color = value;
                paper.EventPool.dispatchEvent(ParticleCompEventType.ColorChanged, this._comp);
            }
        }
        public get color() {
            return this._color;
        }
    }

    export class SizeOverLifetimeModule extends ParticleSystemModule {
        /**
         * @internal
         */
        @paper.serializedField
        public _separateAxes: boolean = false;
        /**
         * @internal
         */
        @paper.serializedField
        public readonly _size: MinMaxCurve = new MinMaxCurve();
        /**
         * @internal
         */
        @paper.serializedField
        public readonly _x: MinMaxCurve = new MinMaxCurve();
        /**
         * @internal
         */
        @paper.serializedField
        public readonly _y: MinMaxCurve = new MinMaxCurve();
        /**
         * @internal
         */
        @paper.serializedField
        public readonly _z: MinMaxCurve = new MinMaxCurve();

        public deserialize(element: any) {
            super.deserialize(element);
            this._separateAxes = (element._separateAxes || element.separateAxes) || false;
            this._size.deserialize(element._size || element.size);
            this._x.deserialize(element._x || element.x);
            this._y.deserialize(element._y || element.y);
            this._z.deserialize(element._z || element.z);
        }
        public set separateAxes(value: boolean) {
            if (this._separateAxes !== value) {
                this._separateAxes = value;
                paper.EventPool.dispatchEvent(ParticleCompEventType.SizeChanged, this._comp);
            }
        }
        public get separateAxes() {
            return this._separateAxes;
        }
        public set size(value: Readonly<MinMaxCurve>) {
            if (this._size !== value) {
                this._size.clone(value);
                paper.EventPool.dispatchEvent(ParticleCompEventType.SizeChanged, this._comp);
            }
        }
        public get size() {
            return this._size;
        }
        public set x(value: Readonly<MinMaxCurve>) {
            if (this._x !== value) {
                this._x.clone(value);
                paper.EventPool.dispatchEvent(ParticleCompEventType.SizeChanged, this._comp);
            }
        }
        public get x() {
            return this._x;
        }
        public set y(value: Readonly<MinMaxCurve>) {
            if (this._y !== value) {
                this._y.clone(value);
                paper.EventPool.dispatchEvent(ParticleCompEventType.SizeChanged, this._comp);
            }
        }
        public get y() {
            return this._y;
        }
        public set z(value: Readonly<MinMaxCurve>) {
            if (this._z !== value) {
                this._z.clone(value);
                paper.EventPool.dispatchEvent(ParticleCompEventType.SizeChanged, this._comp);
            }
        }
        public get z() {
            return this._z;
        }
    }

    export class RotationOverLifetimeModule extends ParticleSystemModule {
        /**
         * @internal
         */
        @paper.serializedField
        public _separateAxes: boolean;
        /**
         * @internal
         */
        @paper.serializedField
        public readonly _x: MinMaxCurve = new MinMaxCurve();
        /**
         * @internal
         */
        @paper.serializedField
        public readonly _y: MinMaxCurve = new MinMaxCurve();
        /**
         * @internal
         */
        @paper.serializedField
        public readonly _z: MinMaxCurve = new MinMaxCurve();

        public deserialize(element: any) {
            super.deserialize(element);
            this._separateAxes = (element._separateAxes || element.separateAxes) || false;
            this._x.deserialize(element._x || element.x);
            this._y.deserialize(element._y || element.y);
            this._z.deserialize(element._z || element.z);
        }
        public set separateAxes(value: boolean) {
            if (this._separateAxes !== value) {
                this._separateAxes = value;
                paper.EventPool.dispatchEvent(ParticleCompEventType.RotationChanged, this._comp);
            }
        }
        public get separateAxes() {
            return this._separateAxes;
        }
        public set x(value: Readonly<MinMaxCurve>) {
            if (this._x !== value) {
                this._x.clone(value);
                paper.EventPool.dispatchEvent(ParticleCompEventType.RotationChanged, this._comp);
            }
        }
        public get x() {
            return this._x;
        }
        public set y(value: Readonly<MinMaxCurve>) {
            if (this._y !== value) {
                this._y.clone(value);
                paper.EventPool.dispatchEvent(ParticleCompEventType.RotationChanged, this._comp);
            }
        }
        public get y() {
            return this._y;
        }
        public set z(value: Readonly<MinMaxCurve>) {
            if (this._z !== value) {
                this._z.clone(value);
                paper.EventPool.dispatchEvent(ParticleCompEventType.RotationChanged, this._comp);
            }
        }
        public get z() {
            return this._z;
        }
    }

    export class TextureSheetAnimationModule extends ParticleSystemModule {
        /**
         * @internal
         */
        @paper.serializedField
        public _numTilesX: number;
        /**
         * @internal
         */
        @paper.serializedField
        public _numTilesY: number;
        /**
         * @internal
         */
        @paper.serializedField
        public _animation: AnimationType = AnimationType.WholeSheet;
        /**
         * @internal
         */
        @paper.serializedField
        public _useRandomRow: boolean;
        /**
         * @internal
         */
        @paper.serializedField
        public readonly _frameOverTime: MinMaxCurve = new MinMaxCurve();
        /**
         * @internal
         */
        @paper.serializedField
        public readonly _startFrame: MinMaxCurve = new MinMaxCurve();
        /**
         * @internal
         */
        @paper.serializedField
        public _cycleCount: number;
        /**
         * @internal
         */
        @paper.serializedField
        public _rowIndex: number;

        private readonly _floatValues: Float32Array = new Float32Array(4);

        public deserialize(element: any) {
            super.deserialize(element);
            this._numTilesX = (element._numTilesX || element.numTilesX) || 0;
            this._numTilesY = (element._numTilesY || element.numTilesY) || 0;
            this._animation = (element._animation || element.animation) || AnimationType.WholeSheet;
            this._useRandomRow = (element._useRandomRow || element.useRandomRow) || false;
            this._frameOverTime.deserialize(element._frameOverTime || element.frameOverTime);
            this._startFrame.deserialize(element._startFrame || element.startFrame);
            this._cycleCount = (element._cycleCount || element.cycleCount) || 0;
            this._rowIndex = (element._rowIndex || element.rowIndex) || 0;
        }

        public set numTilesX(value: number) {
            if (this._numTilesX !== value) {
                this._numTilesX = value;
                paper.EventPool.dispatchEvent(ParticleCompEventType.TextureSheetChanged, this._comp);
            }
        }
        public get numTilesX() {
            return this._numTilesX;
        }
        public set numTilesY(value: number) {
            if (this._numTilesY !== value) {
                this._numTilesY = value;
                paper.EventPool.dispatchEvent(ParticleCompEventType.TextureSheetChanged, this._comp);
            }
        }
        public get numTilesY() {
            return this._numTilesY;
        }
        public set animation(value: AnimationType) {
            if (this._animation !== value) {
                this._animation = value;
                paper.EventPool.dispatchEvent(ParticleCompEventType.TextureSheetChanged, this._comp);
            }
        }
        public get animation() {
            return this._animation;
        }
        public set useRandomRow(value: boolean) {
            if (this._useRandomRow !== value) {
                this._useRandomRow = value;
                paper.EventPool.dispatchEvent(ParticleCompEventType.TextureSheetChanged, this._comp);
            }
        }
        public get useRandomRow() {
            return this._useRandomRow;
        }
        public set frameOverTime(value: Readonly<MinMaxCurve>) {
            if (this._frameOverTime !== value) {
                this._frameOverTime.clone(value);
                paper.EventPool.dispatchEvent(ParticleCompEventType.TextureSheetChanged, this._comp);
            }
        }
        public get frameOverTime() {
            return this._frameOverTime;
        }
        public set startFrame(value: Readonly<MinMaxCurve>) {
            if (this._startFrame !== value) {
                this._startFrame.clone(value);
                paper.EventPool.dispatchEvent(ParticleCompEventType.TextureSheetChanged, this._comp);
            }
        }
        public get startFrame() {
            return this._startFrame;
        }
        public set cycleCount(value: number) {
            if (this._cycleCount !== value) {
                this._cycleCount = value;
                paper.EventPool.dispatchEvent(ParticleCompEventType.TextureSheetChanged, this._comp);
            }
        }
        public get cycleCount() {
            return this._cycleCount;
        }
        public set rowIndex(value: number) {
            if (this._rowIndex !== value) {
                this._rowIndex = value;
                paper.EventPool.dispatchEvent(ParticleCompEventType.TextureSheetChanged, this._comp);
            }
        }
        public get rowIndex() {
            return this._rowIndex;
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
