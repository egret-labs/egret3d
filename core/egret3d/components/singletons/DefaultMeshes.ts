namespace egret3d {
    const _helpVector3 = Vector3.create();
    const _attributesB: gltf.MeshAttributeType[] = [
        gltf.MeshAttributeType.POSITION,
        gltf.MeshAttributeType.NORMAL,
        gltf.MeshAttributeType.TEXCOORD_0,
    ];
    /**
     * 
     */
    export class DefaultMeshes extends paper.SingletonComponent {
        public static QUAD: Mesh;
        public static QUAD_PARTICLE: Mesh;
        public static PLANE: Mesh;
        public static TORUS: Mesh;
        public static CUBE: Mesh;
        public static PYRAMID: Mesh;
        public static CONE: Mesh;
        public static CYLINDER: Mesh;
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
                const mesh = DefaultMeshes.createPlane();
                mesh._isBuiltin = true;
                mesh.name = "builtin/quad.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.QUAD = mesh;
            }

            { // QUAD_PARTICLE.
                const mesh = DefaultMeshes.createPlane(1.0, 1.0, -0.5, 0.0);
                mesh._isBuiltin = true;
                mesh.name = "builtin/quad_particle.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.QUAD_PARTICLE = mesh;
            }

            { // PLANE.
                const mesh = DefaultMeshes.createPlane(10.0, 10.0);
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

            { // TORUS.
                const mesh = DefaultMeshes.createTorus();
                mesh._isBuiltin = true;
                mesh.name = "builtin/torus.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.TORUS = mesh;
            }

            { // PYRAMID.
                const mesh = new Mesh(16, 18);
                mesh._isBuiltin = true;
                mesh.name = "builtin/pyramid.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.PYRAMID = mesh;
                mesh.setAttributes(gltf.MeshAttributeType.POSITION, [
                    -0.5, 0.0, -0.5,
                    0.0, 1.0, 0.0,
                    0.5, 0.0, -0.5,
                    0.5, 0.0, -0.5,
                    0.0, 1.0, 0.0,
                    0.5, 0.0, 0.5,
                    0.5, 0.0, 0.5,
                    0.0, 1.0, 0.0,
                    -0.5, 0.0, 0.5,
                    -0.5, 0.0, 0.5,
                    0.0, 1.0, 0.0,
                    -0.5, 0.0, -0.5,
                    -0.5, 0.0, -0.5,
                    0.5, 0.0, -0.5,
                    0.5, 0.0, 0.5,
                    -0.5, 0.0, 0.5,
                ]);
                mesh.setAttributes(gltf.MeshAttributeType.NORMAL, [
                    0, 0, 0,
                    0, 0, 0,
                    0, 0, 0,
                    0, 0, 0,
                    0, 0, 0,
                    0, 0, 0,
                    0, 0, 0,
                    0, 0, 0,
                    0, 0, 0,
                    0, 0, 0,
                    0, 0, 0,
                    0, 0, 0,
                    0, -1, 0,
                    0, -1, 0,
                    0, -1, 0,
                    0, -1, 0,
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
                    1, 1, 1, 1,
                    1, 1, 1, 1,
                    1, 1, 1, 1,
                    1, 1, 1, 1,
                    1, 1, 1, 1,
                    1, 1, 1, 1,
                    1, 1, 1, 1,
                    1, 1, 1, 1,
                ]);
                mesh.setAttributes(gltf.MeshAttributeType.TEXCOORD_0, [
                    0, 0,
                    0.5, 0.5,
                    0, 1,
                    0, 1,
                    0.5, 0.5,
                    1, 1,
                    1, 1,
                    0.5, 0.5,
                    1, 0,
                    1, 0,
                    0.5, 0.5,
                    0, 0,
                    0, 0,
                    1, 0,
                    1, 1,
                    0, 1,
                ]);
                mesh.setIndices([
                    0, 2, 1, 3, 5, 4,
                    6, 8, 7, 9, 11, 10,
                    12, 14, 13, 15, 14, 12
                ]);
            }

            { // CONE.
                const mesh = DefaultMeshes.createCylinder(0.0, 0.5, 1.0, 0.0, 0.0, 0.0, 16, 1);
                mesh._isBuiltin = true;
                mesh.name = "builtin/pyramid.mesh.bin";
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

            { // SPHERE.
                const mesh = DefaultMeshes.createSphere();
                mesh._isBuiltin = true;
                mesh.name = "builtin/sphere.mesh.bin";
                paper.Asset.register(mesh);
                DefaultMeshes.SPHERE = mesh;
            }

            { // LINE_X.
                const mesh = new Mesh(2, 0, [gltf.MeshAttributeType.POSITION, gltf.MeshAttributeType.COLOR_0]);
                mesh._isBuiltin = true;
                mesh.name = "builtin/line_x.mesh.bin";
                mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines;
                paper.Asset.register(mesh);
                DefaultMeshes.LINE_X = mesh;
                mesh.setAttributes(gltf.MeshAttributeType.POSITION, [
                    0.0, 0.0, 0.0, 1.0, 0.0, 0.0,
                ]);
                mesh.setAttributes(gltf.MeshAttributeType.COLOR_0, [
                    1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
                ]);
            }

            { // LINE_Y.
                const mesh = new Mesh(2, 0, [gltf.MeshAttributeType.POSITION, gltf.MeshAttributeType.COLOR_0]);
                mesh._isBuiltin = true;
                mesh.name = "builtin/line_y.mesh.bin";
                mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines;
                paper.Asset.register(mesh);
                DefaultMeshes.LINE_Y = mesh;
                mesh.setAttributes(gltf.MeshAttributeType.POSITION, [
                    0.0, 0.0, 0.0, 0.0, 1.0, 0.0,
                ]);
                mesh.setAttributes(gltf.MeshAttributeType.COLOR_0, [
                    1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
                ]);
            }

            { // LINE_Z.
                const mesh = new Mesh(2, 0, [gltf.MeshAttributeType.POSITION, gltf.MeshAttributeType.COLOR_0]);
                mesh._isBuiltin = true;
                mesh.name = "builtin/line_z.mesh.bin";
                mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines;
                paper.Asset.register(mesh);
                DefaultMeshes.LINE_Z = mesh;
                mesh.setAttributes(gltf.MeshAttributeType.POSITION, [
                    0.0, 0.0, 0.0, 0.0, 0.0, 1.0,
                ]);
                mesh.setAttributes(gltf.MeshAttributeType.COLOR_0, [
                    1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
                ]);
            }

            { // CIRCLE_LINE
                const mesh = DefaultMeshes.createCircle(1, 0.5);
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
         * 创建带网格的实体。
         */
        public static createObject(mesh: Mesh, name?: string, tag?: string, scene?: paper.Scene) {
            const gameObject = paper.GameObject.create(name, tag, scene);

            const meshFilter = gameObject.addComponent(MeshFilter);
            const renderer = gameObject.addComponent(MeshRenderer);
            meshFilter.mesh = mesh;

            switch (mesh) {
                case this.LINE_X:
                case this.LINE_Y:
                case this.LINE_Z:
                case this.CUBE_LINE:
                    renderer.material = DefaultMaterials.LINEDASHED_COLOR;
                    break;
            }

            return gameObject;
        }
        /**
         * 创建平面网格。
         */
        public static createPlane(
            width: number = 1.0, height: number = 1.0,
            centerOffsetX: number = 0.0, centerOffsetY: number = 0.0,
            widthSegments: number = 1, heightSegments: number = 1,
        ) {
            const widthHalf = width / 2;
            const heightHalf = height / 2;

            const gridX1 = widthSegments + 1;
            const gridY1 = heightSegments + 1;

            const segmentWidth = width / widthSegments;
            const segmentHeight = height / heightSegments;

            // buffers
            const indices = [] as number[];
            const vertices = [] as number[];
            const normals = [] as number[];
            const uvs = [] as number[];

            // generate vertices, normals and uvs
            for (let iy = 0; iy < gridY1; iy++) {
                const y = iy * segmentHeight - heightHalf;

                for (let ix = 0; ix < gridX1; ix++) {
                    const x = ix * segmentWidth - widthHalf;

                    vertices.push(centerOffsetX + x, centerOffsetY - y, 0.0);
                    normals.push(0.0, 0.0, 1.0);
                    uvs.push(
                        ix / widthSegments,
                        iy / heightSegments
                    );
                }
            }

            // indices
            for (let iy = 0; iy < heightSegments; iy++) {
                for (let ix = 0; ix < widthSegments; ix++) {
                    const a = ix + gridX1 * iy;
                    const b = ix + gridX1 * (iy + 1);
                    const c = (ix + 1) + gridX1 * (iy + 1);
                    const d = (ix + 1) + gridX1 * iy;

                    // faces
                    indices.push(
                        a, b, d,
                        b, c, d
                    );
                }
            }

            const mesh = Mesh.create(vertices.length / 3, indices.length);
            mesh.setAttributes(gltf.MeshAttributeType.POSITION, vertices);
            mesh.setAttributes(gltf.MeshAttributeType.NORMAL, normals);
            mesh.setAttributes(gltf.MeshAttributeType.TEXCOORD_0, uvs);
            mesh.setIndices(indices);

            return mesh;
        }
        /**
         * 创建立方体网格。
         */
        public static createCube(
            width: number = 1.0, height: number = 1.0, depth: number = 1.0,
            centerOffsetX: number = 0.0, centerOffsetY: number = 0.0, centerOffsetZ: number = 0.0,
            widthSegments: number = 1, heightSegments: number = 1, depthSegments: number = 1,
            differentFace: boolean = false
        ) {
            // helper variables
            let meshVertexCount = 0;
            // buffers
            const indices = [] as number[];
            const vertices = [] as number[];
            const normals = [] as number[];
            const uvs = [] as number[];
            // build each side of the box geometry
            buildPlane('z', 'y', 'x', -1, -1, depth, height, -width, depthSegments, heightSegments); // px
            buildPlane('z', 'y', 'x', 1, -1, depth, height, width, depthSegments, heightSegments); // nx
            buildPlane('x', 'z', 'y', 1, 1, width, depth, -height, widthSegments, depthSegments); // py
            buildPlane('x', 'z', 'y', 1, -1, width, depth, height, widthSegments, depthSegments); // ny
            buildPlane('x', 'y', 'z', 1, -1, width, height, -depth, widthSegments, heightSegments); // pz
            buildPlane('x', 'y', 'z', -1, -1, width, height, depth, widthSegments, heightSegments); // nz

            // build geometry
            if (differentFace) {
                const faceIndexCount = indices.length / 6;
                const mesh = Mesh.create(vertices.length / 3, 0);
                mesh.setAttributes(gltf.MeshAttributeType.POSITION, vertices);
                mesh.setAttributes(gltf.MeshAttributeType.NORMAL, normals);
                mesh.setAttributes(gltf.MeshAttributeType.TEXCOORD_0, uvs);

                for (let i = 0; i < 6; ++i) {
                    mesh.addSubMesh(faceIndexCount, i);
                    mesh.setIndices(indices, i, faceIndexCount * i);
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

            function buildPlane(u: string, v: string, w: string, udir: number, vdir: number, width: number, height: number, depth: number, gridX: number, gridY: number) {
                const segmentWidth = width / gridX;
                const segmentHeight = height / gridY;

                const widthHalf = width / 2;
                const heightHalf = height / 2;
                const depthHalf = depth / 2;

                const gridX1 = gridX + 1;
                const gridY1 = gridY + 1;

                let vertexCount = 0;

                // generate vertices, normals and uvs
                for (let iy = 0; iy < gridY1; iy++) {
                    const y = iy * segmentHeight - heightHalf;
                    for (let ix = 0; ix < gridX1; ix++) {
                        const x = ix * segmentWidth - widthHalf;

                        // set values to correct vector component
                        _helpVector3[u] = x * udir;
                        _helpVector3[v] = y * vdir;
                        _helpVector3[w] = depthHalf;

                        // now apply vector to vertex buffer
                        vertices.push(_helpVector3.x + centerOffsetX, _helpVector3.y + centerOffsetY, _helpVector3.z + centerOffsetZ);

                        // set values to correct vector component
                        _helpVector3[u] = 0.0;
                        _helpVector3[v] = 0.0;
                        _helpVector3[w] = depth > 0.0 ? 1.0 : - 1.0;

                        // now apply vector to normal buffer
                        normals.push(_helpVector3.x, _helpVector3.y, _helpVector3.z);

                        // uvs
                        uvs.push(ix / gridX);
                        uvs.push(iy / gridY);

                        // counters
                        vertexCount += 1;
                    }
                }

                // indices
                // 1. you need three indices to draw a single face
                // 2. a single segment consists of two faces
                // 3. so we need to generate six (2*3) indices per segment
                for (let iy = 0; iy < gridY; iy++) {
                    for (let ix = 0; ix < gridX; ix++) {
                        const a = meshVertexCount + ix + gridX1 * iy;
                        const b = meshVertexCount + ix + gridX1 * (iy + 1);
                        const c = meshVertexCount + (ix + 1) + gridX1 * (iy + 1);
                        const d = meshVertexCount + (ix + 1) + gridX1 * iy;

                        // faces
                        indices.push(
                            a, b, d,
                            b, c, d
                        );
                    }
                }

                // update total number of vertices
                meshVertexCount += vertexCount;
            }
        }
        /**
         * 创建圆柱体网格。
         */
        public static createCylinder(
            radiusTop: number = 0.5, radiusBottom: number = 0.5, height: number = 1.0,
            centerOffsetX: number = 0.0, centerOffsetY: number = 0.0, centerOffsetZ: number = 0.0,
            radialSegments: number = 16, heightSegments = 1,
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
                        const cosTheta = Math.cos(theta);

                        // vertex
                        _helpVector3.x = radius * sinTheta;
                        _helpVector3.y = -v * height + halfHeight;
                        _helpVector3.z = -radius * cosTheta;
                        vertices.push(_helpVector3.x + centerOffsetX, _helpVector3.y + centerOffsetY, _helpVector3.z + centerOffsetZ);

                        // normal
                        _helpVector3.set(sinTheta, slope, cosTheta).normalize();
                        normals.push(_helpVector3.x, _helpVector3.y, _helpVector3.z);

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

            function generateCap(top) {
                let centerIndexStart = 0, centerIndexEnd = 0;
                let groupCount = 0;
                const radius = (top === true) ? radiusTop : radiusBottom;
                const sign = (top === true) ? 1 : - 1;

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
                    _helpVector3.x = radius * sinTheta;
                    _helpVector3.y = halfHeight * sign;
                    _helpVector3.z = -radius * cosTheta;
                    vertices.push(_helpVector3.x + centerOffsetX, _helpVector3.y + centerOffsetY, _helpVector3.z + centerOffsetZ);

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
        public static createCircle(radius: number, arc: number) {
            const vertices: number[] = [];
            for (var i = 0; i <= 64 * arc; ++i) {
                vertices.push(0, Math.cos(i / 32 * Math.PI) * radius, Math.sin(i / 32 * Math.PI) * radius);
            }
            const mesh = egret3d.Mesh.create(vertices.length / 3, 0, [gltf.MeshAttributeType.POSITION, gltf.MeshAttributeType.COLOR_0]);
            mesh.setAttributes(gltf.MeshAttributeType.POSITION, vertices);
            mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.LineStrip;

            return mesh;
        }
        /**
         * 创建圆环网格。
         */
        public static createTorus(radius: number = 1, tube: number = 0.1, radialSegments: number = 4, tubularSegments: number = 14, arc: number = Math.PI * 2) {
            const indices: number[] = [];
            const vertices: number[] = [];
            const normals: number[] = [];
            const uvs: number[] = [];

            // helper variables

            const center = Vector3.create();
            const vertex = Vector3.create();
            const normal = Vector3.create();

            let j: number, i: number;
            // generate vertices, normals and uvs
            for (j = 0; j <= radialSegments; j++) {

                for (i = 0; i <= tubularSegments; i++) {

                    var u = i / tubularSegments * arc;
                    var v = j / radialSegments * Math.PI * 2;

                    // vertex
                    vertex.x = (radius + tube * Math.cos(v)) * Math.cos(u);
                    vertex.y = (radius + tube * Math.cos(v)) * Math.sin(u);
                    vertex.z = tube * Math.sin(v);

                    vertices.push(vertex.x, vertex.y, vertex.z);

                    // normal
                    center.x = radius * Math.cos(u);
                    center.y = radius * Math.sin(u);
                    normal.subtract(vertex, center).normalize();

                    normals.push(normal.x, normal.y, normal.z);

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

                    indices.push(
                        a, b, d,
                        b, c, d
                    );
                }
            }

            center.release();
            vertex.release();
            normal.release();

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
         * TODO
         */
        public static createSphere(
            radius: number = 0.5,
            widthSegments: number = 24,
            heightSegments: number = 12
        ) {
            widthSegments = Math.max(3, Math.floor(widthSegments));
            heightSegments = Math.max(2, Math.floor(heightSegments));
            const mesh = new Mesh((widthSegments + 1) * (heightSegments + 1), widthSegments * heightSegments * 6 - 6, _attributesB);
            //
            let index = 0;
            const vertex = new Vector3();
            const normal = new Vector3();
            const grid = new Array<number[]>();
            const vertices: number[] = [];
            const normals: number[] = [];
            const uvs: number[] = [];

            for (let iy = 0; iy <= heightSegments; iy++) {
                const verticesRow = new Array<number>();
                const v = iy / heightSegments;

                for (let ix = 0; ix <= widthSegments; ix++) {
                    const u = ix / widthSegments;
                    // Vertex.
                    vertex.x = -radius * Math.cos(u * Math.PI * 2) * Math.sin(v * Math.PI);
                    vertex.y = radius * Math.cos(v * Math.PI);
                    vertex.z = radius * Math.sin(u * Math.PI * 2) * Math.sin(v * Math.PI);
                    vertices.push(vertex.x, vertex.y, vertex.z);

                    // Normal.
                    normal.x = vertex.x;
                    normal.y = vertex.y;
                    normal.z = vertex.z;
                    const num = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);

                    if (num > Number.MIN_VALUE) {
                        normals.push(normal.x / num, normal.y / num, normal.z / num);
                    }
                    else {
                        normals.push(0.0, 0.0, 0.0);
                    }
                    uvs.push(0, 1.0 - u, v);
                    verticesRow.push(index++);
                }

                grid.push(verticesRow);
            }
            mesh.setAttributes(gltf.MeshAttributeType.POSITION, vertices);
            mesh.setAttributes(gltf.MeshAttributeType.NORMAL, normals);
            mesh.setAttributes(gltf.MeshAttributeType.TEXCOORD_0, uvs);
            // Indices.
            const tris = new Array<number>();
            for (let iy = 0; iy < heightSegments; iy++) {
                for (let ix = 0; ix < widthSegments; ix++) {
                    const a = grid[iy][ix + 1];
                    const b = grid[iy][ix];
                    const c = grid[iy + 1][ix];
                    const d = grid[iy + 1][ix + 1];

                    if (iy !== 0) {
                        tris.push(a, d, b);
                    }

                    if (iy !== heightSegments - 1) {
                        tris.push(b, d, c);
                    }
                }
            }

            const indices = mesh.getIndices() as Uint16Array;
            for (let i = 0, l = tris.length; i < l; i++) {
                indices[i] = tris[i];
            }

            return mesh;
        }
    }
}
