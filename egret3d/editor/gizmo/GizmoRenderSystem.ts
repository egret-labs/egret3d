namespace egret3d {
    export class GizmoRenderSystem extends paper.BaseSystem {
        private readonly _renderState: WebGLRenderState = WebGLRenderState.getInstance(WebGLRenderState);

        public onUpdate() {
            this._renderState.clearState();//编辑器走自己的渲染流程，状态需要清除一下
            paper.editor.Gizmo.DrawCoord();
            paper.editor.Gizmo.DrawLights();
            paper.editor.Gizmo.DrawCameras();

        }
    }
}