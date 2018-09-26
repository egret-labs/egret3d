namespace egret3d {
    /**
     * 
     */
    export interface IVector4 extends IVector3 {
        w: number;
    }
    /**
     * 
     */
    export class Vector4 extends paper.BaseRelease<Vector4> implements IVector4, paper.ICCS<Vector4>, paper.ISerializable {

        protected static readonly _instances: Vector4[] = [];
        /**
         * 
         */
        public static create(x: number = 0.0, y: number = 0.0, z: number = 0.0, w: number = 1.0) {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!.set(x, y, z, w);
                instance._released = false;
                return instance;
            }

            return new Vector4().set(x, y, z, w);
        }

        public x: number;
        public y: number;
        public z: number;
        public w: number;
        /**
         * 请使用 `egret3d.Vector4.create(); egret3d.Quaternion.create()` 创建实例。
         * @see egret3d.Quaternion.create()
         * @see egret3d.Vector4.create()
         * @deprecated
         */
        public constructor(x: number = 0.0, y: number = 0.0, z: number = 0.0, w: number = 1.0) {
            super();

            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }

        public serialize() {
            return [this.x, this.y, this.z, this.w];
        }

        public deserialize(value: Readonly<[number, number, number, number]>) {
            return this.fromArray(value);
        }

        public copy(value: Readonly<IVector4>) {
            return this.set(value.x, value.y, value.z, value.w);
        }

        public clone() {
            return Vector4.create(this.x, this.y, this.z, this.w);
        }

        public set(x: number, y: number, z: number, w: number) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;

            return this;
        }

        public fromArray(value: Readonly<ArrayLike<number>>, offset: number = 0) {
            this.x = value[offset];
            this.y = value[offset + 1];
            this.z = value[offset + 2];
            this.w = value[offset + 3];

            return this;
        }

        public normalize(source?: Readonly<IVector4>) {
            if (!source) {
                source = this;
            }

            let l = Math.sqrt(source.x * source.x + source.y * source.y + source.z * source.z + source.w * source.w);
            if (l > egret3d.EPSILON) {
                l = 1.0 / l;
                this.x *= l;
                this.y *= l;
                this.z *= l;
                this.w *= l;
            }
            else {
                this.x = 0.0;
                this.y = 0.0;
                this.z = 0.0;
                this.w = 1.0;
            }

            return this;
        }

        public toArray(value: number[] | Float32Array, offset: number = 0) {
            value[0 + offset] = this.x;
            value[1 + offset] = this.y;
            value[2 + offset] = this.z;
            value[3 + offset] = this.w;

            return value;
        }

        public get length() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        }

        public get squaredLength() {
            return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
        }
    }
}