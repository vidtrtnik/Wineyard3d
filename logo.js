function start() {
  var canvas = document.getElementById("canvas");

  resx = window.innerWidth * 0.85;
  resy = window.innerHeight * 0.85;
  canvas.width = resx;
  canvas.height = resy;

  wy = new Wineyard3D(canvas, resx, resy, 1);
  wy.renderLogoScene();
}
