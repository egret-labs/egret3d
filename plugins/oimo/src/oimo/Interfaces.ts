namespace egret3d.oimo {
    /**
     * 刚体类型。
     */
    export const enum RigidbodyType {
        /**
         * 动态。
         */
        DYNAMIC = 0, // OIMO.RigidBodyType.DYNAMIC
        /**
         * 静态。
         */
        STATIC = 1, // OIMO.RigidBodyType.STATIC
        /**
         * 动力学。
         */
        KINEMATIC = 2, // OIMO.RigidBodyType.KINEMATIC
    }
    /**
     * 关节类型。
     */
    export enum JointType {
        Spherical = OIMO.JointType.SPHERICAL,
        Prismatic = OIMO.JointType.PRISMATIC,
        Hinge = OIMO.JointType.REVOLUTE,
        Cylindrical = OIMO.JointType.CYLINDRICAL,
        ConeTwist = OIMO.JointType.RAGDOLL,
        Universal = OIMO.JointType.UNIVERSAL,
    }
}