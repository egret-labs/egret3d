"use strict";
// namespace examples {
//     export class ResourceTest extends BaseExample {
//         async start() {
//             // Load resource config.
//             await RES.loadConfig("default.res.json", "http://10.1.2.34:8000/resource/");
//             // Create camera.
//             egret3d.Camera.main;
//             paper.GameObject.globalGameObject.addComponent(TestA);
//         }
//     }
//     class TestA extends paper.Behaviour {
//         onUpdate() {
//             if (egret3d.inputCollecter.defaultPointer.isUp(egret3d.PointerButtonsType.TouchContact)) {
//                 this.loadGroup();
//             }
//         }
//         async loadGroup() {
//             await RES.loadGroup("test").catch((e) => {
//                 Promise.reject(e);
//             });
//             const cubeA = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE);
//             cubeA.transform.setLocalPosition(Math.random() * 2.0, Math.random() * 2.0, Math.random() * 2.0);
//         }
//     }
// } 
