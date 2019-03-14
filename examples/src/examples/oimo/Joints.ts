namespace examples.oimo {

    export class Joints implements Example {
        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");
            //
            paper.Application.systemManager.register(StarterSystem, paper.Application.gameObjectContext);
            paper.Application.systemManager.register(TouchJointSystem, paper.Application.gameObjectContext);
        }
    }

    class StarterSystem extends paper.BaseSystem<paper.GameObject> {

        public onEnable() {
            //
            egret3d.Camera.main;
            //
            createGridRoom(10.0);

            { // PrismaticJoint
                const entityA = egret3d.creater.createGameObject("Prismatic Joint", {
                    mesh: egret3d.DefaultMeshes.CUBE,
                    material: egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT),
                    castShadows: true,
                    receiveShadows: true,
                });
                const rigidbodyA = entityA.addComponent(egret3d.oimo.Rigidbody);
                const boxColliderA = entityA.addComponent(egret3d.oimo.BoxCollider);
                rigidbodyA.type = egret3d.oimo.RigidbodyType.KINEMATIC;
                boxColliderA.box.size.set(0.1, 1.0, 0.1).update();
                entityA.transform
                    .setLocalPosition(-3.0, 0.0, 0.0)
                    .setLocalScale(boxColliderA.box.size);

                const entityB = egret3d.creater.createGameObject("Prismatic Joint Connected", {
                    mesh: egret3d.DefaultMeshes.CUBE,
                    material: egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT),
                    castShadows: true,
                    receiveShadows: true,
                });
                const rigidbodyB = entityB.addComponent(egret3d.oimo.Rigidbody);
                const boxColliderB = entityB.addComponent(egret3d.oimo.BoxCollider);
                rigidbodyB.mass = 1.0;
                boxColliderB.box.size.set(0.4, 0.5, 0.4).update();
                entityB.transform
                    .setLocalPosition(-3.0, 0.0, 0.0)
                    .setLocalScale(boxColliderB.box.size);

                const prismaticJoint = entityA.addComponent(egret3d.oimo.PrismaticJoint);
                prismaticJoint.springDamper.frequency = 4.0;
                prismaticJoint.springDamper.dampingRatio = 0.5;
                prismaticJoint.limitMotor.lowerLimit = -0.5;
                prismaticJoint.limitMotor.upperLimit = 0.5;
                prismaticJoint.axis = egret3d.Vector3.DOWN;
                prismaticJoint.connectedRigidbody = rigidbodyB;
            }

            { // RevoluteJoint
                const entityA = egret3d.creater.createGameObject("Revolute Joint", {
                    mesh: egret3d.DefaultMeshes.CYLINDER,
                    material: egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT),
                    castShadows: true,
                    receiveShadows: true,
                });
                const rigidbodyA = entityA.addComponent(egret3d.oimo.Rigidbody);
                const boxColliderA = entityA.addComponent(egret3d.oimo.CylinderCollider);
                rigidbodyA.type = egret3d.oimo.RigidbodyType.KINEMATIC;
                boxColliderA.cylinder.topRadius = 0.05;
                boxColliderA.cylinder.bottomRadius = 0.05;
                boxColliderA.cylinder.height = 1.0;
                entityA.transform
                    .setLocalPosition(-2.0, 0.0, 0.0)
                    .setLocalScale(0.1, 1.0, 0.1);

                const entityB = egret3d.creater.createGameObject("Revolute Joint Connected", {
                    mesh: egret3d.DefaultMeshes.CUBE,
                    material: egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT),
                    castShadows: true,
                    receiveShadows: true,
                });
                const rigidbodyB = entityB.addComponent(egret3d.oimo.Rigidbody);
                const boxColliderB = entityB.addComponent(egret3d.oimo.BoxCollider);
                rigidbodyB.mass = 1.0;
                boxColliderB.box.size.set(0.4, 0.5, 0.4).update();
                entityB.transform
                    .setLocalPosition(-2.0, 0.0, 0.0)
                    .setLocalScale(boxColliderB.box.size);

                const prismaticJoint = entityA.addComponent(egret3d.oimo.RevoluteJoint);
                prismaticJoint.springDamper.frequency = 4.0;
                prismaticJoint.springDamper.dampingRatio = 0.5;
                prismaticJoint.axis = egret3d.Vector3.DOWN;
                prismaticJoint.connectedRigidbody = rigidbodyB;
            }

            { // CylindricalJoint
                const entityA = egret3d.creater.createGameObject("Cylindrical Joint", {
                    mesh: egret3d.DefaultMeshes.CYLINDER,
                    material: egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT),
                    castShadows: true,
                    receiveShadows: true,
                });
                const rigidbodyA = entityA.addComponent(egret3d.oimo.Rigidbody);
                const boxColliderA = entityA.addComponent(egret3d.oimo.CylinderCollider);
                rigidbodyA.type = egret3d.oimo.RigidbodyType.KINEMATIC;
                boxColliderA.cylinder.topRadius = 0.05;
                boxColliderA.cylinder.bottomRadius = 0.05;
                boxColliderA.cylinder.height = 1.0;
                entityA.transform
                    .setLocalPosition(-1.0, 0.0, 0.0)
                    .setLocalScale(0.1, 1.0, 0.1);

                const entityB = egret3d.creater.createGameObject("Cylindrical Joint Connected", {
                    mesh: egret3d.DefaultMeshes.CUBE,
                    material: egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT),
                    castShadows: true,
                    receiveShadows: true,
                });
                const rigidbodyB = entityB.addComponent(egret3d.oimo.Rigidbody);
                const boxColliderB = entityB.addComponent(egret3d.oimo.BoxCollider);
                rigidbodyB.mass = 1.0;
                boxColliderB.box.size.set(0.4, 0.5, 0.4).update();
                entityB.transform
                    .setLocalPosition(-1.0, 0.0, 0.0)
                    .setLocalScale(boxColliderB.box.size);

                const prismaticJoint = entityA.addComponent(egret3d.oimo.CylindricalJoint);
                prismaticJoint.translationalSpringDamper.frequency = 4.0;
                prismaticJoint.translationalSpringDamper.dampingRatio = 0.5;
                prismaticJoint.translationalLimitMotor.lowerLimit = -0.5;
                prismaticJoint.translationalLimitMotor.upperLimit = 0.5;
                prismaticJoint.axis = egret3d.Vector3.DOWN;
                prismaticJoint.connectedRigidbody = rigidbodyB;
            }
        }
    }
}
