namespace egret3d.sound {

    /**
     *  
     */
    export class WebAudioChannel2D {

        protected source:AudioBufferSourceNode;

        protected gain:GainNode;

        constructor() {
            this._init();
        }

        protected _init() {
            let context = WebAudio.instance.audioContext;

            this.source = context.createBufferSource();
            this.gain = context.createGain();

            // Connect up the nodes
            this.source.connect(this.gain);
            this.gain.connect(context.destination);
        }

        public set buffer(buffer:AudioBuffer) {
            this.source.buffer = buffer;
        }

        public set volume(value:number) {
            value = Math.max(Math.min(value, 1), -0.999);
            this.gain.gain.value = value;
        }

        public get volume():number {
            return this.gain.gain.value;
        }

        public set loop(value:boolean) {
            this.source.loop = value;
        }

        public get loop():boolean {
            return this.source.loop;
        }

        public start(offset?:number) {
            this.source.start(undefined, offset || undefined);
        }

        public stop() {
            this.source.stop();
        }

        public dispose() {
            this.source.buffer = null;
        }      
    }
}