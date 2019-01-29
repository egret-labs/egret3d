namespace egret3d {
    let _index: uint = 0;
    let _mask: uint = 0x80000000;
    const _allDefines: { [key: string]: Define } = {};

    function _get(name: string, context?: number | string, order?: number): Define {
        const key = context ? (typeof context === "number" ? name + " " + context : context) : name;
        const defines = _allDefines;

        let define = defines[key];
        if (define) {
            return define;
        }

        define = defines[key] = new Define(_index, _mask, name, context);
        if (order) {
            define.order = order;
        }

        _mask >>>= 1;

        if (_mask === 0) {
            _index++;
            _mask = 0x80000000;
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
         * 
         */
        public isCode?: boolean;
        /**
         * 
         */
        public order?: uint;
        /**
         * 
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
            const linkedName: { [key: string]: Define } = {};

            for (const defines of definess) {
                if (!defines) {
                    continue;
                }

                for (const define of defines._defines) {
                    if (define.type === undefined || (define.type & location)) {
                        const already = linkedName[define.name];
                        if (!already) {
                            linkedName[define.name] = define;
                            linked.push(define);
                        }
                        else {
                            const index = linked.indexOf(already);
                            if (index >= 0) {
                                linked[index] = define;
                            }
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
            if (a.order && b.order) {
                return a.order - b.order;
            }

            let d = a.index - b.index;
            if (d === 0) {
                d = (b.order || b.mask) - (a.order || a.mask); // Define 顺序。
            }

            return d;
        }

        public definesMask: string = "";

        // mask, string, array,
        private readonly _defines: Array<Define> = [];
        private readonly _defineLinks: { [key: string]: Define } = {};

        private _update() {
            let index = 0;
            let mask = 0;
            let definesMask = "";
            const defines = this._defines;
            defines.sort(Defines._sortDefine);

            for (const define of defines) {
                if (define.index !== index) {
                    if (mask < 0) {
                        mask += 0xFFFFFFFF;
                        mask += 1;
                    }

                    definesMask += index + "x" + mask.toString(16);
                    index = define.index;
                    mask = 0;
                }

                mask |= define.mask;
            }

            if (mask < 0) {
                mask += 0xFFFFFFFF;
                mask += 1;
            }
            definesMask += index + "x" + mask.toString(32);

            this.definesMask = definesMask;
        }
        /**
         * 
         */
        public clear(): void {
            this.definesMask = "";

            this._defines.length = 0;
            for (const k in this._defineLinks) {
                delete this._defineLinks[k];
            }
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

            for (const k in value._defineLinks) {
                this._defineLinks[k] = value._defineLinks[k];
            }
        }
        /**
         * 
         */
        public addDefine(name: string, context?: number | string, order?: number): Define | null {
            let define = this._defineLinks[name];
            if (define) {
                if (define.context === context) {
                    return define;
                }
                else {
                    this.removeDefine(name, false);
                }
            }

            //
            define = _get(name, context, order);
            const defines = this._defines;

            if (defines.indexOf(define) < 0) {
                defines.push(define);
                this._defineLinks[name] = define;
                this._update();

                return define;
            }

            return null;
        }

        public removeDefine(name: string, needUpdate: boolean = true): Define | null {
            const define = this._defineLinks[name];
            if (define) {
                const index = this._defines.indexOf(define);
                if (index >= 0) {
                    this._defines.splice(index, 1);
                }
                delete this._defineLinks[name];
                //
                needUpdate && this._update();
            }
            return null;
        }
    }
}
