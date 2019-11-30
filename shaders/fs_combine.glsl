precision highp float;

varying vec2 vVertexPosition;
uniform sampler2D uTex;
uniform sampler2D uTex2;
void main(void)
{
  vec2 vTextureCoords = vec2( vVertexPosition.s, vVertexPosition.t ) * 0.5 + 0.5;
  highp vec4 originalColor = texture2D(uTex, vTextureCoords);
  highp vec4 blurredColor = texture2D(uTex2, vTextureCoords);
  gl_FragColor = originalColor + blurredColor * 0.75;
}
