namespace egret3d.particle {
    /**
     * @private
     * 渲染类型为Mesh的属性格式
     */
    const MeshShaderAttributeFormat: { key: string, type: gltf.AccessorType }[] = [
        { key: gltf.AttributeSemanticType.POSITION, type: gltf.AccessorType.VEC3 },
        { key: gltf.AttributeSemanticType.COLOR_0, type: gltf.AccessorType.VEC4 },
        { key: gltf.AttributeSemanticType.TEXCOORD_0, type: gltf.AccessorType.VEC2 },
        { key: gltf.AttributeSemanticType._START_POSITION, type: gltf.AccessorType.VEC3 },
        { key: gltf.AttributeSemanticType._START_VELOCITY, type: gltf.AccessorType.VEC3 },
        { key: gltf.AttributeSemanticType._START_COLOR, type: gltf.AccessorType.VEC4 },
        { key: gltf.AttributeSemanticType._START_SIZE, type: gltf.AccessorType.VEC3 },
        { key: gltf.AttributeSemanticType._START_ROTATION, type: gltf.AccessorType.VEC3 },
        { key: gltf.AttributeSemanticType._TIME, type: gltf.AccessorType.VEC2 },
        { key: gltf.AttributeSemanticType._RANDOM0, type: gltf.AccessorType.VEC4 },
        { key: gltf.AttributeSemanticType._RANDOM1, type: gltf.AccessorType.VEC4 },
        { key: gltf.AttributeSemanticType._WORLD_POSITION, type: gltf.AccessorType.VEC3 },
        { key: gltf.AttributeSemanticType._WORLD_ROTATION, type: gltf.AccessorType.VEC4 },
    ];
    /**
     * @private
     * 渲染类型为Billboard的属性格式
     */
    const BillboardShaderAttributeFormat: { key: string, type: gltf.AccessorType }[] = [
        { key: gltf.AttributeSemanticType._CORNER, type: gltf.AccessorType.VEC2 },
        { key: gltf.AttributeSemanticType.TEXCOORD_0, type: gltf.AccessorType.VEC2 },
        { key: gltf.AttributeSemanticType._START_POSITION, type: gltf.AccessorType.VEC3 },
        { key: gltf.AttributeSemanticType._START_VELOCITY, type: gltf.AccessorType.VEC3 },
        { key: gltf.AttributeSemanticType._START_COLOR, type: gltf.AccessorType.VEC4 },
        { key: gltf.AttributeSemanticType._START_SIZE, type: gltf.AccessorType.VEC3 },
        { key: gltf.AttributeSemanticType._START_ROTATION, type: gltf.AccessorType.VEC3 },
        { key: gltf.AttributeSemanticType._TIME, type: gltf.AccessorType.VEC2 },
        { key: gltf.AttributeSemanticType._RANDOM0, type: gltf.AccessorType.VEC4 },
        { key: gltf.AttributeSemanticType._RANDOM1, type: gltf.AccessorType.VEC4 },
        { key: gltf.AttributeSemanticType._WORLD_POSITION, type: gltf.AccessorType.VEC3 },
        { key: gltf.AttributeSemanticType._WORLD_ROTATION, type: gltf.AccessorType.VEC4 },
    ];

