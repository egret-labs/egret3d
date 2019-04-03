namespace egret3d {
    /**
     * 宏定义在着色器的位置。
     */
    export const enum DefineLocation {
        /**
         * 只添加到顶点着色器。
         */
        Vertex = 0b01,
        /**
         * 只添加到片段着色器。
         */
        Fragment = 0b10,
        /**
         * 同时添加到顶点和片段着色器。
         */
        All = Vertex | Fragment,
        /**
         * 不添加到着色器中，仅用来标记着色器程序。
         */
        None = 0b00,
    }
    /**
     * 着色器宏定义。
     * - 用于动态改变着色器的功能定义。
     */
    export class Define {
        /**
         * 该宏定义的掩码索引。
         */
        public readonly index: uint;
        /**
         * 该宏定义的掩码。
         */
        public readonly mask: uint;
        /**
         * 该宏定义的名称。
         */
        public readonly name: string;
        /**
         * 该宏定义的内容。
         * - 为 `""` 则不启用。
         */
        public readonly content: number | string;
        /**
         * 该宏定义的优先级排序。
         * - 为 `0` 则按照添加顺序排序。
         */
        public readonly order: uint;
        /**
         * 该宏定义是否为代码片段。
         */
        public isCode: boolean = false;
        /**
         * 该宏定义的添加位置。
         */
        public type: DefineLocation = DefineLocation.All;
        /**
         * @private
         */
        public constructor(index: uint, mask: uint, name: string, content: number | string, order: uint) {
            this.index = index;
            this.mask = mask;
            this.name = name;
            this.content = content;
            this.order = order;
        }
    }
    /**
     * 着色器宏定义组。
     * - 维护一组着色器宏定义，以便于快速编译着色器程序。
     */
    export class Defines {
        private static _index: uint = 0;
        private static _mask: uint = 0x80000000;
        private static _allDefines: { [key: string]: Define } = {};

        private static _getDefine(name: string, content: number | string, order: uint): Define {
            const key = content !== "" ? (typeof content === "number" ? name + " " + content : content) : name;
            const defines = this._allDefines;

            if (key in defines) {
                return defines[key];
            }

            const define = defines[key] = new Define(this._index, this._mask, name, content, order);
            this._mask >>>= 1;

            if (this._mask === 0) {
                this._index++;
                this._mask = 0x80000000;
            }

            return define;
        }

        private static _sortDefine(a: Define, b: Define) {
            if (a.order !== 0 && b.order !== 0) {
                return a.order - b.order;
            }

            let d = a.index - b.index;

            if (d === 0) {
                d = b.mask - a.mask; // Define 顺序。
            }

            return d;
        }
        /**
         * 链接多个着色器宏定义组到指定的着色器位置。
         * @param definess 多个着色器宏定义组。
         * @param location 一个着色器位置。
         */
        public static link(definess: (Defines | null)[], location: DefineLocation): string {
            const linked = [] as Define[];
            const linkedIndices: { [key: string]: uint } = {};

            for (const defines of definess) {
                if (defines === null) {
                    continue;
                }

                for (const define of defines._defines) {
                    if ((define.type & location) === 0) {
                        continue;
                    }

                    if (define.name in linkedIndices) { // 替换已有的宏定义。
                        linked[linkedIndices[define.name]] = define;
                    }
                    else {
                        linkedIndices[define.name] = linked.length;
                        linked.push(define);
                    }
                }
            }

            let definesString = "";
            linked.sort(this._sortDefine);

            for (const define of linked) {
                let content = define.content;

                if (content === "") {
                    content = define.name;
                }
                else if (!define.isCode && typeof content === "number") {
                    content = define.name + " " + content;
                }

                if (define.isCode) {
                    definesString += content + " \n";
                }
                else {
                    definesString += "#define " + content + " \n";
                }
            }

            return definesString;
        }
        /**
         * 该组的特征标识，用于标记唯一的着色器程序。
         */
        public definesMask: string = "";

        private readonly _defines: Array<Define> = [];
        private readonly _defineLinks: { [key: string]: Define } = {};

        private _update() {
            const defines = this._defines;
            let index = 0;
            let mask = 0;
            let definesMask = "";
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
         * 清除该组。
         */
        public clear(): void {
            this.definesMask = "";

            this._defines.length = 0;

            for (const k in this._defineLinks) {
                delete this._defineLinks[k];
            }
        }
        /**
         * 从一个着色器宏定义组拷贝值。
         * @param value 一个着色器宏定义组。
         */
        public copy(value: this): void {
            if (value === this) {
                return;
            }

            const defines = this._defines;
            const defineLinks = this._defineLinks;

            defines.length = 0;

            for (const k in defineLinks) {
                delete defineLinks[k];
            }

            this.definesMask = value.definesMask;

            for (const define of value._defines) {
                defines.push(define);
            }

            for (const k in value._defineLinks) {
                defineLinks[k] = value._defineLinks[k];
            }
        }
        /**
         * 将一个着色器宏定义添加到该组。
         * - 例如：
         * - `#define USE_MAP`
         * - `addDefine("USE_MAP")`
         * @param name 宏定义。
         */
        public addDefine(name: string): Define | null;
        /**
         * 将一个带有数值类型的着色器宏定义添加到该组。
         * - 例如：
         * - `#define PI 3.14159265359`
         * - `addDefine("PI", 3.14159265359)`
         * @param name 宏定义。
         * @param content 宏定义值。
         */
        public addDefine(name: string, content: number): Define | null;
        /**
         * @private
         */
        public addDefine(name: string, content: number | string): Define | null;
        /**
         * @private
         */
        public addDefine(name: string, content: number | string, order: uint): Define | null;
        public addDefine(name: string, content: number | string = "", order: uint = 0): Define | null {
            const defineLinks = this._defineLinks;

            if (name in defineLinks) {
                const define = defineLinks[name];

                if (define.content === content) {
                    return define;
                }
                else {
                    this.removeDefine(name, false);
                }
            }

            const define = Defines._getDefine(name, content, order);
            const defines = this._defines;

            if (defines.indexOf(define) < 0) {
                defines.push(define);
                this._defineLinks[name] = define;
                this._update();

                return define;
            }

            return null;
        }
        /**
         * 从该组移除一个着色器宏定义。
         * @param name 宏定义的名称。
         * @param needUpdate 是否立刻更新特征标识。
         * - 默认为 `true` 。
         */
        public removeDefine(name: string, needUpdate: boolean = true): Define | null {
            const defineLinks = this._defineLinks;

            if (name in defineLinks) {
                const define = defineLinks[name];
                const index = this._defines.indexOf(define);

                if (index >= 0) {
                    this._defines.splice(index, 1);
                }

                delete defineLinks[name];

                if (needUpdate) {
                    this._update();
                }

                return define;
            }

            return null;
        }
    }
}
