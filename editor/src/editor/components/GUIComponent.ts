namespace paper.editor {
    /**
     * 
     */
    export class GUIComponent extends SingletonComponent {
        public readonly hierarchy: dat.GUI = new dat.GUI({ closeOnTop: true, width: 300 });
        public readonly inspector: dat.GUI = new dat.GUI({ closeOnTop: true, width: 300 });
        public readonly stats: Stats = new Stats();

        public initialize() {
            super.initialize();
        }
    }
}