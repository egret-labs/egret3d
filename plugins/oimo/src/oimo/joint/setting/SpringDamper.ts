namespace egret3d.oimo {
    const enum ValueType {
        Frequency,
        DampingRatio,
        UseSymplecticEuler,
    }
    /**
     * 关节的弹簧缓冲器设置。
     */
    export class SpringDamper implements paper.ISerializable {
        /**
         * @internal
         */
        public static create(): SpringDamper {
            return new SpringDamper();
        }

        private readonly _values: Float32Array = new Float32Array([
            0.0, OIMO.Setting.minSpringDamperDampingRatio, 0,
        ]);
        /**
         * @internal
         */
        public _oimoSpringDamper: OIMO.SpringDamper | null = null;

        private constructor() {
        }

        public serialize() {
            return this._values;
        }

        public deserialize(value: [float, float, float]) {
            this._values[0] = value[0];
            this._values[1] = value[1];
            this._values[2] = value[2];

            return this;
        }
        /**
         * 该弹簧的频率。
         * - 单位为`赫兹`。
         * - [`0.0` ~ N]
         * - 默认为 `0.0` ，禁用弹性，使约束完全刚性。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public get frequency(): float {
            return this._values[ValueType.Frequency];
        }
        public set frequency(value: float) {
            if (value < 0.0) {
                value = 0.0;
            }

            this._values[ValueType.Frequency] = value;

            if (this._oimoSpringDamper !== null) {
                this._oimoSpringDamper.frequency = value;
            }
        }
        /**
         * 该缓冲器的阻尼系数。
         * - [`OIMO.Setting.minSpringDamperDampingRatio` ~ N]
         * - 默认为 `OIMO.Setting.minSpringDamperDampingRatio` 。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: OIMO.Setting.minSpringDamperDampingRatio })
        public get dampingRatio(): float {
            return this._values[ValueType.DampingRatio];
        }
        public set dampingRatio(value: float) {
            if (value < OIMO.Setting.minSpringDamperDampingRatio) {
                value = OIMO.Setting.minSpringDamperDampingRatio;
            }

            this._values[ValueType.DampingRatio] = value;

            if (this._oimoSpringDamper !== null) {
                this._oimoSpringDamper.dampingRatio = value;
            }
        }
        /**
         * 是否使用辛欧拉法代替隐式欧拉法，辛欧拉法比隐式欧拉法有更好的性能，但约束在高频下不稳定。
         * - 默认为 `false`，使用隐式欧拉法。
         */
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public get useSymplecticEuler(): boolean {
            return this._values[ValueType.UseSymplecticEuler] > 0;
        }
        public set useSymplecticEuler(value: boolean) {
            this._values[ValueType.UseSymplecticEuler] = value ? 1 : 0;

            if (this._oimoSpringDamper !== null) {
                this._oimoSpringDamper.useSymplecticEuler = value;
            }
        }
    }
}
