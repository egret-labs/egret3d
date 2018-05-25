namespace egret3d {
    /**
     * 
     */
    export class Border implements paper.ISerializable {
        /**
         * 
         */
        public l: number;
        /**
         * 
         */
        public t: number;
        /**
         * 
         */
        public r: number;
        /**
         * 
         */
        public b: number;
        /**
         * 
         */
        public constructor(l: number = 0.0, t: number = 0.0, r: number = 0.0, b: number = 0.0) {
            this.l = l;
            this.t = t;
            this.r = r;
            this.b = b;
        }
        /**
         * @inheritDoc
         */
        public serialize() {
            return [this.l, this.t, this.r, this.b];
        }

        /**
         * @inheritDoc
         */
        public deserialize(element: number[]) {
            this.l = element[0];
            this.t = element[1];
            this.r = element[2];
            this.b = element[3];
        }
    }
}
