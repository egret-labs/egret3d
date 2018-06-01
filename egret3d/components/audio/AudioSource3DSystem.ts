namespace egret3d {
    /**
     * Audio系统
     */
    export class AudioSource3DSystem extends paper.BaseSystem<AudioSource3D> {
        /**
         * @inheritDoc
         */
        protected readonly _interests = [
            { componentClass: AudioSource3D }
        ];
        /**
         * @inheritDoc
         */
        public update() {
            const deltaTime = paper.Time.deltaTime;
            for (const component of this._components) {
                component.update(deltaTime);
            }
        }
    }
}
