class wy3d_ObjectGroup {
  constructor(name, group, x, y, z, rx, ry, rz, sx, sy, sz) {
    this.name = name;
    this.group = group;
    this.position = setPosition(x, y, z);
    this.rotation = setRotation(rx, ry, rz);
    this.scale = setScale(sx, sy, sz);

    this.colission = false;
    this.collisionInfo = [];

    this.mvMatrixStack = [];
  }

  setPosition(x, y, z) {
    var pos_x = 0.0;
    var pos_y = 0.0;
    var pos_z = 0.0;

    if (x !== undefined && y !== undefined && z !== undefined) {
      pos_x = x;
      pos_y = y;
      pos_z = z;
    }
    else if(sx.constructor == Array)
    {
      pos_x = x[0];
      pos_y = x[1];
      pos_z = x[2];
    }

    this.position = [pos_x, pos_y, pos_z];
  }

  setRotation(rx, ry, rz) {
    var new_rx = 0.0;
    var new_ry = 0.0;
    var new_rz = 0.0;

    if (rx !== undefined && ry !== undefined && rz !== undefined) {
      new_rx = rx;
      new_ry = ry;
      new_rz = rz;
    }
    else if(rx.constructor == Array)
    {
      new_rx = rx[0];
      new_ry = rx[1];
      new_rz = rx[2];
    }
    
    this.rotation = [new_rx, new_ry, new_rz];
  }

  setScale(sx, sy, sz) {
    var new_sx = 1.0;
    var new_sy = 1.0;
    var new_sz = 1.0;

    if (sx !== undefined && sy !== undefined && sz !== undefined) {
      new_sx = sx;
      new_sy = sy;
      new_sz = sz;
    }
    else if(sx.constructor == Array) {
      new_sx = sx[0];
      new_sy = sx[1];
      new_sz = sx[2];
    }

    this.scale = [new_sx, new_sy, new_sz];
  }

  setRotation(rx, ry, rz) {
    this.rotation = [rx, ry, rz];

    this.setMvMatrix();
  }

  addRotation(rx, ry, rz) {
    this.rotation = [this.rotation[0] + rx, this.rotation[1] + ry, this.rotation[2] + rz];

    this.setMvMatrix();
  }

  addScale(sx, sy, sz) {
    this.scale = [this.scale[0] + sx, this.scale[1] + sy, this.scale[2] + sz];

    this.setMvMatrix();
  }

  mvMatrixStack_push()
  {
    var copy = glMatrix.mat4.create();
    glMatrix.mat4.set(mvMatrix, copy);
    this.mvMatrixStack.push(copy);
  }

  mvMatrixStack_pop()
  {
    var mvMatrix = this.mvMatrixStack.pop();

    if (this.mvMatrixStack.length == 0)
      this.mvMatrixStack[0] = glMatrix.mat4.create();

    return mvMatrix;
  }

  mvMatrixStack_get()
  {
    return this.mvMatrixStack[this.mvMatrixStack.length - 1].slice();
  }

  mvMatrixStack_set(curr_mvMatrix)
  {
    this.mvMatrixStack[this.mvMatrixStack.length - 1] = curr_mvMatrix;
  }

  mvMatrixStack_rotateZ(deg)
  {
    var m = this.mvMatrixStack_get();
    glMatrix.mat4.rotateZ(m, m, degToRad(deg));
    this.mvMatrixStack_set(m);
  }
  mvMatrixStack_translate(px, py, pz)
  {
    var m = this.mvMatrixStack_get();
    glMatrix.mat4.translate(m, m, [px, py, pz]);
    this.mvMatrixStack_set(m);
  }

  setMvMatrix() {
    var new_mvMatrix = this.mvMatrixStack_get();
    
    translate(new_mvMatrix, this.position[0], this.position[1], this.position[2]);
    rotate(new_mvMatrix, this.rotation[0], this.rotation[1], this.rotation[2]);
    scaling(new_mvMatrix, this.scale[0], this.scale[1], this.scale[2]);
  
    this.mvMatrixStack_set(new_mvMatrix);
  }
}


function setPosition(x, y, z) {
  var pos_x = 0.0;
  var pos_y = 0.0;
  var pos_z = 0.0;

  if (x !== undefined && y !== undefined && z !== undefined) {
    pos_x = x;
    pos_y = y;
    pos_z = z;
  }

  var ret = [pos_x, pos_y, pos_z];
  return ret;
}

function setRotation(rx, ry, rz) {
  var new_rx = 0.0;
  var new_ry = 0.0;
  var new_rz = 0.0;

  if (rx !== undefined && ry !== undefined && rz !== undefined) {
    new_rx = rx;
    new_ry = ry;
    new_rz = rz;
  }

  var ret = [new_rx, new_ry, new_rz];
  return ret;
}

function setScale(sx, sy, sz) {
  var new_sx = 1.0;
  var new_sy = 1.0;
  var new_sz = 1.0;

  if (sx !== undefined && sy !== undefined && sz !== undefined) {
    new_sx = sx;
    new_sy = sy;
    new_sz = sz;
  }

  var ret = [new_sx, new_sy, new_sz];
  return ret;
}