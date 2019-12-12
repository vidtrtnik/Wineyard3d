# Wineyard3d
3D game engine, written in Javascript and WebGL 2. 

<b>Wineyard3d</b> is a 3D game engine, written in <b>Javascript</b> and <b>WebGL 2</b>. 
It is in development since 2018. I wrote this engine for my personal projects.
Wineyard3D runs in all web browsers supported by WebGL 1.0.

![Alt text](/screenshots/wineyard3d_logo_scr.png?raw=true "Wineyard3d Logo Scene")

Currently, Wineyard3d can only load models which are stored in proprietary format "<b>wy3dm</b>" <i>(Wineyard 3D model)</i>. Wineyard 3D model file contains unpacked .obj vertices and texture vertices and some additional data. Converter from .obj to .wy3dm format is also available on my github repository, [here](https://github.com/vidtrtnik/c2wy3dm).

Currently, Wineyard3d only supports textures in 8-bit PNG format, without alpha channel. Texture resolution must be power of 2.

## My game engine currently supports
- Directional and ambient lighting
- Postprocessing effects (Bloom, gaussian blur...)
- Custom glsl shaders
- Collision detection (3D AABB)
- Keyboard input

## Logo scene example
Pull this repository to your local machine. Run a web server from folder Wineyard3d (for example, with Python: <i>python3 -m http.server</i>). Open web browser, navigate to your server address and open <b>logo.html</b>.

## Example code (Logo scene)
```javascript
  var canvas = document.getElementById("canvas");
  
  var wy = new Wineyard3D(canvas, 1280, 720, true);
  wy.renderLogoScene();
```


TODOs:
- Documentation and tutorials
- Sound, music support
- Blending
- Improved lighting
- Mouse input


<i>Current version: 0.0.1</i>

<b>Author: Vid Trtnik<b>
