namespace egret3d {
    /**
     * 雾。
     */
    export class Shadow implements paper.ISerializable {
        /**
         * @internal
         */
        public static create() {
            return new Shadow();
        }
        /**
         * 禁止实例化。
         */
        private constructor() {
        }

        public serialize() {
            return [];
        }

        public deserialize(data: Readonly<[number, number, number, number, number, number, number, number]>) {
        }
    }
}