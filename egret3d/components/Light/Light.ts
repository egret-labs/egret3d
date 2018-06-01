namespace egret3d {

    /**
     * Light Type Enum
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 灯光类型的枚举。
     * @version paper 1.0
     * @platform Web
     * @language
     */
    export enum LightTypeEnum {
        /**
         * direction light
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 直射光
         * @version paper 1.0
         * @platform Web
         * @language
         */
        Direction = 1,
        /**
         * point light
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 点光源
         * @version paper 1.0
         * @platform Web
         * @language
         */
        Point = 2,
        /**
         * point light
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 聚光灯
         * @version paper 1.0
         * @platform Web
         * @language
         */
        Spot = 3
    }

    /**
     * light component
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 灯光组件
     * @version paper 1.0
     * @platform Web
     * @language
     */
    export class Light extends paper.BaseComponent {
        /**
         * light type
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 光源类型
         * @version paper 1.0
         * @platform Web
         * @language
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.LIST,{listItems:[{label:'Direction',value:1},{label:'Point',value:2},{label:'Spot',value:3}]})
        public type: LightTypeEnum = 0;
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.COLOR)
        public color: Color = new Color(1, 1, 1, 1);
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public intensity: number = 2;
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public distance: number = 50;
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public decay: number = 2;
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public angle: number = Math.PI / 6;
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public penumbra: number = 0;

        /**
         * spot angel cos
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 聚光灯的开合角度cos值
         * @version paper 1.0
         * @platform Web
         * @language
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public spotAngelCos: number = 0.9;
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public castShadows: boolean = false;
        public $directLightShadow: DirectLightShadow;
        public $pointLightShadow: PointLightShadow;
        public $spotLightShadow: SpotLightShadow;
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public shadowBias: number = 0.0003;
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public shadowRadius: number = 2;
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public shadowSize: number = 16;
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public shadowCameraNear: number = 0.1;
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public shadowCameraFar: number = 200;

        // TODO 考虑将不同灯光类型拆分成不同的组件

    }
}