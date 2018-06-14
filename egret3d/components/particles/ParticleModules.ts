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
        public startSize3D: boolean = false;
        @paper.serializedField
        public readonly startSizeX: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        public readonly startSizeY: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        public readonly startSizeZ: MinMaxCurve = new MinMaxCurve();
        //
        @paper.serializedField
        public startRotation3D: boolean = false;
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
        //
        @paper.serializedField
        public simulationSpace: SimulationSpace = SimulationSpace.Local;
        //
        @paper.serializedField
        public scaleMode: ScalingMode = ScalingMode.Hierarchy;
        //
        @paper.serializedField
        public playOnAwake: boolean = false;
        //
        @paper.serializedField
        public maxParticles: number = 0;

        public deserialize(element: any) {
            super.deserialize(element);
            this.duration = element.duration;
            this.loop = element.loop || element.looping; // TODO 兼容代码 looping。
            this.startDelay.deserialize(element.startDelay);
            this.startLifetime.deserialize(element.startLifetime);
            this.startSpeed.deserialize(element.startSpeed);
            this.startSize3D = element.startSize3D;
            this.startSizeX.deserialize(element.startSizeX);
            this.startSizeY.deserialize(element.startSizeY);
            this.startSizeZ.deserialize(element.startSizeZ);
            this.startRotation3D = element.startRotation3D;
            this.startRotationX.deserialize(element.startRotationX);
            this.startRotationY.deserialize(element.startRotationY);
            this.startRotationZ.deserialize(element.startRotationZ);
            this.startColor.deserialize(element.startColor);
            this.gravityModifier.deserialize(element.gravityModifier);
            this.simulationSpace = element.simulationSpace;
            this.scaleMode = element.scaleMode;
            this.playOnAwake = element.playOnAwake;
            this.maxParticles = element.maxParticles;
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
            paper.EventPool.dispatchEvent(ParticleComponenetEventType.ShapeChanged, this._comp);
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
        public mode: CurveMode = CurveMode.Constant;
        @paper.serializedField
        public space: SimulationSpace = SimulationSpace.Local;
        @paper.serializedField
        public readonly x: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        public readonly y: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        public readonly z: MinMaxCurve = new MinMaxCurve();

        public initialize() {
            super.initialize();
        }

        public deserialize(element: any) {
            super.deserialize(element);
            this.mode = element.mode;
            this.space = element.space;
            this.x.deserialize(element.x);
            this.y.deserialize(element.y);
            this.z.deserialize(element.z);
        }

        public invalidUpdate(): void {
            paper.EventPool.dispatchEvent(ParticleComponenetEventType.VelocityOverLifetime, this._comp);
        }
    }

    export class LimitVelocityOverLifetimeModule extends ParticleSystemModule {
        @paper.serializedField
        public readonly x: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        public readonly y: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        public readonly z: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        public dampen: number;
        @paper.serializedField
        public separateAxes: boolean;
        @paper.serializedField
        public space: SimulationSpace = SimulationSpace.Local;

        public deserialize(element: any) {
            super.deserialize(element);
            this.x.deserialize(element.limitX);
            this.y.deserialize(element.limitY);
            this.z.deserialize(element.limitZ);
            this.dampen = element.dampen;
            this.separateAxes = element.separateAxes;
            this.space = element.space;
        }
    }

    export class ColorOverLifetimeModule extends ParticleSystemModule {
        @paper.serializedField
        public color: MinMaxGradient = new MinMaxGradient();

        public deserialize(element: any) {
            super.deserialize(element);
            this.color.deserialize(element.color);
        }

        public invalidUpdate(): void {
            paper.EventPool.dispatchEvent(ParticleComponenetEventType.ColorOverLifetime, this._comp);
        }
    }

    export class SizeOverLifetimeModule extends ParticleSystemModule {
        @paper.serializedField
        public separateAxes: boolean = false;
        @paper.serializedField
        public readonly size: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        public readonly x: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        public readonly y: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        public readonly z: MinMaxCurve = new MinMaxCurve();

        public deserialize(element: any) {
            super.deserialize(element);
            this.separateAxes = element.separateAxes || false;
            this.size.deserialize(element.x);
            this.x.deserialize(element.x);
            this.y.deserialize(element.y);
            this.z.deserialize(element.z);
        }
        public invalidUpdate(): void {
            paper.EventPool.dispatchEvent(ParticleComponenetEventType.SizeOverLifetime, this._comp);
        }
    }

    export class RotationOverLifetimeModule extends ParticleSystemModule {
        @paper.serializedField
        public readonly x: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        public readonly y: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        public readonly z: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        public separateAxes: boolean;

        public deserialize(element: any) {
            super.deserialize(element);
            this.x.deserialize(element.x);
            this.y.deserialize(element.y);
            this.z.deserialize(element.z);
            this.separateAxes = element.separateAxes;
        }
        public invalidUpdate(): void {
            paper.EventPool.dispatchEvent(ParticleComponenetEventType.RotationOverLifetime, this._comp);
        }
    }

    export class TextureSheetAnimationModule extends ParticleSystemModule {
        @paper.serializedField
        public numTilesX: number;
        @paper.serializedField
        public numTilesY: number;
        @paper.serializedField
        public animation: AnimationType = AnimationType.WholeSheet;
        @paper.serializedField
        public useRandomRow: boolean;
        @paper.serializedField
        public readonly frameOverTime: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        public readonly startFrame: MinMaxCurve = new MinMaxCurve();
        @paper.serializedField
        public cycleCount: number;
        @paper.serializedField
        public rowIndex: number;

        public deserialize(element: any) {
            super.deserialize(element);
            this.numTilesX = element.numTilesX;
            this.numTilesY = element.numTilesY;
            this.animation = element.animation;
            this.useRandomRow = element.useRandomRow;
            this.frameOverTime.deserialize(element.frameOverTime);
            this.startFrame.deserialize(element.startFrame);
            this.cycleCount = element.cycleCount;
            this.rowIndex = element.rowIndex;
        }
        public invalidUpdate(): void {
            paper.EventPool.dispatchEvent(ParticleComponenetEventType.TextureSheetAnimation, this._comp);
        }

        public evaluate(t: number = 0.0, out: Vector4): Vector4 {
            if (this.enable) {
                const subU: number = 1.0 / this.numTilesX;
                const subV: number = 1.0 / this.numTilesY;

                let startFrmaeCount = Math.floor(this.startFrame.evaluate(t));
                startFrmaeCount += Math.floor(this.frameOverTime.evaluate(t));

                let startRow = 0;
                switch (this.animation) {
                    case AnimationType.SingleRow:
                        {
                            if (this.useRandomRow) {
                                startRow = Math.floor(Math.random() * this.numTilesY);
                            } else {
                                startRow = this.rowIndex;
                            }
                        }
                        break;
                    case AnimationType.WholeSheet:
                        {
                            startRow = Math.floor(startFrmaeCount / this.numTilesX);
                        }
                        break;
                }
                const startCol = Math.floor(startFrmaeCount % this.numTilesX);

                out.x = subU;
                out.y = subV;
                out.z = startCol * subU;
                out.w = startRow * subV;
            } else {
                out.x = out.y = 1.0;
                out.z = out.w = 0.0;
            }
            return out;
        }
    }
}
