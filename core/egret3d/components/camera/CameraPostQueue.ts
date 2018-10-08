namespace egret3d {
    /**
     * TODO 平台无关。
     */
    export interface ICameraPostQueue {

        renderTarget: GlRenderTarget;

        render(camera: Camera, renderSystem: web.WebGLRenderSystem): void;
    }

    /**
     * TODO 平台无关。
     */
    export class CameraPostQueueDepth implements ICameraPostQueue {

        public renderTarget: GlRenderTarget = null as any;

        public render(camera: Camera, renderSystem: web.WebGLRenderSystem) {
            // camera.context.drawtype = "_depth";
            // renderSystem._targetAndViewport(camera.viewport, this.renderTarget);
            // renderSystem._cleanBuffer(true, true, Color.BLACK);
            // renderSystem._renderCamera(camera);
            // GlRenderTarget.useNull();
        }
    }

    // /**
    //  * framebuffer绘制通道
    //  * 
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
     * TODO 平台无关。
     */
    export class CameraPostQueueColor implements ICameraPostQueue {
        /**
         * @inheritDoc
         */
        public renderTarget: GlRenderTarget = null as any;
        /**
         * @inheritDoc
         */
        public render(camera: Camera, renderSystem: web.WebGLRenderSystem) {
            // renderSystem._targetAndViewport(camera.viewport, this.renderTarget);
            // renderSystem._cleanBuffer(camera.clearOption_Color, camera.clearOption_Depth, camera.backgroundColor);
            // renderSystem._renderCamera(camera);
            // GlRenderTarget.useNull();
        }
    }
}
