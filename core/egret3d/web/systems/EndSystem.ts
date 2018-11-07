namespace egret3d.web {
    /**
     * @internal
     */
    export class EndSystem extends paper.BaseSystem {
        private readonly _contactCollecter: ContactCollecter = paper.GameObject.globalGameObject.getOrAddComponent(ContactCollecter);

        public onUpdate(deltaTime: number) {
            const contactCollecter = this._contactCollecter;
            if (contactCollecter.isActiveAndEnabled) {
                this._contactCollecter.update(deltaTime);
            }
        }
    }
}
