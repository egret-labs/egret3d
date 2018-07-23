namespace egret3d {
    /**
     * Camera系统
     */
    export class CameraSystem extends paper.BaseSystem {
        protected readonly _interests = [
            [
                { componentClass: Camera }
            ],
            [
                { componentClass: [DirectLight, SpotLight, PointLight] }
            ]
        ];
        private readonly _drawCalls: DrawCalls = this._globalGameObject.getComponent(DrawCalls) || this._globalGameObject.addComponent(DrawCalls);       

        protected _sortCamera(a: Camera, b: Camera) {
            return a.order - b.order;
        }

        public onUpdate(deltaTime: number) {
            Performance.startCounter("render");

            const cameras = this._groups[0].components as Camera[];
            if (cameras.length > 0) {
                const lights = this._groups[1].components as ReadonlyArray<BaseLight>;
                cameras.sort(this._sortCamera);

                for (const component of cameras) {
                    component.update(deltaTime);                   
                }
            }

            Performance.endCounter("render");
            Performance.updateFPS();
        }
    }
}
