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
     * 
     */
    export abstract class BaseCollider extends paper.BaseComponent implements IRaycast {
        /**
         * 碰撞体类型。
         */
        public readonly colliderType: ColliderType = -1;
        /**
         * 
         */
        protected _physicsData: any | null = null;

        public abstract raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo): boolean;
    }
}