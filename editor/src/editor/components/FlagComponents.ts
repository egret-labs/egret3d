namespace paper.editor {
    /**
     * 
     */
    export class EditorComponent extends Component {
        public hideFlags = HideFlags.HideAndDontSave;
    }
    /**
     * Gizmos 容器标记。
     */
    export class GizmosContainerEntityFlag extends EditorComponent {
    }
    /**
     * 可点选容器标记。
     */
    export class TouchContainerEntityFlag extends EditorComponent {
    }
    /**
     * 标尺网格标记。
     */
    export class GridFlag extends EditorComponent {
    }
    /**
     * 高亮标记。
     */
    export class HoveredFlag extends EditorComponent {
    }
    /**
     * 选中标记。
     */
    export class SelectedFlag extends EditorComponent {
    }
    /**
     * 最后选中标记。
     */
    export class LastSelectedFlag extends EditorComponent {
    }
}