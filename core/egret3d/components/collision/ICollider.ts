namespace egret3d {
    /**
     * 碰撞体类型。
     * - 枚举需要支持的全部碰撞体类型。
     */
    export enum ColliderType {
        /**
         * 立方体。
         */
        Box,
        /**
         * 球体。
         */
        Sphere,
        /**
         * 圆柱体。
         */
        Cylinder,
        /**
         * 圆锥体。
         */
        Cone,
        /**
         * 胶囊体。
         */
        Capsule,
        /**
         * TODO
         */
        ConvexHull,
    }
    /**
     * 碰撞体接口。
     * - 为多物理引擎统一接口。
     */
    export interface ICollider {
        /**
         * 碰撞体类型。
         */
        readonly colliderType: ColliderType;
    }
}