namespace egret3d.webgl {
    /**
     * @internal
     */
    export class EndSystem extends paper.BaseSystem<paper.GameObject> {
        private readonly _contactCollecter: ContactCollecter = paper.Application.sceneManager.globalEntity.getComponent(ContactCollecter)!;

        public onTickCleanup() {
            this._contactCollecter._update();
        }
    }
}
