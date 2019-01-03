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
     * 
     */
    export const enum DefineLocation {
        None = 0b00,
        All = 0b11,
        Vertex = 0b01,
        Fragment = 0b10,
    }
    /**
     * @private
     */
    export class Define {
        /**
         * @internal
         */
        public isDefine: boolean = true;
        /**
         * @internal
         */
        public type: DefineLocation = DefineLocation.All;
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

        public name?: string = "";
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
        public definesMask: string = "";

        // mask, string, array,
        private readonly _defines: Array<Define> = [];

        private _sortDefine(a: Define, b: Define) {
            let d = a.index - b.index;
            if (d === 0) {
                d = a.mask - b.mask;
            }

            return d;
        }

        private _update() {
            let index = 0;
            let mask = 0;
            let definesMask = "";
            const defines = this._defines;
            defines.sort(this._sortDefine);

            for (const define of defines) {
                if (define.index !== index) {
                    definesMask += "0x" + mask.toString(16);
                    index = define.index;
                    mask = 0;
                }

                mask |= define.mask;

                if (mask < 0) {
                    mask = -mask;
                }
            }

            definesMask += "0x" + mask.toString(16);

            this.definesMask = definesMask;
        }
        /**
         * 
         */
        public clear(): void {
            this.definesMask = "";

            this._defines.length = 0;
        }
        /**
         * 
         */
        public copy(value: this): void {
            this.definesMask = value.definesMask;

            this._defines.length = 0;

            for (const define of value._defines) {
                this._defines.push(define);
            }
        }
        /**
         * 
         */
        public addDefine(defineString: string, value?: number): Define | null {
            if (value !== undefined) {
                defineString += " " + value;
            }
            //
            const define = _get(defineString);
            const defines = this._defines;

            if (defines.indexOf(define) < 0) {
                defines.push(define);
                this._update();

                return define;
            }

            return null;
        }
        /**
         * 
         */
        public removeDefine(defineString: string, value?: number): Define | null {
            if (value !== undefined) {
                defineString += " " + value;
            }
            //
            const define = _get(defineString);
            const defines = this._defines;
            const index = defines.indexOf(define);

            if (index >= 0) {
                defines.splice(index, 1);
                this._update();

                return define;
            }

            return null;
        }

        public removeDefineByName(name: string): Define | null {
            for (const define of this._defines) {
                if (define.name && define.name === name) {
                    return this.removeDefine(define.context);
                }
            }

            return null;
        }

        public get vertexDefinesString(): string {
            let definesString = "";

            for (const define of this._defines) {
                if (define.type & DefineLocation.Vertex) {
                    if (define.isDefine) {
                        definesString += "#define " + define.context + " \n";
                    }
                    else {
                        definesString += define.context + " \n";
                    }
                }
            }

            return definesString;
        }
        /**
         * 
         */
        public get fragmentDefinesString(): string {
            let definesString = "";

            for (const define of this._defines) {
                if (define.type & DefineLocation.Fragment) {
                    if (define.isDefine) {
                        definesString += "#define " + define.context + " \n";
                    }
                    else {
                        definesString += define.context + " \n";
                    }
                }
            }

            return definesString;
        }
    }
}