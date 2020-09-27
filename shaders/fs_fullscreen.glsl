precision mediump float;

varying vec2 vVertexPosition;
uniform sampler2D uTex;
uniform float deltaX;
uniform float deltaY;

void main()
{
    vec2 vTextureCoords = vec2(vVertexPosition.s + deltaX, vVertexPosition.t + deltaY) * 0.5 + 0.5;
    vec4 originalColor = texture2D(uTex, vTextureCoords);
    gl_FragColor  = vec4( originalColor.rgb, 1.0 );
}
