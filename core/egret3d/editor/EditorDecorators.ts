
namespace paper.editor {
    /**
     * 属性信息。
     */
    export class PropertyInfo {
        /**
         * 属性名称。
         */
        public name: string;
        /**
         * 编辑类型。
         */
        public editType: EditType;
        /**
         * 属性配置。
         */
        public option?: PropertyOption;

        constructor(name: string, editType: EditType, option?: PropertyOption) {
            this.name = name;
            this.editType = editType;
            this.option = option;
        }
    }
    /**
     * 下拉列表项。
     */
    export type ListItem = {
        label: string;
        value: any;
    };
    /**
     * 属性配置。
     */
    export type PropertyOption = {
        readonly?: boolean;
        /**
         * UINT, INT, FLOAT 类型的最小值。
         */
        minimum?: number;
        /**
         * UINT, INT, FLOAT 类型的最大值。
         */
        maximum?: number;
        /**
         * UINT, INT, FLOAT 类型的步进值。
         */
        step?: number;
        /**
         * UINT, INT, FLOAT 类型的数值精度。 TODO
         */
        precision?: number;
        /**
         * 赋值函数
         */
        set?: string;
        /**
         * 下拉项。
         */
        listItems?: ListItem[] | string | ((value: any) => ListItem[]);
    };
    /**
     * 编辑类型。
     */
    export const enum EditType {
        /**
         * 选中框。
         */
        CHECKBOX = "CHECKBOX",
        /**
         * 正整数。
         */
        UINT = "UINT",
        /**
         * 整数。
         */
        INT = "INT",
        /**
         * 浮点数。
         */
        FLOAT = "FLOAT",
        /**
         * 文本。
         */
        TEXT = "TEXT",
        /**
         * 下拉列表。
         */
        LIST = "LIST",
        /**
         * 数组。
         */
        ARRAY = "ARRAY",
        /** 
         * 尺寸。
         */
        SIZE = "SIZE",
        /**
         * 矩形。
         */
        RECT = "RECT",
        /**
         * 二维向量。
         */
        VECTOR2 = "VECTOR2",
        /**
         * 三维向量。
         */
        VECTOR3 = "VECTOR3",
        /**
         * 四维向量。
         */
        VECTOR4 = "VECTOR4",
        /**
         * 四元数。
         */
        QUATERNION = "QUATERNION",
        /**
         * 颜色选择器。
         */
        COLOR = "COLOR",
        /**
         * 着色器。
         */
        SHADER = "SHADER",
        /**
         * 材质。
         */
        MATERIAL = "MATERIAL",
        /**
         * 材质数组。
         */
        MATERIAL_ARRAY = "MATERIAL_ARRAY",
        /**
         * 贴图。
         */
        TEXTUREDESC = "TEXTUREDESC",
        /**
         * 网格。
         */
        MESH = "MESH",
        /**
         * 实体。
         */
        GAMEOBJECT = "GAMEOBJECT",
        /**
         * 组件。
         */
        COMPONENT = "COMPONENT",
        /**声音 */
        SOUND = "SOUND",
        /**
         * 按钮。
         */
        BUTTON = "BUTTON",
        /**
         * 3x3 矩阵。
         */
        MAT3 = "MAT3",
        /**
         * 内嵌的。
         */
        NESTED = "NESTED",

        /**变换 TODO remove*/
        TRANSFROM = "TRANSFROM",
    }
    /**
     * 自定义装饰器。
     */
    export function custom() {
        return function (target: any) {
            target['__custom__'] = true;
        };
    }
    /**
     * 属性装饰器。
     * @param editType 编辑类型。
     * @param option 配置。
     */
    export function property(editType?: EditType, option?: PropertyOption) {
        return function (target: any, property: string) {
            if (!target.hasOwnProperty('__props__')) {
                target['__props__'] = [];
            }

            if (editType !== undefined) {
                target['__props__'].push(new PropertyInfo(property, editType, option));
            }
            else {
                //TODO:自动分析编辑类型
            }
        };
    }
    /**
     * 从枚举中生成装饰器列表项。
     */
    export function getItemsFromEnum(enumObject: any) {
        const items = [];
        for (const k in enumObject) {
            if (!isNaN(Number(k))) {
                continue;
            }

            items.push({ label: k, value: enumObject[k] });
        }

        return items;
    }
}
