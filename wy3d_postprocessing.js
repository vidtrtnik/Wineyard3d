function createFB(resolution_x, resolution_y) {
  var targetTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, targetTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, resolution_x, resolution_y, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  //gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  var frameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, targetTexture, 0);
  var depthBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, resolution_x, resolution_y);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);

  return {
    fb: frameBuffer,
    tex: targetTexture,
    db: depthBuffer
  }
}

function bindFB(fb, tex) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

  if (tex !== undefined) {
    gl.bindTexture(gl.TEXTURE_2D, tex);
  }
}

function deleteFB(fbo) {
  gl.deleteFramebuffer(fbo.fb);
  gl.deleteTexture(fbo.tex);
  gl.deleteRenderbuffer(fbo.db);

  delete fbo.fb;
  delete fbo.tex;
  delete fbo.db;
  delete fbo;
}

function initFBRectangle(vertices, texcoords) {
  var verBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, verBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  var texBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

  return {
    vertexBuffer: verBuf,
    textureBuffer: texBuf
  };
}
