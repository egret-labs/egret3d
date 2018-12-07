namespace egret3d {
    /**
     * 
     */
    export interface ITransformObserver {
        /**
         * 
         */
        onTransformChange(): void;
    }
    /**
     * 渲染系统接口。
     */
    export interface IRenderSystem {
        /**
         * 渲染相机。
         * @param camera 
         */
        render(camera: Camera, material: Material | null): void;
        /**
         * 绘制一个绘制信息。
         * @param camera 
         * @param drawCall 
         */
        draw(drawCall: DrawCall, material: Material | null): void;
    }
}