namespace egret3d.webgl {
    /**
     * @internal
     */
    export class EndSystem extends paper.BaseSystem {
        private readonly _contactCollecter: ContactCollecter = paper.GameObject.globalGameObject.getOrAddComponent(ContactCollecter);
        private readonly _drawCallCollecter: DrawCallCollecter = paper.GameObject.globalGameObject.getOrAddComponent(DrawCallCollecter);

        public onUpdate() {
            //
            this._contactCollecter._update();
            //
            const addDrawCalls = this._drawCallCollecter.addDrawCalls;
            if (addDrawCalls.length > 0) {
                addDrawCalls.length = 0;
            }
        }
    }
}
