namespace paper.editor {
    /**
     * 
     */
    @singleton
    export class GUIComponent extends BaseComponent {
        public readonly hierarchy: dat.GUI = new dat.GUI({ closeOnTop: true, width: 300 });
        public readonly inspector: dat.GUI = new dat.GUI({ closeOnTop: true, width: 300 });
        public readonly stats: Stats = new Stats();
        public readonly renderPanel: Stats.Panel = this.stats.addPanel(new Stats.Panel("MS(R)", "#ff8", "#221"));

        public initialize() {
            super.initialize();

            this.stats.showPanel(0);
        }
    }
}