namespace egret3d {
    /**
     * 
     */
    export class Sphere {
        /**
         * 
         */
        public radius: number = 0.0;
        /**
         * 
         */
        public readonly center: Vector3 = Vector3.create();

        public copy(value: Sphere) {
            this.radius = value.radius;
            this.center.copy(value.center);
        }
    }
}