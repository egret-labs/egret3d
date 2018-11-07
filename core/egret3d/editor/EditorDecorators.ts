
namespace paper.editor {
    /**属性信息 */
    export class PropertyInfo {
        /**属性名称 */
        public name: string;
        /**编辑类型 */
        public editType: EditType;
        /**属性配置 */
        public option: PropertyOption | undefined;
        constructor(name: string, editType: EditType, option?: PropertyOption) {
            this.name = name;
            this.editType = editType;
            this.option = option;
        }
    }
    /**属性配置 */
    export type PropertyOption = {
        readonly?: boolean;
        minimum?: number;
        maximum?: number;
        step?: number;
        /**赋值函数*/
        set?: string;
        /**下拉项*/
        listItems?: { label: string, value: any }[];
    };
    /**
     * 编辑类型
     */
    export const enum EditType {
        /**数字输入 */
        UINT = "UINT",
        INT = "INT",
        FLOAT = "FLOAT",
        /**文本输入 */
        TEXT = "TEXT",
        /**选中框 */
        CHECKBOX = "CHECKBOX",
        /** Size.*/
        SIZE = "SIZE",
        /**vertor2 */
        VECTOR2 = "VECTOR2",
        /**vertor3 */
        VECTOR3 = "VECTOR3",
        /**vertor4 */
        VECTOR4 = "VECTOR4",
        /**Quaternion */
        QUATERNION = "QUATERNION",
        /**颜色选择器 */
        COLOR = "COLOR",
        /**下拉 */
        LIST = "LIST",
        /**Rect */
        RECT = "RECT",
        /**材质 */
        MATERIAL = "MATERIAL",
        /**材质数组 */
        MATERIAL_ARRAY = "MATERIAL_ARRAY",
        /**游戏对象 */
        GAMEOBJECT = "GAMEOBJECT",
        /**变换 TODO 不需要*/
        TRANSFROM = "TRANSFROM",
        /**组件 */
        COMPONENT = "COMPONENT",
        /**声音 */
        SOUND = "SOUND",
        /**Mesh */
        MESH = "MESH",
        /**shader */
        SHADER = "SHADER",
        /**数组 */
        ARRAY = "ARRAY",
        /***/
        BUTTON = "BUTTON",
        /***/
        NESTED = "NESTED",
        /**贴图 */
        TEXTUREDESC = "TEXTUREDESC",
        /**矩阵 */
        MAT3 = "MAT3"
    }
    /**
     * 装饰器:自定义
     */
    export function custom() {
        return function (target: any) {
            target['__custom__'] = true;
        };
    }
    /**
     * 装饰器:属性
     * @param editType 编辑类型
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
