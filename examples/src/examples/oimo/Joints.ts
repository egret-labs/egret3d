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
                    .setLocalPosition(-6.0, 0.0, 0.0)
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
                    .setLocalPosition(-6.0, 0.0, 0.2)
                    .setLocalScale(boxColliderB.box.size);

                const jonit = entityA.addComponent(egret3d.oimo.PrismaticJoint);
                jonit.springDamper.frequency = 4.0;
                jonit.springDamper.dampingRatio = 0.5;
                jonit.limitMotor.lowerLimit = -0.5;
                jonit.limitMotor.upperLimit = 0.5;
                jonit.axis = egret3d.Vector3.UP;
                jonit.connectedRigidbody = rigidbodyB;

                entityA.addComponent(behaviors.Rotater).speed.set(0.0, 0.0, 1.0);
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
                    .setLocalPosition(-4.0, 0.0, 0.0)
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
                    .setLocalPosition(-4.0, 0.0, 0.2)
                    .setLocalScale(boxColliderB.box.size);

                const joint = entityA.addComponent(egret3d.oimo.RevoluteJoint);
                joint.springDamper.frequency = 4.0;
                joint.springDamper.dampingRatio = 0.5;
                joint.axis = egret3d.Vector3.UP;
                joint.connectedRigidbody = rigidbodyB;
                joint.limitMotor.motorSpeed = 10.0;
                joint.limitMotor.motorTorque = 10.0;
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
                    .setLocalPosition(-2.0, 0.0, 0.0)
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
                    .setLocalPosition(-2.0, 0.0, 0.0)
                    .setLocalScale(boxColliderB.box.size);

                const joint = entityA.addComponent(egret3d.oimo.CylindricalJoint);
                joint.translationalSpringDamper.frequency = 4.0;
                joint.translationalSpringDamper.dampingRatio = 0.5;
                joint.translationalLimitMotor.lowerLimit = -0.5;
                joint.translationalLimitMotor.upperLimit = 0.5;
                joint.axis = egret3d.Vector3.UP;
                joint.connectedRigidbody = rigidbodyB;
                joint.rotationalLimitMotor.motorSpeed = 10.0;
                joint.rotationalLimitMotor.motorTorque = 10.0;

                entityA.addComponent(behaviors.Rotater).speed.set(0.0, 0.0, 1.0);
            }

            { // SphericalJoint
                const entityA = egret3d.creater.createGameObject("Spherical Joint", {
                    mesh: egret3d.DefaultMeshes.SPHERE,
                    material: egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT),
                    castShadows: true,
                    receiveShadows: true,
                });
                const rigidbodyA = entityA.addComponent(egret3d.oimo.Rigidbody);
                const boxColliderA = entityA.addComponent(egret3d.oimo.SphereCollider);
                rigidbodyA.type = egret3d.oimo.RigidbodyType.KINEMATIC;
                boxColliderA.sphere.radius = 0.2;
                entityA.transform
                    .setLocalPosition(2.0, 0.0, 0.0)
                    .setLocalScale(0.4);

                const entityB = egret3d.creater.createGameObject("Spherical Joint Connected", {
                    mesh: egret3d.DefaultMeshes.CUBE,
                    material: egret3d.Material.create(egret3d.DefaultShaders.MESH_LAMBERT),
                    castShadows: true,
                    receiveShadows: true,
                });
                const rigidbodyB = entityB.addComponent(egret3d.oimo.Rigidbody);
                const boxColliderB = entityB.addComponent(egret3d.oimo.BoxCollider);
                rigidbodyB.mass = 1.0;
                boxColliderB.box.size.set(0.5, 0.5, 0.5).update();
                entityB.transform
                    .setLocalPosition(2.0, -1.0, 0.0)
                    .setLocalScale(boxColliderB.box.size);

                const joint = entityA.addComponent(egret3d.oimo.SphericalJoint);
                joint.springDamper.frequency = 4.0;
                joint.springDamper.dampingRatio = 0.5;
                joint.connectedRigidbody = rigidbodyB;

                const wander = entityA.addComponent(behaviors.Wander);
                wander.radius = 0.5;
                wander.center.set(2.0, 0.0, 0.0);
            }
        }
    }
}
