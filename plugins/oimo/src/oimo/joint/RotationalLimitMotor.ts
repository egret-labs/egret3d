namespace egret3d.oimo {
    const enum ValueType {
        LowerLimit,
        UpperLimit,
        MotorSpeed,
        MotorTorque,
    }
    /**
     * 
     */
    export class RotationalLimitMotor implements paper.ISerializable {
        /**
         * @internal
         */
        public static create(): RotationalLimitMotor {
            return new RotationalLimitMotor();
        }

        private readonly _values: Float32Array = new Float32Array([
            1, 0, 0, 0
        ]);
        /**
         * @internal
         */
        public _oimoRotationalLimitMotor: OIMO.RotationalLimitMotor = null!;

        private constructor() {
        }

        public serialize() {
            return this._values;
        }

        public deserialize(value: [number, number, number, number]) {
            this._values[0] = value[0];
            this._values[1] = value[1];
            this._values[2] = value[2];
            this._values[3] = value[3];

            return this;
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public get lowerLimit(): number {
            return this._values[ValueType.LowerLimit];
        }
        public set lowerLimit(value: number) {
            this._values[ValueType.LowerLimit] = value;

            if (this._oimoRotationalLimitMotor) {
                this._oimoRotationalLimitMotor.lowerLimit = value;
            }
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public get upperLimit(): number {
            return this._values[ValueType.UpperLimit];
        }
        public set upperLimit(value: number) {
            this._values[ValueType.UpperLimit] = value;

            if (this._oimoRotationalLimitMotor) {
                this._oimoRotationalLimitMotor.upperLimit = value;
            }
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public get motorSpeed(): number {
            return this._values[ValueType.MotorSpeed];
        }
        public set motorSpeed(value: number) {
            this._values[ValueType.MotorSpeed] = value;

            if (this._oimoRotationalLimitMotor) {
                this._oimoRotationalLimitMotor.motorSpeed = value;
            }
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public get motorTorque(): number {
            return this._values[ValueType.MotorTorque];
        }
        public set motorTorque(value: number) {
            this._values[ValueType.MotorTorque] = value;

            if (this._oimoRotationalLimitMotor) {
                this._oimoRotationalLimitMotor.motorTorque = value;
            }
        }
    }
}
