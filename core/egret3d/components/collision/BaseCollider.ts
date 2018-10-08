namespace egret3d {
    /**
     * 碰撞体类型。
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
     */
    export interface ICollider {
        /**
         * 碰撞体类型。
         */
        readonly colliderType: ColliderType;
    }
    /**
     * 
     */
    export abstract class BaseCollider extends paper.BaseComponent implements ICollider, IRaycast {
        public readonly colliderType: ColliderType = -1;
        /**
         * 
         */
        protected _physicsData: any | null = null;

        public abstract raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo): boolean;
    }
}