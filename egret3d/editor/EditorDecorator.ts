namespace paper.editor {
    /**属性信息 */
    export class PropertyInfo {
        /**属性名称 */
        public name: string;
        /**编辑类型 */
        public editType: EditType;
        /**属性配置 */
        public option: PropertyOption;
        constructor(name?: string, editType?: EditType, option?: PropertyOption) {
            this.name = name;
            this.editType = editType;
            this.option = option;
        }
    }
    /**属性配置 */
    export type PropertyOption = {
        /**赋值函数*/
        set?: string,
        /**下拉项*/
        listItems?: { label: string, value: any }[]
    }
    /**编辑类型 */
    export enum EditType {
        /**数字输入 */
        NUMBER,
        /**文本输入 */
        TEXT,
        /**选中框 */
        CHECKBOX,
        /**vertor2 */
        VECTOR2,
        /**vertor3 */
        VECTOR3,
        /**vertor4 */
        VECTOR4,
        /**Quaternion */
        QUATERNION,
        /**颜色选择器 */
        COLOR,
        /**下拉 */
        LIST,
        /**Rect */
        RECT,
        /**材质 */
        MATERIAL,
        /**材质数组 */
        MATERIAL_ARRAY,
        /**游戏对象 */
        GAMEOBJECT,
        /**变换 */
        TRANSFROM,
        /**声音 */
        SOUND,
        /**Mesh */
        MESH,
        /**数组 */
        ARRAY
    }

    let customMap: { [key: string]: boolean } = {};
    /**
     * 装饰器:自定义
     */
    export function custom() {
        return function (target: any) {
            customMap[target.name] = true;
        }
    }
    let propertyMap: { [key: string]: { extends: string, propertyList: PropertyInfo[] } } = {};
    /**
     * 装饰器:属性
     * @param editType 编辑类型
     */
    export function property(editType?: EditType, option?: PropertyOption) {
        return function (target: any, property: string) {
            if (!propertyMap[target.constructor.name]) {
                propertyMap[target.constructor.name] = {
                    extends: target.__proto__.constructor.name,
                    propertyList: [],
                }
            }
            if (editType !== undefined) {
                propertyMap[target.constructor.name].propertyList.push(new PropertyInfo(property, editType, option));
            }
            else {
                //TODO:自动分析编辑类型
            }
        }
    }

    /**
     * 检测一个实例对象是否为已被自定义
     * @param classInstance 实例对象
     */
    export function isCustom(classInstance: any): boolean {
        return customMap[classInstance.constructor.name] ? true : false;
    }

    /**
     * 获取一个实例对象的编辑信息
     * @param classInstance 实例对象
     */
    export function getEditInfo(classInstance: any): PropertyInfo[] {
        let className = classInstance.constructor.name;
        function _getEditInfo(className: string): PropertyInfo[] {
            let classInfo = propertyMap[className];
            if (classInfo) {
                let extendsInfo = _getEditInfo(classInfo.extends);
                extendsInfo = extendsInfo.concat(classInfo.propertyList);
                return extendsInfo;
            }
            return [];
        }
        return _getEditInfo(className);
    }
}