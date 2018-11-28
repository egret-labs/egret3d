// namespace egret3d {

//     export class RenderState extends paper.SingletonComponent {
//         public readonly clearColor: Color = Color.create();
//         public readonly viewPort: Rectangle = Rectangle.create();
//         public renderTarget: BaseRenderTarget | null = null;

//         public render: (camera: Camera, material?: Material) => void = null!;
//         public draw: (drawCall: DrawCall) => void = null!;

//         private readonly _stateEnables: ReadonlyArray<gltf.EnableState> = [gltf.EnableState.BLEND, gltf.EnableState.CULL_FACE, gltf.EnableState.DEPTH_TEST]; // TODO
//         private readonly _programs: { [key: string]: WebGLProgramBinder } = {};
//         private readonly _vsShaders: { [key: string]: WebGLShader } = {};
//         private readonly _fsShaders: { [key: string]: WebGLShader } = {};
//         private readonly _cacheStateEnable: { [key: string]: boolean | undefined } = {};
//         private _cacheProgram: WebGLProgramBinder | null = null;
//         private _cacheState: gltf.States | null = null;

//         private _getWebGLProgram(vs: gltf.Shader, fs: gltf.Shader, customDefines: string) {
//             const webgl = WebGLCapabilities.webgl!;
//             const program = webgl.createProgram()!;

//             let key = vs.name + customDefines;
//             let vertexShader = this._vsShaders[key];
//             if (!vertexShader) {
//                 const prefixVertex = _prefixVertex(customDefines);
//                 vertexShader = _getWebGLShader(webgl.VERTEX_SHADER, webgl, vs, prefixVertex)!;
//                 this._vsShaders[key] = vertexShader;
//             }

//             key = fs.name + customDefines;
//             let fragmentShader = this._fsShaders[key];
//             if (!fragmentShader) {
//                 const prefixFragment = _prefixFragment(customDefines);
//                 fragmentShader = _getWebGLShader(webgl.FRAGMENT_SHADER, webgl, fs, prefixFragment)!;
//                 this._fsShaders[key] = fragmentShader;
//             }

//             webgl.attachShader(program, vertexShader);
//             webgl.attachShader(program, fragmentShader);
//             webgl.linkProgram(program);

//             const parameter = webgl.getProgramParameter(program, webgl.LINK_STATUS);
//             if (!parameter) {
//                 console.error("program compile: " + vs.name + "_" + fs.name + " error! ->" + webgl.getProgramInfoLog(program));
//                 // alert("program compile: " + vs.name + "_" + fs.name + " error! ->" + webgl.getProgramInfoLog(program));
//                 webgl.deleteProgram(program);

//                 return null;
//             }

//             return program;
//         }

//         public initialize(renderSystem: IRenderSystem) {
//             super.initialize();

//             if (renderSystem) {
//                 this.render = renderSystem.render.bind(renderSystem);
//                 this.draw = renderSystem.draw.bind(renderSystem);
//             }
//         }

//         public updateViewport(viewport: Readonly<Rectangle>, target: BaseRenderTarget | null) { // TODO
//             const webgl = WebGLCapabilities.webgl!;
//             let w: number;
//             let h: number;

//             this.viewPort.copy(viewport);
//             this.renderTarget = target;

//             if (target) {
//                 w = target.width;
//                 h = target.height;
//                 target.use();
//             }
//             else {
//                 const stageViewport = stage.viewport;
//                 w = stageViewport.w;
//                 h = stageViewport.h;
//                 webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);
//             }

//             webgl.viewport(w * viewport.x, h * (1.0 - viewport.y - viewport.h), w * viewport.w, h * viewport.h);
//             webgl.depthRange(0.0, 1.0); // TODO
//         }

//         public updateState(state: gltf.States | null) {
//             if (this._cacheState === state) {
//                 return;
//             }
//             this._cacheState = state;

//             const webgl = WebGLCapabilities.webgl!;
//             const stateEnables = this._stateEnables;
//             const cacheStateEnable = this._cacheStateEnable;
//             for (const e of stateEnables) {
//                 const b = state ? state.enable && state.enable.indexOf(e) >= 0 : false;
//                 if (cacheStateEnable[e] !== b) {
//                     cacheStateEnable[e] = b;
//                     b ? webgl.enable(e) : webgl.disable(e);
//                 }
//             }
//             // Functions.
//             if (state) {
//                 const functions = state.functions;
//                 if (functions) {
//                     for (const fun in functions) {
//                         ((webgl as any)[fun] as Function).apply(webgl, functions[fun]);
//                     }
//                 }
//             }
//         }

//         public clearState() {
//             for (const key in this._cacheStateEnable) {
//                 delete this._cacheStateEnable[key];
//             }

//             this._cacheProgram = null;
//             this._cacheState = null;
//         }

//         public useProgram(program: WebGLProgramBinder) {
//             if (this._cacheProgram !== program) {
//                 this._cacheProgram = program;
//                 WebGLCapabilities.webgl!.useProgram(program.program);

//                 return true;
//             }

//             return false;
//         }

//         public getProgram(material: Material, technique: gltf.Technique, defines: string) {
//             const shader = material._shader;
//             const extensions = shader.config.extensions!.KHR_techniques_webgl;
//             const vertexShader = extensions!.shaders[0];
//             const fragShader = extensions!.shaders[1];
//             const name = vertexShader.name + "_" + fragShader.name + "_" + defines;//TODO材质标脏可以优化
//             const webgl = WebGLCapabilities.webgl!;
//             let program = this._programs[name];

//             if (!program) {
//                 const webglProgram = this._getWebGLProgram(vertexShader, fragShader, defines);
//                 if (webglProgram) {
//                     program = new WebGLProgramBinder(webglProgram);
//                     this._programs[name] = program;
//                     _extractAttributes(webgl, program, technique);
//                     _extractUniforms(webgl, program, technique);
//                     _extractTextureUnits(program);
//                 }
//             }

//             if (technique.program !== program.id) {
//                 technique.program = program.id;
//             }

//             return program;
//         }

//         public clearBuffer(bufferBit: gltf.BufferMask, clearColor?: Readonly<IColor>) {
//             const webgl = WebGLCapabilities.webgl!;

//             if (bufferBit & gltf.BufferMask.Depth) {
//                 webgl.depthMask(true);
//                 webgl.clearDepth(1.0);
//             }

//             if (bufferBit & gltf.BufferMask.Stencil) {
//                 webgl.clearStencil(1.0);
//             }

//             if ((bufferBit & gltf.BufferMask.Color) !== 0 && clearColor) {
//                 webgl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
//             }

//             webgl.clear(bufferBit);
//         }

//         public copyFramebufferToTexture(screenPostion: Vector2, target: ITexture, level: number = 0) {
//             const webgl = WebGLCapabilities.webgl!;
//             webgl.activeTexture(webgl.TEXTURE0);
//             webgl.bindTexture(webgl.TEXTURE_2D, target.texture);
//             webgl.copyTexImage2D(webgl.TEXTURE_2D, level, target.format, screenPostion.x, screenPostion.y, target.width, target.height, 0);//TODO
//         }
//     }
// }