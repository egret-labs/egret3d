"use strict";
// namespace examples {
//     export class MirroTest {
//         async start() {
//             // Load resource config.
//             await RES.loadConfig("default.res.json", "resource/");
//             //
//             await RES.getResAsync("shaders/reflector.shader.json");
//             //
//             await RES.getResAsync("textures/UV_Grid_Sm.jpg");
//             // Create camera.
//             egret3d.Camera.main;
//             const plane = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.PLANE, "Plane");
//             plane.renderer!.material = egret3d.Material.create(RES.getRes("shaders/reflector.shader.json"));
//             plane.renderer!.material!.setTexture(RES.getRes("textures/UV_Grid_Sm.jpg"));
//             plane.addComponent(behaviors.Reflector);
//             plane.transform.setLocalEuler(Math.PI * 0.5, 0.0, 0.0).setLocalScale(10.0, 10.0, 10.0);
//             // {
//             //     const plane = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.PLANE, "Plane");
//             //     plane.renderer!.material = egret3d.Material.create(egret3d.DefaultShaders.TRANSPARENT);
//             //     plane.renderer!.material!.opacity = 0.5;
//             // }
//             // const cubeA = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
//             // cubeA.name = "cubeA";
//             // cubeA.transform.setLocalPosition(0.0, 1.0, 0.0);
//         }
//     }
// } 
