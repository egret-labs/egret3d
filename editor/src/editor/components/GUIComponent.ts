namespace paper.editor {
    /**
     * 
     */
    export class GUIComponent extends SingletonComponent {
        public readonly inspector: dat.GUI = new dat.GUI({ closeOnTop: true, width: 330 });
        public readonly hierarchy: dat.GUI = new dat.GUI({ closeOnTop: true, width: 330 });
    }
}