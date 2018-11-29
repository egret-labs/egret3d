namespace egret3d {
    const _helpVector3 = Vector3.create();
    /**
     * 
     */
    export class Frustum extends paper.BaseRelease<Frustum> implements paper.ICCS<Frustum>, paper.ISerializable {
        private static readonly _instances: Frustum[] = [];
        /**
         * 
         */
        public static create() {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!;
                instance._released = false;
                return instance;
            }

            return new Frustum();
        }
        /**
         * 
         */
        public readonly planes: [Plane, Plane, Plane, Plane, Plane, Plane] = [
            Plane.create(),
            Plane.create(),
            Plane.create(),
            Plane.create(),
            Plane.create(),
            Plane.create(),
        ];
        /**
         * 请使用 `egret3d.Frustum.create()` 创建实例。
         * @see egret3d.Frustum.create()
         */
        private constructor() {
            super();
        }

        public serialize() {
            let index = 0;
            const array: number[] = [];

            for (const plane of this.planes) {
                plane.toArray(array, index++);
            }

            return array;
        }

        public deserialize(value: ReadonlyArray<number>) {
            return this.fromArray(value);
        }

        public clone() {
            return Frustum.create().set(this.planes);
        }

        public copy(value: Readonly<Frustum>) {
            return this.set(value.planes);
        }

        public set(planes: [Plane, Plane, Plane, Plane, Plane, Plane]) {
            let index = 0;
            for (const plane of planes) {
                this.planes[index++].copy(plane);
            }

            return this;
        }

        public fromArray(array: ReadonlyArray<number>, offset: number = 0) {
            for (const plane of this.planes) {
                plane.fromArray(array, offset);
                offset += 4;
            }

            return this;
        }

        public fromMatrix(matrix: Readonly<Matrix4>): this {
            const planes = this.planes;
            const me = matrix.rawData;
            const me0 = me[0], me1 = me[1], me2 = me[2], me3 = me[3];
            const me4 = me[4], me5 = me[5], me6 = me[6], me7 = me[7];
            const me8 = me[8], me9 = me[9], me10 = me[10], me11 = me[11];
            const me12 = me[12], me13 = me[13], me14 = me[14], me15 = me[15];
            const helpVector3 = _helpVector3;

            planes[0].set(helpVector3.set(me3 - me0, me7 - me4, me11 - me8), me15 - me12).normalize();
            planes[1].set(helpVector3.set(me3 + me0, me7 + me4, me11 + me8), me15 + me12).normalize();
            planes[2].set(helpVector3.set(me3 + me1, me7 + me5, me11 + me9), me15 + me13).normalize();
            planes[3].set(helpVector3.set(me3 - me1, me7 - me5, me11 - me9), me15 - me13).normalize();
            planes[4].set(helpVector3.set(me3 - me2, me7 - me6, me11 - me10), me15 - me14).normalize();
            planes[5].set(helpVector3.set(me3 + me2, me7 + me6, me11 + me10), me15 + me14).normalize();

            return this;
        }

        public containsPoint(point: Readonly<IVector3>): boolean {
            for (const plane of this.planes) {
                if (plane.getDistance(point) < 0.0) {
                    return false;
                }
            }

            return true;
        }
    }
}