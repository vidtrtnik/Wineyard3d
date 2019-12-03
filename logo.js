function start()
{
  var canvas = document.getElementById("canvas");

  var wy = new Wineyard3D(canvas, 1280, 720, true);
  wy.renderLogoScene();
}