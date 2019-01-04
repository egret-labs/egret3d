namespace egret3d {
    /**
     * 天空盒组件。
     */
    export class SkyBox extends paper.BaseComponent {
        @paper.serializedField
        public material: Material | null = null;
    }
}