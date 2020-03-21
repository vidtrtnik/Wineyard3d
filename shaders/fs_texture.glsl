precision highp float;

varying highp vec2 vTextureCoord;
varying highp vec3 vLightWeight;

uniform sampler2D uSampler;
uniform float uAlpha;

void main(void)
{
  highp vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
  gl_FragColor = vec4(textureColor.rgb * vLightWeight, uAlpha);
}
