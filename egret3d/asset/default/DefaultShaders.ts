namespace egret3d {

    export class DefaultShaders {

        public static TRANSPARENT: Shader;
        public static TRANSPARENT_ADDITIVE: Shader;
        public static TRANSPARENT_BOTH_SIDE: Shader;
        public static TRANSPARENT_ADDITIVE_BOTH_SIDE: Shader;
        public static DIFFUSE: Shader;
        public static DIFFUSE_TINT_COLOR: Shader;
        public static DIFFUSE_VERT_COLOR: Shader;
        public static DIFFUSE_BOTH_SIDE: Shader;
        public static UI: Shader;
        public static UI_FONT: Shader;
        public static LINE: Shader;
        public static MATERIAL_COLOR: Shader;
        public static LAMBERT: Shader;
        public static LAMBERT_NORMAL: Shader;
        public static GIZMOS_COLOR: Shader;

        private static _inited: boolean = false;

        public static init() {
            if (this._inited) {
                return;
            }

            this._inited = true;

            const def_code_vs = Shader.registerVertShader("def_code", ShaderLib.code_vert);
            const def_code_fs = Shader.registerFragShader("def_code", ShaderLib.code_frag);
            const def_code2_fs = Shader.registerFragShader("def_code2", ShaderLib.code2_frag);
            const def_ui_fs = Shader.registerFragShader("def_ui", ShaderLib.ui_frag);
            const def_uifont_vs = Shader.registerVertShader("def_uifont", ShaderLib.uifont_vert);
            const def_uifont_fs = Shader.registerFragShader("def_uifont", ShaderLib.uifont_frag);
            const def_diffuse_vs = Shader.registerVertShader("def_diffuse", ShaderLib.diffuse_vert);
            const def_diffuse_fs = Shader.registerFragShader("def_diffuse", ShaderLib.diffuse_frag);
            const def_boneeff_vs = Shader.registerVertShader("def_boneeff", ShaderLib.boneeff_vert);
            const def_diffuselightmap_vs = Shader.registerVertShader("def_diffuselightmap", ShaderLib.diffuselightmap_vert);
            const def_diffuselightmap_fs = Shader.registerFragShader("def_diffuselightmap", ShaderLib.diffuselightmap_frag);
            const def_postquad_vs = Shader.registerVertShader("def_postquad", ShaderLib.postquad_vert);
            const def_postquaddepth_fs = Shader.registerFragShader("def_postquaddepth", ShaderLib.postquaddepth_frag);
            const def_postdepth_vs = Shader.registerVertShader("def_postdepth", ShaderLib.postdepth_vert);
            const def_postdepth_fs = Shader.registerFragShader("def_postdepth", ShaderLib.postdepth_frag);
            const def_line_vs = Shader.registerVertShader("def_line", ShaderLib.line_vert);
            const def_line_fs = Shader.registerFragShader("def_line", ShaderLib.line_frag);
            const def_materialcolor_vs = Shader.registerVertShader("def_materialcolor", ShaderLib.materialcolor_vert);

            const def_diffusetintcolor_fs = Shader.registerFragShader("def_diffusetintcolor", ShaderLib.tintcolor_frag);
            const def_diffusevertcolor_vs = Shader.registerVertShader("def_diffusevertcolor", ShaderLib.vertcolor_vert);
            const def_diffusevertcolor_fs = Shader.registerFragShader("def_diffusevertcolor", ShaderLib.vertcolor_frag);

            const def_lambert_vs = Shader.registerVertShader("def_lambert", ShaderLib.lambert_vert);
            const def_lambert_fs = Shader.registerFragShader("def_lambert", ShaderLib.lambert_frag);

            const def_lambertnormal_vs = Shader.registerVertShader("def_lambertnormal", "#define USE_NORMAL_MAP \n" + ShaderLib.lambert_vert);
            const def_lambertnormal_fs = Shader.registerFragShader("def_lambertnormal", "#define USE_NORMAL_MAP \n" + ShaderLib.lambert_frag);

            const def_depthpackage_vs = Shader.registerVertShader("def_depthpackage", ShaderLib.depthpackage_vert); // non-linear
            const def_depthpackage_fs = Shader.registerFragShader("def_depthpackage", ShaderLib.depthpackage_frag);

            const def_distancepackage_vs = Shader.registerVertShader("def_depthpackage", ShaderLib.distancepackage_vert); // linear
            const def_distancepackage_fs = Shader.registerFragShader("def_depthpackage", ShaderLib.distancepackage_frag);

            {
                const shader = new Shader("shader/lambert");
                shader.url = "shader/lambert";
                shader.renderQueue = RenderQueue.Geometry;
                shader.defaultValue["_MainTex"] = { type: "Texture", value: paper.Asset.find("gray") };
                shader.defaultValue["_Color"] = { type: "Vector4", value: new Vector4(1, 1, 1, 1) };

                shader.passes["base"] = [];
                const renderPass = new DrawPass(def_lambert_vs, def_lambert_fs);
                renderPass.state_ztest = true;
                renderPass.state_ztest_method = WebGLKit.LEQUAL;
                renderPass.state_zwrite = true;
                renderPass.state_showface = ShowFaceStateEnum.CCW;
                renderPass.setAlphaBlend(BlendModeEnum.Close);
                shader.passes["base"].push(renderPass);

                shader.passes["base_depth_package"] = [];
                const depthPass = new DrawPass(def_depthpackage_vs, def_depthpackage_fs);
                depthPass.state_ztest = true;
                depthPass.state_ztest_method = WebGLKit.LEQUAL;
                depthPass.state_zwrite = true;
                depthPass.state_showface = ShowFaceStateEnum.CCW;
                depthPass.setAlphaBlend(BlendModeEnum.Close);
                shader.passes["base_depth_package"].push(depthPass);

                shader.passes["base_distance_package"] = [];
                const distancePass = new DrawPass(def_distancepackage_vs, def_distancepackage_fs);
                distancePass.state_ztest = true;
                distancePass.state_ztest_method = WebGLKit.LEQUAL;
                distancePass.state_zwrite = true;
                distancePass.state_showface = ShowFaceStateEnum.CCW;
                distancePass.setAlphaBlend(BlendModeEnum.Close);
                shader.passes["base_distance_package"].push(distancePass);

                this.LAMBERT = shader;

                paper.Asset.register(shader);
            }
            {
                const shader = new Shader("shader/lambertnormal");
                shader.url = "shader/lambertnormal";
                shader.renderQueue = RenderQueue.Geometry;
                shader.defaultValue["_MainTex"] = { type: "Texture", value: paper.Asset.find("gray") };
                shader.defaultValue["_Color"] = { type: "Vector4", value: new Vector4(1, 1, 1, 1) };

                shader.passes["base"] = [];
                const renderPass = new DrawPass(def_lambertnormal_vs, def_lambertnormal_fs);
                renderPass.state_ztest = true;
                renderPass.state_ztest_method = WebGLKit.LEQUAL;
                renderPass.state_zwrite = true;
                renderPass.state_showface = ShowFaceStateEnum.CCW;
                renderPass.setAlphaBlend(BlendModeEnum.Close);
                shader.passes["base"].push(renderPass);

                shader.passes["base_depth_package"] = [];
                const depthPass = new DrawPass(def_depthpackage_vs, def_depthpackage_fs);
                depthPass.state_ztest = true;
                depthPass.state_ztest_method = WebGLKit.LEQUAL;
                depthPass.state_zwrite = true;
                depthPass.state_showface = ShowFaceStateEnum.CCW;
                depthPass.setAlphaBlend(BlendModeEnum.Close);
                shader.passes["base_depth_package"].push(depthPass);

                shader.passes["base_distance_package"] = [];
                const distancePass = new DrawPass(def_distancepackage_vs, def_distancepackage_fs);
                distancePass.state_ztest = true;
                distancePass.state_ztest_method = WebGLKit.LEQUAL;
                distancePass.state_zwrite = true;
                distancePass.state_showface = ShowFaceStateEnum.CCW;
                distancePass.setAlphaBlend(BlendModeEnum.Close);
                shader.passes["base_distance_package"].push(distancePass);

                this.LAMBERT_NORMAL = shader;

                paper.Asset.register(shader);
            }
            {
                const sh = new Shader("shader/def");
                sh.url = "shader/def";
                // sh.defaultAsset = true;
                sh.renderQueue = RenderQueue.Geometry;
                sh.passes["base"] = [];
                sh.defaultValue["_MainTex"] = { type: "Texture", value: paper.Asset.find("grid") };
                sh.defaultValue["_MainTex_ST"] = { type: "Vector4", value: new Vector4(1, 1, 0, 0) };
                sh.defaultValue["_AlphaCut"] = { type: "Range", value: 0.1, min: 0, max: 1 };
                const p = new DrawPass(def_diffuse_vs, def_diffuse_fs);
                sh.passes["base"].push(p);
                p.state_ztest = true;
                p.state_ztest_method = WebGLKit.LEQUAL;
                p.state_zwrite = true;
                p.state_showface = ShowFaceStateEnum.CCW;
                // p.setProgram(diffuseProgram);
                p.setAlphaBlend(BlendModeEnum.Close);
                // p.uniformTexture("_MainTex", null);

                paper.Asset.register(sh);
            }
            {
                // 兼容外部引入的 transparent.shader.json
                const sh = new Shader("transparent.shader.json");
                sh.url = "transparent.shader.json";
                // sh.defaultAsset = true;
                sh.renderQueue = RenderQueue.Transparent;
                sh.passes["base"] = [];
                sh.defaultValue["_MainTex"] = { type: "Texture", value: paper.Asset.find("grid") };
                sh.defaultValue["_MainTex_ST"] = { type: "Vector4", value: new Vector4(1, 1, 0, 0) };
                sh.defaultValue["_AlphaCut"] = { type: "Range", value: 0.1, min: 0, max: 1 };
                const p = new DrawPass(def_diffuse_vs, def_diffuse_fs);
                sh.passes["base"].push(p);
                p.state_ztest = true;
                p.state_ztest_method = WebGLKit.LEQUAL;
                p.state_zwrite = true;
                p.state_showface = ShowFaceStateEnum.CCW;
                // p.setProgram(diffuseProgram);
                p.setAlphaBlend(BlendModeEnum.Blend);
                // p.uniformTexture("_MainTex", null);
                this.TRANSPARENT = sh;

                paper.Asset.register(sh);
            }
            {
                // 兼容外部引入的 transparent_additive.shader.json
                const sh = new Shader("transparent_additive.shader.json");
                sh.url = "transparent_additive.shader.json";
                // sh.defaultAsset = true;
                sh.renderQueue = RenderQueue.Transparent;
                sh.passes["base"] = [];
                sh.defaultValue["_MainTex"] = { type: "Texture", value: paper.Asset.find("grid") };
                sh.defaultValue["_MainTex_ST"] = { type: "Vector4", value: new Vector4(1, 1, 0, 0) };
                sh.defaultValue["_AlphaCut"] = { type: "Range", value: 0.1, min: 0, max: 1 };
                const p = new DrawPass(def_diffuse_vs, def_diffuse_fs);
                sh.passes["base"].push(p);
                p.state_ztest = true;
                p.state_ztest_method = WebGLKit.LEQUAL;
                p.state_zwrite = true;
                p.state_showface = ShowFaceStateEnum.CCW;
                // p.setProgram(diffuseProgram);
                p.setAlphaBlend(BlendModeEnum.Add);
                // p.uniformTexture("_MainTex", null);
                this.TRANSPARENT_ADDITIVE = sh;

                paper.Asset.register(sh);
            }
            {
                // 兼容外部引入的 transparent_additive_bothside.shader.json
                const sh = new Shader("transparent_additive_bothside.shader.json");
                sh.url = "transparent_additive_bothside.shader.json";
                // sh.defaultAsset = true;
                sh.renderQueue = RenderQueue.Transparent;
                sh.passes["base"] = [];
                sh.defaultValue["_MainTex"] = { type: "Texture", value: paper.Asset.find("grid") };
                sh.defaultValue["_MainTex_ST"] = { type: "Vector4", value: new Vector4(1, 1, 0, 0) };
                sh.defaultValue["_AlphaCut"] = { type: "Range", value: 0.1, min: 0, max: 1 };
                const p = new DrawPass(def_diffuse_vs, def_diffuse_fs);
                sh.passes["base"].push(p);
                p.state_ztest = true;
                p.state_ztest_method = WebGLKit.LEQUAL;
                p.state_zwrite = true;
                p.state_showface = ShowFaceStateEnum.ALL;
                // p.setProgram(diffuseProgram);
                p.setAlphaBlend(BlendModeEnum.Add);
                // p.uniformTexture("_MainTex", null);
                this.TRANSPARENT_ADDITIVE_BOTH_SIDE = sh;

                paper.Asset.register(sh);
            }
            {
                // 兼容外部引入的 transparent_bothside.shader.json
                const sh = new Shader("transparent_bothside.shader.json");
                sh.url = "transparent_bothside.shader.json";
                // sh.defaultAsset = true;
                sh.renderQueue = RenderQueue.Transparent;
                sh.passes["base"] = [];
                sh.defaultValue["_MainTex"] = { type: "Texture", value: paper.Asset.find("grid") };
                sh.defaultValue["_MainTex_ST"] = { type: "Vector4", value: new Vector4(1, 1, 0, 0) };
                sh.defaultValue["_AlphaCut"] = { type: "Range", value: 0.1, min: 0, max: 1 };
                const p = new DrawPass(def_diffuse_vs, def_diffuse_fs);
                sh.passes["base"].push(p);
                p.state_ztest = true;
                p.state_ztest_method = WebGLKit.LEQUAL;
                p.state_zwrite = true;
                p.state_showface = ShowFaceStateEnum.ALL;
                // p.setProgram(diffuseProgram);
                p.setAlphaBlend(BlendModeEnum.Blend);
                // p.uniformTexture("_MainTex", null);
                this.TRANSPARENT_BOTH_SIDE = sh;

                paper.Asset.register(sh);
            }
            {
                // 兼容外部引入的 diffuse.shader.json
                const sh = new Shader("diffuse.shader.json");
                sh.url = "diffuse.shader.json";
                // sh.defaultAsset = true;
                sh.renderQueue = RenderQueue.Geometry;
                sh.defaultValue["_MainTex"] = { type: "Texture", value: paper.Asset.find("gray") };
                sh.defaultValue["_MainTex_ST"] = { type: "Vector4", value: new Vector4(1, 1, 0, 0) };
                sh.defaultValue["_AlphaCut"] = { type: "Range", value: 0.1, min: 0, max: 1 };

                const p = new DrawPass(def_diffuse_vs, def_diffuse_fs);
                sh.passes["base"] = [];
                sh.passes["base"].push(p);
                p.state_ztest = true;
                p.state_ztest_method = WebGLKit.LEQUAL;
                p.state_zwrite = true;
                p.state_showface = ShowFaceStateEnum.CCW;
                p.setAlphaBlend(BlendModeEnum.Close);

                const p2 = new DrawPass(def_boneeff_vs, def_diffuse_fs);
                sh.passes["skin"] = [];
                sh.passes["skin"].push(p2);
                p2.state_ztest = true;
                p2.state_ztest_method = WebGLKit.LEQUAL;
                p2.state_zwrite = true;
                p2.state_showface = ShowFaceStateEnum.CCW;
                p2.setAlphaBlend(BlendModeEnum.Close);

                const p3 = new DrawPass(def_diffuselightmap_vs, def_diffuselightmap_fs);
                sh.passes["lightmap"] = [];
                sh.passes["lightmap"].push(p3);
                p3.state_ztest = true;
                p3.state_ztest_method = WebGLKit.LEQUAL;
                p3.state_zwrite = true;
                p3.state_showface = ShowFaceStateEnum.CCW;
                p3.setAlphaBlend(BlendModeEnum.Close);

                const p4 = new DrawPass(def_postquad_vs, def_postquaddepth_fs);
                sh.passes["quad"] = [];
                sh.passes["quad"].push(p4);
                p4.state_ztest = true;
                p4.state_ztest_method = WebGLKit.LEQUAL;
                p4.state_zwrite = true;
                p4.state_showface = ShowFaceStateEnum.CCW;
                p4.setAlphaBlend(BlendModeEnum.Close);

                const p5 = new DrawPass(def_postdepth_vs, def_postdepth_fs);
                sh.passes["base_depth"] = [];
                sh.passes["base_depth"].push(p5);
                p5.state_ztest = true;
                p5.state_ztest_method = WebGLKit.LEQUAL;
                p5.state_zwrite = true;
                p5.state_showface = ShowFaceStateEnum.CCW;
                p5.setAlphaBlend(BlendModeEnum.Close);

                const p6 = new DrawPass(def_depthpackage_vs, def_depthpackage_fs);
                sh.passes["base_depth_package"] = [];
                sh.passes["base_depth_package"].push(p6);
                p6.state_ztest = false;
                p6.state_ztest_method = WebGLKit.LEQUAL;
                p6.state_zwrite = false;
                p6.state_showface = ShowFaceStateEnum.CCW;
                p6.setAlphaBlend(BlendModeEnum.Close);

                // p.uniformTexture("_MainTex", null);
                this.DIFFUSE = sh;

                paper.Asset.register(sh);
            }
            {
                const sh = new Shader("shader/diffuse_tintcolor");
                sh.url = "shader/diffuse_tintcolor";
                // sh.defaultAsset = true;
                sh.renderQueue = RenderQueue.Geometry;
                sh.passes["base"] = [];
                sh.defaultValue["_MainTex"] = { type: "Texture", value: paper.Asset.find("grid") };
                sh.defaultValue["_MainTex_ST"] = { type: "Vector4", value: new Vector4(1, 1, 0, 0) };
                sh.defaultValue["_AlphaCut"] = { type: "Range", value: 0.1, min: 0, max: 1 };
                sh.defaultValue["_TintColor"] = { type: "Vector4", value: new Vector4(1, 1, 1, 1) };
                const p = new DrawPass(def_diffuse_vs, def_diffusetintcolor_fs);
                sh.passes["base"].push(p);
                p.state_ztest = true;
                p.state_ztest_method = WebGLKit.LEQUAL;
                p.state_zwrite = true;
                p.state_showface = ShowFaceStateEnum.CCW;
                // p.setProgram(diffuseProgram);
                p.setAlphaBlend(BlendModeEnum.Close);
                // p.uniformTexture("_MainTex", null);
                this.DIFFUSE_TINT_COLOR = sh;

                paper.Asset.register(sh);
            }
            {
                const sh = new Shader("shader/diffuse_vertcolor");
                sh.url = "shader/diffuse_vertcolor";
                // sh.defaultAsset = true;
                sh.renderQueue = RenderQueue.Geometry;
                sh.passes["base"] = [];
                sh.defaultValue["_MainTex"] = { type: "Texture", value: paper.Asset.find("grid") };
                sh.defaultValue["_MainTex_ST"] = { type: "Vector4", value: new Vector4(1, 1, 0, 0) };
                sh.defaultValue["_AlphaCut"] = { type: "Range", value: 0.1, min: 0, max: 1 };
                const p = new DrawPass(def_diffusevertcolor_vs, def_diffusevertcolor_fs);
                sh.passes["base"].push(p);
                p.state_ztest = true;
                p.state_ztest_method = WebGLKit.LEQUAL;
                p.state_zwrite = true;
                p.state_showface = ShowFaceStateEnum.CCW;
                // p.setProgram(diffuseProgram);
                p.setAlphaBlend(BlendModeEnum.Close);
                // p.uniformTexture("_MainTex", null);
                this.DIFFUSE_VERT_COLOR = sh;

                paper.Asset.register(sh);
            }
            {
                // 兼容外部引入的 diffuse_bothside.shader.json
                const sh = new Shader("diffuse_bothside.shader.json");
                sh.url = "diffuse_bothside.shader.json";
                sh.renderQueue = RenderQueue.Geometry;
                // sh.defaultAsset = true;
                sh.defaultValue["_MainTex"] = { type: "Texture", value: paper.Asset.find("grid") };
                sh.defaultValue["_MainTex_ST"] = { type: "Vector4", value: new Vector4(1, 1, 0, 0) };
                sh.defaultValue["_AlphaCut"] = { type: "Range", value: 0.1, min: 0, max: 1 };

                const p = new DrawPass(def_diffuse_vs, def_diffuse_fs);
                sh.passes["base"] = [];
                sh.passes["base"].push(p);
                p.state_ztest = true;
                p.state_ztest_method = WebGLKit.LEQUAL;
                p.state_zwrite = true;
                p.state_showface = ShowFaceStateEnum.ALL;
                p.setAlphaBlend(BlendModeEnum.Close);

                const p2 = new DrawPass(def_boneeff_vs, def_diffuse_fs);
                sh.passes["skin"] = [];
                sh.passes["skin"].push(p2);
                p2.state_ztest = true;
                p2.state_ztest_method = WebGLKit.LEQUAL;
                p2.state_zwrite = true;
                p2.state_showface = ShowFaceStateEnum.CCW;
                p2.setAlphaBlend(BlendModeEnum.Close);

                const p3 = new DrawPass(def_diffuselightmap_vs, def_diffuselightmap_fs);
                sh.passes["lightmap"] = [];
                sh.passes["lightmap"].push(p3);
                p3.state_ztest = true;
                p3.state_ztest_method = WebGLKit.LEQUAL;
                p3.state_zwrite = true;
                p3.state_showface = ShowFaceStateEnum.CCW;
                p3.setAlphaBlend(BlendModeEnum.Close);

                const p4 = new DrawPass(def_postquad_vs, def_postquaddepth_fs);
                sh.passes["quad"] = [];
                sh.passes["quad"].push(p4);
                p4.state_ztest = true;
                p4.state_ztest_method = WebGLKit.LEQUAL;
                p4.state_zwrite = true;
                p4.state_showface = ShowFaceStateEnum.CCW;
                p4.setAlphaBlend(BlendModeEnum.Close);

                const p5 = new DrawPass(def_postdepth_vs, def_postdepth_fs);
                sh.passes["base_depth"] = [];
                sh.passes["base_depth"].push(p5);
                p5.state_ztest = true;
                p5.state_ztest_method = WebGLKit.LEQUAL;
                p5.state_zwrite = true;
                p5.state_showface = ShowFaceStateEnum.CCW;
                p5.setAlphaBlend(BlendModeEnum.Close);

                // p.uniformTexture("_MainTex", null);
                this.DIFFUSE_BOTH_SIDE = sh;

                paper.Asset.register(sh);
            }
            {
                const sh = new Shader("shader/defui");
                sh.url = "shader/defui";
                // sh.defaultAsset = true;
                sh.passes["base"] = [];
                const p = new DrawPass(def_code_vs, def_ui_fs);
                sh.passes["base"].push(p);
                // p.setProgram(program2);
                p.state_showface = ShowFaceStateEnum.CW;// ui 只需要显示正面
                p.state_ztest = false;
                p.state_zwrite = false;
                p.state_ztest_method = WebGLKit.LEQUAL;
                p.setAlphaBlend(BlendModeEnum.Blend_PreMultiply);
                const p2 = new DrawPass(def_code_vs, def_ui_fs);
                sh.passes["base"].push(p2);
                // p2.setProgram(program2);
                p2.state_showface = ShowFaceStateEnum.ALL;
                p2.state_ztest = true;
                p2.state_zwrite = false;
                p2.state_ztest_method = WebGLKit.LEQUAL;
                p2.setAlphaBlend(BlendModeEnum.Blend_PreMultiply);
                this.UI = sh;

                paper.Asset.register(sh);
            }
            {
                const sh = new Shader("shader/defuifont");
                sh.url = "shader/defuifont";
                // sh.defaultAsset = true;
                sh.passes["base"] = [];
                const p = new DrawPass(def_uifont_vs, def_uifont_fs);
                sh.passes["base"].push(p);
                // p.setProgram(programuifont);
                p.state_showface = ShowFaceStateEnum.CW;
                p.state_ztest = false;
                p.state_zwrite = false;
                p.state_ztest_method = WebGLKit.LEQUAL;
                p.setAlphaBlend(BlendModeEnum.Blend_PreMultiply);
                const p2 = new DrawPass(def_uifont_vs, def_uifont_fs);
                sh.passes["base"].push(p2);
                // p2.setProgram(programuifont);
                p2.state_showface = ShowFaceStateEnum.ALL;
                p2.state_ztest = true;
                p2.state_zwrite = false;
                p2.state_ztest_method = WebGLKit.LEQUAL;
                p2.setAlphaBlend(BlendModeEnum.Blend_PreMultiply);
                this.UI_FONT = sh;

                paper.Asset.register(sh);
            }
            {
                const sh = new Shader("line.shader.json");
                sh.url = "line.shader.json";
                sh.renderQueue = RenderQueue.Geometry;
                // sh.defaultAsset = true;
                sh.passes["base"] = [];
                const p = new DrawPass(def_line_vs, def_line_fs);
                sh.passes["base"].push(p);
                // p.setProgram(programline);
                p.state_ztest = true;
                p.state_ztest_method = WebGLKit.LEQUAL;
                p.state_zwrite = true;
                p.state_showface = ShowFaceStateEnum.ALL;
                p.setAlphaBlend(BlendModeEnum.Close);
                this.LINE = sh;

                paper.Asset.register(sh);
            }
            {
                const sh = new Shader("materialcolor.shader.json");
                sh.url = "materialcolor.shader.json";
                sh.renderQueue = RenderQueue.Geometry;
                sh.defaultValue["_Color"] = { type: "Vector4", value: new Vector4(1, 1, 1, 1) };
                // sh.defaultAsset = true;
                sh.passes["base"] = [];
                const p = new DrawPass(def_materialcolor_vs, def_line_fs);
                sh.passes["base"].push(p);
                // p.setProgram(programmaterialcolor);
                p.state_ztest = true;
                p.state_ztest_method = WebGLKit.LEQUAL;
                p.state_zwrite = true;
                p.state_showface = ShowFaceStateEnum.ALL;
                p.setAlphaBlend(BlendModeEnum.Close);
                sh.renderQueue = RenderQueue.Overlay;
                this.MATERIAL_COLOR = sh;

                paper.Asset.register(sh);
            }
            {
                const sh = new Shader("gizmos.shader.json");
                sh.url = "gizmos.shader.json";
                sh.renderQueue = RenderQueue.Overlay;
                sh.defaultValue["_Color"] = { type: "Vector4", value: new Vector4(1, 1, 1, 1) };
                // sh.defaultAsset = true;
                sh.passes["base"] = [];
                const p = new DrawPass(def_materialcolor_vs, def_line_fs);
                sh.passes["base"].push(p);
                // p.setProgram(programmaterialcolor);
                p.state_ztest = false;
                p.state_ztest_method = WebGLKit.LEQUAL;
                p.state_zwrite = false;
                p.state_showface = ShowFaceStateEnum.CCW;
                p.setAlphaBlend(BlendModeEnum.Blend);
                sh.renderQueue = RenderQueue.Overlay;
                this.GIZMOS_COLOR = sh;

                paper.Asset.register(sh);
            }
        }
    }
}
