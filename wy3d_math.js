function mvPushMatrix() {
  var copy = glMatrix.mat4.create();
  glMatrix.mat4.set(mvMatrix, copy);
  mvMatrixStack.push(copy);
}

function mvPopMatrix() {
  if (mvMatrixStack.length == 0) {
    throw "Invalid popMatrix!";
  }
  var mvMatrix = mvMatrixStack.pop();
  return mvMatrix;
}

function isInt(n) {
  return Number(n) === n && n % 1 === 0;
}

function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

function degToRad(deg) {
  if (deg > 360) {
    const m = Math.floor(deg / 360);
    deg = deg - (360 * m);
  }

  return deg * Math.PI / 180; //RAD
}

function calculateFBDimensions(w, h) {
  const half_w = w / 2.0;
  const half_h = h / 2.0;

  const x = 1.0;
  const y = half_h / half_w;

  const vertices = [
    -x, -y,
    x, -y,
    -x, y,

    -x, y,
    x, -y,
    x, y
  ];

  //const indices = [0, 1, 2, 2, 4, 5];

  const texCoords = [
    0.0, 0.0,
    x, 0.0,
    0.0, y,

    0.0, y,
    x, 0.0,
    x, y
  ];


  return {
    v: vertices,
    //i: indices,
    t: texCoords
  }
}

function translate(matrix, x, y, z) {
  glMatrix.mat4.translate(matrix, matrix, [x, y, z]);
}

function scaling(matrix, x, y, z) {
  glMatrix.mat4.scale(matrix, matrix, [x, y, z]);
}

function rotate(matrix, x, y, z) {
  if (x != 0)
    if (x > 0)
      glMatrix.mat4.rotate(matrix, matrix, degToRad(x), [1, 0, 0])
  else
    glMatrix.mat4.rotate(matrix, matrix, degToRad(x * -1), [-1, 0, 0])

  if (y != 0)
    if (y > 0)
      glMatrix.mat4.rotate(matrix, matrix, degToRad(y), [0, 1, 0])
  else
    glMatrix.mat4.rotate(matrix, matrix, degToRad(y * -1), [0, -1, 0])

  if (z != 0)
    if (z > 0)
      glMatrix.mat4.rotate(matrix, matrix, degToRad(z), [0, 0, 1])
  else
    glMatrix.mat4.rotate(matrix, matrix, degToRad(z * -1), [0, 0, -1])
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}
