namespace egret3d {
    /**
     * 矩形对象
     */
    export interface RectData {

        x: number;

        y: number;

        w: number;

        h: number;
    }
    /**
     * 矩形可序列化对象
     */
    export class Rect implements RectData, paper.ISerializable {
        /**
         * 
         */
        public x: number = 0.0;
        /**
         * 
         */
        public y: number = 0.0;
        /**
         * 
         */
        public w: number = 0.0;
        /**
         * 
         */
        public h: number = 0.0;
        /**
         * 
         */
        public constructor(x: number = 0.0, y: number = 0.0, w: number = 0.0, h: number = 0.0) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }
        /**
         * @inheritDoc
         */
        public serialize() {
            return [this.x, this.y, this.w, this.h];
        }
        /**
         * @inheritDoc
         */
        public deserialize(element: number[]) {
            this.x = element[0];
            this.y = element[1];
            this.w = element[2];
            this.h = element[3];
        }
    }

    /**
     * @internal
     */
    export const helpRectA = new Rect();
    /**
     * @internal
     */
    export const helpRectB = new Rect();
    /**
     * @internal
     */
    export const helpRectC = new Rect();
    /**
     * @internal 
     */
    export const helpRectD = new Rect();
}