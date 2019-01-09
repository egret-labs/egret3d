

namespace behaviors {

    export class Wander extends paper.Behaviour {
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public length: number = 10.0;

        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public readonly timeScale: egret3d.Vector3 = egret3d.Vector3.create(1.0, 0.7, 0.4);

        @paper.editor.property(paper.editor.EditType.VECTOR3)
        public readonly center: egret3d.Vector3 = egret3d.Vector3.create();

        public target: paper.GameObject | null = null;

        public onUpdate() {
            const time = paper.clock.time;
            const radius = this.length;
            const timeScale = this.timeScale;
            const center = this.center;

            if (this.target) {
                center.copy(this.target.transform.position);
            }

            this.gameObject.transform.setLocalPosition(
                Math.sin(time * timeScale.x) * radius + center.x,
                Math.cos(time * timeScale.y) * radius + center.y,
                Math.cos(time * timeScale.z) * radius + center.z,
            );
        }
    }
}
