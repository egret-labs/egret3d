// namespace egret3d {
//     /**
//      * 
//      */
//     export class DrawCalls extends paper.SingletonComponent {
//         /**
//          * 
//          */
//         public readonly renderers: paper.BaseRenderer[] = [];
//         /**
//          * 
//          */
//         public readonly drawCalls: DrawCall[] = [];
//         /**
//          * 
//          */
//         public readonly shadowCasterDrawCalls: DrawCall[] = [];
//         /**
//          * 
//          */
//         public updateZDist(camera: Camera) {
//             // TODO 更新计算物体的zdist，如果是不透明物体，统一设置为 -1
//         }
//         /**
//          * 
//          */
//         public sort() {
//             Pool.drawCall.instances.sort(function (a, b) {
//                 if (a.material.renderQueue === b.material.renderQueue) {
//                     return b.zdist - a.zdist; // 从远至近画
//                 }
//                 else {
//                     return a.material.renderQueue - b.material.renderQueue;
//                 }
//             });
//         }
//         /**
//          * 
//          */
//         public updateDrawCalls(
//             renderer: paper.BaseRenderer,
//             createDrawCalls: () => (DrawCall[] | null)
//         ) {
//             this.removeDrawCalls(renderer);
//             createDrawCalls();
//         }

//         public updateShadowCasters(renderer: paper.BaseRenderer, castShadows: boolean) {
//             const index = this.renderers.indexOf(renderer);
//             if (index < 0) {
//                 return;
//             }

//             const drawCalls = this._drawCalls[gameObject.uuid];
//             if (castShadows) {
//                 for (const drawCall of drawCalls) {
//                     Pool.shadowCaster.add(drawCall);
//                 }
//             }
//             else {
//                 for (const drawCall of drawCalls) {
//                     Pool.shadowCaster.remove(drawCall);
//                 }
//             }

//         }

//         public removeDrawCalls(renderer: paper.BaseRenderer) {
//             const index = this.renderers.indexOf(renderer);
//             if (index < 0) {
//                 return;
//             }

//             let i = this.drawCalls.length;
//             while (i--) {
//                 if (this.drawCalls[i].renderer === renderer) {
//                     this.drawCalls.splice(i, 1);
//                 }
//             }

//             i = this.shadowCasterDrawCalls.length;
//             while (i--) {
//                 if (this.shadowCasterDrawCalls[i].renderer === renderer) {
//                     this.shadowCasterDrawCalls.splice(i, 1);
//                 }
//             }

//             this.drawCalls.splice(index, 1);
//         }

//         public getDrawCalls(renderer: paper.BaseRenderer): DrawCall[] | null {
//             if (this.renderers.indexOf(renderer) < 0) {
//                 return null;
//             }

//             this.drawCalls.filter(drawCall => drawCall.renderer === renderer);
//         }
//     }
// }