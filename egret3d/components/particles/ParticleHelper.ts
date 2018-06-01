namespace egret3d.particle {

    /**
    * @internal
    */
    export function createBatchMesh(renderer: ParticleRenderer, maxParticleCount: number) {
        if (renderer._renderMode === ParticleRenderMode.None || maxParticleCount <= 0) {
            throw "ParticleSystem : error renderMode or maxParticleCount";
        }

        const meshAttributes: string[] = [];
        const meshAttributesType: gltf.AccessorType[] = [];
        if (renderer._renderMode === ParticleRenderMode.Mesh) {
            const mesh = renderer.mesh;
            if (mesh.subMeshCount > 1) {
                throw "ParticleSystem : subMeshCount > 1";
            }

            const orginIndexBuffer = mesh.getIndices();
            const orginIndexBufferCount = orginIndexBuffer.length;
            for (const attribute of MeshShaderAttributeFormat) {
                meshAttributes.push(attribute.key);
                meshAttributesType.push(attribute.type);
            }

            const totalVertexCount = mesh.vertexCount * maxParticleCount;
            const totalIndexCount = orginIndexBufferCount * maxParticleCount;
            const batchMesh = new Mesh(totalVertexCount, totalIndexCount, totalIndexCount, meshAttributes, meshAttributesType, MeshDrawMode.Dynamic);
            const indexBuffer = batchMesh.getIndices();
            //
            let index = 0;
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
                meshAttributesType.push(attribute.type);
            }

            const vertexStride = 4;
            const totalVertexCount = vertexStride * maxParticleCount;
            const totalIndexCount = orginIndexBufferCount * maxParticleCount;

            const batchMesh = new Mesh(totalVertexCount, totalIndexCount, totalIndexCount, meshAttributes, meshAttributesType, MeshDrawMode.Dynamic);
            const indexBuffer = batchMesh.getIndices();

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
        if (!shape.enable) {
            position.x = position.y = position.z = 0;
            direction.x = direction.y = 0;
            direction.z = 1.0;
            return;
        }
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
            default:
                {
                    position.x = position.y = position.z = 0;
                    direction.x = direction.y = 0;
                    direction.z = 1;
                }
        }
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
        const temp = new Vector3();
        if (shape.shapeType == ShapeType.Cone) {
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
        const temp = new Vector3();
        if (shape.shapeType == ShapeType.ConeVolume) {
            _randomPositionInsideCircle(temp);
        } else {
            _randomPostionCircle(temp);
        }

        position.x = temp.x * shape.radius;
        position.y = temp.y * shape.radius;
        position.z = 0;

        const sinValue = Math.sin(shape.angle);
        const cosValue = Math.cos(shape.angle);

        direction.x = temp.x * sinValue;
        direction.y = temp.y * sinValue;
        direction.z = cosValue;

        direction = Vector3.normalize(direction);
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
        const temp = new Vector3();
        if (!shape.spherizeDirection) {
            if (shape.shapeType == ShapeType.Sphere) {
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
        const temp = new Vector3();
        if (shape.shapeType == ShapeType.Circle) {
            _randomPositionInsideArcCircle(shape.radiusSpread, temp);
        } else {
            _randomPositionArcCircle(shape.radiusSpread, temp);
        }

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