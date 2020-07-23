class wy3d_Scene {
  constructor(name) {
    this.name = name;

    this.OBJECTS = [];
    this.OBJ_GROUPS = [];

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

    this.fxaa = true;
  }

  setBackgroundColor(r, g, b) {
    this.backgroundColor = [r, g, b];
  }

  setBackgroundTexture(texture) {
    this.backgroundTexture = texture;
    var load_try1 = renderer.wy3d.addResource("fboQuad", "./models/fboQuad.wy3dm");
    var load_try2 = renderer.wy3d.addResource("fboQuad", "./Wineyard3d/models/fboQuad.wy3dm");

    this.backgroundQuadRes = null;
    if(load_try1 !== null)
      this.backgroundQuadRes = load_try1;
    else if(load_try2 !== null)
      this.backgroundQuadRes = load_try2;
    else
      return false;

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

  setFxaa(toggle)
  {
    this.fxaa = toggle;
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

  addObjectGroup()
  {
    if (arguments[0].constructor.name == "wy3d_ObjectGroup")
    {
      this.OBJ_GROUPS.push(arguments[0]);
      return;
    }

    var group = [];
    for(var i=1; i < arguments.length; i++)
    {
      group.push(arguments[i]);
    }

    var newObjGroup = new wy3d_ObjectGroup(arguments[1], group);
    this.OBJ_GROUPS.push(newObjGroup);
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
      renderer.drawObject(true, renderer.mainShader, object, this.ambientColor);
    }

    for (var i = 0; i < this.OBJ_GROUPS.length; i++) {
      var objGroup = this.OBJ_GROUPS[i];
      for (var j = 0; j < objGroup.group.length; j++) {
        var object = objGroup.group[j];
        glMatrix.mat4.identity(mvMatrix);
        objGroup.mvMatrixStack_push();
        objGroup.mvMatrixStack_translate(objGroup.position[0], objGroup.position[1], objGroup.position[2]);
        objGroup.mvMatrixStack_rotateZ(objGroup.rotation[2]);
        mvMatrix = objGroup.mvMatrixStack_get();

        renderer.drawObject(false, renderer.mainShader, object, this.ambientColor);
        objGroup.mvMatrixStack_pop();
        glMatrix.mat4.identity(mvMatrix);
      }
    }

    if (renderer.pp) {
      renderer.renderEffect(this, renderer.brightTreshShader, renderer.fboBrightTresh.fb, renderer.fboNoPP.tex);
      renderer.renderEffect(this, renderer.blurHShader, renderer.fboBlurH.fb, renderer.fboBrightTresh.tex);
      renderer.renderEffect(this, renderer.blurVShader, renderer.fboBlurV.fb, renderer.fboBlurH.tex);
      renderer.renderEffect(this, renderer.combineShader, renderer.fboCombine.fb, renderer.fboNoPP.tex, renderer.fboBlurV.tex);

      if (this.grayscale)
        renderer.renderEffect(this, renderer.grayscaleShader, null, renderer.fboCombine.tex);

      else if(!this.grayscale && this.fxaa)
        renderer.renderEffect(this, renderer.fxaaShader, null, renderer.fboCombine.tex);

      else
        renderer.renderEffect(this, renderer.combineShader, null, renderer.fboNoPP.tex, renderer.fboBlurV.tex);
    }
  }

  rotateCamera(x, y, z) {
    this.camRot = [x, y, z];
  }

  moveCamera(x, y, z) {
    this.camPos = [x, y, z];
  }
    
  checkCollisions()
  {
      for (var i = 0; i < this.OBJECTS.length; i++)
      {
          var obj1 = this.OBJECTS[i];
          obj1.collisionInfo = [];
          
          var obj1Xmin = obj1.position[0] - obj1.dimensions[0] / 2;
          var obj1Xmax = obj1.position[0] + obj1.dimensions[0] / 2;
              
          var obj1Ymin = obj1.position[1] - obj1.dimensions[1] / 2;
          var obj1Ymax = obj1.position[1] + obj1.dimensions[1] / 2;
              
          var obj1Zmin = obj1.position[2] - obj1.dimensions[1] / 2;
          var obj1Zmax = obj1.position[2] + obj1.dimensions[1] / 2;
          
          for (var j = 0; j < this.OBJECTS.length; j++)
          {
              if(i == j)
                  continue;
              
              var obj2 = this.OBJECTS[j];
                  
              var obj2Xmin = obj2.position[0] - obj1.dimensions[0] / 2;
              var obj2Xmax = obj2.position[0] + obj1.dimensions[0] / 2;
              
              var obj2Ymin = obj2.position[1] - obj1.dimensions[1] / 2;
              var obj2Ymax = obj2.position[1] + obj1.dimensions[1] / 2;
              
              var obj2Zmin = obj2.position[2] - obj1.dimensions[1] / 2;
              var obj2Zmax = obj2.position[2] + obj1.dimensions[1] / 2;
              
              if((obj1Xmin <= obj2Xmax && obj1Xmax >= obj2Xmin) &&
                 (obj1Ymin <= obj2Ymax && obj1Ymax >= obj2Ymin) &&
                 (obj1Zmin <= obj2Zmax && obj1Zmax >= obj2Zmin))
              {
                    obj1.collision = true;
                    obj1.collisionInfo.push(obj2.name);
              }
          }
      }
  }

}
