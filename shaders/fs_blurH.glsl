precision highp float;

uniform sampler2D uTex;
uniform float h;

varying vec2 vVertexPosition;

void main(void)
{
  vec2 vTextureCoord = vec2( vVertexPosition.s, vVertexPosition.t ) * 0.5 + 0.5;
  vec4 sum = vec4(0.0);

  vec4 originalSample = texture2D(uTex, vTextureCoord);
  sum += texture2D(uTex, vec2(vTextureCoord.x - 4.0 * h, vTextureCoord.y)) * 0.0162;
  sum += texture2D(uTex, vec2(vTextureCoord.x - 3.0 * h, vTextureCoord.y)) * 0.0540;
  sum += texture2D(uTex, vec2(vTextureCoord.x - 2.0 * h, vTextureCoord.y)) * 0.1216;
  sum += texture2D(uTex, vec2(vTextureCoord.x - 1.0 * h, vTextureCoord.y)) * 0.1945;
  //sum += texture2D(uTex, vec2(vTextureCoord.x - 0.0 * h, vTextureCoord.y)) * 0.2270;
  sum += texture2D(uTex, vTextureCoord) * 0.2270;
  sum += texture2D(uTex, vec2(vTextureCoord.x + 1.0 * h, vTextureCoord.y)) * 0.1945;
  sum += texture2D(uTex, vec2(vTextureCoord.x + 2.0 * h, vTextureCoord.y)) * 0.1216;
  sum += texture2D(uTex, vec2(vTextureCoord.x + 3.0 * h, vTextureCoord.y)) * 0.0540;
  sum += texture2D(uTex, vec2(vTextureCoord.x + 4.0 * h, vTextureCoord.y)) * 0.0162;

  gl_FragColor = sum;
}
