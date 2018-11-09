namespace egret3d {
    const _points = [
        Vector2.create(),
        Vector2.create(),
        Vector2.create(),
        Vector2.create(),
        Vector2.create(),
        Vector2.create(),
        Vector2.create(),
        Vector2.create(),
    ];
    /**
     * TODO
     */
    export class Box2 extends paper.BaseRelease<Box2> implements paper.ICCS<Box2>, paper.ISerializable {
        public static readonly ONE: Readonly<Box2> = new Box2().set(
            Vector2.MINUS_ONE.clone().multiplyScalar(0.5),
            Vector2.ONE.clone().multiplyScalar(0.5)
        );
        private static readonly _instances: Box2[] = [];
        /**
         * 
         * @param minimum 最小点。
         * @param maximum 最大点。
         */
        public static create(minimum: Readonly<IVector2> | null = null, maximum: Readonly<IVector2> | null = null) {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!.set(minimum, maximum);
                instance._released = false;
                return instance;
            }

            return new Box2().set(minimum, maximum);
        }

        private _dirtyRadius: boolean = true;
        private _dirtyCenter: boolean = true;
        private _dirtySize: boolean = true;
        private _boundingSphereRadius: number = 0.0;
        private readonly _minimum: Vector2 = Vector2.create(Number.MAX_VALUE, Number.MAX_VALUE);
        private readonly _maximum: Vector2 = Vector2.create(-Number.MAX_VALUE, -Number.MAX_VALUE);
        private readonly _center: Vector2 = Vector2.create();
        private readonly _size: Vector2 = Vector2.create();

        private constructor() {
            super();
        }

        public serialize() {
            return [this._minimum.x, this._minimum.y, this._maximum.x, this._maximum.y];
        }

        public deserialize(value: Readonly<[number, number, number, number]>) {
            return this.fromArray(value);
        }

        public clone() {
            return Box2.create(this.minimum, this.maximum);
        }

        public copy(value: Readonly<Box2>) {
            return this.set(value.minimum, value.maximum);
        }

        public clear() {
            this._minimum.set(Number.MAX_VALUE, Number.MAX_VALUE);
            this._maximum.set(-Number.MAX_VALUE, -Number.MAX_VALUE);
            this._dirtyCenter = true;
            this._dirtyRadius = true;
            this._dirtySize = true;

            return this;
        }

        public set(minimum: Readonly<IVector2> | null = null, maximum: Readonly<IVector2> | null = null) {
            if (minimum && minimum !== this._minimum) {
                this._minimum.copy(minimum);
            }

            if (maximum && maximum !== this._maximum) {
                this._maximum.copy(maximum);
            }

            this._dirtyCenter = true;
            this._dirtyRadius = true;
            this._dirtySize = true;

            return this;
        }

        public fromArray(value: Readonly<ArrayLike<number>>, offset: number = 0) {
            this._minimum.fromArray(value, offset);
            this._maximum.fromArray(value, offset + 2);

            this._dirtyCenter = true;
            this._dirtyRadius = true;
            this._dirtySize = true;

            return this;
        }
        /**
         * 设置该立方体，使得全部点都在立方体内。
         * @param points 全部点。
         */
        public fromPoints(points: Readonly<ArrayLike<IVector2>>): this {
            this.clear();

            for (const point of points as IVector2[]) {
                this.add(point);
            }

            return this;
        }
        public add(pointOrBox: Readonly<IVector2 | Box2>): this;
        public add(pointOrBox: Readonly<IVector2 | Box2>, input: Readonly<Box2>): this;
        public add(pointOrBox: Readonly<IVector2 | Box2>, input?: Readonly<Box2>) {
            if (!input) {
                input = this;
            }

            const min = input.minimum;
            const max = input.maximum;

            if (pointOrBox instanceof Box2) {
                this._minimum.min(pointOrBox._minimum, min);
                this._maximum.max(pointOrBox._maximum, max);
            }
            else {
                this._minimum.min(pointOrBox as IVector2, min);
                this._maximum.max(pointOrBox as IVector2, max);
            }

            this._dirtyRadius = true;
            this._dirtyCenter = true;
            this._dirtySize = true;

            return this;
        }
        public expand(scalarOrVector: number | Readonly<IVector2>): this;

        public expand(scalarOrVector: number | Readonly<IVector2>, input: Readonly<Box2>): this;
        public expand(scalarOrVector: number | Readonly<IVector2>, input?: Readonly<Box2>) {
            if (!input) {
                input = this;
            }

            const min = input.minimum;
            const max = input.maximum;

            if (typeof scalarOrVector === "number") {
                this._minimum.addScalar(-scalarOrVector, min);
                this._maximum.addScalar(scalarOrVector, max);
            }
            else {
                this._minimum.subtract(scalarOrVector as IVector2, min);
                this._maximum.add(scalarOrVector as IVector2, max);
            }

            this._dirtyRadius = true;
            this._dirtyCenter = true;
            this._dirtySize = true;

            return this;
        }
        public translate(scalarOrVector: number | Readonly<IVector2>): this;
        public translate(scalarOrVector: number | Readonly<IVector2>, input: Readonly<Box2>): this;
        public translate(scalarOrVector: number | Readonly<IVector2>, input?: Readonly<Box2>) {
            if (!input) {
                input = this;
            }

            const min = input.minimum;
            const max = input.maximum;

            if (typeof scalarOrVector === "number") {
                this._minimum.addScalar(scalarOrVector, min);
                this._maximum.addScalar(scalarOrVector, max);
            }
            else {
                this._minimum.add(scalarOrVector, min);
                this._maximum.add(scalarOrVector, max);
            }

            this._dirtyRadius = true;
            this._dirtyCenter = true;
            this._dirtySize = true;

            return this;
        }
        public getClosestPointToPoint(point: Readonly<IVector2>, out?: Vector2): Vector2 {
            if (!out) {
                out = egret3d.Vector2.create();
            }

            return out.clamp(this._minimum, this._maximum, point);
        }
        public getDistance(point: Readonly<IVector2>): number {
            return helpVector2A.clamp(this._minimum, this._maximum, point).subtract(point).length;
        }
        public contains(pointOrBox: Readonly<IVector2 | Box2>): boolean {
            const min = this._minimum;
            const max = this._maximum;

            if (pointOrBox instanceof Box2) {
                const vMin = pointOrBox.minimum;
                const vMax = pointOrBox.maximum;

                return min.x <= vMin.x && vMax.x <= max.x &&
                    min.y <= vMin.y && vMax.y <= max.y;
            }

            return ((pointOrBox as IVector2).x > min.x) && ((pointOrBox as IVector2).x < max.x) &&
                ((pointOrBox as IVector2).y > min.y) && ((pointOrBox as IVector2).y < max.y);
        }
        public get isEmpty(): boolean {
            return (this._maximum.x < this._minimum.x) || (this._maximum.y < this._minimum.y);
        }
        public get boundingSphereRadius(): number {
            if (this._dirtyRadius) {
                helpVector2A.subtract(this._maximum, this._minimum).multiplyScalar(0.5);
                this._boundingSphereRadius = helpVector2A.length;
                this._dirtyRadius = false;
            }

            return this._boundingSphereRadius;
        }
        public get minimum(): Readonly<IVector2> {
            return this._minimum;
        }
        public get maximum(): Readonly<IVector2> {
            return this._maximum;
        }
        @paper.editor.property(paper.editor.EditType.VECTOR2, { minimum: 0.0 })
        public get size(): Readonly<IVector2> {
            if (this._dirtySize) {
                this._size.subtract(this._maximum, this._minimum);
                this._dirtySize = false;
            }

            return this._size;
        }
        public set size(value: Readonly<IVector2>) {
            const center = this.center;
            const size = this._size.copy(value);

            const halfSize = helpVector2A.copy(size).multiplyScalar(0.5);
            this._minimum.copy(center).subtract(halfSize);
            this._maximum.copy(center).add(halfSize);
            this._dirtyRadius = true;
        }
        @paper.editor.property(paper.editor.EditType.VECTOR2)
        public get center(): Readonly<IVector2> {
            if (this._dirtyCenter) {
                this._center.add(this._maximum, this._minimum).multiplyScalar(0.5);
                this._dirtyCenter = false;
            }

            return this._center;
        }
        public set center(value: Readonly<IVector2>) {
            const size = this.size;
            const center = this._center.copy(value);

            const halfSize = helpVector2A.copy(size).multiplyScalar(0.5);
            this._minimum.copy(center).subtract(halfSize);
            this._maximum.copy(center).add(halfSize);
        }
    }
}