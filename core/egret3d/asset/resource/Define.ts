namespace egret3d {
    let _index: uint = 0;
    let _mask: uint = 0x80000000;
    const _defines: { [key: string]: Define } = {};

    function _get(defineString: string): Define {
        const defines = _defines;
        let define = defines[defineString];

        if (!define) {
            define = defines[defineString] = new Define(_index, _mask, defineString);

            _mask >>>= 1;
            if (_mask === 0) {
                _index++;
                _mask = 0x80000000;
            }
        }

        return define;
    }
    /**
     * @private
     */
    export class Define {
        /**
         * 掩码索引。
         */
        public readonly index: uint;
        /**
         * 掩码。
         */
        public readonly mask: uint;
        /**
         * 内容。
         */
        public readonly context: string;

        public constructor(index: uint, mask: uint, context: string) {
            this.index = index;
            this.mask = mask;
            this.context = context;
        }
    }
    /**
     * @private
     */
    export class Defines {
        // mask, string, array,
        private _definesDirty: uint = 0b000;
        private _definesMask: string = "";
        private _definesString: string = "";
        private readonly _defines: Array<Define> = [];

        private _sortDefine(a: Define, b: Define) {
            let d = a.index - b.index;
            if (d === 0) {
                d = a.mask - b.mask;
            }

            return d;
        }
        /**
         * 
         */
        public clear(): void {
            this._definesDirty = 0b000;
            this._definesMask = "";
            this._definesString = "";
            this._defines.length = 0;
        }
        /**
         * 
         */
        public addDefine(defineString: string, value?: number): boolean {
            if (value !== undefined) {
                defineString += " " + value;
            }
            //
            const define = _get(defineString);
            const defines = this._defines;

            if (defines.indexOf(define) < 0) {
                defines.push(define);
                this._definesDirty = 0b111;

                return true;
            }

            return false;
        }
        /**
         * 
         */
        public removeDefine(defineString: string, value?: number): boolean {
            if (value !== undefined) {
                defineString += " " + value;
            }
            //
            const define = _get(defineString);
            const defines = this._defines;
            const index = defines.indexOf(define);

            if (index >= 0) {
                defines.splice(index, 1);
                this._definesDirty = 0b111;

                return true;
            }

            return false;
        }
        /**
         * 
         */
        public get definesMask(): string {
            if (this._definesDirty & 0b100) {
                const defines = this._defines;
                //
                if (this._definesDirty & 0b001) {
                    defines.sort(this._sortDefine);
                    this._definesDirty &= ~0b001;
                }
                //
                let index = 0;
                let mask = 0;
                let definesMask = "";

                for (const define of defines) {
                    if (define.index !== index) {
                        index = define.index;
                        mask = 0;
                        definesMask += "0x" + mask.toString(16);
                    }

                    mask |= define.mask;
                }

                if (index === 0) {
                    definesMask += "0x" + mask.toString(16);
                }

                this._definesMask = definesMask;
                this._definesDirty &= ~0b100;
            }

            return this._definesMask;
        }
        /**
         * 
         */
        public get definesString(): string {
            if (this._definesDirty & 0b010) {
                let definesString = "";
                const defines = this._defines;

                if (this._definesDirty & 0b001) {
                    defines.sort(this._sortDefine);
                    this._definesDirty &= ~0b001;
                }

                for (const define of this._defines) {
                    definesString += "#define " + define.context + " \n";
                }

                this._definesString = definesString;
                this._definesDirty &= ~0b010;
            }

            return this._definesString;
        }
    }
}