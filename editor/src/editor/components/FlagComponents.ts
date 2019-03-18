namespace paper.editor {
    /**
     * 
     */
    export class EditorComponent extends Component {
        public initialize() {
            super.initialize();

            this.hideFlags = HideFlags.HideAndDontSave;
        }
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
     * 选框网格标记。
     */
    export class SelectFrameFlag extends EditorComponent {
        public readonly viewport: egret3d.Rectangle = egret3d.Rectangle.create();
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
     * 选取重定向标记。
     */
    export class PickedFlag extends EditorComponent {
        public target: GameObject | null = null;
    }
}