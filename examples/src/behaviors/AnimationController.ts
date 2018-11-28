namespace behaviors {
    export class AnimationController extends paper.Behaviour {
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 10.0 })
        public fadeTime: number = 0.3;

        @paper.editor.property(paper.editor.EditType.TEXT)
        public animationName: string = "";

        @paper.editor.property(paper.editor.EditType.BUTTON)
        public play: () => void = () => {
            const animation = this.gameObject.getComponent(egret3d.Animation);
            if (animation) {
                animation.fadeIn(this.animationName, this.fadeTime);
            }
        }
    }
}