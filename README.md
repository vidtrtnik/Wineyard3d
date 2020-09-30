# Wineyard3d
3D game engine, written in Javascript and WebGL. 

<b>Wineyard3d</b> is a free and open-source 3D game engine, written in <b>Javascript</b> and <b>WebGL</b>. 
It is in development since 2018. I wrote this engine for my personal projects.
Wineyard3D runs in all web browsers supported by WebGL 1.0.

![Alt text](/screenshots/wineyard3d_logo_scr.jpg?raw=true "Wineyard3d Logo Scene")

Currently Wineyard3d can only load models which are stored in proprietary format "<b>wy3dm</b>" <i>(Wineyard 3D model)</i>. Wineyard 3D model file contains unpacked .obj vertices, texture vertices and some additional data. Converter from .obj to .wy3dm format is available on my github repository: [c2wy3dm](https://github.com/vidtrtnik/c2wy3dm).

Wineyard3d only supports textures in 8-bit PNG format, without alpha channel.

## My game engine currently supports
- Directional and ambient lighting
- Postprocessing effects (Bloom, gaussian blur, FXAA antialiasing)
- Grouping objects
- Custom glsl shaders
- Collision detection (3D AABB)
- Mouse and Keyboard input
- Alpha blending (custom opacity for ingame objects)
- Anisotropic filtering

## Demo scene
Pull this repository to your local machine. Run a web server from folder Wineyard3d (for example, with Python: <i>python3 -m http.server</i>). Open web browser, navigate to your server address and open <b>logo.html</b>. For the FPS overlay I was following [this example](https://webglfundamentals.org/webgl/lessons/webgl-text-html.html).

## Examples
### Define Wineyard3D
```javascript
var canvas = document.getElementById("canvas");
var wy = new Wineyard3D(canvas, 1280, 720, true);
```
### Define models and textures
```javascript
var m_logo = new wy3d_Model(wy, "./models/logo.wy3dm", "m_logo");
var t_logo = new wy3d_Texture(wy, "./textures/logo.wy3dt", "t_logo");
```

### Define a new scene and add the objects
```javascript
var demoScene = wy.addScene("DemoScene");
logoObject1 = demoScene.addObject("logoObject1", m_logo, t_logo);
```

### Move an object
```javascript
logoObject1.setPosition(px, py, pz);
// or
logoObject1.setPosition([px, py, pz]);
```

### Rotate an object
```javascript
logoObject1.setRotation(rx, ry, rz);
// or
logoObject1.setRotation([rx, ry, rz]);
```

### Get keyboard events
```javascript
var up = wy.input.get("up");
if (wy.input.isDown("P")){ }
if (wy.input.isDown("space"){ }
```

## Third-Party libraries
Wineyard3d uses the following open source javascript libraries:
- [UPNG.js](https://github.com/photopea/UPNG.js)
- [pako](https://github.com/nodeca/pako)
- [glMatrix](http://glmatrix.net)


## TODOs:
- Documentation, more code examples and tutorials
- Audio support (music, sound effects)
- Improved lighting
- Touchscreen support (for browsers on Android/iOS)


<i>Current version: 0.0.5</i>  
<b>Author: Vid Trtnik<b>
