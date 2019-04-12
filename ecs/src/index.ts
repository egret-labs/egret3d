import Application from "./egret/Application";
import { Scene } from "./egret/components/Scene";
//
const application = new Application<Scene>();
//
application.initialize();
//
application.start();
//
function loop(timestamp: number) {
    if (application.isRunning) {
        Application.current = application;

        const { tickCount, frameCount } = application.clock.update(timestamp);

        if (tickCount > 0) {
            const { runningMode, systemManager } = application;

            systemManager.startup(runningMode);
            systemManager.execute(tickCount, frameCount);
            systemManager.cleanup(frameCount);
            systemManager.teardown();
        }

        requestAnimationFrame(loop);
    }
}

requestAnimationFrame(loop);