class Wineyard3D {
    constructor(canvas, resx, resy, pp) {
        this.canvas = canvas;
        gl = this.initWebGL(canvas);

        this.resolution_x = resx;
        this.resolution_y = resy;

        if (resx === null || resx === undefined || resy === null || resy === undefined) {
            this.resolution_x = this.canvas.clientWidth;
            this.resolution_y = this.canvas.clientHeight;
        }

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        this.vendorInfo = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        this.rendererInfo = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

        this.pp = pp;

        this.aspectRatio = this.resolution_x / this.resolution_y;
        renderer = new wy3d_Renderer(this, this.resolution_x, this.resolution_y, this.pp);
        this.RESOURCES = [];
        this.SCENES = [];

        initInput();

        var logoScene = 0;

    }

    addResource(name, path) {
        const newResource = new wy3d_Resource(name, path);
        this.RESOURCES.push(newResource);
        return newResource;
    }

    getResource(name) {
        for (var i = 0; i < this.RESOURCES.length; i++) {
            const tmpRes = this.RESOURCES[i];
            if (tmpRes.getName() == name) {
                return this.RESOURCES[i];
            }
        }

        return null;
    }

    addScene(name, gl, renderer) {
        const newScene = new wy3d_Scene(name);
        this.SCENES.push(newScene);
        return newScene;
    }

    getScene(name) {
        for (var i = 0; i < this.SCENES.length; i++) {
            const tmpScene = this.SCENES[i];
            if (tmpScene.getName() == name) {
                return this.SCENES[i];
            }
        }

        return null;
    }

    initWebGL(canvas) {
        var tmp_gl = null;
        try {
            tmp_gl = canvas.getContext("webgl2", {antialias: true, alpha: false})
        } catch (e) {
            alert("initWebGL() --> canvas.getContext() ERROR");
        }
        if (!tmp_gl) {
            alert("No WEBGL2 context");
            return null;
        }
        return tmp_gl;
    }

    setPP(v) {
        this.pp = v;
    }

    getVendorInfo() {
        return this.vendorInfo;
    }

    getRendererInfo() {
        return this.rendererInfo;
    }

    rotateLogo() {
        var logoObject = logoScene.getObject("logoObject")
        logoObject.addRotation(0, 1, 0);
    }
    renderLogoScene() {
        const m_res_logo = this.addResource("m_res_logo", "./models/logo.wy3dm");
        const t_res_logo = this.addResource("m_res_logo", "./textures/logo.wy3dt");
        const m_logo = new wy3d_Model(m_res_logo);
        const t_logo = new wy3d_Texture(t_res_logo);

        this.logoScene = this.addScene("LogoScene");
        const logoObject = this.logoScene.addObject("logoObject", m_logo, t_logo, 0.0, 0.0, -5.0, 0, 20, -90);

        this.logoScene.renderScene(dummy);
    }
}

function dummy() {
    console.log("dummy");
    return
}
