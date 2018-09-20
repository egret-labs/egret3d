namespace paper.debug {
    export class GizmoPickComponent extends Behaviour {
        public pickTarget: GameObject | null = null;
        
        public onDestroy() {
            this.pickTarget = null;
        }
    }
}