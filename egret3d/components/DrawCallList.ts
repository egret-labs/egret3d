namespace egret3d {
    /**
     * @private
     * draw call type
     */
    export type DrawCall = {
        subMeshInfo: number,
        mesh: Mesh,
        material: Material,
        lightMapIndex: number,
        lightMapScaleOffset?: Readonly<Vector4>,
        boneData: Float32Array | null,
        gameObject: paper.GameObject,
        transform: Transform,
        frustumTest: boolean,
        zdist: number
    };
    /**
     * @private
     */
    export class DrawCallList {
        // 更新 zdist
        public static updateZdist(camera: Camera): void {
            // TODO 更新计算物体的zdist，如果是不透明物体，统一设置为 -1
        }

        // 渲染排序
        public static sort() {
            Pool.drawCall.instances.sort(function (a, b) {
                if (a.material.renderQueue === b.material.renderQueue) {
                    return b.zdist - a.zdist; // 从远至近画
                }
                else {
                    return a.material.renderQueue - b.material.renderQueue;
                }
            });
        }

        private readonly _drawCalls: { [k: string]: DrawCall[] } = {};
        private readonly _createDrawCalls: (gameObject: paper.GameObject) => DrawCall[] | null;

        public constructor(createDrawCalls: (gameObject: paper.GameObject) => DrawCall[] | null) {
            this._createDrawCalls = createDrawCalls;
        }

        public updateDrawCalls(gameObject: paper.GameObject, castShadows: boolean) {
            this.removeDrawCalls(gameObject);

            const drawCalls = this._createDrawCalls(gameObject);
            if (drawCalls) {
                this._drawCalls[gameObject.hashCode] = drawCalls;
                Pool.drawCall.add(drawCalls);

                if (castShadows) {
                    Pool.shadowCaster.add(drawCalls);
                }
            }
        }

        public updateShadowCasters(gameObject: paper.GameObject, castShadows: boolean) {
            if (gameObject.hashCode in this._drawCalls) {
                const drawCalls = this._drawCalls[gameObject.hashCode];
                if (castShadows) {
                    for (const drawCall of drawCalls) {
                        Pool.shadowCaster.add(drawCall);
                    }
                }
                else {
                    for (const drawCall of drawCalls) {
                        Pool.shadowCaster.remove(drawCall);
                    }
                }
            }
        }

        public removeDrawCalls(gameObject: paper.GameObject) {
            if (gameObject.hashCode in this._drawCalls) {
                const drawCalls = this._drawCalls[gameObject.hashCode];
                Pool.drawCall.remove(drawCalls);
                Pool.shadowCaster.remove(drawCalls);
                delete this._drawCalls[gameObject.hashCode];
            }
        }

        public getDrawCalls(gameObject: paper.GameObject): DrawCall[] | null {
            if (gameObject.hashCode in this._drawCalls) {
                return this._drawCalls[gameObject.hashCode];
            }

            return null;
        }
    }
}