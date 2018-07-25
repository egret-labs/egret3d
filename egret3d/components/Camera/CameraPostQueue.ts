namespace egret3d {

    /**
     * 相机处理通道接口
     * TODO 完善后public给开发者
     */
    export interface ICameraPostQueue {
        /**
         * 
         */
        renderTarget: GlRenderTarget;
        /**
         * 
         */
        render(camera: Camera, renderSystem: WebGLRenderSystem): void;
    }

    /**
     * 深度绘制通道
     * TODO 完善后public给开发者
     */
    export class CameraPostQueueDepth implements ICameraPostQueue {
        /**
         * @inheritDoc
         */
        public renderTarget: GlRenderTarget = null as any;
        /**
         * @inheritDoc
         */
        public render(camera: Camera, renderSystem: WebGLRenderSystem) {
            const webgl = WebGLCapabilities.webgl;
            camera._targetAndViewport(this.renderTarget, true); // 最后一个参数true 表示不用camera的clear 配置
            webgl.depthMask(true);
            // webgl.depthMask(true); // 开启 zwrite 以便正常 clear depth
            webgl.clearColor(0, 0, 0, 0);
            webgl.clearDepth(1.0);
            webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);

            // camera.context.drawtype = "_depth";
            // camera._renderOnce(scene, context, "_depth");
            renderSystem._renderCamera(camera);
            GlRenderTarget.useNull(webgl);
        }
    }

    // /**
    //  * framebuffer绘制通道
    //  * TODO 完善后public给开发者
    //  */
    // export class CameraPostQueueQuad implements ICameraPostQueue {
    //     /**
    //      * shader & uniform
    //      */
    //     public readonly material: Material = new Material();
    //     /**
    //      * @inheritDoc
    //      */
    //     public renderTarget: GlRenderTarget = null as any;
    //     /**
    //      * @inheritDoc
    //      */
    //     public render(camera: Camera, _renderSystem: CameraSystem) {
    //         const webgl = WebGLKit.webgl;
    //         camera._targetAndViewport(this.renderTarget, true);
    //         WebGLKit.zWrite(true);
    //         // webgl.depthMask(true); // 开启 zwrite 以便正常 clear depth
    //         webgl.clearColor(0, 0.3, 0, 0);
    //         webgl.clearDepth(1.0);
    //         webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);

    //         const mesh = DefaultMeshes.QUAD;
    //         camera.context.drawtype = "";
    //         WebGLKit.draw(camera.context, this.material, mesh, 0, "quad");
    //     }
    // }

    /**
     * 颜色绘制通道
     * TODO 完善后public给开发者
     */
    export class CameraPostQueueColor implements ICameraPostQueue {
        /**
         * @inheritDoc
         */
        public renderTarget: GlRenderTarget = null as any;
        /**
         * @inheritDoc
         */
        public render(camera: Camera, renderSystem: WebGLRenderSystem) {
            const webgl = WebGLCapabilities.webgl;
            camera._targetAndViewport(this.renderTarget, false);
            // camera.context.drawtype = "";

            // camera._renderOnce(scene, context, "");
            renderSystem._renderCamera(camera);
            GlRenderTarget.useNull(webgl);
        }
    }
}
