import Application from "./application/Application";
import { Scene } from "./application/components/Scene";

const application = new Application<Scene>();

application.initialize();

application.start();

function loop(timestamp: number) {
    const result = application.clock.update(timestamp);

    if (result.tickCount > 0) {
        const { systemManager } = application;

        systemManager.startup(0);
        systemManager.execute(result.tickCount, result.frameCount);
        systemManager.cleanup(result.frameCount);
        systemManager.teardown();
    }

    // 下一次循环
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);