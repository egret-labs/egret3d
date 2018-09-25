namespace egret3d {
    /**
     * 
     */
    export interface ISize {
        w: number;
        h: number;
    }
    /**
     * 
     */
    export interface IRectangle extends IVector2, ISize {
    }
    /**
     * 矩形可序列化对象
     */
    export class Rectangle implements IRectangle, paper.ISerializable {
        public x: number;
        public y: number;
        public w: number;
        public h: number;
        
        public constructor(x: number = 0.0, y: number = 0.0, w: number = 0.0, h: number = 0.0) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }

        public serialize() {
            return [this.x, this.y, this.w, this.h];
        }

        public deserialize(element: number[]) {
            this.x = element[0];
            this.y = element[1];
            this.w = element[2];
            this.h = element[3];

            return this;
        }
    }
}