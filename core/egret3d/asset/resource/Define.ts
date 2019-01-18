namespace egret3d {
    let _index: uint = 0;
    let _mask: uint = 0x80000000;
    const _defines: { [key: string]: Define } = {};

    function _get(name: string, context?: number | string, isGlobal?: boolean): Define {
        let key = name;
        const defines = _defines;

        if (isGlobal || !context) {
        }
        else if (typeof context === "number") {
            key = name + " " + context;
            context = undefined;
        }
        else {
            key = context;
        }

        let define = defines[key];

        if (define) {
            if (isGlobal) {
                (define.context as any) = context;
            }
        }
        else {
            define = defines[key] = new Define(_index, _mask, name, context);
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
         * 掩码索引。
         */
        public readonly index: uint;
        /**
         * 掩码。
         */
        public readonly mask: uint;
        /**
         * 名称。
         */
        public readonly name: string;
        /**
         * 内容。
         */
        public readonly context?: number | string;
        /**
         * @internal
         */
        public isCode?: boolean;
        /**
         * @internal
         */
        public type?: DefineLocation;

        public constructor(index: uint, mask: uint, name: string, context?: number | string) {
            this.index = index;
            this.mask = mask;
            this.name = name;
            this.context = context;
        }
    }
    /**
     * @private
     */
    export class Defines {
        public static link(definess: (Defines | null)[], location: DefineLocation) {
            const linked = [] as Define[];

            for (const defines of definess) {
                if (!defines) {
                    continue;
                }

                for (const define of defines._defines) {
                    if (define.type === undefined || (define.type & location)) {
                        const index = linked.indexOf(define);
                        if (index >= 0) {
                            linked[index] = define;
                        }
                        else {
                            linked.push(define);
                        }
                    }
                }
            }

            let definesString = "";
            linked.sort(this._sortDefine);

            for (const define of linked) {
                let context = define.context;
                if (context) {
                    if (typeof context === "number") {
                        context = define.name + " " + context;
                    }
                }
                else {
                    context = define.name;
                }

                if (define.isCode) {
                    definesString += context + " \n";
                }
                else {
                    definesString += "#define " + context + " \n";
                }
            }

            return definesString;
        }

        private static _sortDefine(a: Define, b: Define) {
            let d = a.index - b.index;
            if (d === 0) {
                d = b.mask - a.mask; // Define 顺序。
            }

            return d;
        }

        public definesMask: string = "";

        // mask, string, array,
        private readonly _defines: Array<Define> = [];

        private _update() {
            let index = 0;
            let mask = 0;
            let definesMask = "";
            const defines = this._defines;
            defines.sort(Defines._sortDefine);

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
        public addDefine(name: string, context?: number | string, isGlobal?: boolean): Define | null {
            const define = _get(name, context, isGlobal);
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
        public removeDefine(name: string, isLocal?: boolean): Define | null {
            const defines = this._defines;
            let define: Define | null = null;

            if (isLocal) {
                for (define of defines) {
                    if (define.name === name) {
                        break;
                    }

                    define = null;
                }
            }
            else {
                define = _get(name);
            }

            if (define) {
                const index = defines.indexOf(define);

                if (index >= 0) {
                    defines.splice(index, 1);
                    this._update();

                    return define;
                }
            }

            return null;
        }
    }
}
