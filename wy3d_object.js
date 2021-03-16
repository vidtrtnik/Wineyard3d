class wy3d_Object {
  constructor(name, model, texture, x, y, z, rx, ry, rz, sx, sy, sz, lr, lg, lb, a) {
    this.name = name;
    this.model = model;
    this.texture = texture;
    this.position = setPosition(x, y, z);
    this.rotation = setRotation(rx, ry, rz);
    this.scale = setScale(sx, sy, sz);
    this.dimensions = calculateDimensions(this.scale, this.model.boundingBox);
    this.light = setLightning(lr, lg, lb);
    this.opacity = setOpacity(a);
    this.colission = false;
    this.collisionInfo = [];
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
    else if(x !== undefined && x.constructor == Array)
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
    else if(rx !== undefined && rx.constructor == Array)
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
    else if(sx !== undefined && sx.constructor == Array)
    {
      new_sx = sx[0];
      new_sy = sx[1];
      new_sz = sx[2];
    }

    this.scale = [new_sx, new_sy, new_sz];
    
    this.dimensions = calculateDimensions(this.scale, this.model.boundingBox);
  }

  setLightning(lr, lg, lb) {
    var new_lr = 1.0;
    var new_lg = 1.0;
    var new_lb = 1.0;

    if (lr !== undefined && lg !== undefined && lb !== undefined) {
      new_lr = lr;
      new_lg = lg;
      new_lb = lb;
    }
    else if(sx !== undefined && sx.constructor == Array)
    {
      new_lr = lr[0];
      new_lg = lr[1];
      new_lb = lr[2];
    }

    this.light = [new_lr, new_lg, new_lb];
  }

  setOpacity(a) {
    var new_a = 1.0;

    if (a !== undefined && a <= 1.0 && a >= 0.0) {
      new_a = a;
    }

    this.opacity = new_a;
  }



  setRotation(rx, ry, rz) {
    this.rotation = [rx, ry, rz];
  }

  addRotation(rx, ry, rz) {
    this.rotation = [this.rotation[0] + rx, this.rotation[1] + ry, this.rotation[2] + rz];
  }

  addScale(sx, sy, sz) {
    this.scale = [this.scale[0] + sx, this.scale[1] + sy, this.scale[2] + sz];
  }

  addLightning(lr, lg, lb) {
    this.light = [this.light[0] + lr, this.light[1] + lg, this.light[2] + lb];
  }

  addOpacity(a) {
    if (this.opacity + a <= 1.0 && this.opacity + a >= 0.0)
      this.opacity = this.opacity + a;
  }

}

function calculateDimensions(s, bb) {
  var new_dims = [0.0, 0.0, 0.0];
  new_dims[0] = bb[0] * s[0];
  new_dims[1] = bb[1] * s[1];
  new_dims[2] = bb[2] * s[2];

  return new_dims;
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
  else if(x !== undefined && x.constructor == Array)
    {
      pos_x = x[0];
      pos_y = x[1];
      pos_z = x[2];
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
  else if(rx !== undefined && rx.constructor == Array)
  {
    new_rx = rx[0];
    new_ry = rx[1];
    new_rz = rx[2];
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
  else if(sx !== undefined && sx.constructor == Array)
  {
    new_sx = sx[0];
    new_sy = sx[1];
    new_sz = sx[2];
  }

  var ret = [new_sx, new_sy, new_sz];
  
  return ret;
}

function setLightning(lr, lg, lb) {
  var new_lr = 1.0;
  var new_lg = 1.0;
  var new_lb = 1.0;

  if (lr !== undefined && lg !== undefined && lb !== undefined) {
    new_lr = lr;
    new_lg = lg;
    new_lb = lb;
  }

  var ret = [new_lr, new_lg, new_lb];
  return ret;
}

function setOpacity(a) {
  var new_a = 1.0;
  if (a !== undefined && a <= 1.0 && a >= 0.0) {
    new_a = a;
  }

  return new_a;
}
