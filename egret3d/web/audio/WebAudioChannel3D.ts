/// <reference path="WebAudioChannel2D.ts" />

namespace egret3d.sound {

    /**
     *  
     */
    export class WebAudioChannel3D extends WebAudioChannel2D {

        private panner:PannerNode;

        protected _init() {
            let context = WebAudio.instance.audioContext;

            this.source = context.createBufferSource();
            this.panner = context.createPanner();
            this.gain = context.createGain();

            // Connect up the nodes
            this.source.connect(this.panner);
            this.panner.connect(this.gain);
            this.gain.connect(context.destination);
        }

        public set maxDistance(value:number) {
            this.panner.maxDistance = value;
        }

        public get maxDistance():number {
            return this.panner.maxDistance;
        }

        public set minDistance(value:number) {
            this.panner.refDistance = value;
        }

        public get minDistance():number {
            return this.panner.refDistance;
        }

        public set rollOffFactor(value:number) {
            this.panner.rolloffFactor = value;
        }

        public get rollOffFactor():number {
            return this.panner.rolloffFactor;
        }

        public set distanceModel(value:string) {
            if(value === "linear" || value === "inverse" || value === "exponential") {
                this.panner.distanceModel = value;
            } else {
                console.warn("distanceModel: " + value + " Is not a valid parameter");
            }
        }

        public get distanceModel():string {
            return this.panner.distanceModel;
        }

        private position:Vector3 = new Vector3();

        public setPosition(x:number, y:number, z:number) {
            this.position.x = x;
            this.position.y = y;
            this.position.z = z;
            this.panner.setPosition(x, y, z);
        }    

        public getPosition():Vector3 {
            return this.position;
        }      

        private velocity:Vector3 = new Vector3();

        public setVelocity(x:number, y:number, z:number) {
            this.position.x = x;
            this.position.y = y;
            this.position.z = z;
            this.panner.setVelocity(x, y, z);
        }    

        public getVelocity():Vector3 {
            return this.velocity;
        }
    }
}