
interface OES_vertex_array_object {
    bindVertexArrayOES(arrayObject: WebGLVertexArrayObjectOES | null): void;
    createVertexArrayOES(): WebGLVertexArrayObjectOES | null;
    deleteVertexArrayOES(arrayObject: WebGLVertexArrayObjectOES | null): void;
    isVertexArrayOES(arrayObject: WebGLVertexArrayObjectOES | null): GLboolean;
    readonly VERTEX_ARRAY_BINDING_OES: GLenum;
}

interface EXT_shader_texture_lod {
}
