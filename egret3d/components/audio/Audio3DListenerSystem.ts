namespace egret3d {

    /**
     * Audio系统
     */
    export class Audio3DListenerSystem extends paper.BaseSystem<Audio3DListener> {

        /**
         * @inheritDoc
         */
        protected readonly _interests = [
            { componentClass: Audio3DListener }
        ];

        private _updateAudioListener(audioListener: Audio3DListener) {
            if (audioListener.gameObject) {
                const position = audioListener.gameObject.transform.getPosition();
                sound.WebAudio.instance.getAudioListener().setPosition(position.x, position.y, position.z);

                const wtm = audioListener.gameObject.transform.getWorldMatrix();
                sound.WebAudio.instance.getAudioListener().setOrientation(wtm);
            }
        }

        /**
         * @inheritDoc
         */
        public update() {
            for (const component of this._components) {
                this._updateAudioListener(component);
            }
        }
    }
}
