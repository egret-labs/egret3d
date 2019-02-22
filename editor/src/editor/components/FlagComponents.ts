namespace paper.editor {
    /**
     * 
     */
    export class EditorComponent extends Component {
        public hideFlags = HideFlags.HideAndDontSave;
    }
    /**
     * 
     */
    export class ContainerEntityFlag extends EditorComponent {
    }
    /**
     * 
     */
    export class TouchContainerEntityFlag extends EditorComponent {
    }
    /**
     * 
     */
    export class HoveredFlag extends EditorComponent {
    }
    /**
     * 
     */
    export class SelectedFlag extends EditorComponent {
    }
    /**
     * 
     */
    export class LastSelectedFlag extends EditorComponent {
    }
    /**
     * 
     */
    export class DeletedFlag extends EditorComponent {
    }
}