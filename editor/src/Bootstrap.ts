namespace paper.debug {
    /**
     * TODO 临时的
     */
    export class Bootstrap extends paper.Behaviour {
        public initialize() {
            GameObject.globalGameObject.getOrAddComponent(debug.GUIComponent);
        }

        // public bootstrap() {
        //     GameObject.globalGameObject.getOrAddComponent(debug.GUIComponent);
        // }
    }

    setTimeout(() => {
        paper.GameObject.globalGameObject.getOrAddComponent(debug.Bootstrap);
    }, 1000);

}