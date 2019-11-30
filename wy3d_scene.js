class wy3d_Scene
{
  constructor(name)
  {
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
  }

  setBackgroundColor(r, g, b)
  {
    this.backgroundColor = [r, g, b];
  }
  
  setBackgroundTexture(texture)
  {
	  this.backgroundTexture = texture;	  
	  this.backgroundQuadRes = renderer.wy3d.addResource("fboQuad", "./models/fboQuad.wy3dm");
	  this.backgroundQuadModel = new wy3d_Model(this.backgroundQuadRes);
	  this.backgroundObject = new wy3d_Object("backgroundQuadModel", this.backgroundQuadModel, this.backgroundTexture, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
  }
  
  setBackgroundScroll(vx, vy)
  {
	if(vx > 2.0)
		vx /= 2.0;
	
	if(vy > 2.0)
		vy /= 2.0;
	
	  this.backgroundScroll = [vx, vy];
  }
  addBackgroundScroll(vx, vy)
  {
	  this.backgroundScroll = [this.backgroundScroll[0] + vx, this.backgroundScroll[1] + vy];
	  if(this.backgroundScroll[0] > 2.0)
		vx = 0.0;
	
	  if(this.backgroundScroll[1] > 2.0)
		vy = 0.0;
  }

  setAmbientColor(r, g, b)
  {
    this.ambientColor = [r, g, b];
  }

  getName()
  {
    return this.name;
  }

  addObject(name, model, texture, x, y, z, rx, ry, rz, sx, sy, sz)
  {
	  if(name.constructor.name == "wy3d_Object")
	  {
		  this.OBJECTS.push(name);
		  return name;
	  }
    var tmpObject = new wy3d_Object(name, model, texture, x, y, z, rx, ry, rz, sx, sy, sz);
    this.OBJECTS.push(tmpObject);
    return tmpObject;
  }

  getObject(name)
  {
    for(var i=0; i < this.OBJECTS.length; i++)
    {
      if(name == this.OBJECTS[i].name)
      {
        return this.OBJECTS[i];
      }
    }
    return null;
  }

  getObjects()
  {
    return this.OBJECTS;
  }

  render(time, gameFunction)
  {
	this.time = new Date().getTime();
	if(renderer.showFps)
	{
		const ft = Math.floor(time - this.then);
		var fps = Math.floor(1000/ft);
	
		this.time_prev = time;

		document.getElementById('overlay_fps').innerHTML = fps;
		document.getElementById('overlay_ft').innerHTML = ft;
	}
	
    //renderer.setGL([0.1, 0.2, 0.3]);
    //renderer.setPMatrix(renderer.fov, renderer.aspectRatio, renderer.zNear, renderer.zFar);
	gameFunction();
    this.renderObjects();

    requestAnimationFrame(this.render.bind(this, this.time, gameFunction));
  }


  renderScene(gameFunction)
  {
    requestAnimationFrame(this.render.bind(this, this.time, gameFunction));
  }
  
  renderBackground()
  {
	var bufRect = gl.createBuffer()
	gl.bindBuffer( gl.ARRAY_BUFFER, bufRect );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( [ -1, -1, 1, -1, 1, 1, -1, 1 ] ), gl.STATIC_DRAW );

	gl.clear( gl.DEPTH_BUFFER_BIT );
	gl.disable( gl.DEPTH_TEST );
	gl.clear( gl.DEPTH_BUFFER_BIT );

	var texUnit = 0;
	gl.activeTexture( gl.TEXTURE0 + texUnit );
	gl.bindTexture( gl.TEXTURE_2D, this.backgroundObject.texture.tex );
	var tex_loc = gl.getUniformLocation( renderer.fullscreenShader.shaderProgram, "u_texture" ); //getShaderUniform(renderer.fullscreenShader, "u_texture");
	var deltaX = gl.getUniformLocation(renderer.fullscreenShader.shaderProgram, "deltaX");
	var deltaY = gl.getUniformLocation(renderer.fullscreenShader.shaderProgram, "deltaY");
	
	gl.useProgram( renderer.fullscreenShader.shaderProgram );
	gl.uniform1i( tex_loc, texUnit );
	gl.uniform1f(deltaX, this.backgroundScroll[0]);
	gl.uniform1f(deltaY, this.backgroundScroll[1]);
	

	var v_attr_inx = gl.getAttribLocation( renderer.fullscreenShader.shaderProgram, "inPos" );
	gl.bindBuffer( gl.ARRAY_BUFFER, bufRect );
	gl.vertexAttribPointer( v_attr_inx, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( v_attr_inx );
	gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
	gl.disableVertexAttribArray( v_attr_inx );
	
	gl.clear(gl.DEPTH_BUFFER_BIT);
	//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable( gl.DEPTH_TEST );
  }

  renderObjects()
  {
    if(renderer.pp == true || renderer.pp == 1)
      renderer.enableRenderToTex(renderer.fboNoPP.fb);

    renderer.setGL(this.backgroundColor);
    renderer.setPMatrix(this.camPos, this.camRot);
	
	if(this.backgroundObject !== null && this.backgroundObject !== undefined)
		this.renderBackground();
	
    //Izris objektov
    for(var i = 0; i < this.OBJECTS.length; i++)
    {
      var object = this.OBJECTS[i];
      this.drawObject(renderer.mainShader, object);
    }

    if(renderer.pp)
    {
      renderer.renderEffect(this, renderer.brightTreshShader, renderer.fboBrightTresh.fb, renderer.fboNoPP.tex);
      renderer.renderEffect(this, renderer.blurHShader, renderer.fboBlurH.fb, renderer.fboBrightTresh.tex);
      renderer.renderEffect(this, renderer.blurVShader, renderer.fboBlurV.fb, renderer.fboBlurH.tex);
      renderer.renderEffect(this, renderer.combineShader, null, renderer.fboNoPP.tex, renderer.fboBlurV.tex);
    }
  }

  drawObject(shader, object, tex)
  {
    const position = object.position;
    const rotation = object.rotation;
	const scale = object.scale;

    gl.useProgram(shader.shaderProgram);
    mat4.identity(mvMatrix);
    mat4.identity(nMatrix);
    translate(mvMatrix, position[0], position[1], position[2]);
    rotate(mvMatrix, rotation[0], rotation[1], rotation[2]);
	scaling(mvMatrix, scale[0], scale[1], scale[2]);
    mat4.identity(nMatrix);
    mat4.invert(nMatrix, mvMatrix);
    mat4.transpose(nMatrix, nMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, object.model.vertexBuffer);
    gl.vertexAttribPointer(shader.shaderProgram.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shader.shaderProgram.aVertexPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, object.model.textureBuffer);
    gl.vertexAttribPointer(shader.shaderProgram.aVertexTextureCoords, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shader.shaderProgram.aVertexTextureCoords);

    gl.bindBuffer(gl.ARRAY_BUFFER, object.model.normalBuffer);
    gl.vertexAttribPointer(shader.shaderProgram.aVertexNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shader.shaderProgram.aVertexNormal);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.model.indexBuffer);

    gl.activeTexture(gl.TEXTURE0);
	
    if(tex !== undefined && tex !== null)
      gl.bindTexture(gl.TEXTURE_2D, tex);
    else
		gl.bindTexture(gl.TEXTURE_2D, object.texture.tex);
  
    gl.uniform1i(shader.shaderProgram.uSampler, 0);
    gl.uniform1i(shader.shaderProgram.uUseLightning, true);
    gl.uniform3f(shader.shaderProgram.uAmbientColor, this.ambientColor[0], this.ambientColor[1], this.ambientColor[2]);
    gl.uniform3f(shader.shaderProgram.uLightDirection, 0, 0, 1);
    gl.uniform3f(shader.shaderProgram.uDirectionColor, 1, 1, 1);

    gl.uniformMatrix4fv(shader.shaderProgram.uPMatrix, false, pMatrix);
    gl.uniformMatrix4fv(shader.shaderProgram.uMVMatrix, false, mvMatrix);
    gl.uniformMatrix4fv(shader.shaderProgram.uNMatrix, false, nMatrix);

	gl.drawElements(gl.TRIANGLES, object.model.i.length, gl.UNSIGNED_SHORT, 0);

  }
  
  rotateCamera(x,y,z)
  {
	  this.camRot = [x, y, z];
  }
  
  moveCamera(x,y,z)
  {
	  this.camPos = [x, y, z];
  }
  
}
