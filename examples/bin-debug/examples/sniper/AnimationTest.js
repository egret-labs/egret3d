"use strict";
// namespace examples.sniper {
//     export class AnimationTest extends BaseExample {
//         async start() {
//             // Load resource config.
//             await RES.loadConfig("default.res.json", "resource/sniper/");
//             // Load prefab resource.
//             await RES.getResAsync("Assets/Prefab/Actor/female1.prefab.json");
//             // Create camera.
//             egret3d.Camera.main;
//             { // Create light.
//                 const gameObject = paper.GameObject.create("Light");
//                 gameObject.transform.setLocalPosition(1.0, 10.0, -1.0);
//                 gameObject.transform.lookAt(egret3d.Vector3.ZERO);
//                 const light = gameObject.addComponent(egret3d.DirectionalLight);
//                 light.intensity = 0.5;
//             }
//             // Create prefab.
//             const gameObject = paper.Prefab.create("Assets/Prefab/Actor/female1.prefab.json")!;
//             gameObject.getComponentInChildren(egret3d.SkinnedMeshRenderer)!.material = egret3d.DefaultMaterials.MESH_LAMBERT;
//             //
//             gameObject.addComponent(behaviors.AnimationHelper);
//             gameObject.addComponent(behaviors.AnimationHelper);
//             //
//             egret3d.Camera.main.gameObject.addComponent(behaviors.RotateComponent);
//         }
//     }
// } 
