precision mediump float;

uniform sampler2D uTex;
uniform float h;
varying vec2 vVertexPosition;

void main(void)
{
  vec2 vTextureCoord = vec2(vVertexPosition.s, vVertexPosition.t) * 0.5 + 0.5;
  vec4 sum = vec4(0.0);

  vec4 originalSample = texture2D(uTex, vTextureCoord);
  sum += texture2D(uTex, vec2(vTextureCoord.x - 4.0 * h, vTextureCoord.y)) * 0.016;
  sum += texture2D(uTex, vec2(vTextureCoord.x - 3.0 * h, vTextureCoord.y)) * 0.054;
  sum += texture2D(uTex, vec2(vTextureCoord.x - 2.0 * h, vTextureCoord.y)) * 0.122;
  sum += texture2D(uTex, vec2(vTextureCoord.x - 1.0 * h, vTextureCoord.y)) * 0.195;
  sum += texture2D(uTex, vTextureCoord) * 0.227;
  sum += texture2D(uTex, vec2(vTextureCoord.x + 1.0 * h, vTextureCoord.y)) * 0.195;
  sum += texture2D(uTex, vec2(vTextureCoord.x + 2.0 * h, vTextureCoord.y)) * 0.122;
  sum += texture2D(uTex, vec2(vTextureCoord.x + 3.0 * h, vTextureCoord.y)) * 0.054;
  sum += texture2D(uTex, vec2(vTextureCoord.x + 4.0 * h, vTextureCoord.y)) * 0.016;

  gl_FragColor = sum;
}
