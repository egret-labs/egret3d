namespace egret3d.oimo {
    const enum ValueType {
        LowerLimit,
        UpperLimit,
        MotorSpeed,
        MotorTorque,
    }
    /**
     * 关节的旋转限位和马达设置。
     */
    export class RotationalLimitMotor implements paper.ISerializable {
        /**
         * @internal
         */
        public static create(): RotationalLimitMotor {
            return new RotationalLimitMotor();
        }

        private readonly _values: Float32Array = new Float32Array([
            1.0, 0.0, 0.0, 0.0
        ]);
        /**
         * @internal
         */
        public _oimoRotationalLimitMotor: OIMO.RotationalLimitMotor | null = null;

        private constructor() {
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
         * 最低旋转角限制。
         * - 弧度制。
         * - 当 `lowerLimit > upperLimit` 时关闭限位。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public get lowerLimit(): float {
            return this._values[ValueType.LowerLimit];
        }
        public set lowerLimit(value: float) {
            this._values[ValueType.LowerLimit] = value;

            if (this._oimoRotationalLimitMotor !== null) {
                this._oimoRotationalLimitMotor.lowerLimit = value;
            }
        }
        /**
         * 最高旋转角限制。
         * - 弧度制。
         * - 当 `upperLimit < lowerLimit` 时关闭限位。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public get upperLimit(): float {
            return this._values[ValueType.UpperLimit];
        }
        public set upperLimit(value: float) {
            this._values[ValueType.UpperLimit] = value;

            if (this._oimoRotationalLimitMotor !== null) {
                this._oimoRotationalLimitMotor.upperLimit = value;
            }
        }
        /**
         * 该马达的速度。
         * - [`0.0` ~ N]
         * - 设置为 `0.0` 停用马达。
         * - 默认为 `0.0`。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public get motorSpeed(): float {
            return this._values[ValueType.MotorSpeed];
        }
        public set motorSpeed(value: float) {
            if (value < 0.0) {
                value = 0.0;
            }

            this._values[ValueType.MotorSpeed] = value;

            if (this._oimoRotationalLimitMotor !== null) {
                this._oimoRotationalLimitMotor.motorSpeed = value;
            }
        }
        /**
         * 该马达的扭矩。
         * - [`0.0` ~ N]
         * - 设置为 `0.0` 停用马达。
         * - 默认为 `0.0`。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public get motorTorque(): float {
            return this._values[ValueType.MotorTorque];
        }
        public set motorTorque(value: float) {
            if (value < 0.0) {
                value = 0.0;
            }

            this._values[ValueType.MotorTorque] = value;

            if (this._oimoRotationalLimitMotor !== null) {
                this._oimoRotationalLimitMotor.motorTorque = value;
            }
        }
    }
}