    /**
    * @internal
    */
    export function createBatchMesh(renderer: ParticleRenderer, maxParticleCount: number) {
        const meshAttributes: string[] = [];
        const meshAttributesType: { [key: string]: gltf.AccessorType } = {};
        if (renderer.renderMode === ParticleRenderMode.Mesh) {
            const mesh = renderer.mesh!;
            const orginIndexBuffer = mesh.getIndices()!;
            const orginIndexBufferCount = orginIndexBuffer.length;
            for (const attribute of MeshShaderAttributeFormat) {
                meshAttributes.push(attribute.key);
                meshAttributesType[attribute.key] = attribute.type;
            }

            const totalVertexCount = mesh.vertexCount * maxParticleCount;
            const totalIndexCount = orginIndexBufferCount * maxParticleCount;
            const batchMesh = Mesh.create(totalVertexCount, totalIndexCount, meshAttributes, meshAttributesType, gltf.DrawMode.Dynamic);
            //
            let index = 0;
            //提前填充
            const orginPostionBuffer = mesh.getAttributes(gltf.MeshAttributeType.POSITION)!;
            const orginUVBuffer = mesh.getAttributes(gltf.MeshAttributeType.TEXCOORD_0);
            const orginColorBuffer = mesh.getAttributes(gltf.MeshAttributeType.COLOR_0);
            const positionBuffer = batchMesh.getAttributes(gltf.AttributeSemanticType.POSITION)!;
            const colorBuffer = batchMesh.getAttributes(gltf.AttributeSemanticType.COLOR_0)!;
            const uvBuffer = batchMesh.getAttributes(gltf.AttributeSemanticType.TEXCOORD_0)!;
            for (let i = 0; i < totalVertexCount; i++) {
                const vector2Offset = i * 2;
                const vector3Offset = i * 3;
                const vector4Offset = i * 4;
                const orginVertexIndex = i % mesh.vertexCount;
                positionBuffer[vector3Offset] = orginPostionBuffer[orginVertexIndex * 3];
                positionBuffer[vector3Offset + 1] = orginPostionBuffer[orginVertexIndex * 3 + 1];
                positionBuffer[vector3Offset + 2] = orginPostionBuffer[orginVertexIndex * 3 + 2];

                if (orginUVBuffer) {
                    uvBuffer[vector2Offset] = orginUVBuffer[orginVertexIndex * 2];
                    uvBuffer[vector2Offset + 1] = orginUVBuffer[orginVertexIndex * 2 + 1];
                }

                if (orginColorBuffer) {
                    colorBuffer[vector4Offset] = orginColorBuffer[orginVertexIndex * 4];
                    colorBuffer[vector4Offset + 1] = orginColorBuffer[orginVertexIndex * 4 + 1];
                    colorBuffer[vector4Offset + 2] = orginColorBuffer[orginVertexIndex * 4 + 2];
                    colorBuffer[vector4Offset + 3] = orginColorBuffer[orginVertexIndex * 4 + 3];
                } else {
                    colorBuffer[vector4Offset] = 1;
                    colorBuffer[vector4Offset + 1] = 1;
                    colorBuffer[vector4Offset + 2] = 1;
                    colorBuffer[vector4Offset + 3] = 1;
                }
            }

            const indexBuffer = batchMesh.getIndices()!;
            for (let i = 0; i < maxParticleCount; i++) {
                const indexOffset = i * mesh.vertexCount;
                for (let j = 0; j < orginIndexBufferCount; j++) {
                    indexBuffer[index++] = orginIndexBuffer[j] + indexOffset;
                }
            }
            return batchMesh;
        } else {
            const orginIndexBuffer = [0, 2, 1, 0, 3, 2];
            const orginIndexBufferCount = orginIndexBuffer.length;
            for (const attribute of BillboardShaderAttributeFormat) {
                meshAttributes.push(attribute.key);
                meshAttributesType[attribute.key] = attribute.type;
            }

            const vertexStride = 4;
            const totalVertexCount = vertexStride * maxParticleCount;
            const totalIndexCount = orginIndexBufferCount * maxParticleCount;
            const batchMesh = Mesh.create(totalVertexCount, totalIndexCount, meshAttributes, meshAttributesType, gltf.DrawMode.Dynamic);

            const cornerBuffer = batchMesh.getAttributes(gltf.AttributeSemanticType._CORNER)!;
            const uvBuffer = batchMesh.getAttributes(gltf.AttributeSemanticType.TEXCOORD_0)!;
            for (let i = 0; i < totalVertexCount; i++) {
                const orginVertexIndex = i % vertexStride;
                const vector2Offset = i * 2;
                switch (orginVertexIndex) {
                    case 0:
                        cornerBuffer[vector2Offset] = -0.5;
                        cornerBuffer[vector2Offset + 1] = -0.5;
                        uvBuffer[vector2Offset] = 0.0;
                        uvBuffer[vector2Offset + 1] = 1.0;
                        break;
                    case 1:
                        cornerBuffer[vector2Offset] = 0.5;
                        cornerBuffer[vector2Offset + 1] = -0.5;
                        uvBuffer[vector2Offset] = 1.0;
                        uvBuffer[vector2Offset + 1] = 1.0;
                        break;
                    case 2:
                        cornerBuffer[vector2Offset] = 0.5;
                        cornerBuffer[vector2Offset + 1] = 0.5;
                        uvBuffer[vector2Offset] = 1.0;
                        uvBuffer[vector2Offset + 1] = 0.0;
                        break;
                    case 3:
                        cornerBuffer[vector2Offset] = -0.5;
                        cornerBuffer[vector2Offset + 1] = 0.5;
                        uvBuffer[vector2Offset] = 0.0;
                        uvBuffer[vector2Offset + 1] = 0.0;
                        break;
                }
            }
            const indexBuffer = batchMesh.getIndices()!;
            for (let i = 0; i < maxParticleCount; i++) {
                const indexOffset = i * 6;
                const firstVertex = i * vertexStride;
                const secondVertex = firstVertex + 2;
                indexBuffer[indexOffset + 0] = firstVertex;
                indexBuffer[indexOffset + 1] = secondVertex;
                indexBuffer[indexOffset + 2] = firstVertex + 1;
                indexBuffer[indexOffset + 3] = firstVertex;
                indexBuffer[indexOffset + 4] = firstVertex + 3;
                indexBuffer[indexOffset + 5] = secondVertex;
            }
            return batchMesh;
        }
    }
    /**
     * @internal
     */
    export function generatePositionAndDirection(position: Vector3, direction: Vector3, shape: ShapeModule) {
        position.x = position.y = position.z = 0;
        direction.x = direction.y = 0;
        direction.z = 1.0;
        //
        switch (shape.shapeType) {
            case ShapeType.Cone:
            case ShapeType.ConeShell:
                {
                    _generateConeParticlePosition(shape, position, direction);
                }
                break;
            case ShapeType.ConeVolume:
            case ShapeType.ConeVolumeShell:
                {
                    _generateConeVolumeParticlePosition(shape, position, direction);
                }
                break;
            case ShapeType.Box:
                {
                    _generateBoxParticlePosition(shape, position, direction);
                }
                break;
            case ShapeType.Sphere:
            case ShapeType.SphereShell:
                {
                    _generateSphereParticlePosition(shape, position, direction);
                }
                break;
            case ShapeType.Circle:
                {
                    _generateCircleParticlePosition(shape, position, direction);
                }
                break;
        }

        direction.normalize();
    }

