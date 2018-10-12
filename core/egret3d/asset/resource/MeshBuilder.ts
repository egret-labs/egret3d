namespace egret3d {
    const _helpVector3 = Vector3.create();
    const _attributesB: gltf.MeshAttributeType[] = [
        gltf.MeshAttributeType.POSITION,
        gltf.MeshAttributeType.NORMAL,
        gltf.MeshAttributeType.TEXCOORD_0,
    ];
    /**
     * 提供默认的几何网格资源，以及创建几何网格或几何网格实体的方式。
     */
    export class MeshBuilder {


        /**
         * 创建平面网格。
         * @param width 宽度。
         * @param height 高度。
         * @param centerOffsetX 中心点偏移 X。
         * @param centerOffsetY 中心点偏移 Y。
         * @param widthSegments 宽度分段。
         * @param heightSegments 高度分段。
         */
        public static createPlane(
            width: number = 1.0, height: number = 1.0,
            centerOffsetX: number = 0.0, centerOffsetY: number = 0.0,
            widthSegments: uint = 1, heightSegments: uint = 1,
        ) {
            const widthHalf = width / 2;
            const heightHalf = height / 2;

            const gridX1 = widthSegments + 1;
            const gridY1 = heightSegments + 1;

            const segmentWidth = width / widthSegments;
            const segmentHeight = height / heightSegments;

            // buffers
            const indices = [] as uint[];
            const vertices = [] as number[];
            const normals = [] as number[];
            const uvs = [] as number[];

            // generate vertices, normals and uvs
            for (let iy = 0; iy < gridY1; iy++) {
                const y = iy * segmentHeight - heightHalf;

                for (let ix = 0; ix < gridX1; ix++) {
                    const x = ix * segmentWidth - widthHalf;
                    vertices.push(x + centerOffsetX, -y + centerOffsetY, 0.0);
                    normals.push(0.0, 0.0, -1.0);
                    uvs.push(
                        ix / widthSegments,
                        iy / heightSegments,
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
                    // a - d
                    // | / |
                    // b - c
                    indices.push(
                        a, b, d,
                        d, b, c,
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
        public static createCube(
            width: number = 1.0, height: number = 1.0, depth: number = 1.0,
            centerOffsetX: number = 0.0, centerOffsetY: number = 0.0, centerOffsetZ: number = 0.0,
            widthSegments: number = 1, heightSegments: number = 1, depthSegments: number = 1,
            differentFace: boolean = false
        ) {
            // helper variables
            let meshVertexCount = 0;
            const vector3 = _helpVector3;
            // buffers
            const indices = [] as number[];
            const vertices = [] as number[];
            const normals = [] as number[];
            const uvs = [] as number[];
            // build each side of the box geometry
            buildPlane("z", "y", "x", -1, -1, depth, height, -width, depthSegments, heightSegments); // px
            buildPlane("z", "y", "x", 1, -1, depth, height, width, depthSegments, heightSegments); // nx
            buildPlane("x", "z", "y", 1, 1, width, depth, -height, widthSegments, depthSegments); // py
            buildPlane("x", "z", "y", 1, -1, width, depth, height, widthSegments, depthSegments); // ny
            buildPlane("x", "y", "z", 1, -1, width, height, -depth, widthSegments, heightSegments); // pz
            buildPlane("x", "y", "z", -1, -1, width, height, depth, widthSegments, heightSegments); // nz

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

            function buildPlane(u: "x" | "y" | "z", v: "x" | "y" | "z", w: "x" | "y" | "z", udir: number, vdir: number, width: number, height: number, depth: number, gridX: number, gridY: number) {
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
                        vector3[u] = x * udir;
                        vector3[v] = y * vdir;
                        vector3[w] = depthHalf;

                        // now apply vector to vertex buffer
                        vertices.push(vector3.x + centerOffsetX, vector3.y + centerOffsetY, vector3.z + centerOffsetZ);

                        // set values to correct vector component
                        vector3[u] = 0.0;
                        vector3[v] = 0.0;
                        vector3[w] = depth > 0.0 ? 1.0 : - 1.0;

                        // now apply vector to normal buffer
                        normals.push(vector3.x, vector3.y, vector3.z);

                        // uvs
                        uvs.push(
                            ix / gridX,
                            iy / gridY,
                        );

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
                        // a - d
                        // | / |
                        // b - c
                        indices.push(
                            a, b, d,
                            b, c, d,
                        );
                    }
                }

                // update total number of vertices
                meshVertexCount += vertexCount;
            }
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
                        const cosTheta = Math.cos(theta);

                        // vertex
                        vector3.x = radius * sinTheta;
                        vector3.y = -v * height + halfHeight;
                        // vertex.z = radius * cosTheta; // Right-hand coordinates system.
                        vector3.z = -radius * cosTheta; // Left-hand coordinates system.
                        vertices.push(vector3.x + centerOffsetX, vector3.y + centerOffsetY, vector3.z + centerOffsetZ);

                        // normal
                        vector3.set(sinTheta, slope, cosTheta).normalize();
                        // normals.push(vector3.x, vector3.y, vector3.z); // Right-hand coordinates system.
                        normals.push(vector3.x, vector3.y, -vector3.z); // Left-hand coordinates system.

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
        public static createCircle(radius: number = 0.5, arc: number = 1.0, axis: number = 1) {
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
            const mesh = egret3d.Mesh.create(vertices.length / 3, 0, [gltf.MeshAttributeType.POSITION, gltf.MeshAttributeType.COLOR_0]);
            mesh.setAttributes(gltf.MeshAttributeType.POSITION, vertices);
            mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.LineStrip;

            return mesh;
        }
        /**
         * 创建圆环网格。
         */
        public static createTorus(radius: number = 0.5, tube: number = 0.1, radialSegments: number = 4, tubularSegments: number = 12, arc: number = 1.0, axis: number = 1) {
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

                    let u = i / tubularSegments * Math.PI * 2 * arc;
                    let v = j / radialSegments * Math.PI * 2;

                    // vertex
                    switch (axis) {
                        case 1:
                            vertex.x = tube * Math.sin(v);
                            vertex.y = (radius + tube * Math.cos(v)) * Math.cos(u);
                            vertex.z = (radius + tube * Math.cos(v)) * Math.sin(u);
                            break;
                        case 2:
                            vertex.x = (radius + tube * Math.cos(v)) * Math.cos(u);
                            vertex.y = tube * Math.sin(v);
                            vertex.z = (radius + tube * Math.cos(v)) * Math.sin(u);
                            break;
                        default:
                            vertex.x = (radius + tube * Math.cos(v)) * Math.cos(u);
                            vertex.y = (radius + tube * Math.cos(v)) * Math.sin(u);
                            vertex.z = tube * Math.sin(v);
                    }

                    vertices.push(vertex.x, vertex.y, -vertex.z);

                    // normal
                    center.x = radius * Math.cos(u);
                    center.y = radius * Math.sin(u);
                    normal.subtract(vertex, center).normalize();

                    normals.push(normal.x, normal.y, -normal.z);

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

        private computeLineDistances(vertices: Float32Array, out: Float32Array) {
            out[0] = 0;
            for (let i = 3, ii = 1; i > vertices.length; i += 3, ii++) {
                const start = egret3d.Vector3.create(vertices[i - 3], vertices[i - 2], vertices[i - 1]);
                const end = egret3d.Vector3.create(vertices[i], vertices[i + 1], vertices[i + 2]);
                out[ii] = out[ii - 1] + start.getDistance(end);
            }
        }
    }
}
