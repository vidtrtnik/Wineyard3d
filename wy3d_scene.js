class wy3d_Scene {
  constructor(name) {
    this.name = name;

    this.OBJECTS = [];

    this.backgroundColor = [0.075, 0.175, 0.275];
    this.ambientColor = [0.075, 0.075, 0.075];

    this.backgroundObject = null;
    this.backgroundScroll = [0.0, 0.0];

    this.time = 0.0;
    this.time_prev = 0.0;

    this.camRot = [0.0, 0.0, 0.0];
    this.camPos = [0.0, 0.0, 0.0];

    this.enabled = 0;
    this.animationRequest = null;

    this.grayscale = false;
    this.grayscaleValues = this.setGrayscale(0.5, 0.5, 0.5);
  }

  setBackgroundColor(r, g, b) {
    this.backgroundColor = [r, g, b];
  }

  setBackgroundTexture(texture) {
    this.backgroundTexture = texture;
    this.backgroundQuadRes = renderer.wy3d.addResource("fboQuad", "./Wineyard3d/models/fboQuad.wy3dm") || renderer.wy3d.addResource("fboQuad", "./models/fboQuad.wy3dm");
    this.backgroundQuadModel = new wy3d_Model(this.backgroundQuadRes);
    this.backgroundObject = new wy3d_Object("backgroundQuadModel", this.backgroundQuadModel, this.backgroundTexture);
  }

  setBackgroundScroll(vx, vy) {
    if (vx > 2.0)
      vx /= 2.0;

    if (vy > 2.0)
      vy /= 2.0;

    this.backgroundScroll = [vx, vy];
  }
  addBackgroundScroll(vx, vy) {
    this.backgroundScroll = [this.backgroundScroll[0] + vx, this.backgroundScroll[1] + vy];
    if (this.backgroundScroll[0] > 2.0)
      vx = 0.0;

    if (this.backgroundScroll[1] > 2.0)
      vy = 0.0;
  }

  setAmbientColor(r, g, b) {
    this.ambientColor = [r, g, b];
  }

  setGrayscale(r, g, b) {
    renderer.setGrayscaleValues(r, g, b);
    return [r, g, b];
  }

  getName() {
    return this.name;
  }

  addObject(name, model, texture, x, y, z, rx, ry, rz, sx, sy, sz, lr, lg, lb, a) {
    if (name.constructor.name == "wy3d_Object") {
      this.OBJECTS.push(name);
      return name;
    }
    var tmpObject = new wy3d_Object(name, model, texture, x, y, z, rx, ry, rz, sx, sy, sz, lr, lg, lb, a);
    this.OBJECTS.push(tmpObject);
    return tmpObject;
  }

  getObject(name) {
    for (var i = 0; i < this.OBJECTS.length; i++) {
      if (name == this.OBJECTS[i].name) {
        return this.OBJECTS[i];
      }
    }
    return null;
  }

  getObjects() {
    return this.OBJECTS;
  }

  stop() {
    this.enabled = 0;
    //if(this.animationRequest !== null && this.animationRequest !== undefined)
    cancelAnimationFrame(this.animationRequest);
    this.animationRequest = null;
  }

  start() {
    this.enabled = 1;
  }

  render(time, gameFunction) {
    this.time = new Date().getTime();
    if (renderer.showFps) {
      const ft = Math.floor(this.time - this.time_prev);
      var fps = Math.floor(1000 / ft);

      this.time_prev = this.time;

      document.getElementById('overlay_fps').innerHTML = fps;
      document.getElementById('overlay_ft').innerHTML = ft;
    }

    gameFunction(this);
    this.renderObjects();

    if (this.enabled)
      this.animationRequest = requestAnimationFrame(this.render.bind(this, this.time, gameFunction));
  }

  renderObjects() {
    if (renderer.pp == true || renderer.pp == 1)
      renderer.enableRenderToTex(renderer.fboNoPP.fb);

    renderer.setGL(this.backgroundColor);
    renderer.setPMatrix(this.camPos, this.camRot);

    if (this.backgroundObject !== null && this.backgroundObject !== undefined)
      renderer.renderBackground(this.backgroundObject.texture.tex, this.backgroundScroll[0], this.backgroundScroll[1]);

    //Izris objektov
    for (var i = 0; i < this.OBJECTS.length; i++) {
      var object = this.OBJECTS[i];
      renderer.drawObject(renderer.mainShader, object, this.ambientColor);
    }

    if (renderer.pp) {
      renderer.renderEffect(this, renderer.brightTreshShader, renderer.fboBrightTresh.fb, renderer.fboNoPP.tex);
      renderer.renderEffect(this, renderer.blurHShader, renderer.fboBlurH.fb, renderer.fboBrightTresh.tex);
      renderer.renderEffect(this, renderer.blurVShader, renderer.fboBlurV.fb, renderer.fboBlurH.tex);

      if (this.grayscale) {
        renderer.renderEffect(this, renderer.combineShader, renderer.fboCombine.fb, renderer.fboNoPP.tex, renderer.fboBlurV.tex);
        renderer.renderEffect(this, renderer.grayscaleShader, null, renderer.fboCombine.tex);
      } else
        renderer.renderEffect(this, renderer.combineShader, null, renderer.fboNoPP.tex, renderer.fboBlurV.tex);
    }
  }

  rotateCamera(x, y, z) {
    this.camRot = [x, y, z];
  }

  moveCamera(x, y, z) {
    this.camPos = [x, y, z];
  }

}
