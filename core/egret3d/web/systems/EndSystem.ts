namespace egret3d.webgl {
    /**
     * @internal
     */
    export class EndSystem extends paper.BaseSystem<paper.GameObject> {
        private readonly _contactCollecter: ContactCollecter = paper.SceneManager.getInstance().globalEntity.getComponent(ContactCollecter)!;

        public onUpdate() {
            this._contactCollecter._update();
        }
    }
}
