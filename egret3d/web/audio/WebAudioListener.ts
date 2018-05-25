namespace egret3d.sound {

    export class WebAudioListener {

        private readonly listener:AudioListener;

        private position:Vector3 = new Vector3();

        private velocity:Vector3 = new Vector3();

        private orientation:Matrix = new Matrix();

        constructor() {
            this.listener = WebAudio.instance.audioContext.listener;
        }

        public setPosition(x:number, y:number, z:number) {
            this.position.x = x;
            this.position.y = y;
            this.position.z = z;
            this.listener.setPosition(x, y, z);
        }    

        public getPosition():Vector3 {
            return this.position;
        }

        public setVelocity(x:number, y:number, z:number) {
            this.velocity.x = x;
            this.velocity.y = y;
            this.velocity.z = z;
            this.listener.setVelocity(x, y, z);
        }    

        public getVelocity():Vector3 {
            return this.velocity;
        }

        public setOrientation(orientation:Matrix) {
            Matrix.copy(orientation, this.orientation);
            this.listener.setOrientation(
                -orientation.rawData[8], -orientation.rawData[9], -orientation.rawData[10],
                orientation.rawData[4], orientation.rawData[5], orientation.rawData[6]
            );
        }   

        public getOrientation():Matrix {
            return this.orientation;
        }
    }
}