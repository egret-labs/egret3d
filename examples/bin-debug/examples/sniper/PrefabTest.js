"use strict";
// namespace examples.sniper {
//     export class PrefabTest extends BaseExample {
//         async start() {
//             // Load resource config.
//             await RES.loadConfig("default.res.json", "resource/sniper/");
//             // Load prefab resource.
//             await RES.getResAsync("Assets/Prefab/Other/man01.prefab.json");
//             // Create prefab.
//             const gameObject = paper.Prefab.create("Assets/Prefab/Other/man01.prefab.json")!;
//             //
//             gameObject.addComponent(behaviors.AnimationHelper);
//             //
//             egret3d.Camera.main.gameObject.addComponent(behaviors.RotateComponent);
//             { // Create light.
//                 const gameObject = paper.GameObject.create("Light");
//                 gameObject.transform.setLocalPosition(1.0, 10.0, -1.0);
//                 gameObject.transform.lookAt(egret3d.Vector3.ZERO);
//                 const light = gameObject.addComponent(egret3d.DirectionalLight);
//                 light.intensity = 0.5;
//             }
//         }
//     }
// } 
