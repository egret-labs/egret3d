namespace egret3d.web {
    /**
     * @internal
     */
    export class EndSystem extends paper.BaseSystem {
        private readonly _contactCollecter: ContactCollecter = paper.GameObject.globalGameObject.getOrAddComponent(ContactCollecter);

        public onUpdate() {
            this._contactCollecter._update();
        }
    }
}
