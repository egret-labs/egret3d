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
            // camera.context.drawtype = "_depth";
            // renderSystem._targetAndViewport(camera.viewport, this.renderTarget);
            // renderSystem._cleanBuffer(true, true, Color.BLACK);
            // renderSystem._renderCamera(camera);
            // GlRenderTarget.useNull();
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
            // renderSystem._targetAndViewport(camera.viewport, this.renderTarget);
            // renderSystem._cleanBuffer(camera.clearOption_Color, camera.clearOption_Depth, camera.backgroundColor);
            // renderSystem._renderCamera(camera);
            // GlRenderTarget.useNull();
        }
    }
}
