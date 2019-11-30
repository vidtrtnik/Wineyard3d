class wy3d_Object
{
  constructor(name, model, texture, x, y, z, rx, ry, rz, sx, sy, sz)
  {
	  this.name = name;
	  this.model = model;
	  this.texture = texture;
	  this.position = setPosition(x, y, z);
	  this.rotation = setRotation(rx, ry, rz);
	  this.scale = setScale(sx, sy, sz);
	  this.dimensions = calculateDimensions(this.scale, this.model.boundingBox);
  }
  
  setPosition(x,y,z)
{
  var pos_x = 0.0;
  var pos_y = 0.0;
  var pos_z = 0.0;

  if(x !== undefined && y !== undefined && z !== undefined)
  {
    pos_x = x;
    pos_y = y;
    pos_z = z;
  }

  this.position = [pos_x, pos_y, pos_z];
}

setRotation(rx,ry,rz)
{
  var new_rx = 0.0;
  var new_ry = 0.0;
  var new_rz = 0.0;

  if(rx !== undefined && ry !== undefined && rz !== undefined)
  {
    new_rx = rx;
    new_ry = ry;
    new_rz = rz;
  }

  this.rotation = [new_rx, new_ry, new_rz];
}

setScale(sx,sy,sz)
{
  var new_sx = 1.0;
  var new_sy = 1.0;
  var new_sz = 1.0;

  if(sx !== undefined && sy !== undefined && sz !== undefined)
  {
    new_sx = sx;
    new_sy = sy;
    new_sz = sz;
  }

  this.scale = [new_sx, new_sy, new_sz];
}

setRotation(rx, ry, rz)
{
  this.rotation = [rx, ry, rz];
}

addRotation(rx, ry, rz)
{
  this.rotation = [this.rotation[0] + rx, this.rotation[1] + ry, this.rotation[2] + rz];
}

addScale(sx, sy, sz)
{
  this.scale = [this.scale[0] + sx, this.scale[1] + sy, this.scale[2] + sz];
}

}

function calculateDimensions(s, bb)
{
	var new_dims = [0.0, 0.0, 0.0];
	new_dims[0] = bb[0] * s[0];
	new_dims[1] = bb[1] * s[1];
	new_dims[2] = bb[2] * s[2];
	
	return new_dims;
}

function setPosition(x,y,z)
{
  var pos_x = 0.0;
  var pos_y = 0.0;
  var pos_z = 0.0;

  if(x !== undefined && y !== undefined && z !== undefined)
  {
    pos_x = x;
    pos_y = y;
    pos_z = z;
  }

  var ret = [pos_x, pos_y, pos_z];
  return ret;
}

function setRotation(rx, ry, rz)
{
  var new_rx = 1.0;
  var new_ry = 1.0;
  var new_rz = 1.0;

  if(rx !== undefined && ry !== undefined && rz !== undefined)
  {
    new_rx = rx;
    new_ry = ry;
    new_rz = rz;
  }
  
  var ret = [new_rx, new_ry, new_rz];
  return ret;
}

function setScale(sx,sy,sz)
{
  var new_sx = 1.0;
  var new_sy = 1.0;
  var new_sz = 1.0;

  if(sx !== undefined && sy !== undefined && sz !== undefined)
  {
    new_sx = sx;
    new_sy = sy;
    new_sz = sz;
  }

  var ret = [new_sx, new_sy, new_sz];
  return ret;
}