    function _randomPostionCircle(out: Vector3) {
        const angle = Math.random() * Math.PI * 2;
        out.x = Math.cos(angle);
        out.y = Math.sin(angle);
    }

    function _randomPositionInsideCircle(out: Vector3) {
        _randomPostionCircle(out);

        const range = Math.pow(Math.random(), 0.5);
        out.x = out.x * range;
        out.y = out.y * range;
    }

    function _randomPositionArcCircle(arc: number, out: Vector3) {
        arc *= Math.PI / 180.0;
        const angle = Math.random() * arc;
        out.x = Math.cos(angle);
        out.y = Math.sin(angle);
    }

    function _randomPositionInsideArcCircle(arc: number, out: Vector3) {
        _randomPositionArcCircle(arc, out);
        const range = Math.pow(Math.random(), 0.5);
        out.x = out.x * range;
        out.y = out.y * range;
    }

    function _randomPositionSphere(out: Vector3) {
        const ranZ = Math.random() * 2 - 1.0;
        const angle = Math.random() * Math.PI * 2;
        const range = Math.sqrt(1.0 - ranZ * ranZ);

        out.x = Math.cos(angle) * range;
        out.y = Math.sin(angle) * range;
        out.z = ranZ;
    }

    function _randomPositionInsideSphere(out: Vector3) {
        _randomPositionSphere(out);
        const range = Math.pow(Math.random(), 1.0 / 3.0);

        out.x = out.x * range;
        out.y = out.y * range;
        out.z = out.z * range;
    }

