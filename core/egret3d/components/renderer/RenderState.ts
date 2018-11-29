namespace egret3d {
    /**
     * 
     */
    export class RenderState extends paper.SingletonComponent {
        public readonly clearColor: Color = Color.create();
        public readonly viewPort: Rectangle = Rectangle.create();
        public renderTarget: BaseRenderTarget | null = null;

        public render: (camera: Camera, material?: Material) => void = null!;
        public draw: (drawCall: DrawCall) => void = null!;

        public initialize(renderSystem: IRenderSystem) {
            super.initialize();

            if (renderSystem) {
                this.render = renderSystem.render.bind(renderSystem);
                this.draw = renderSystem.draw.bind(renderSystem);
            }
        }

        public updateViewport(viewport: Readonly<Rectangle>, target: BaseRenderTarget | null): void { }
        public clearBuffer(bufferBit: gltf.BufferMask, clearColor?: Readonly<IColor>): void { }
        public copyFramebufferToTexture(screenPostion: Vector2, target: ITexture, level: number = 0): void { }
    }
}