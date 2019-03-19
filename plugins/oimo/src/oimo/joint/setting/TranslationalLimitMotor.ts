namespace egret3d.oimo {
    const enum ValueType {
        LowerLimit,
        UpperLimit,
        MotorSpeed,
        MotorForce,
    }
    /**
     * 关节的移动马达设置。
     */
    export class TranslationalLimitMotor implements paper.ISerializable {
        /**
         * @internal
         */
        public static create(): TranslationalLimitMotor {
            return new TranslationalLimitMotor();
        }

        private readonly _values: Float32Array = new Float32Array(4);
        /**
         * @internal
         */
        public _oimoLimitMotor: OIMO.TranslationalLimitMotor | null;

        private constructor() {
            this._clear();
        }
        /**
         * @internal
         */
        public _clear() {
            this._values[ValueType.LowerLimit] = 1.0;
            this._values[ValueType.UpperLimit] = 0.0;
            this._values[ValueType.MotorSpeed] = 0.0;
            this._values[ValueType.MotorForce] = 0.0;
            this._oimoLimitMotor = null;
        }

        public serialize() {
            return this._values;
        }

        public deserialize(value: [float, float, float, float]) {
            this._values[0] = value[0];
            this._values[1] = value[1];
            this._values[2] = value[2];
            this._values[3] = value[3];

            return this;
        }
        /**
         * 该马达的最低位移限制。
         * - 单位为`米`。
         * - 当 `lowerLimit > upperLimit` 时关闭限位。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public get lowerLimit(): float {
            return this._values[ValueType.LowerLimit];
        }
        public set lowerLimit(value: float) {
            this._values[ValueType.LowerLimit] = value;

            if (this._oimoLimitMotor !== null) {
                this._oimoLimitMotor.lowerLimit = value;
            }
        }
        /**
         * 该马达的最高位移限制。
         * - 单位为`米`。
         * - 当 `upperLimit < lowerLimit` 时关闭限位。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public get upperLimit(): float {
            return this._values[ValueType.UpperLimit];
        }
        public set upperLimit(value: float) {
            this._values[ValueType.UpperLimit] = value;

            if (this._oimoLimitMotor !== null) {
                this._oimoLimitMotor.upperLimit = value;
            }
        }
        /**
         * 该马达的最大线速度。
         * - 单位为`米 / 秒`。
         * - 默认为 `0.0`。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public get motorSpeed(): float {
            return this._values[ValueType.MotorSpeed];
        }
        public set motorSpeed(value: float) {
            this._values[ValueType.MotorSpeed] = value;

            if (this._oimoLimitMotor !== null) {
                this._oimoLimitMotor.motorSpeed = value;
            }
        }
        /**
         * 该马达的最大输出力。
         * - 单位为`牛顿`。
         * - [`0.0` ~ N]
         * - 设置为 `0.0` 停用马达。
         * - 默认为 `0.0`。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public get motorForce(): float {
            return this._values[ValueType.MotorForce];
        }
        public set motorForce(value: float) {
            if (value < 0.0) {
                value = 0.0;
            }

            this._values[ValueType.MotorForce] = value;

            if (this._oimoLimitMotor !== null) {
                this._oimoLimitMotor.motorForce = value;
            }
        }
    }
}
