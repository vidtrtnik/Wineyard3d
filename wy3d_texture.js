class wy3d_Texture {
  constructor(wy, resource_path, name) {
    this.resource = null;
    if(wy.constructor.name == "wy3d_Resource") 
    {
      this.resource = wy;
    }
    else
    {
      this.name = setName(name, resource_path);
      this.resource = wy.addResource(this.name, resource_path);
    }

    this.tex = this.initTexture(this.resource.res);
  }

  initTexture(image) {
    var texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, image.width, image.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image.data);

    if (isPowerOf2(image.width) && isPowerOf2(image.height))
    {
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    }
    else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    var ext_af = gl.getExtension("EXT_texture_filter_anisotropic");
    if(ext_af !== null)
    {
      var max_af = gl.getParameter(ext_af.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
      if(max_af > 1)
        gl.texParameterf(gl.TEXTURE_2D, ext_af.TEXTURE_MAX_ANISOTROPY_EXT, max_af);
    }

    return texture;
  }
}

function setName(name, resource_path)
{
  if(name === undefined || name === null)
  {
    var fname = resource_path.split(/(\\|\/)/g).pop();
    name = fname;
  }
  return name;
}
