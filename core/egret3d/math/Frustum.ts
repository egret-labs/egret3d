// namespace egret3d {
//     class Frustum extends paper.BaseRelease<Frustum> implements paper.ICCS<Frustum>, paper.ISerializable {
//         private static readonly _instances: Frustum[] = [];
//         /**
//          * 创建一个几何立方体。
//          * @param minimum 最小点。
//          * @param maximum 最大点。
//          */
//         public static create(planes: Readonly<[Plane, Plane, Plane, Plane, Plane, Plane]>) {
//             if (this._instances.length > 0) {
//                 const instance = this._instances.pop()!.set(planes);
//                 instance._released = false;
//                 return instance;
//             }

//             return new Frustum();
//         }

//         public readonly planes: Readonly<[Plane, Plane, Plane, Plane, Plane, Plane]> = [
//             Plane.create(),
//             Plane.create(),
//             Plane.create(),
//             Plane.create(),
//             Plane.create(),
//             Plane.create(),
//         ];
//         /**
//          * 请使用 `egret3d.Frustum.create()` 创建实例。
//          * @see egret3d.Frustum.create()
//          */
//         private constructor() {
//             super();
//         }

//         public serialize() {
//             let index = 0;
//             const array = [];

//             for (const plane of this.planes) {
//                 plane.toArray(array, index++);
//             }

//             return array;
//         }

//         public deserialize(value: ReadonlyArray<number>) {
//             return this.fromArray(value);
//         }

//         public clone() {
//             return Frustum.create(this.planes);
//         }

//         public copy(value: Readonly<Frustum>) {
//             return this.set(value.planes);
//         }

//         public set(planes: Readonly<[Plane, Plane, Plane, Plane, Plane, Plane]>): this {
//             this.r = r;
//             this.g = g;
//             this.b = b;

//             if (a !== undefined) {
//                 this.a = a;
//             }

//             return this;
//         }

//         public fromArray(array: ReadonlyArray<number>, offset: number = 0) {

//         }
//     }
// }