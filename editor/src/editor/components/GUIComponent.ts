namespace paper.editor {
    /**
     * 
     */
    export class GUIComponent extends SingletonComponent {
        public hierarchy: dat.GUI = null!;
        public inspector: dat.GUI | null = null;
    }
}