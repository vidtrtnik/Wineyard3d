precision mediump float;

uniform sampler2D uTex;
uniform float v;
varying vec2 vVertexPosition;

void main(void)
{
  vec2 vTextureCoord = vec2(vVertexPosition.s, vVertexPosition.t) * 0.5 + 0.5;
  vec4 sum = vec4(0.0);

  vec4 originalSample = texture2D(uTex, vTextureCoord);
  sum += texture2D(uTex, vec2(vTextureCoord.x, vTextureCoord.y - 4.0 * v)) * 0.016;
  sum += texture2D(uTex, vec2(vTextureCoord.x, vTextureCoord.y - 3.0 * v)) * 0.054;
  sum += texture2D(uTex, vec2(vTextureCoord.x, vTextureCoord.y - 2.0 * v)) * 0.122;
  sum += texture2D(uTex, vec2(vTextureCoord.x, vTextureCoord.y - 1.0 * v)) * 0.195;
  sum += texture2D(uTex, vTextureCoord) * 0.227;
  sum += texture2D(uTex, vec2(vTextureCoord.x, vTextureCoord.y + 1.0 * v)) * 0.195;
  sum += texture2D(uTex, vec2(vTextureCoord.x, vTextureCoord.y + 2.0 * v)) * 0.122;
  sum += texture2D(uTex, vec2(vTextureCoord.x, vTextureCoord.y + 3.0 * v)) * 0.054;
  sum += texture2D(uTex, vec2(vTextureCoord.x, vTextureCoord.y + 4.0 * v)) * 0.016;

  gl_FragColor = sum;
}
