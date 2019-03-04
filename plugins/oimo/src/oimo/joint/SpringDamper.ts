namespace egret3d.oimo {
    const enum ValueType {
        Frequency,
        DampingRatio,
        UseSymplecticEuler,
    }
    /**
     * 
     */
    export class SpringDamper implements paper.ISerializable {
        /**
         * @internal
         */
        public static create(): SpringDamper {
            return new SpringDamper();
        }

        private readonly _values: Float32Array = new Float32Array([
            0, 0, 0
        ]);
        /**
         * @internal
         */
        public _oimoSpringDamper: OIMO.SpringDamper = null!;

        private constructor() {
        }

        public serialize() {
            return this._values;
        }

        public deserialize(value: [number, number, number]) {
            this._values[0] = value[0];
            this._values[1] = value[1];
            this._values[2] = value[2];

            return this;
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public get frequency(): number {
            return this._values[ValueType.Frequency];
        }
        public set frequency(value: number) {
            this._values[ValueType.Frequency] = value;

            if (this._oimoSpringDamper) {
                this._oimoSpringDamper.frequency = value;
            }
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public get dampingRatio(): number {
            return this._values[ValueType.DampingRatio];
        }
        public set dampingRatio(value: number) {
            this._values[ValueType.DampingRatio] = value;

            if (this._oimoSpringDamper) {
                this._oimoSpringDamper.dampingRatio = value;
            }
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public get useSymplecticEuler(): boolean {
            return this._values[ValueType.UseSymplecticEuler] > 0;
        }
        public set useSymplecticEuler(value: boolean) {
            this._values[ValueType.UseSymplecticEuler] = value ? 1 : 0;

            if (this._oimoSpringDamper) {
                this._oimoSpringDamper.useSymplecticEuler = value;
            }
        }
    }
}
