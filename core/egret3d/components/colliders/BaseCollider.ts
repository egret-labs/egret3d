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
    /**
     * 
     */
    export class BoxCollider extends BaseCollider {
        public readonly colliderType: ColliderType = ColliderType.Box;

        @paper.serializedField
        public readonly aabb: AABB = AABB.ONE.clone();

        public raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo) {
            const localRay = helpRay.applyMatrix(helpMatrixA.inverse(this.transform.worldMatrix), ray); // TODO transform inverse world matrix.

            if (this.aabb.raycast(localRay, raycastInfo)) {
                if (raycastInfo) {
                    raycastInfo.position.applyMatrix(this.transform.worldMatrix);
                    raycastInfo.distance = ray.origin.getDistance(raycastInfo.position);
                }

                return true;
            }

            return false;
        }
    }
    /**
     * 
     */
    export class SphereCollider extends BaseCollider {
        public readonly colliderType: ColliderType = ColliderType.Sphere;
        @paper.serializedField
        public readonly sphere: Sphere = Sphere.create(Vector3.ZERO, 0.5);

        public raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo) {
            const localRay = helpRay.applyMatrix(helpMatrixA.inverse(this.transform.worldMatrix), ray); // TODO transform inverse world matrix.

            if (this.sphere.raycast(localRay, raycastInfo)) {
                if (raycastInfo) {
                    raycastInfo.position.applyMatrix(this.transform.worldMatrix);
                    raycastInfo.distance = ray.origin.getDistance(raycastInfo.position);
                }

                return true;
            }

            return false;
        }
    }
    /**
     * 
     */
    // export class CylinderCollider extends BaseCollider {
    //     public readonly colliderType: ColliderType = ColliderType.Cylinder;
    //     @paper.serializedField
    //     public radius: number = 1.0;
    //     @paper.serializedField
    //     public height: number = 1.0;

    //     public raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo) {
    //         const localRay = helpRay.applyMatrix(helpMatrixA.inverse(this.transform.worldMatrix), ray); // TODO transform inverse world matrix.

    //         if (this.aabb.raycast(localRay, raycastInfo)) {
    //             if (raycastInfo) {
    //                 raycastInfo.position.applyMatrix(this.transform.worldMatrix);
    //                 raycastInfo.distance = ray.origin.getDistance(raycastInfo.position);
    //             }

    //             return true;
    //         }

    //         return false;
    //     }
    // }
    /**
     * 
     */
    // export class ConeCollider extends BaseCollider {
    //     public readonly colliderType: ColliderType = ColliderType.Cone;
    //     @paper.serializedField
    //     public radius: number = 1.0;
    //     @paper.serializedField
    //     public height: number = 1.0;
    // }
    /**
     * 
     */
    // export class CapsuleCollider extends BaseCollider {
    //     public readonly colliderType: ColliderType = ColliderType.Capsule;
    //     @paper.serializedField
    //     public radius: number = 1.0;
    //     @paper.serializedField
    //     public height: number = 1.0;
    // }
}