<html>
  <head>
    <title>Test</title>
    <link rel="stylesheet" type="text/css" href="./style.css">
	
    <script src="./3rdparty/pako.js"></script>
    <script src="./3rdparty/UPNG.js"></script>
    <script src="./3rdparty/gl-matrix.js"></script>

    <script src="./wy3d_vars.js"></script>
    <script src="./wy3d_postprocessing.js"></script>
    <script src="./wy3d_input.js"></script>
    <script src="./wy3d_object.js"></script>
    <script src="./wy3d_model.js"></script>
    <script src="./wy3d_texture.js"></script>
    <script src="./wy3d_resources.js"></script>
    <script src="./wy3d_math.js"></script>
    <script src="./wy3d_shader.js"></script>
    <script src="./wy3d_scene.js"></script>
    <script src="./wy3d_renderer.js"></script>
    <script src="./wy3d.js"></script>
    <script src="./logo.js"></script>
  </head>

  <body onload=start()>
    <header id="header">
      Test
    </header>
	
	<div class="container">
		<canvas id="canvas" width="1280px" height="720px"></canvas>
		<div id="overlay">
			<div>FPS: <span id="overlay_fps"></span></div>
			<div>FT: <span id="overlay_ft"></span></div>
		</div>
	</div>
  </body>
</html>
