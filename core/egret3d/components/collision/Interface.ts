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
        /**
         * TODO
         */
        Mesh,
    }
    /**
     * 碰撞体接口。
     * - 为多物理引擎统一接口。
     */
    export interface ICollider extends paper.BaseComponent { // TODO paper.IComponent
        /**
         * 碰撞体类型。
         */
        readonly colliderType: ColliderType;
    }
    /**
     * 立方体碰撞组件接口。
     */
    export interface IBoxCollider extends ICollider {
        /**
         * 描述该碰撞体的立方体。
         */
        readonly box: Box;
    }
    /**
     * 球体碰撞组件接口。
     */
    export interface ISphereCollider extends ICollider {
        /**
         * 描述该碰撞体的球体。
         */
        readonly sphere: Sphere;
    }
    /**
     * 圆柱（锥）体碰撞组件接口。
     */
    export interface ICylinderCollider extends ICollider {
        /**
         * 描述该碰撞体的圆柱（锥）体。
         */
        readonly cylinder: Cylinder;
    }
    /**
     * 胶囊体碰撞组件接口。
     */
    export interface ICapsuleCollider extends ICollider {
        /**
         * 描述该碰撞体的胶囊体。
         */
        readonly capsule: Capsule;
    }
    /**
     * 网格碰撞组件接口。
     */
    export interface IMeshCollider extends ICollider {
    }
    /**
     * 
     */
    export interface IRigidbody {

    }
    /**
     * 射线检测接口。
     */
    export interface IRaycast {
        /**
         * 射线检测。
         * @param ray 射线。
         * @param raycastInfo 是否将检测的详细数据写入 raycastInfo。
         */
        raycast(ray: Readonly<Ray>, raycastInfo: RaycastInfo | null): boolean;
    }
}