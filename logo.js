var logoObject = null;

var px = 0;
var py = 0;
var pz = -5.5;

var toggleGrayscale = false;
var togglePP = true;

function start() {
    var canvas = document.getElementById("canvas");
    resy = window.innerHeight * 0.85;
    resx = resy * (16 / 9);
    canvas.width = resx;
    canvas.height = resy;

    wy = new Wineyard3D(canvas, resx, resy, togglePP);
    renderLogoScene();
}

function setGrayscale() {
    wy.logoScene.grayscale = toggleGrayscale;
    wy.logoScene.setGrayscale(0.5, 0.5, 0.5);
}

function renderLogoScene() {
    const m_res_logo = wy.addResource("m_res_logo", "./models/logo.wy3dm");
    const t_res_logo = wy.addResource("m_res_logo", "./textures/logo.wy3dt");
    const m_logo = new wy3d_Model(m_res_logo);
    const t_logo = new wy3d_Texture(t_res_logo);

    wy.logoScene = wy.addScene("LogoScene");
    logoObject1 = wy.logoScene.addObject("logoObject1", m_logo, t_logo, px, py, pz, 0,-20,-90);

    wy.renderScene(wy.logoScene, logoFunction);
}

function logoFunction() {
    if (wy.input.get("up"))
        py += 0.05;
    if (wy.input.get("down"))
        py -= 0.05;
    if (wy.input.get("left"))
        px -= 0.05;
    if (wy.input.get("right"))
        px += 0.05;

    if (wy.input.get("enter"))
        logoObject1.addRotation(0.1, 0, 0);
    if (wy.input.get("space"))
        logoObject1.addRotation(0, 0.1, 0);

    if (wy.input.get("1"))
        logoObject1.addOpacity(0.01);
    if (wy.input.get("2"))
        logoObject1.addOpacity(-0.01);

    if (wy.input.isDown("G"))
        toggleGrayscale = !toggleGrayscale;

    if (wy.input.isDown("P")) {
        togglePP = !togglePP;
        wy.setPP(togglePP);
    }

    setGrayscale();

    logoObject1.setPosition(px, py, pz);
}