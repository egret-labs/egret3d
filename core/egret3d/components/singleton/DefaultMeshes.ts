namespace egret3d {
    /**
     * 默认的网格资源。
     */
    @paper.singleton
    export class DefaultMeshes extends paper.BaseComponent {
        /**
         * 一个三角形网格。
         */
        public static TRIANGLE: Mesh;
        /**
         * 一个正方形网格。
         */
        public static QUAD: Mesh;
        /**
         * 一个正方形网格。
         * - 坐标系原点在其中的一边中点上。
         */
        public static QUAD_PARTICLE: Mesh;
        /**
         * 一个平面网格。
         */
        public static PLANE: Mesh;
        /**
         * 一个正方体网格。
         */
        public static CUBE: Mesh;
        /**
         * 一个金字塔网格。
         */
        public static PYRAMID: Mesh;
        /**
         * 一个圆锥体网格。
         */
        public static CONE: Mesh;
        /**
         * 一个圆柱体网格。
         */
        public static CYLINDER: Mesh;
        /**
         * 一个圆环体网格。
         */
        public static TORUS: Mesh;
        /**
         * 一个球体网格。
         */
        public static SPHERE: Mesh;
        /**
         * 渲染精灵使用的网格。
         */
        public static SPRITE: Mesh;

        public static LINE_X: Mesh;
        public static LINE_Y: Mesh;
        public static LINE_Z: Mesh;
        public static CIRCLE_LINE: Mesh;
        public static CUBE_LINE: Mesh;
        /**
         * 后期渲染使用的网格。
         * @internal
         */
        public static POSTPROCESSING_QUAD: Mesh;
        /**
         * 
         */
        public static FULLSCREEN:Mesh;

        public initialize() {
            super.initialize();
            // TODO 颜色，更多类型。

            const attributesA = [gltf.AttributeSemantics.POSITION, gltf.AttributeSemantics.COLOR_0];

            { // TRIANGLE.
                const mesh = Mesh.create(3, 0, attributesA);
                mesh.name = "builtin/triangle.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.TRIANGLE = mesh;

                mesh.setAttributes(gltf.AttributeSemantics.POSITION, [
                    0.0, 0.5, 0.0,
                    -0.5, -0.5, 0.0,
                    0.5, -0.5, 0.0,
                ]);
                mesh.setAttributes(gltf.AttributeSemantics.COLOR_0, [
                    1.0, 1.0, 1.0, 1.0,
                    1.0, 1.0, 1.0, 1.0,
                    1.0, 1.0, 1.0, 1.0,
                ]);
            }

            { // QUAD.
                const mesh = MeshBuilder.createPlane();
                mesh.name = "builtin/quad.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.QUAD = mesh;
            }

            { // QUAD_PARTICLE.
                const mesh = MeshBuilder.createPlane(1.0, 1.0, -0.5, 0.0);
                mesh.name = "builtin/quad_particle.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.QUAD_PARTICLE = mesh;
            }

            { // SPRITE.
                const mesh = MeshBuilder.createPlane();
                mesh.name = "builtin/sprite.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.SPRITE = mesh;
            }

            { // POSTPROCESSING_QUAD.
                const mesh = MeshBuilder.createPlane(2.0, 2.0);
                mesh.name = "builtin/postprocessing_quad.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.POSTPROCESSING_QUAD = mesh;

                // 后期渲染专用，UV 反转一下，这样 shader 中就不用反转。
                const uvs = mesh.getUVs()!;
                for (let i = 1, l = uvs.length; i < l; i += 2) {
                    uvs[i] = 1.0 - uvs[i];
                }
            }

            { // FULLSCREEN_QUAD.
                const mesh = MeshBuilder.createPlane(2.0, 2.0);
                mesh.name = "builtin/fullscreen_quad.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.FULLSCREEN = mesh;
            }

            { // PLANE.
                const mesh = MeshBuilder.createPlane(10.0, 10.0);
                mesh.name = "builtin/plane.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.PLANE = mesh;
            }

            { // CUBE.
                const mesh = MeshBuilder.createCube();
                mesh.name = "builtin/cube.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.CUBE = mesh;
            }

            { // PYRAMID.
                const mesh = MeshBuilder.createCylinder(0.0, Math.sqrt(0.5), 1.0, 0.0, 0.0, 0.0, 4, 1, false, Const.PI_QUARTER);
                mesh.name = "builtin/pyramid.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.PYRAMID = mesh;
            }

            { // CONE.
                const mesh = MeshBuilder.createCylinder(0.0, 0.5, 1.0, 0.0, 0.0, 0.0, 10, 1);
                mesh.name = "builtin/cone.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.CONE = mesh;
            }

            { // CYLINDER.
                const mesh = MeshBuilder.createCylinder();
                mesh.name = "builtin/cylinder.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.CYLINDER = mesh;
            }

            { // TORUS.
                const mesh = MeshBuilder.createTorus();
                mesh.name = "builtin/torus.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.TORUS = mesh;
            }

            { // SPHERE.
                const mesh = MeshBuilder.createSphere();
                mesh.name = "builtin/sphere.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.SPHERE = mesh;
            }

            { // LINE_X.
                const mesh = Mesh.create(4, 2, attributesA);
                mesh.name = "builtin/line_x.mesh.bin";
                mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines;
                paper.Asset.register(mesh);
                DefaultMeshes.LINE_X = mesh;
                mesh.setAttributes(gltf.AttributeSemantics.POSITION, [
                    0.0, 0.0, 0.0, // Line start.
                    1.0, 0.0, 0.0, // Line end.

                    0.0, 0.0, 0.0, // Point start.
                    1.0, 0.0, 0.0, // Point end.
                ]);
                mesh.setAttributes(gltf.AttributeSemantics.COLOR_0, [
                    1.0, 1.0, 1.0, 1.0,
                    1.0, 1.0, 1.0, 1.0,

                    1.0, 1.0, 1.0, 1.0,
                    1.0, 1.0, 1.0, 1.0,
                ]);
                mesh.setIndices([0, 1], 0);
            }

            { // LINE_Y.
                const mesh = Mesh.create(4, 2, attributesA);
                mesh.name = "builtin/line_y.mesh.bin";
                mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines;
                paper.Asset.register(mesh);
                DefaultMeshes.LINE_Y = mesh;
                mesh.setAttributes(gltf.AttributeSemantics.POSITION, [
                    0.0, 0.0, 0.0, // Line start.
                    0.0, 1.0, 0.0, // Line end.

                    0.0, 0.0, 0.0, // Point start.
                    0.0, 1.0, 0.0, // Point end.
                ]);
                mesh.setAttributes(gltf.AttributeSemantics.COLOR_0, [
                    1.0, 1.0, 1.0, 1.0,
                    1.0, 1.0, 1.0, 1.0,

                    1.0, 1.0, 1.0, 1.0,
                    1.0, 1.0, 1.0, 1.0,
                ]);
                mesh.setIndices([0, 1], 0);
            }

            { // LINE_Z.
                const mesh = Mesh.create(4, 2, attributesA);
                mesh.name = "builtin/line_z.mesh.bin";
                mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines;
                paper.Asset.register(mesh);
                DefaultMeshes.LINE_Z = mesh;
                mesh.setAttributes(gltf.AttributeSemantics.POSITION, [
                    0.0, 0.0, 0.0, // Line start.
                    0.0, 0.0, 1.0, // Line end.

                    0.0, 0.0, 0.0, // Point start.
                    0.0, 0.0, 1.0, // Point end.
                ]);
                mesh.setAttributes(gltf.AttributeSemantics.COLOR_0, [
                    1.0, 1.0, 1.0, 1.0,
                    1.0, 1.0, 1.0, 1.0,

                    1.0, 1.0, 1.0, 1.0,
                    1.0, 1.0, 1.0, 1.0,
                ]);
                mesh.setIndices([0, 1], 0);
            }

            { // CIRCLE_LINE
                const mesh = MeshBuilder.createCircle();
                mesh.name = "builtin/circle_line.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.CIRCLE_LINE = mesh;
            }

            { // CUBE_LINE
                const mesh = Mesh.create(8, 24, attributesA);
                mesh.name = "builtin/cube_line.mesh.bin";
                mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines;
                paper.Asset.register(mesh);
                DefaultMeshes.CUBE_LINE = mesh;
                //
                mesh.setAttributes(gltf.AttributeSemantics.POSITION, [
                    // Z-
                    -0.5, 0.5, -0.5,
                    0.5, 0.5, -0.5,
                    0.5, -0.5, -0.5,
                    -0.5, -0.5, -0.5,

                    // Z+
                    0.5, 0.5, 0.5,
                    0.5, -0.5, 0.5,
                    -0.5, -0.5, 0.5,
                    -0.5, 0.5, 0.5,
                ]);
                mesh.setAttributes(gltf.AttributeSemantics.COLOR_0, [
                    1, 1, 1, 1,
                    1, 1, 1, 1,
                    1, 1, 1, 1,
                    1, 1, 1, 1,

                    1, 1, 1, 1,
                    1, 1, 1, 1,
                    1, 1, 1, 1,
                    1, 1, 1, 1,
                ]);
                mesh.setIndices([
                    0, 1, 1, 2, 2, 3, 3, 0,
                    4, 5, 5, 6, 6, 7, 7, 4,
                    0, 7, 1, 4, 2, 5, 3, 6,
                ]);
            }
        }

        /**
         * @deprecated
         */
        public static createObject(mesh: Mesh, name?: string, tag?: string, scene?: paper.Scene) {
            const gameObject = paper.GameObject.create(name, tag, scene);
            const meshFilter = gameObject.addComponent(MeshFilter);
            const renderer = gameObject.addComponent(MeshRenderer);
            meshFilter.mesh = mesh;

            switch (mesh) {
                case this.QUAD:
                case this.QUAD_PARTICLE:
                case this.PLANE:
                    renderer.material = DefaultMaterials.MESH_BASIC_DOUBLESIDE;

                    break;
                case this.LINE_X:
                case this.LINE_Y:
                case this.LINE_Z:
                    renderer.material = DefaultMaterials.LINEDASHED_COLOR;
                    break;

                case this.CIRCLE_LINE:
                case this.CUBE_LINE:
                    renderer.material = DefaultMaterials.LINEDASHED;
                    break;
            }

            return gameObject;
        }
    }
}