    function _generateConeParticlePosition(shape: ShapeModule, position: Vector3, direction: Vector3) {
        const temp = Vector3.create().release();
        if (shape.shapeType === ShapeType.Cone) {
            _randomPositionInsideCircle(temp);
        } else {
            _randomPostionCircle(temp);
        }

        position.x = temp.x * shape.radius;
        position.y = temp.y * shape.radius;
        position.z = temp.z * shape.radius;

        const angle = shape.angle * Math.PI / 180.0;
        const sinValue = Math.sin(angle);
        const cosValue = Math.cos(angle);
        if (shape.randomDirection) {
            _randomPositionInsideCircle(direction);
            direction.x = direction.x * sinValue;
            direction.y = direction.y * sinValue;
            direction.z = cosValue;
        } else {
            direction.x = temp.x * sinValue;
            direction.y = temp.y * sinValue;
            direction.z = cosValue;
        }
    }

    function _generateConeVolumeParticlePosition(shape: ShapeModule, position: Vector3, direction: Vector3) {
        const temp = Vector3.create().release();
        if (shape.shapeType === ShapeType.ConeVolume) {
            _randomPositionInsideCircle(temp);
        } else {
            _randomPostionCircle(temp);
        }

        position.x = temp.x * shape.radius;
        position.y = temp.y * shape.radius;
        position.z = 0;

        const angle = shape.angle * Math.PI / 180.0;
        const sinValue = Math.sin(angle);
        const cosValue = Math.cos(angle);

        direction.x = temp.x * sinValue;
        direction.y = temp.y * sinValue;
        direction.z = cosValue;

        Vector3.normalize(direction);
        const len = Math.random() * shape.length;
        direction.x = direction.x * len;
        direction.y = direction.y * len;
        direction.z = direction.z * len;

        position.x += direction.x;
        position.y += direction.y;
        position.z += direction.z;

        if (shape.randomDirection) {
            _randomPositionSphere(direction);
        }
    }

    function _generateBoxParticlePosition(shape: ShapeModule, position: Vector3, direction: Vector3) {
        position.x = shape.box.x * (Math.random() - 0.5);
        position.y = shape.box.y * (Math.random() - 0.5);
        position.z = shape.box.z * (Math.random() - 0.5);

        if (shape.randomDirection) {
            direction.x = 0.0;
            direction.y = 0.0;
            direction.z = 1.0;
        } else {
            direction.x = 0.0;
            direction.y = 0.0;
            direction.z = 1.0;
        }
    }

    function _generateSphereParticlePosition(shape: ShapeModule, position: Vector3, direction: Vector3) {
        const temp = Vector3.create().release();
        if (!shape.spherizeDirection) {
            if (shape.shapeType === ShapeType.Sphere) {
                _randomPositionInsideSphere(position);
            } else {
                _randomPositionSphere(position);
            }
        }

        position.x = position.x * shape.radius;
        position.y = position.y * shape.radius;
        position.z = position.z * shape.radius;

        if (shape.randomDirection || shape.spherizeDirection) {
            _randomPositionSphere(direction);
        } else {
            direction.x = position.x;
            direction.y = position.y;
            direction.z = position.z;
        }
    }

    function _generateCircleParticlePosition(shape: ShapeModule, position: Vector3, direction: Vector3) {
        const temp = Vector3.create().release();
        _randomPositionArcCircle(shape.arc, temp);        

        position.x = -temp.x * shape.radius;
        position.y = temp.y * shape.radius;
        position.z = 0;

        if (shape.randomDirection) {
            _randomPositionSphere(direction);
        } else {
            direction.x = position.x;
            direction.y = position.y;
            direction.z = position.z;
        }
    }
}
