namespace paper.editor {
    /**
     * 
     */
    export class GUIComponent extends SingletonComponent {
        public readonly inspector: dat.GUI = new dat.GUI({ autoPlace: this._getAutoPlace(), closeOnTop: true, width: 330 });
        public readonly hierarchy: dat.GUI = new dat.GUI({ autoPlace: this._getAutoPlace(), closeOnTop: true, width: 330 });

        private _getAutoPlace() {
            const hierarchy = document.getElementsByClassName("egret-hierarchy");
            const inspector = document.getElementsByClassName("egret-inspector");

            return hierarchy.length === 0 && inspector.length === 0;
        }

        public initialize() {
            super.initialize();

            const hierarchy = document.getElementsByClassName("egret-hierarchy");
            const inspector = document.getElementsByClassName("egret-inspector");

            if (hierarchy.length > 0 && inspector.length > 0) {
                hierarchy[0].appendChild(this.hierarchy.domElement);
                inspector[0].appendChild(this.inspector.domElement);
            }
        }
    }
}