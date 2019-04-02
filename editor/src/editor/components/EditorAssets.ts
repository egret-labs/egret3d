namespace paper.editor {
    const _icons = {
        camera: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIcSURBVFhH7ZbPjtMwEMYj7vAACCFg28Rx4oQmtGnLQo/7Du1pK3Hk2BtSHwYkXoA34C34I7Fozxxoy+6yaocZx9M6u4WkFaA95JN+qu0Z21/riVOnVq1a/0oiaoMXPdlCBxpxG0xaNXlB+vHqIl7Utfo5Jl3LxU2uxpkmmjNp1RTEGfg4kZhOp/eRe8xwOHzqmnjSPXxnpjhBlIEIM5BRb40f96Ch2jCZTO6atGryVQeESjVmqCA/zGNy15/2xuv4xcuBK1N4KBNw445FZugauG/ndKr9GlJRYWBBxcn7LHveHAyOHtC4iJKLbQW0C0IlBRNemH6jTzpSQqouOFQ89iSdibLHcrKKbObYBqhGaC9qc/yaAdnKdMKjoLUe08QpvH7zFsp08fOyMI8N0DHRPqUGRJhXsWr112ME5SwWM73Jp5NTzecvFtg/+XqK0UsQ1vNvG+Ax6nN7bYBN8GPW0HVRZL44h+VqdW2cafcOYYUW9jZAAZb3uHiWxPcfZQae7Wdgmw7wYuEk5r8a8MPNBGa+OIMVGpBRfyu9rI/bL/+OAU/Sy2azOS06m81xgzItoRkmm3l7G2gGr7gwGR8LU+JbLAcvEQ29bIi8L4Li0bEBunR4TK9v2r81QCIDwiQSblwNzifYAMkNW+Dil6A2x/9ogGQvtg8HQn0wS2mxIY5LlV98pRqNRnfG4/HtXcD/CrfM9Fq1at1kOc4vVSG2+aaGzOwAAAAASUVORK5CYII=",
        light: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAPcSURBVFhH3ZdLSNRRFMbn4fuZmtmYZpn0gCx6YbQokBZRq6hVL6xWUdCmICIoIYjaWBDRu3WShhUJLSKIIKISgqBWao9NlIsUwlKn33fnzDij/1HHsU0fHM693z333HPOffxnfNNBMBjcgRpCVjjiX6GwsHAJKhDpjYIAdqLCyEpHxKG8vLwgJyen2rrTR25uboPf7/+Ns31GxTBRAJmZmc2BQKC/rKys0qhpAz+Bt8inUCiUZ5xDsgAIeh5BDzCnzaj0kJ2d3YjDcFZW1imjHJIFkJGRcQf7waKiojqj0gdOH5DRz7y8vLlGeQZA6Vex+DBjLUalhtLS0iJrJoDsl+os4PiGUVqsHu48zVCEcYE+JdAfZF9qVAKS+XfgoM1nch+LnK2oqMg3OgYWvIhcsu44VFVV5RLAXYI9alQMBQUFsxm7prPk5dtBhwejdu03hr04Uonj4TftKy4ursVmP/bH0LvZmlgVQMwOBDlDh/D53bbmWklJSbGNeYMJW3D6kWaYBZ4Q/bLIiM+nM8BYG85G6Gr/ndD/owy5doWyE6joBmzf0Ayz8EsSXBsZmRqycHgCx/1MPieCyKtpdyNhgnTCluh2hHGuIFS519EgsGul/w27g3THPWRTAoemyg6OH2fPtLgWoz9OqI4CUNVu0Ve1QmxVidppgywaUUkXjwplVyWGsF9If+ZA5i3Knuw8F46KApCmEkfQKaEH+ewhWxG9xw+13zQnFJ0DBYl2DxHzDqO8/D5HRsGEVuTeWGFovcZx1D6VAKJVQl+gr8pt9/KLXNb4lIGjMzpgkwWhmyGN3V70zMHeguGJDqECtEP4k9M/Cy59cMe3ktUCtcnqKs7D+fn5bq+hEhYXrzZzjqN1DdcQcIPaKcOe2g6aKqfbr5qamhy4TnHKVA+QSh4V8ez/dbR7iml3Eugw+ibBzRE3KfRBYb+bmfhLwuLNY36IBFn4KGO6NfEVeI/tLhlEoS8ivq5gO8R4H4HoagYjox7AwXIMu5mgTDrIqtaGHOwTG31S/aoSduv0RBvnqhT/PRDYitX4fUFTt6NL35PIyBhoIkE8J8NtRiWAxR4x/tS642DV+4BcNCoefhJqYv5j2ql/F5i8GaV9PxlhXECbUM+QRY4AcLep4CC/pBcbNSMIUsIupFdZGuf5k4xTX0kAAwRy36j0QdkO6Fyg9xjl4BWAwOKnUSPcFFUoPegPBpl/RV7RTdi7ZAHoJxf2Xxh/TXd6vwOiIOt6HPWQzUajYkgWgMC8JsbfJT3xqaCuri7bmgmYKACgzDMizX+EuFswc39A/kfE/0RPAp/vL7M1A0/aWSCCAAAAAElFTkSuQmCC"
    };
    /**
     * @internal
     */
    @singleton
    export class EditorAssets extends Component {
        public static SKELETON_MESH: egret3d.Mesh;
        public static CIRCLE_LINE_HALF: egret3d.Mesh;
        public static JOINT_MESH: egret3d.Mesh;

        public static CAMERA_ICON: egret3d.Texture;
        public static LIGHT_ICON: egret3d.Texture;

        public static HOVER_MATERIAL: egret3d.Material;
        public static SELECTED_MATERIAL: egret3d.Material;
        public static COLLIDER_MATERIAL: egret3d.Material;
        public static SELECT_MATERIAL: egret3d.Material;
        public static SKELETON_MATERIAL: egret3d.Material;
        public static JOINT_LINE_MATERIAL: egret3d.Material;
        public static JOINT_POINT_MATERIAL: egret3d.Material;

        /**专门为编辑器写的API，解决再调用纹理时纹理尚未加载完毕的问题 */
        public static async initializeForEditor(): Promise<void> {
            return new Promise<void>((resolve) => {
                let mapList = [
                    { target: "CAMERA_ICON", img: _icons.camera },
                    { target: "LIGHT_ICON", img: _icons.light },
                ]
                let index = 0;
                let loadNext = () => {
                    if (index < mapList.length) {
                        const image = new Image();
                        image.src = mapList[index].img;
                        image.onload = () => {
                            const texture = egret3d.Texture.create({
                                source: image
                            }).setLiner(true).setRepeat(false).setMipmap(false);
                            (EditorAssets as any)[mapList[index].target] = texture;

                            index++;
                            loadNext()
                        };
                    }
                    else {
                        resolve();
                    }
                }
                loadNext();
            })
        }

        public initialize() {
            super.initialize();

            EditorAssets.SKELETON_MESH = egret3d.Mesh.create(1024, 0, [gltf.AttributeSemantics.POSITION]);
            EditorAssets.SKELETON_MESH.drawMode = gltf.DrawMode.Dynamic;
            EditorAssets.SKELETON_MESH.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.LineStrip;

            EditorAssets.CIRCLE_LINE_HALF = egret3d.MeshBuilder.createCircle(0.5, 0.5);

            {
                const mesh = EditorAssets.JOINT_MESH = egret3d.Mesh.create(2, 2, [gltf.AttributeSemantics.POSITION]);
                mesh.name = "editor/joint.mesh.bin";
                mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines;
                mesh.setAttributes(gltf.AttributeSemantics.POSITION, [
                    0.0, 0.0, 0.0,
                    0.0, 0.0, 1.0,
                ]);
                mesh.setIndices([0, 1], 0);
                mesh.setIndices([0, 1], mesh.addSubMesh(2, 1, gltf.MeshPrimitiveMode.Points));
            }

            {
                if (!EditorAssets.CAMERA_ICON) {
                    const image = new Image();
                    image.src = _icons.camera;
                    image.onload = () => {
                        const texture = egret3d.Texture.create({
                            source: image
                        }).setLiner(true).setRepeat(false).setMipmap(false);
                        EditorAssets.CAMERA_ICON = texture;
                    };
                }
            }

            {
                if (!EditorAssets.LIGHT_ICON) {
                    const image = new Image();
                    image.src = _icons.light;
                    image.onload = () => {
                        const texture = egret3d.Texture.create({
                            source: image
                        }).setLiner(true).setRepeat(false).setMipmap(false);
                        EditorAssets.LIGHT_ICON = texture;
                    };
                }
            }

            EditorAssets.HOVER_MATERIAL = egret3d.Material.create("editor/hover.mat.json", egret3d.DefaultShaders.LINEDASHED)
                .setBlend(egret3d.BlendMode.Normal, egret3d.RenderQueue.Blend, 0.6)
                .setColor(egret3d.Color.WHITE);

            EditorAssets.SELECTED_MATERIAL = egret3d.Material.create("editor/selected.mat.json", egret3d.DefaultShaders.LINEDASHED)
                .setBlend(egret3d.BlendMode.Normal, egret3d.RenderQueue.Blend, 0.8)
                .setColor(egret3d.Color.INDIGO);

            EditorAssets.COLLIDER_MATERIAL = egret3d.Material.create("editor/collider.mat.json", egret3d.DefaultShaders.LINEDASHED)
                .setBlend(egret3d.BlendMode.Normal, egret3d.RenderQueue.Blend, 0.6)
                .setColor(egret3d.Color.YELLOW);

            EditorAssets.SELECT_MATERIAL = egret3d.Material.create("editor/select.mat.json", egret3d.DefaultShaders.MESH_BASIC)
                .setBlend(egret3d.BlendMode.Normal, egret3d.RenderQueue.Overlay, 0.4)
                .setColor(egret3d.Color.INDIGO)
                .setDepth(false, false);

            EditorAssets.SKELETON_MATERIAL = egret3d.Material.create("editor/skeleton.mat.json", egret3d.DefaultShaders.LINEDASHED)
                .setBlend(egret3d.BlendMode.Normal, egret3d.RenderQueue.Overlay, 0.6)
                .setColor(egret3d.Color.YELLOW)
                .setDepth(false, false);

            EditorAssets.JOINT_LINE_MATERIAL = egret3d.Material.create("editor/joint_line.mat.json", egret3d.DefaultShaders.LINEDASHED)
                .setBlend(egret3d.BlendMode.Normal, egret3d.RenderQueue.Overlay, 0.6)
                .setColor(egret3d.Color.PURPLE)
                .setDepth(false, false);

            EditorAssets.JOINT_POINT_MATERIAL = egret3d.Material.create("editor/joint_point.mat.json", egret3d.DefaultShaders.POINTS)
                .setBlend(egret3d.BlendMode.Normal, egret3d.RenderQueue.Overlay, 0.6)
                .setColor(egret3d.Color.PURPLE)
                .setFloat(egret3d.ShaderUniformName.Size, 4.0)
                .setDepth(false, false);
        }
    }
}
