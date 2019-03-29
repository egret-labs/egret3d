namespace egret3d {
    /**
     * 提供默认的几何网格资源，以及创建几何网格或几何网格实体的方式。
     */
    export class MeshBuilder {
        /**
         * 创建圆形网格。
         */
        public static createCircle(radius: number = 0.5, arc: number = 1.0, axis: 1 | 2 | 3 = 3): Mesh {
            const PI = Const.PI;
            // buffers
            const vertices = [] as number[];
            //
            for (let i = 0; i <= 64 * arc; ++i) {
                switch (axis) {
                    case 1:
                        vertices.push(0.0, Math.cos(i / 32 * PI) * radius, -Math.sin(i / 32 * PI) * radius);
                        break;

                    case 2:
                        vertices.push(Math.cos(i / 32 * PI) * radius, 0.0, -Math.sin(i / 32 * PI) * radius);
                        break;

                    case 3:
                        vertices.push(Math.cos(i / 32 * PI) * radius, Math.sin(i / 32 * PI) * radius, -0.0);
                        break;
                }

            }
            //
            const mesh = Mesh.create(vertices.length / 3, 0, [gltf.AttributeSemantics.POSITION]);
            mesh.setAttribute(gltf.AttributeSemantics.POSITION, vertices);
            mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.LineStrip;

            return mesh;
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
        public static createPlane(
            width: number = 1.0, height: number = 1.0,
            centerOffsetX: number = 0.0, centerOffsetY: number = 0.0,
            widthSegments: uint = 1, heightSegments: uint = 1,
        ): Mesh {
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
            //
            const mesh = Mesh.create(vertices.length / 3, indices.length);
            mesh.setAttribute(gltf.AttributeSemantics.POSITION, vertices);
            mesh.setAttribute(gltf.AttributeSemantics.NORMAL, normals);
            mesh.setAttribute(gltf.AttributeSemantics.TEXCOORD_0, uvs);
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
            widthSegments: uint = 1, heightSegments: uint = 1, depthSegments: uint = 1,
            differentFace: boolean = false,
        ): Mesh {
            // helper variables
            let meshVertexCount = 0;
            const vertex = Vector3.create().release();
            // buffers
            const indices = [] as uint[];
            const vertices = [] as number[];
            const normals = [] as number[];
            const uvs = [] as number[];
            //
            function buildPlane(u: "x" | "y" | "z", v: "x" | "y" | "z", w: "x" | "y" | "z", udir: int, vdir: int, width: number, height: number, depth: number, gridX: uint, gridY: uint) {
                let vertexCount = 0;
                const segmentWidth = width / gridX;
                const segmentHeight = height / gridY;
                const widthHalf = width / 2;
                const heightHalf = height / 2;
                const depthHalf = depth / 2;
                const gridX1 = gridX + 1;
                const gridY1 = gridY + 1;
                // generate vertices, normals and uvs
                for (let iy = 0; iy < gridY1; iy++) {
                    const y = iy * segmentHeight - heightHalf;
                    for (let ix = 0; ix < gridX1; ix++) {
                        const x = ix * segmentWidth - widthHalf;
                        // set values to correct vector component
                        vertex[u] = x * udir;
                        vertex[v] = y * vdir;
                        vertex[w] = depthHalf;
                        vertices.push(vertex.x + centerOffsetX, vertex.y + centerOffsetY, vertex.z + centerOffsetZ);
                        // set values to correct vector component
                        vertex[u] = 0.0;
                        vertex[v] = 0.0;
                        vertex[w] = depth > 0.0 ? 1.0 : - 1.0;
                        normals.push(vertex.x, vertex.y, vertex.z);
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
                mesh.setAttribute(gltf.AttributeSemantics.POSITION, vertices);
                mesh.setAttribute(gltf.AttributeSemantics.NORMAL, normals);
                mesh.setAttribute(gltf.AttributeSemantics.TEXCOORD_0, uvs);

                for (let i = 0; i < 6; ++i) {
                    mesh.addSubMesh(faceIndexCount, i);
                    mesh.setIndices(indices, i, faceIndexCount * i);
                }

                return mesh;
            }
            //
            const mesh = Mesh.create(vertices.length / 3, indices.length);
            mesh.setAttribute(gltf.AttributeSemantics.POSITION, vertices);
            mesh.setAttribute(gltf.AttributeSemantics.NORMAL, normals);
            mesh.setAttribute(gltf.AttributeSemantics.TEXCOORD_0, uvs);
            mesh.setIndices(indices);

            return mesh;
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
            radialSegments: uint = 10, heightSegments: uint = 1,
            openEnded: boolean = false, thetaStart: number = 0.0, thetaLength: number = Const.PI_DOUBLE,
            differentFace: boolean = false
        ): Mesh {
            // helper variables
            let index = 0;
            let groupStart = 0;
            const halfHeight = height / 2;
            const vertex = Vector3.create().release();
            const indexArray = [] as uint[][];
            const subIndices = [] as number[];
            // buffers
            const indices = [] as uint[];
            const vertices = [] as number[];
            const normals = [] as number[];
            const uvs = [] as number[];
            //
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
                        vertex.x = radius * sinTheta;
                        vertex.y = -v * height + halfHeight;
                        // vertex.z = radius * cosTheta; // Right-hand coordinates system.
                        vertex.z = -radius * cosTheta; // Left-hand coordinates system.
                        vertices.push(vertex.x + centerOffsetX, vertex.y + centerOffsetY, vertex.z + centerOffsetZ);

                        // normal
                        vertex.set(sinTheta, slope, cosTheta).normalize();
                        // normals.push(vertex.x, vertex.y, vertex.z); // Right-hand coordinates system.
                        normals.push(vertex.x, vertex.y, -vertex.z); // Left-hand coordinates system.

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
            //
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
                    vertex.x = radius * sinTheta;
                    vertex.y = halfHeight * sign;
                    // vertex.z = radius * cosTheta; // Right-hand coordinates system.
                    vertex.z = -radius * cosTheta; // Left-hand coordinates system.
                    vertices.push(vertex.x + centerOffsetX, vertex.y + centerOffsetY, vertex.z + centerOffsetZ);

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
            // generate geometry
            generateTorso();
            //
            if (!openEnded) {
                if (radiusTop > 0.0) generateCap(true);
                if (radiusBottom > 0.0) generateCap(false);
            }
            // build geometry
            if (differentFace) {
                const mesh = Mesh.create(vertices.length / 3, 0);
                mesh.setAttribute(gltf.AttributeSemantics.POSITION, vertices);
                mesh.setAttribute(gltf.AttributeSemantics.NORMAL, normals);
                mesh.setAttribute(gltf.AttributeSemantics.TEXCOORD_0, uvs);

                for (let i = 0; i < subIndices.length; i += 3) {
                    mesh.addSubMesh(subIndices[1], subIndices[2]);
                    mesh.setIndices(indices, i, subIndices[0]);
                }

                return mesh;
            }

            const mesh = Mesh.create(vertices.length / 3, indices.length);
            mesh.setAttribute(gltf.AttributeSemantics.POSITION, vertices);
            mesh.setAttribute(gltf.AttributeSemantics.NORMAL, normals);
            mesh.setAttribute(gltf.AttributeSemantics.TEXCOORD_0, uvs);
            mesh.setIndices(indices);

            return mesh;
        }
        /**
         * 创建圆环网格。
         */
        public static createTorus(
            radius: number = 0.5, tube: number = 0.1,
            radialSegments: uint = 10, tubularSegments: uint = 10,
            arc: number = 1.0, axis: 1 | 2 | 3 = 3
        ): Mesh {
            // helper variables
            const vertex = Vector3.create().release();
            const normal = Vector3.create().release();
            // buffers
            const indices = [] as uint[];
            const vertices = [] as number[];
            const normals = [] as number[];
            const uvs = [] as number[];
            // generate vertices, normals and uvs
            for (let j = 0; j <= radialSegments; j++) {
                for (let i = 0; i <= tubularSegments; i++) {
                    const u = i / tubularSegments * Const.PI_DOUBLE * arc;
                    const v = j / radialSegments * Const.PI_DOUBLE;
                    // vertex
                    switch (axis) {
                        case 1:
                            vertex.x = tube * Math.sin(v);
                            vertex.y = (radius + tube * Math.cos(v)) * Math.cos(u);
                            vertex.z = -(radius + tube * Math.cos(v)) * Math.sin(u);
                            break;

                        case 2:
                            vertex.x = (radius + tube * Math.cos(v)) * Math.cos(u);
                            vertex.y = -tube * Math.sin(v);
                            vertex.z = -(radius + tube * Math.cos(v)) * Math.sin(u);
                            break;

                        case 3:
                            vertex.x = (radius + tube * Math.cos(v)) * Math.cos(u);
                            vertex.y = (radius + tube * Math.cos(v)) * Math.sin(u);
                            vertex.z = -tube * Math.sin(v);
                    }

                    vertices.push(vertex.x, vertex.y, vertex.z);
                    // normal
                    normal.x = radius * Math.cos(u);
                    normal.y = radius * Math.sin(u);
                    normal.z = 0.0;
                    normal.subtract(vertex, normal).normalize();
                    normals.push(normal.x, normal.y, -normal.z);
                    // uv
                    uvs.push(i / tubularSegments);
                    uvs.push(j / radialSegments);
                }
            }
            // generate indices
            for (let j = 1; j <= radialSegments; j++) {
                for (let i = 1; i <= tubularSegments; i++) {
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
            // build geometry
            const mesh = Mesh.create(vertices.length / 3, indices.length, [gltf.AttributeSemantics.POSITION, gltf.AttributeSemantics.NORMAL, gltf.AttributeSemantics.TEXCOORD_0]);
            mesh.setAttribute(gltf.AttributeSemantics.POSITION, vertices);
            mesh.setAttribute(gltf.AttributeSemantics.NORMAL, normals);
            mesh.setAttribute(gltf.AttributeSemantics.TEXCOORD_0, uvs);
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
            widthSegments: uint = 10, heightSegments: uint = 10,
            phiStart: number = 0.0, phiLength: number = Const.PI_DOUBLE,
            thetaStart: number = 0.0, thetaLength: number = Const.PI,
        ): Mesh {
            widthSegments = Math.max(3, widthSegments);
            heightSegments = Math.max(2, heightSegments);
            // generate vertices, normals and uvs
            let index = 0;
            const thetaEnd = thetaStart + thetaLength;
            const vertex = Vector3.create().release();
            const grid = [] as uint[][];
            // buffers
            const indices = [] as uint[];
            const vertices = [] as number[];
            const normals = [] as number[];
            const uvs = [] as number[];
            //
            for (let iY = 0; iY <= heightSegments; iY++) {
                const v = iY / heightSegments;
                const verticesRow = [] as uint[];

                for (let iX = 0; iX <= widthSegments; iX++) {
                    const u = iX / widthSegments;
                    const t = radius * Math.sin(thetaStart + v * thetaLength);
                    // vertex
                    vertex.x = -t * Math.cos(phiStart + u * phiLength);
                    vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
                    vertex.z = t * Math.sin(phiStart + u * phiLength);
                    vertices.push(vertex.x + centerOffsetX, vertex.y + centerOffsetY, -vertex.z + centerOffsetZ);
                    // normal
                    vertex.normalize();
                    normals.push(vertex.x, vertex.y, -vertex.z);
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
                    if (iy !== heightSegments - 1 || thetaEnd < Const.PI) indices.push(b, c, d);
                }
            }
            // build geometry
            const mesh = Mesh.create(vertices.length / 3, indices.length, [gltf.AttributeSemantics.POSITION, gltf.AttributeSemantics.NORMAL, gltf.AttributeSemantics.TEXCOORD_0]);
            mesh.setAttribute(gltf.AttributeSemantics.POSITION, vertices);
            mesh.setAttribute(gltf.AttributeSemantics.NORMAL, normals);
            mesh.setAttribute(gltf.AttributeSemantics.TEXCOORD_0, uvs);
            mesh.setIndices(indices);

            return mesh;
        }
        /**
         * 
         * @param radius 
         * @param tube 
         * @param tubularSegments 
         * @param radialSegments 
         * @param p 
         * @param q 
         */
        public static createTorusKnot(
            radius: number = 0.5, tube: number = 0.2,
            tubularSegments: uint = 64, radialSegments: uint = 8,
            p: number = 2.0, q: number = 3.0,
        ): Mesh {
            // helper variables
            const vertex = Vector3.create().release();
            const normal = Vector3.create().release();
            const P1 = Vector3.create().release();
            const P2 = Vector3.create().release();
            const B = Vector3.create().release();
            const T = Vector3.create().release();
            const N = Vector3.create().release();
            // buffers
            const indices = [] as uint[];
            const vertices = [] as number[];
            const normals = [] as number[];
            const uvs = [] as number[];
            // this function calculates the current position on the torus curve
            function calculatePositionOnCurve(u: number, p: number, q: number, radius: number, position: Vector3) {
                const cu = Math.cos(u);
                const su = Math.sin(u);
                const quOverP = q / p * u;
                const cs = Math.cos(quOverP);

                position.x = radius * (2 + cs) * 0.5 * cu;
                position.y = radius * (2 + cs) * su * 0.5;
                position.z = radius * Math.sin(quOverP) * 0.5;
            }
            // generate vertices, normals and uvs
            for (let i = 0; i <= tubularSegments; ++i) {
                // the radian "u" is used to calculate the position on the torus curve of the current tubular segement
                const u = i / tubularSegments * p * Const.PI_DOUBLE;
                // now we calculate two points. P1 is our current position on the curve, P2 is a little farther ahead.
                // these points are used to create a special "coordinate space", which is necessary to calculate the correct vertex positions
                calculatePositionOnCurve(u, p, q, radius, P1);
                calculatePositionOnCurve(u + 0.01, p, q, radius, P2);
                // calculate orthonormal basis
                T.subtract(P2, P1);
                N.add(P2, P1);
                B.cross(T, N);
                N.cross(B, T);
                // normalize B, N. T can be ignored, we don't use it
                B.normalize();
                N.normalize();
                //
                for (let j = 0; j <= radialSegments; ++j) {
                    // now calculate the vertices. they are nothing more than an extrusion of the torus curve.
                    // because we extrude a shape in the xy-plane, there is no need to calculate a z-value.
                    const v = j / radialSegments * Const.PI_DOUBLE;
                    const cx = -tube * Math.cos(v);
                    const cy = tube * Math.sin(v);
                    // now calculate the final vertex position.
                    // first we orient the extrusion with our basis vectos, then we add it to the current position on the curve
                    vertex.x = P1.x + (cx * N.x + cy * B.x);
                    vertex.y = P1.y + (cx * N.y + cy * B.y);
                    vertex.z = P1.z + (cx * N.z + cy * B.z);
                    vertices.push(vertex.x, vertex.y, -vertex.z); //
                    // normal (P1 is always the center/origin of the extrusion, thus we can use it to calculate the normal)
                    normal.subtract(vertex, P1).normalize();
                    normals.push(normal.x, normal.y, -normal.z); //
                    // uv
                    uvs.push(
                        i / tubularSegments,
                        j / radialSegments
                    );
                }
            }
            // generate indices
            for (let j = 1; j <= tubularSegments; j++) {
                for (let i = 1; i <= radialSegments; i++) {
                    // indices
                    const a = (radialSegments + 1) * (j - 1) + (i - 1);
                    const b = (radialSegments + 1) * j + (i - 1);
                    const c = (radialSegments + 1) * j + i;
                    const d = (radialSegments + 1) * (j - 1) + i;
                    // faces
                    indices.push(
                        a, b, d,
                        b, c, d
                    );
                }
            }
            // build geometry
            const mesh = Mesh.create(vertices.length / 3, indices.length, [gltf.AttributeSemantics.POSITION, gltf.AttributeSemantics.NORMAL, gltf.AttributeSemantics.TEXCOORD_0]);
            mesh.setAttribute(gltf.AttributeSemantics.POSITION, vertices);
            mesh.setAttribute(gltf.AttributeSemantics.NORMAL, normals);
            mesh.setAttribute(gltf.AttributeSemantics.TEXCOORD_0, uvs);
            mesh.setIndices(indices);

            return mesh;
        }
        /**
         * 创建胶囊体网格。
         * @param radius 半径。
         * @param height 圆柱体高度。
         * @param centerOffsetX 中心点偏移 X。
         * @param centerOffsetY 中心点偏移 Y。
         * @param centerOffsetZ 中心点偏移 Z。
         * @param widthSegments 球体宽度分段。
         * @param heightSegments 球体高度分段。
         * @param middleSegments 圆柱体高度分段。
         * @param phiStart 水平起始弧度。
         * @param phiLength 水平覆盖弧度。
         * @param thetaStart 垂直起始弧度。
         * @param thetaLength 垂直覆盖弧度。
         */
        public static createCapsule(
            radius: number = 0.25, height: number = 0.5,
            centerOffsetX: number = 0.0, centerOffsetY: number = 0.0, centerOffsetZ: number = 0.0,
            widthSegments: uint = 10, heightSegments: uint = 10, middleSegments: uint = 1,
            phiStart: number = 0.0, phiLength: number = Const.PI_DOUBLE,
            thetaStart: number = 0.0, thetaLength: number = Const.PI,
        ): Mesh {
            if (heightSegments % 2) {
                heightSegments++;
            }

            widthSegments = Math.max(3, widthSegments);
            heightSegments = Math.max(2, heightSegments);
            // generate vertices, normals and uvs
            let index = 0;
            const allHeightSegments = heightSegments + (middleSegments ? 1 : 0); // TODO middleSegments
            const middleHeight = (heightSegments + 1) * 0.5;
            const thetaEnd = thetaStart + thetaLength;
            const vertex = Vector3.create().release();
            const grid = [] as uint[][];
            // buffers
            const indices = [] as uint[];
            const vertices = [] as number[];
            const normals = [] as number[];
            const uvs = [] as number[];
            //
            for (let iY = 0; iY <= allHeightSegments; iY++) {
                const v = iY / allHeightSegments;
                const vS = iY < middleHeight ? (iY / heightSegments) : ((iY - 1) / heightSegments); // TODO middleSegments
                const verticesRow = [] as uint[];
                grid.push(verticesRow);

                for (let iX = 0; iX <= widthSegments; iX++) {
                    const u = iX / widthSegments;
                    const t = radius * Math.sin(thetaStart + v * thetaLength);

                    vertex.x = -t * Math.cos(phiStart + u * phiLength);
                    vertex.z = t * Math.sin(phiStart + u * phiLength);
                    vertex.y = radius * Math.cos(thetaStart + vS * thetaLength);

                    if (iY < middleHeight) {
                        vertices.push(vertex.x + centerOffsetX, vertex.y + height * 0.5 + centerOffsetY, -vertex.z + centerOffsetZ);
                    }
                    else {
                        vertices.push(vertex.x + centerOffsetX, vertex.y - height * 0.5 + centerOffsetY, -vertex.z + centerOffsetZ);
                    }

                    vertex.normalize();
                    normals.push(vertex.x, vertex.y, -vertex.z);

                    uvs.push(u, v);

                    verticesRow.push(index++);
                }
            }
            // indices
            for (let iY = 0; iY < allHeightSegments; iY++) {
                for (let iX = 0; iX < widthSegments; iX++) {
                    const a = grid[iY][iX + 1];
                    const b = grid[iY][iX];
                    const c = grid[iY + 1][iX];
                    const d = grid[iY + 1][iX + 1];

                    if (iY !== 0 || thetaStart > 0.0) indices.push(a, b, d);
                    if (iY !== allHeightSegments - 1 || thetaEnd < Const.PI) indices.push(b, c, d);
                }
            }
            // build geometry
            const mesh = Mesh.create(vertices.length / 3, indices.length, [gltf.AttributeSemantics.POSITION, gltf.AttributeSemantics.NORMAL, gltf.AttributeSemantics.TEXCOORD_0]);
            mesh.setAttribute(gltf.AttributeSemantics.POSITION, vertices);
            mesh.setAttribute(gltf.AttributeSemantics.NORMAL, normals);
            mesh.setAttribute(gltf.AttributeSemantics.TEXCOORD_0, uvs);
            mesh.setIndices(indices);

            return mesh;
        }

        private static _createPolyhedron(vertices: ReadonlyArray<number>, indices: ReadonlyArray<uint>, radius: number, detail: uint) {
            const vertexBuffer = [] as number[];
            const uvBuffer = [] as number[];

            // // the subdivision creates the vertex buffer data

            // subdivide(detail);

            // // all vertices should lie on a conceptual sphere with a given radius

            // appplyRadius(radius);

            // // finally, create the uv data

            // generateUVs();

            // // build non-indexed geometry

            // this.addAttribute('position', new Float32BufferAttribute(vertexBuffer, 3));
            // this.addAttribute('normal', new Float32BufferAttribute(vertexBuffer.slice(), 3));
            // this.addAttribute('uv', new Float32BufferAttribute(uvBuffer, 2));

            // if (detail === 0) {

            //     this.computeVertexNormals(); // flat normals

            // } else {

            //     this.normalizeNormals(); // smooth normals
            // }

            // return 

            // // helper functions

            // function subdivide(detail) {

            //     var a = new Vector3();
            //     var b = new Vector3();
            //     var c = new Vector3();

            //     // iterate over all faces and apply a subdivison with the given detail value

            //     for (var i = 0; i < indices.length; i += 3) {

            //         // get the vertices of the face

            //         getVertexByIndex(indices[i + 0], a);
            //         getVertexByIndex(indices[i + 1], b);
            //         getVertexByIndex(indices[i + 2], c);

            //         // perform subdivision

            //         subdivideFace(a, b, c, detail);

            //     }

            // }

            // function subdivideFace(a, b, c, detail) {

            //     var cols = Math.pow(2, detail);

            //     // we use this multidimensional array as a data structure for creating the subdivision

            //     var v = [];

            //     var i, j;

            //     // construct all of the vertices for this subdivision

            //     for (i = 0; i <= cols; i++) {

            //         v[i] = [];

            //         var aj = a.clone().lerp(c, i / cols);
            //         var bj = b.clone().lerp(c, i / cols);

            //         var rows = cols - i;

            //         for (j = 0; j <= rows; j++) {

            //             if (j === 0 && i === cols) {

            //                 v[i][j] = aj;

            //             } else {

            //                 v[i][j] = aj.clone().lerp(bj, j / rows);

            //             }

            //         }

            //     }

            //     // construct all of the faces

            //     for (i = 0; i < cols; i++) {

            //         for (j = 0; j < 2 * (cols - i) - 1; j++) {

            //             var k = Math.floor(j / 2);

            //             if (j % 2 === 0) {

            //                 pushVertex(v[i][k + 1]);
            //                 pushVertex(v[i + 1][k]);
            //                 pushVertex(v[i][k]);

            //             } else {

            //                 pushVertex(v[i][k + 1]);
            //                 pushVertex(v[i + 1][k + 1]);
            //                 pushVertex(v[i + 1][k]);

            //             }

            //         }

            //     }

            // }

            // function appplyRadius(radius) {

            //     var vertex = new Vector3();

            //     // iterate over the entire buffer and apply the radius to each vertex

            //     for (var i = 0; i < vertexBuffer.length; i += 3) {

            //         vertex.x = vertexBuffer[i + 0];
            //         vertex.y = vertexBuffer[i + 1];
            //         vertex.z = vertexBuffer[i + 2];

            //         vertex.normalize().multiplyScalar(radius);

            //         vertexBuffer[i + 0] = vertex.x;
            //         vertexBuffer[i + 1] = vertex.y;
            //         vertexBuffer[i + 2] = vertex.z;

            //     }

            // }

            // function generateUVs() {

            //     var vertex = new Vector3();

            //     for (var i = 0; i < vertexBuffer.length; i += 3) {

            //         vertex.x = vertexBuffer[i + 0];
            //         vertex.y = vertexBuffer[i + 1];
            //         vertex.z = vertexBuffer[i + 2];

            //         var u = azimuth(vertex) / 2 / Math.PI + 0.5;
            //         var v = inclination(vertex) / Math.PI + 0.5;
            //         uvBuffer.push(u, 1 - v);

            //     }

            //     correctUVs();

            //     correctSeam();

            // }

            // function correctSeam() {

            //     // handle case when face straddles the seam, see #3269

            //     for (var i = 0; i < uvBuffer.length; i += 6) {

            //         // uv data of a single face

            //         var x0 = uvBuffer[i + 0];
            //         var x1 = uvBuffer[i + 2];
            //         var x2 = uvBuffer[i + 4];

            //         var max = Math.max(x0, x1, x2);
            //         var min = Math.min(x0, x1, x2);

            //         // 0.9 is somewhat arbitrary

            //         if (max > 0.9 && min < 0.1) {

            //             if (x0 < 0.2) uvBuffer[i + 0] += 1;
            //             if (x1 < 0.2) uvBuffer[i + 2] += 1;
            //             if (x2 < 0.2) uvBuffer[i + 4] += 1;

            //         }

            //     }

            // }

            // function pushVertex(vertex) {

            //     vertexBuffer.push(vertex.x, vertex.y, vertex.z);

            // }

            // function getVertexByIndex(index, vertex) {

            //     var stride = index * 3;

            //     vertex.x = vertices[stride + 0];
            //     vertex.y = vertices[stride + 1];
            //     vertex.z = vertices[stride + 2];

            // }

            // function correctUVs() {

            //     var a = new Vector3();
            //     var b = new Vector3();
            //     var c = new Vector3();

            //     var centroid = new Vector3();

            //     var uvA = new Vector2();
            //     var uvB = new Vector2();
            //     var uvC = new Vector2();

            //     for (var i = 0, j = 0; i < vertexBuffer.length; i += 9, j += 6) {

            //         a.set(vertexBuffer[i + 0], vertexBuffer[i + 1], vertexBuffer[i + 2]);
            //         b.set(vertexBuffer[i + 3], vertexBuffer[i + 4], vertexBuffer[i + 5]);
            //         c.set(vertexBuffer[i + 6], vertexBuffer[i + 7], vertexBuffer[i + 8]);

            //         uvA.set(uvBuffer[j + 0], uvBuffer[j + 1]);
            //         uvB.set(uvBuffer[j + 2], uvBuffer[j + 3]);
            //         uvC.set(uvBuffer[j + 4], uvBuffer[j + 5]);

            //         centroid.copy(a).add(b).add(c).divideScalar(3);

            //         var azi = azimuth(centroid);

            //         correctUV(uvA, j + 0, a, azi);
            //         correctUV(uvB, j + 2, b, azi);
            //         correctUV(uvC, j + 4, c, azi);

            //     }

            // }

            // function correctUV(uv, stride, vector, azimuth) {

            //     if ((azimuth < 0) && (uv.x === 1)) {

            //         uvBuffer[stride] = uv.x - 1;

            //     }

            //     if ((vector.x === 0) && (vector.z === 0)) {

            //         uvBuffer[stride] = azimuth / 2 / Math.PI + 0.5;

            //     }

            // }

            // // Angle around the Y axis, counter-clockwise when looking from above.

            // function azimuth(vector) {

            //     return Math.atan2(vector.z, - vector.x);

            // }


            // // Angle above the XZ plane.

            // function inclination(vector) {

            //     return Math.atan2(- vector.y, Math.sqrt((vector.x * vector.x) + (vector.z * vector.z)));

            // }
        }

        private constructor() { }
    }
}
