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
    export class GizmosContainerFlag extends EditorComponent {
    }
    /**
     * 可点选容器标记。
     */
    export class TouchContainerFlag extends EditorComponent {
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
    /**
     * 
     */
    export class PickedFlag extends EditorComponent {
        public target: GameObject | null = null;
    }
}