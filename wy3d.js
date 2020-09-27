class Wineyard3D {
  constructor(canvas, resx, resy, pp) {
    this.canvas = canvas;
    gl = this.initWebGL(canvas);

    this.resolution_x = resx;
    this.resolution_y = resy;

    this.canvas_bcr = this.canvas.getBoundingClientRect();

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

    this.currentScene = "";

    wy3d_Input = wy3d_InitializeInput(this.canvas);
    this.input = wy3d_Input;

    this.version = "v0.0.4";
  }

  addResource(name, path) {
    const newResource = new wy3d_Resource(name, path);
    if (newResource.getRes() === false)
      return false;

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

  setCurrentScene(scene) {
    this.currentScene = scene;

    for (var i = 0; i < this.SCENES.length; i++) {
      const tmpScene = this.SCENES[i];
      tmpScene.stop();
    }
  }

  renderScene(scene, gameFunction) {
    this.setCurrentScene(scene);

    scene.start();
    scene.animationRequest = requestAnimationFrame(scene.render.bind(scene, scene.time, gameFunction));
  }


  initWebGL(canvas) {
    var tmp_gl = null;
    try {
      tmp_gl = canvas.getContext("webgl2", {
        antialias: true,
        alpha: false
      })
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
    renderer.pp = this.pp;
  }

  getVendorInfo() {
    return this.vendorInfo;
  }

  getRendererInfo() {
    return this.rendererInfo;
  }
}
