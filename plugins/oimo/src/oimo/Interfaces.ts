namespace egret3d.oimo {
    /**
     * 刚体类型。
     */
    export const enum RigidbodyType {
        /**
         * 动态。
         */
        Dynamic = 0, // OIMO.RigidBodyType.DYNAMIC
        /**
         * 静态。
         */
        Static = 1, // OIMO.RigidBodyType.STATIC
        /**
         * 动力学。
         */
        Kinematic = 2, // OIMO.RigidBodyType.KINEMATIC
    }
    /**
     * 关节类型。
     */
    export enum JointType {
        /**
         * 移动关节。
         */
        Prismatic = OIMO.JointType.PRISMATIC,
        /**
         * 转动关节。
         */
        Revolute = OIMO.JointType.REVOLUTE,
        /**
         * 柱面关节。
         */
        Cylindrical = OIMO.JointType.CYLINDRICAL,
        /**
         * 球面关节。
         */
        Spherical = OIMO.JointType.SPHERICAL,
        /**
         * 万向关节。
         */
        Universal = OIMO.JointType.UNIVERSAL,
        /**
         * 锥形旋转关节。
         */
        ConeTwist = OIMO.JointType.RAGDOLL,
    }
}