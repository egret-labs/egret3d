namespace egret3d {

    interface DefaultMeshData {
        vbo: Float32Array;
        ibo: Uint16Array;
    }

    const _plane = {
        vbo: new Float32Array([
            -5, 0, 5, -5, 0, -5, 5, 0, 5, 5, 0, -5,
            0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
            1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            0, 0, 0, 1, 1, 0, 1, 1
        ]),
        ibo: new Uint16Array([
            0, 1, 2,
            2, 1, 3
        ])
    };

    const _cube = {
        vbo: new Float32Array([
            -0.5, -0.5, -0.5,
            -0.5, -0.5, 0.5,
            0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5,
            0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,
            -0.5, -0.5, 0.5,
            -0.5, 0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5,
            -0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,
            0.5, 0.5, -0.5,
            0.5, 0.5, 0.5,
            -0.5, -0.5, 0.5,
            -0.5, -0.5, -0.5,
            -0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5,

            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,

            -1, 0, 0, 1,
            -1, 0, 0, 1,
            -1, 0, 0, 1,
            -1, 0, 0, 1,
            1, 0, 0, 1,
            1, 0, 0, 1,
            1, 0, 0, 1,
            1, 0, 0, 1,
            -1, 0, 0, 1,
            -1, 0, 0, 1,
            -1, 0, 0, 1,
            -1, 0, 0, 1,
            1, 0, 0, 1,
            1, 0, 0, 1,
            1, 0, 0, 1,
            1, 0, 0, 1,
            0, 0, 1, 1,
            0, 0, 1, 1,
            0, 0, 1, 1,
            0, 0, 1, 1,
            0, 0, -1, 1,
            0, 0, -1, 1,
            0, 0, -1, 1,
            0, 0, -1, 1,

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
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,

            0, 0,
            0, 1,
            1, 0,
            1, 1,
            0, 0,
            0, 1,
            1, 0,
            1, 1,
            1, 1,
            1, 0,
            0, 1,
            0, 0,
            0, 0,
            0, 1,
            1, 0,
            1, 1,
            0, 1,
            1, 1,
            0, 0,
            1, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 0,
        ]),
        ibo: new Uint16Array([
            0, 1, 2, 2, 1, 3,
            4, 5, 6, 6, 5, 7,
            8, 9, 10, 10, 9, 11,
            12, 13, 14, 14, 13, 15,
            16, 17, 18, 18, 17, 19,
            20, 21, 22, 22, 21, 23
        ])
    };

    const _circleLine = {
        vbo: new Float32Array([
            -0.5, 0.5, 0,
            -0.5, -0.5, 0,
            0.5, 0.5, 0,
            0.5, -0.5, 0,

            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,

            1, 0, 0, 1,
            1, 0, 0, 1,
            1, 0, 0, 1,
            1, 0, 0, 1,

            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,

            0, 0,
            0, 1,
            1, 0,
            1, 1,
        ]),
        ibo: new Uint16Array([
            0, 1, 2,
            2, 1, 3
        ])
    };

    const _quadParticle = {
        vbo: new Float32Array([
            0, 0.5, 0,
            0, -0.5, 0,
            1, 0.5, 0,
            1, -0.5, 0,

            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,

            1, 0, 0, 1,
            1, 0, 0, 1,
            1, 0, 0, 1,
            1, 0, 0, 1,

            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,

            0, 0,
            0, 1,
            1, 0,
            1, 1,
        ]),
        ibo: new Uint16Array([
            0, 1, 2,
            2, 1, 3
        ])
    };

    const _quad = {
        vbo: new Float32Array([
            -0.5, 0.5, 0,
            -0.5, -0.5, 0,
            0.5, 0.5, 0,
            0.5, -0.5, 0,

            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,

            1, 0, 0, 1,
            1, 0, 0, 1,
            1, 0, 0, 1,
            1, 0, 0, 1,

            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,

            0, 0,
            0, 1,
            1, 0,
            1, 1,
        ]),
        ibo: new Uint16Array([
            0, 1, 2,
            2, 1, 3
        ])
    };

    const _pyramid = {
        vbo: new Float32Array([
            -0.5, -1, -0.5,
            0, 1, 0,
            0.5, -1, -0.5,
            0.5, -1, -0.5,
            0, 1, 0,
            0.5, -1, 0.5,
            0.5, -1, 0.5,
            0, 1, 0,
            -0.5, -1, 0.5,
            -0.5, -1, 0.5,
            0, 1, 0,
            -0.5, -1, -0.5,
            -0.5, -1, -0.5,
            0.5, -1, -0.5,
            0.5, -1, 0.5,
            -0.5, -1, 0.5,

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

            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,

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
        ]),
        ibo: new Uint16Array([
            0, 2, 1, 3, 5, 4,
            6, 8, 7, 9, 11, 10,
            12, 14, 13, 15, 14, 12
        ])
    };

    const _box = {
        ibo: new Uint16Array([
            0, 1, 2, 2, 1, 3,
            4, 5, 6, 6, 5, 7,
            1, 3, 5, 5, 3, 7,
            0, 2, 4, 4, 2, 6,
            6, 2, 7, 7, 2, 3,
            0, 4, 1, 1, 4, 5,
        ])
    };

    const _attributesA: gltf.MeshAttributeType[] = [
        gltf.MeshAttributeType.POSITION,
        gltf.MeshAttributeType.NORMAL,
        gltf.MeshAttributeType.TANGENT,
        gltf.MeshAttributeType.COLOR_0,
        gltf.MeshAttributeType.TEXCOORD_0,
    ];

    const _attributesB: gltf.MeshAttributeType[] = [
        gltf.MeshAttributeType.POSITION,
        gltf.MeshAttributeType.NORMAL,
        gltf.MeshAttributeType.TEXCOORD_0,
    ];

    const _attributesC: gltf.MeshAttributeType[] = [
        gltf.MeshAttributeType.POSITION,
    ];

    export class DefaultMeshes {
        public static QUAD: Mesh;
        public static QUAD_PARTICLE: Mesh;
        public static PLANE: Mesh;
        public static CIRCLE_LINE: Mesh;
        public static CUBE: Mesh;
        public static PYRAMID: Mesh;
        public static CYLINDER: Mesh;
        public static SPHERE: Mesh;

        private static _inited: boolean = false;

        public static init() {
            if (this._inited) {
                return;
            }

            this._inited = true;

            this.QUAD = this._createDefaultMeshA(_quad);
            this.QUAD_PARTICLE = this._createDefaultMeshA(_quadParticle);
            this.PLANE = this._createDefaultMeshA(_plane);
            this.CIRCLE_LINE = this._createDefaultMeshA(_circleLine);
            this.CUBE = this._createDefaultMeshA(_cube);
            this.PYRAMID = this._createDefaultMeshA(_pyramid);
            this.CYLINDER = this.createCylinderCCW(2, 0.5);
            this.SPHERE = this.createSphereCCW();
        }

        private static _createDefaultMeshA(data: DefaultMeshData) {
            const mesh = new Mesh(data.vbo, data.ibo, _attributesA);

            return mesh;
        }

        public static genBoxByArray(array: egret3d.Vector3[]) {
            const vertexCount = 8;
            const mesh = new Mesh(vertexCount, _box.ibo, _attributesC);
            const vertices = mesh.getVertices();

            for (let i = 0; i < vertexCount; ++i) {
                const iD = i * 3;
                const vertex = array[i];
                vertices[iD] = vertex.x;
                vertices[iD + 1] = vertex.y;
                vertices[iD + 2] = vertex.z;
            }

            mesh.uploadSubVertexBuffer(_attributesC);

            return mesh;
        }

        public static createCylinderCCW(height: number, radius: number, segment = 20) {
            let index = 0;
            const mesh = new Mesh(4 * segment + 2, 3 * 4 * segment, _attributesB);
            const normal = new Vector3(0.0, 1.0, 0.0);
            const indices = mesh.getIndices() as Uint16Array;

            for (let s = 0; s < 4; s++) {
                const y = (s < 2 ? 0.5 : -0.5) * height;

                if (s === 3) {
                    normal.x = 0.0;
                    normal.y = -1.0;
                    normal.z = 0.0;
                }

                for (let i = 0; i < segment; i++) {
                    const r = i / segment * Math.PI * 2.0;
                    const x = Math.sin(r);
                    const z = Math.cos(r);

                    if (s === 1 || s === 2) {
                        normal.x = x;
                        normal.y = 0.0;
                        normal.z = z;
                    }

                    mesh.setAttribute(index, gltf.MeshAttributeType.POSITION, 0, x * radius, y, z * radius);
                    // mesh.setVertexAttribute(index, gltf.MeshAttributeType.NORMAL, 0, normal.x, normal.y, normal.z);

                    if (s === 0 || s === 3) {
                        mesh.setAttribute(index, gltf.MeshAttributeType.TEXCOORD_0, 0, x * 0.5 + 0.5, z * 0.5 + 0.5);
                    }
                    else {
                        mesh.setAttribute(index, gltf.MeshAttributeType.TEXCOORD_0, 0, i / segment, y < 0.0 ? 0.0 : 1.0);
                    }

                    index++;
                }
            }

            // Top
            mesh.setAttribute(index, gltf.MeshAttributeType.POSITION, 0, 0.0, 0.5 * height, 0.0);
            // mesh.setVertexAttribute(index, gltf.MeshAttributeType.NORMAL, 0, 0.0, 1.0, 0.0);
            mesh.setAttribute(index, gltf.MeshAttributeType.TEXCOORD_0, 0, 0.5, 0.5);
            index++;
            // Bottom
            mesh.setAttribute(index, gltf.MeshAttributeType.POSITION, 0, 0.0, -0.5 * height, 0.0);
            // mesh.setVertexAttribute(index, gltf.MeshAttributeType.NORMAL, 0, 0.0, -1.0, 0.0);
            mesh.setAttribute(index, gltf.MeshAttributeType.TEXCOORD_0, 0, 0.5, 0.5);
            index++;
            //
            index = 0;
            const iTop = 4 * segment;
            const iBottom = 4 * segment + 1;

            for (let i = 0; i < segment; i++) {
                // Top
                indices[index++] = iTop;
                indices[index++] = i === segment - 1 ? segment * 0 + 0 : segment * 0 + i + 1;
                indices[index++] = segment * 0 + i + 0;

                // Bottom
                indices[index++] = iBottom;
                indices[index++] = segment * 3 + i + 0;
                indices[index++] = i === segment - 1 ? segment * 3 + 0 : segment * 3 + i + 1;

                // Side
                const t = segment * 1 + i;
                const t2 = i === segment - 1 ? segment * 1 + 0 : segment * 1 + i + 1;
                const b = segment * 2 + i;
                const b2 = i === segment - 1 ? segment * 2 + 0 : segment * 2 + i + 1;
                indices[index++] = t;
                indices[index++] = t2;
                indices[index++] = b;
                indices[index++] = t2;
                indices[index++] = b2;
                indices[index++] = b;
            }

            mesh.uploadSubVertexBuffer(_attributesB);
            mesh.uploadSubIndexBuffer();

            return mesh;
        }

        public static createSphereCCW(radius: number = 1.0, widthSegments: number = 24, heightSegments: number = 12) {
            widthSegments = Math.max(3, Math.floor(widthSegments));
            heightSegments = Math.max(2, Math.floor(heightSegments));
            const mesh = new Mesh((widthSegments + 1) * (heightSegments + 1), widthSegments * heightSegments * 6 - 6, _attributesB);
            //
            let index = 0;
            let iv = 0;
            const vertex = new Vector3();
            const normal = new Vector3();
            const grid = new Array<number[]>();

            for (let iy = 0; iy <= heightSegments; iy++) {
                const verticesRow = new Array<number>();
                const v = iy / heightSegments;

                for (let ix = 0; ix <= widthSegments; ix++) {
                    const u = ix / widthSegments;
                    // Vertex.
                    vertex.x = -radius * Math.cos(u * Math.PI * 2) * Math.sin(v * Math.PI);
                    vertex.y = radius * Math.cos(v * Math.PI);
                    vertex.z = radius * Math.sin(u * Math.PI * 2) * Math.sin(v * Math.PI);
                    mesh.setAttribute(iv, gltf.MeshAttributeType.POSITION, 0, vertex.x, vertex.y, vertex.z);
                    // Normal.
                    normal.x = vertex.x;
                    normal.y = vertex.y;
                    normal.z = vertex.z;
                    const num = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);

                    if (num > Number.MIN_VALUE) {
                        mesh.setAttribute(iv, gltf.MeshAttributeType.NORMAL, 0, normal.x / num, normal.y / num, normal.z / num);
                    }
                    else {
                        mesh.setAttribute(iv, gltf.MeshAttributeType.NORMAL, 0, 0.0, 0.0, 0.0);
                    }

                    mesh.setAttribute(iv, gltf.MeshAttributeType.TEXCOORD_0, 0, 1.0 - u, v);
                    iv++;
                    verticesRow.push(index++);
                }

                grid.push(verticesRow);
            }

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

            mesh.uploadSubVertexBuffer(_attributesB);
            mesh.uploadSubIndexBuffer();

            return mesh;
        }
    }
}
