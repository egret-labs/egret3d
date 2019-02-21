namespace egret3d {
    /**
     * 引擎启动入口。
     * @param options 
     */
    export function runEgret(options?: RunOptions) {
        if (!options) {
            options = {};
        }

        const { version, systemManager, gameObjectContext } = paper.Application;

        console.info("Egret", version, "start.");

        systemManager
            .preRegister(webgl.BeginSystem, gameObjectContext, paper.SystemOrder.Begin, options)
            .preRegister(webgl.WebGLRenderSystem, gameObjectContext, paper.SystemOrder.Renderer, options)
            .preRegister(webgl.InputSystem, gameObjectContext, paper.SystemOrder.End, options)
            .preRegister(webgl.EndSystem, gameObjectContext, paper.SystemOrder.End, options)

            .preRegister(AnimationSystem, gameObjectContext, paper.SystemOrder.Animation)
            .preRegister(MeshRendererSystem, gameObjectContext, paper.SystemOrder.BeforeRenderer)
            .preRegister(SkinnedMeshRendererSystem, gameObjectContext, paper.SystemOrder.BeforeRenderer)
            .preRegister(particle.ParticleSystem, gameObjectContext, paper.SystemOrder.BeforeRenderer)
            .preRegister(Egret2DRendererSystem, gameObjectContext, paper.SystemOrder.BeforeRenderer, options)
            .preRegister(CameraAndLightSystem, gameObjectContext, paper.SystemOrder.BeforeRenderer);

        paper.Application.initialize(options);

        console.info("Egret start complete.");
    }
}
