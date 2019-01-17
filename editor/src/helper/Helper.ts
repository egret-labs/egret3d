namespace paper.editor {
    /**
     * @internal
     */
    export class Helper {

        public static raycastAll(targets: ReadonlyArray<paper.GameObject | egret3d.Transform>, mousePositionX: number, mousePositionY: number, backfaceCulling: boolean) {
            const camera = egret3d.Camera.editor;
            const ray = camera.createRayByScreen(mousePositionX, mousePositionY).release();
            const raycastInfos = egret3d.raycastAll(ray, targets, 0.0, paper.Layer.Everything, true, backfaceCulling);

            return raycastInfos;
        }
    }

    export function getQueryValues(uri: string): any {
        let match: RegExpExecArray | null;
        const pl = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s: string) { return decodeURIComponent(s.replace(pl, " ")); },
            query = uri.substring(1);
        const result: any = {};

        while (match = search.exec(query)) {
            const value = decode(match[2]);
            const numberValue = Number(value);

            if (numberValue === numberValue) {
                result[decode(match[1])] = numberValue;
            }
            else {
                result[decode(match[1])] = value;
            }
        }

        return result;
    }
}