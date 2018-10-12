namespace egret3d {
    const _helpVector3 = Vector3.create();
    /**
     * 提供默认的几何网格资源的快速访问方式，以及创建几何网格或几何网格实体的方法。
     */
    export class DefaultMeshes extends paper.SingletonComponent {
        public static QUAD: Mesh;
        public static QUAD_PARTICLE: Mesh;
        public static PLANE: Mesh;
        public static CUBE: Mesh;
        public static PYRAMID: Mesh;
        public static CONE: Mesh;
        public static CYLINDER: Mesh;
        public static TORUS: Mesh;
        public static SPHERE: Mesh;

        public static LINE_X: Mesh;
        public static LINE_Y: Mesh;
        public static LINE_Z: Mesh;
        public static CIRCLE_LINE: Mesh;
        public static CUBE_LINE: Mesh;

        public initialize() {
            super.initialize();
            // TODO 颜色切线，球体，更多类型。

            { // QUAD.
                const mesh = MeshBuilder.createPlane();
                mesh._isBuiltin = true;
                mesh.name = "builtin/quad.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.QUAD = mesh;
            }

            { // QUAD_PARTICLE.
                const mesh = MeshBuilder.createPlane(1.0, 1.0, -0.5, 0.0);
                mesh._isBuiltin = true;
                mesh.name = "builtin/quad_particle.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.QUAD_PARTICLE = mesh;
            }

            { // PLANE.
                const mesh = MeshBuilder.createPlane(10.0, 10.0);
                mesh._isBuiltin = true;
                mesh.name = "builtin/plane.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.PLANE = mesh;
            }

            { // CUBE.
                const mesh = DefaultMeshes.createCube();
                mesh._isBuiltin = true;
                mesh.name = "builtin/cube.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.CUBE = mesh;
            }

            { // PYRAMID.
                const mesh = DefaultMeshes.createCylinder(0.0, Math.sqrt(0.5), 1.0, 0.0, 0.0, 0.0, 4, 1, false, Math.PI * 0.25);
                mesh._isBuiltin = true;
                mesh.name = "builtin/pyramid.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.PYRAMID = mesh;
            }

            { // CONE.
                const mesh = DefaultMeshes.createCylinder(0.0, 0.5, 1.0, 0.0, 0.0, 0.0, 16, 1);
                mesh._isBuiltin = true;
                mesh.name = "builtin/cone.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.CONE = mesh;
            }

            { // CYLINDER.
                const mesh = DefaultMeshes.createCylinder();
                mesh._isBuiltin = true;
                mesh.name = "builtin/cylinder.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.CYLINDER = mesh;
            }

            { // TORUS.
                const mesh = DefaultMeshes.createTorus();
                mesh._isBuiltin = true;
                mesh.name = "builtin/torus.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.TORUS = mesh;
            }

            { // SPHERE.
                const mesh = DefaultMeshes.createSphere();
                mesh._isBuiltin = true;
                mesh.name = "builtin/sphere.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.SPHERE = mesh;
            }

            { // LINE_X.
                const mesh = new Mesh(4, 2, [gltf.MeshAttributeType.POSITION, gltf.MeshAttributeType.COLOR_0]);
                mesh._isBuiltin = true;
                mesh.name = "builtin/line_x.mesh.bin";
                mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines;
                paper.Asset.register(mesh);
                DefaultMeshes.LINE_X = mesh;
                mesh.setAttributes(gltf.MeshAttributeType.POSITION, [
                    0.0, 0.0, 0.0, // Line start.
                    1.0, 0.0, 0.0, // Line end.

                    0.0, 0.0, 0.0, // Point start.
                    1.0, 0.0, 0.0, // Point end.
                ]);
                mesh.setAttributes(gltf.MeshAttributeType.COLOR_0, [
                    1.0, 1.0, 1.0, 1.0,
                    1.0, 1.0, 1.0, 1.0,

                    1.0, 1.0, 1.0, 1.0,
                    1.0, 1.0, 1.0, 1.0,
                ]);
                mesh.setIndices([0, 1], 0);
            }

            { // LINE_Y.
                const mesh = new Mesh(4, 2, [gltf.MeshAttributeType.POSITION, gltf.MeshAttributeType.COLOR_0]);
                mesh._isBuiltin = true;
                mesh.name = "builtin/line_y.mesh.bin";
                mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines;
                paper.Asset.register(mesh);
                DefaultMeshes.LINE_Y = mesh;
                mesh.setAttributes(gltf.MeshAttributeType.POSITION, [
                    0.0, 0.0, 0.0, // Line start.
                    0.0, 1.0, 0.0, // Line end.

                    0.0, 0.0, 0.0, // Point start.
                    0.0, 1.0, 0.0, // Point end.
                ]);
                mesh.setAttributes(gltf.MeshAttributeType.COLOR_0, [
                    1.0, 1.0, 1.0, 1.0,
                    1.0, 1.0, 1.0, 1.0,

                    1.0, 1.0, 1.0, 1.0,
                    1.0, 1.0, 1.0, 1.0,
                ]);
                mesh.setIndices([0, 1], 0);
            }

            { // LINE_Z.
                const mesh = new Mesh(4, 2, [gltf.MeshAttributeType.POSITION, gltf.MeshAttributeType.COLOR_0]);
                mesh._isBuiltin = true;
                mesh.name = "builtin/line_z.mesh.bin";
                mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines;
                paper.Asset.register(mesh);
                DefaultMeshes.LINE_Z = mesh;
                mesh.setAttributes(gltf.MeshAttributeType.POSITION, [
                    0.0, 0.0, 0.0, // Line start.
                    0.0, 0.0, 1.0, // Line end.

                    0.0, 0.0, 0.0, // Point start.
                    0.0, 0.0, 1.0, // Point end.
                ]);
                mesh.setAttributes(gltf.MeshAttributeType.COLOR_0, [
                    1.0, 1.0, 1.0, 1.0,
                    1.0, 1.0, 1.0, 1.0,

                    1.0, 1.0, 1.0, 1.0,
                    1.0, 1.0, 1.0, 1.0,
                ]);
                mesh.setIndices([0, 1], 0);
            }

            { // CIRCLE_LINE
                const mesh = DefaultMeshes.createCircle();
                mesh._isBuiltin = true;
                mesh.name = "builtin/circle_line.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.CIRCLE_LINE = mesh;
            }

            { // CUBE_LINE
                const mesh = new Mesh(8, 24, [gltf.MeshAttributeType.POSITION, gltf.MeshAttributeType.COLOR_0]);
                mesh._isBuiltin = true;
                mesh.name = "builtin/cube_line.mesh.bin";
                mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines;
                paper.Asset.register(mesh);
                DefaultMeshes.CUBE_LINE = mesh;
                //
                mesh.setAttributes(gltf.MeshAttributeType.POSITION, [
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
                mesh.setAttributes(gltf.MeshAttributeType.COLOR_0, [
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
         * 创建带有指定网格资源的实体。
         * @param mesh 网格资源。
         * @param name 实体的名称。
         * @param tag 实体的标识。
         * @param scene 实体的场景。
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
                case this.CIRCLE_LINE:
                case this.CUBE_LINE:
                    renderer.material = DefaultMaterials.LINEDASHED_COLOR;
                    break;
            }

            return gameObject;
        }

        @paper.deprecated("1.4")
        public static createPlane(
            width: number = 1.0, height: number = 1.0,
            centerOffsetX: number = 0.0, centerOffsetY: number = 0.0,
            widthSegments: uint = 1, heightSegments: uint = 1,
        ) {
            return MeshBuilder.createPlane(width, height, centerOffsetX, centerOffsetY, widthSegments, heightSegments);
        }

        @paper.deprecated("1.4")
        public static createCube(
            width: number = 1.0, height: number = 1.0, depth: number = 1.0,
            centerOffsetX: number = 0.0, centerOffsetY: number = 0.0, centerOffsetZ: number = 0.0,
            widthSegments: uint = 1, heightSegments: uint = 1, depthSegments: uint = 1,
            differentFace: boolean = false
        ) {
            return MeshBuilder.createCube(width, height, depth, centerOffsetX, centerOffsetY, centerOffsetZ, widthSegments, heightSegments, depthSegments, differentFace);
        }

        @paper.deprecated("1.4")
        public static createCylinder(
            radiusTop: number = 0.5, radiusBottom: number = 0.5, height: number = 1.0,
            centerOffsetX: number = 0.0, centerOffsetY: number = 0.0, centerOffsetZ: number = 0.0,
            radialSegments: uint = 16, heightSegments: uint = 1,
            openEnded: boolean = false, thetaStart: number = 0.0, thetaLength: number = Math.PI * 2.0,
            differentFace: boolean = false
        ) {
            return MeshBuilder.createCylinder(radiusTop, radiusBottom, height,
                centerOffsetX, centerOffsetY, centerOffsetZ,
                radialSegments, heightSegments, openEnded, thetaStart, thetaLength, differentFace
            )
        }

        @paper.deprecated("1.4")
        public static createCircle(radius: number = 0.5, arc: number = 1.0, axis: 1 | 2 | 3 = 1) {
            return MeshBuilder.createCircle(radius, arc, axis)
        }

        @paper.deprecated("1.4")
        public static createTorus(radius: number = 0.5, tube: number = 0.1, radialSegments: number = 4, tubularSegments: number = 12, arc: number = 1.0, axis: 1 | 2 | 3 = 1) {
            return MeshBuilder.createTorus(radius, tube, radialSegments, tubularSegments, arc, axis);
        }

        @paper.deprecated("1.4")
        public static createSphere(
            radius: number = 0.5,
            centerOffsetX: number = 0.0, centerOffsetY: number = 0.0, centerOffsetZ: number = 0.0,
            widthSegments: uint = 24, heightSegments: uint = 12,
            phiStart: number = 0.0, phiLength: number = Math.PI * 2.0,
            thetaStart: number = 0.0, thetaLength: number = Math.PI
        ) {
            return MeshBuilder.createSphere(radius, centerOffsetX, centerOffsetY, centerOffsetZ,
                widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength
            )
        }
    }
}
