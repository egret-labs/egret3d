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
        /**
         * 创建平面网格。
         * @param width 宽度。
         * @param height 高度。
         * @param centerOffsetX 中心点偏移 X。
         * @param centerOffsetY 中心点偏移 Y。
         * @param widthSegments 宽度分段。
         * @param heightSegments 高度分段。
         */
        @paper.deprecated("1.4")
        public static createPlane(
            width: number = 1.0, height: number = 1.0,
            centerOffsetX: number = 0.0, centerOffsetY: number = 0.0,
            widthSegments: uint = 1, heightSegments: uint = 1,
        ) {
            return MeshBuilder.createPlane(width, height, centerOffsetX, centerOffsetY, widthSegments, heightSegments);
        }
        /**
         * 创建立方体网格。
         * @param width 宽度。
         * @param height 高度。
         * @param depth 深度。
         * @param centerOffsetX 中心点偏移 X。
         * @param centerOffsetY 中心点偏移 Y。
         * @param centerOffsetZ 中心点偏移 Z。
         * @param widthSegments 宽度分段。
         * @param heightSegments 高度分段。
         * @param depthSegments 深度分段。
         * @param differentFace 是否使用不同材质。
         */
        @paper.deprecated("1.4")
        public static createCube(
            width: number = 1.0, height: number = 1.0, depth: number = 1.0,
            centerOffsetX: number = 0.0, centerOffsetY: number = 0.0, centerOffsetZ: number = 0.0,
            widthSegments: uint = 1, heightSegments: uint = 1, depthSegments: uint = 1,
            differentFace: boolean = false
        ) {
            return MeshBuilder.createCube(width, height, depth, centerOffsetX, centerOffsetY, centerOffsetZ, widthSegments, heightSegments, depthSegments, differentFace);
        }
        /**
         * 创建圆柱体网格。
         * @param radiusTop 顶部半径。
         * @param radiusBottom 底部半径。
         * @param height 高度。
         * @param centerOffsetX 中心点偏移 X。
         * @param centerOffsetY 中心点偏移 Y。
         * @param centerOffsetZ 中心点偏移 Z。
         * @param radialSegments 径向分段。
         * @param heightSegments 高度分段。
         * @param openEnded 是否开口。
         * @param thetaStart 起始弧度。
         * @param thetaLength 覆盖弧度。
         * @param differentFace 是否使用不同材质。
         */
        public static createCylinder(
            radiusTop: number = 0.5, radiusBottom: number = 0.5, height: number = 1.0,
            centerOffsetX: number = 0.0, centerOffsetY: number = 0.0, centerOffsetZ: number = 0.0,
            radialSegments: uint = 16, heightSegments: uint = 1,
            openEnded: boolean = false, thetaStart: number = 0.0, thetaLength: number = Math.PI * 2.0,
            differentFace: boolean = false
        ) {
            // buffers
            const indices = [] as number[];
            const vertices = [] as number[];
            const normals = [] as number[];
            const uvs = [] as number[];

            // helper variables
            let index = 0;
            let groupStart = 0;
            const halfHeight = height / 2;
            const vector3 = _helpVector3;
            const indexArray = [] as number[][];
            const subIndices = [] as number[];

            // generate geometry
            generateTorso();

            if (openEnded === false) {
                if (radiusTop > 0.0) generateCap(true);
                if (radiusBottom > 0.0) generateCap(false);
            }

            // build geometry
            if (differentFace) {
                const mesh = Mesh.create(vertices.length / 3, 0);
                mesh.setAttributes(gltf.MeshAttributeType.POSITION, vertices);
                mesh.setAttributes(gltf.MeshAttributeType.NORMAL, normals);
                mesh.setAttributes(gltf.MeshAttributeType.TEXCOORD_0, uvs);

                for (let i = 0; i < subIndices.length; i += 3) {
                    mesh.addSubMesh(subIndices[1], subIndices[2]);
                    mesh.setIndices(indices, i, subIndices[0]);
                }

                return mesh;
            }
            else {
                const mesh = Mesh.create(vertices.length / 3, indices.length);
                mesh.setAttributes(gltf.MeshAttributeType.POSITION, vertices);
                mesh.setAttributes(gltf.MeshAttributeType.NORMAL, normals);
                mesh.setAttributes(gltf.MeshAttributeType.TEXCOORD_0, uvs);
                mesh.setIndices(indices);

                return mesh;
            }

            function generateTorso() {
                let groupCount = 0;

                // this will be used to calculate the normal
                const slope = (radiusBottom - radiusTop) / height;

                // generate vertices, normals and uvs
                for (let iY = 0; iY <= heightSegments; iY++) {
                    const indexRow = [];
                    const v = iY / heightSegments;
                    // calculate the radius of the current row
                    const radius = v * (radiusBottom - radiusTop) + radiusTop;

                    for (let iX = 0; iX <= radialSegments; iX++) {
                        const u = iX / radialSegments;
                        const theta = u * thetaLength + thetaStart;
                        const sinTheta = Math.sin(theta);
                        const cosTheta = -Math.cos(theta);

                        // vertex
                        vector3.x = radius * sinTheta;
                        vector3.y = -v * height + halfHeight;
                        vector3.z = radius * cosTheta;
                        vertices.push(vector3.x + centerOffsetX, vector3.y + centerOffsetY, vector3.z + centerOffsetZ);

                        // normal
                        vector3.set(sinTheta, slope, cosTheta).normalize();
                        normals.push(vector3.x, vector3.y, vector3.z);

                        // uv
                        uvs.push(u, v);

                        // save index of vertex in respective row
                        indexRow.push(index++);
                    }

                    // now save vertices of the row in our index array
                    indexArray.push(indexRow);
                }

                // generate indices
                for (let iX = 0; iX < radialSegments; iX++) {
                    for (let iY = 0; iY < heightSegments; iY++) {
                        // we use the index array to access the correct indices
                        const a = indexArray[iY][iX];
                        const b = indexArray[iY + 1][iX];
                        const c = indexArray[iY + 1][iX + 1];
                        const d = indexArray[iY][iX + 1];

                        // faces
                        // a - d
                        // | / |
                        // b - c
                        indices.push(
                            a, b, d,
                            b, c, d
                        );

                        // update group counter
                        groupCount += 6;
                    }
                }

                // add a group to the geometry. this will ensure multi material support
                subIndices.push(groupStart, groupCount, 0);
                // calculate new start value for groups
                groupStart += groupCount;
            }

            function generateCap(top: boolean) {
                let centerIndexStart = 0, centerIndexEnd = 0;
                let groupCount = 0;
                const radius = top ? radiusTop : radiusBottom;
                const sign = top ? 1 : - 1;

                // save the index of the first center vertex
                centerIndexStart = index;

                // first we generate the center vertex data of the cap.
                // because the geometry needs one set of uvs per face,
                // we must generate a center vertex per face/segment
                for (let iX = 1; iX <= radialSegments; iX++) {
                    // vertex
                    vertices.push(0.0, halfHeight * sign, 0.0);

                    // normal
                    normals.push(0.0, sign, 0.0);

                    // uv
                    uvs.push(0.5, 0.5);

                    // increase index
                    index++;
                }

                // save the index of the last center vertex
                centerIndexEnd = index;

                // now we generate the surrounding vertices, normals and uvs
                for (let iX = 0; iX <= radialSegments; iX++) {
                    const u = iX / radialSegments;
                    const theta = u * thetaLength + thetaStart;
                    const cosTheta = Math.cos(theta);
                    const sinTheta = Math.sin(theta);

                    // vertex
                    vector3.x = radius * sinTheta;
                    vector3.y = halfHeight * sign;
                    // vector3.z = radius * cosTheta; // Right-hand coordinates system.
                    vector3.z = -radius * cosTheta; // Left-hand coordinates system.
                    vertices.push(vector3.x + centerOffsetX, vector3.y + centerOffsetY, vector3.z + centerOffsetZ);

                    // normal
                    normals.push(0.0, sign, 0.0);

                    // uv
                    uvs.push(
                        (sinTheta * 0.5 * sign) + 0.5,
                        (cosTheta * 0.5) + 0.5
                    );

                    // increase index
                    index++;
                }

                // generate indices
                for (let iX = 0; iX < radialSegments; iX++) {
                    const c = centerIndexStart + iX;
                    const i = centerIndexEnd + iX;

                    if (top === true) {
                        // face top
                        indices.push(i, i + 1, c);

                    }
                    else {
                        // face bottom
                        indices.push(i + 1, i, c);
                    }

                    groupCount += 3;
                }

                // add a group to the geometry. this will ensure multi material support
                subIndices.push(groupStart, groupCount, top === true ? 1 : 2);

                // calculate new start value for groups
                groupStart += groupCount;
            }
        }
        /**
         * 创建圆形网格。
         */
        public static createCircle(radius: number = 0.5, arc: number = 1.0, axis: 1 | 2 | 3 = 1) {
            const vertices: number[] = [];
            for (let i = 0; i <= 64 * arc; ++i) {
                switch (axis) {
                    case 1:
                        vertices.push(0.0, Math.cos(i / 32 * Math.PI) * radius, -Math.sin(i / 32 * Math.PI) * radius);
                        break;
                    case 2:
                        vertices.push(Math.cos(i / 32 * Math.PI) * radius, 0.0, -Math.sin(i / 32 * Math.PI) * radius);
                        break;
                    case 3:
                        vertices.push(Math.cos(i / 32 * Math.PI) * radius, Math.sin(i / 32 * Math.PI) * radius, -0.0);
                        break;
                }
            }
            // build geometry
            const mesh = egret3d.Mesh.create(vertices.length / 3, 0, [gltf.MeshAttributeType.POSITION, gltf.MeshAttributeType.COLOR_0]);
            mesh.setAttributes(gltf.MeshAttributeType.POSITION, vertices);
            mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.LineStrip;

            return mesh;
        }
        /**
         * 创建圆环网格。
         */
        public static createTorus(radius: number = 0.5, tube: number = 0.1, radialSegments: number = 4, tubularSegments: number = 12, arc: number = 1.0, axis: 1 | 2 | 3 = 1) {
            const indices: number[] = [];
            const vertices: number[] = [];
            const normals: number[] = [];
            const uvs: number[] = [];

            // helper variables

            const vector3 = _helpVector3;
            const center = Vector3.create().release();

            let j: number, i: number;
            // generate vertices, normals and uvs
            for (j = 0; j <= radialSegments; j++) {

                for (i = 0; i <= tubularSegments; i++) {

                    let u = i / tubularSegments * Math.PI * 2 * arc;
                    let v = j / radialSegments * Math.PI * 2;

                    // vertex
                    switch (axis) {
                        case 1:
                            vector3.x = tube * Math.sin(v);
                            vector3.y = (radius + tube * Math.cos(v)) * Math.cos(u);
                            vector3.z = (radius + tube * Math.cos(v)) * Math.sin(u);
                            break;
                        case 2:
                            vector3.x = (radius + tube * Math.cos(v)) * Math.cos(u);
                            vector3.y = tube * Math.sin(v);
                            vector3.z = (radius + tube * Math.cos(v)) * Math.sin(u);
                            break;
                        default:
                            vector3.x = (radius + tube * Math.cos(v)) * Math.cos(u);
                            vector3.y = (radius + tube * Math.cos(v)) * Math.sin(u);
                            vector3.z = tube * Math.sin(v);
                    }

                    vertices.push(vector3.x, vector3.y, -vector3.z);

                    // normal
                    center.x = radius * Math.cos(u);
                    center.y = radius * Math.sin(u);
                    vector3.subtract(center).normalize();

                    normals.push(vector3.x, vector3.y, -vector3.z);

                    // uv
                    uvs.push(i / tubularSegments);
                    uvs.push(j / radialSegments);

                }

            }

            // generate indices

            for (j = 1; j <= radialSegments; j++) {

                for (i = 1; i <= tubularSegments; i++) {

                    // indices

                    const a = (tubularSegments + 1) * j + i - 1;
                    const b = (tubularSegments + 1) * (j - 1) + i - 1;
                    const c = (tubularSegments + 1) * (j - 1) + i;
                    const d = (tubularSegments + 1) * j + i;

                    // faces
                    // a - d
                    // | / |
                    // b - c
                    indices.push(
                        a, b, d,
                        b, c, d
                    );
                }
            }

            // build geometry
            const mesh = Mesh.create(vertices.length / 3, indices.length, [gltf.MeshAttributeType.POSITION, gltf.MeshAttributeType.NORMAL, gltf.MeshAttributeType.TEXCOORD_0]);
            mesh.setAttributes(gltf.MeshAttributeType.POSITION, vertices);
            mesh.setAttributes(gltf.MeshAttributeType.NORMAL, normals);
            mesh.setAttributes(gltf.MeshAttributeType.TEXCOORD_0, uvs);
            mesh.setIndices(indices);

            return mesh;
        }
        /**
         * 创建球体网格。
         * @param radius 半径。
         * @param centerOffsetX 中心点偏移 X。
         * @param centerOffsetY 中心点偏移 Y。
         * @param centerOffsetZ 中心点偏移 Z。
         * @param widthSegments 宽度分段。
         * @param heightSegments 高度分段。
         * @param phiStart 水平起始弧度。
         * @param phiLength 水平覆盖弧度。
         * @param thetaStart 垂直起始弧度。
         * @param thetaLength 垂直覆盖弧度。
         */
        public static createSphere(
            radius: number = 0.5,
            centerOffsetX: number = 0.0, centerOffsetY: number = 0.0, centerOffsetZ: number = 0.0,
            widthSegments: uint = 24, heightSegments: uint = 12,
            phiStart: number = 0.0, phiLength: number = Math.PI * 2.0,
            thetaStart: number = 0.0, thetaLength: number = Math.PI
        ) {
            widthSegments = Math.max(3, Math.floor(widthSegments));
            heightSegments = Math.max(2, Math.floor(heightSegments));

            const thetaEnd = thetaStart + thetaLength;

            let index = 0;
            const grid = [] as number[][];

            const vector3 = _helpVector3;
            // buffers
            const indices = [] as number[];
            const vertices = [] as number[];
            const normals = [] as number[];
            const uvs = [] as number[];

            // generate vertices, normals and uvs

            for (let iY = 0; iY <= heightSegments; iY++) {

                const verticesRow = [] as number[];

                const v = iY / heightSegments;

                for (let iX = 0; iX <= widthSegments; iX++) {

                    const u = iX / widthSegments;

                    // vertex

                    vector3.x = - radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
                    vector3.y = radius * Math.cos(thetaStart + v * thetaLength);
                    vector3.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);

                    vertices.push(vector3.x + centerOffsetX, vector3.y + centerOffsetY, -vector3.z + centerOffsetZ);

                    // normal

                    vector3.normalize();
                    normals.push(vector3.x, vector3.y, -vector3.z);

                    // uv

                    uvs.push(u, v);

                    verticesRow.push(index++);

                }

                grid.push(verticesRow);

            }

            // indices

            for (let iy = 0; iy < heightSegments; iy++) {

                for (let ix = 0; ix < widthSegments; ix++) {

                    const a = grid[iy][ix + 1];
                    const b = grid[iy][ix];
                    const c = grid[iy + 1][ix];
                    const d = grid[iy + 1][ix + 1];

                    if (iy !== 0 || thetaStart > 0) indices.push(a, b, d);
                    if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indices.push(b, c, d);
                }
            }

            // build geometry
            const mesh = Mesh.create(vertices.length / 3, indices.length, [gltf.MeshAttributeType.POSITION, gltf.MeshAttributeType.NORMAL, gltf.MeshAttributeType.TEXCOORD_0]);
            mesh.setAttributes(gltf.MeshAttributeType.POSITION, vertices);
            mesh.setAttributes(gltf.MeshAttributeType.NORMAL, normals);
            mesh.setAttributes(gltf.MeshAttributeType.TEXCOORD_0, uvs);
            mesh.setIndices(indices);

            return mesh;
        }
    }
}
