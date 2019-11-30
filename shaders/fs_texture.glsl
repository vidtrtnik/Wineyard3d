varying highp vec2 vTextureCoord;
varying highp vec3 vLightWeight;

uniform sampler2D uSampler;

void main(void)
{
  highp vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
  gl_FragColor = vec4(textureColor.rgb * vLightWeight, textureColor.a);
}
