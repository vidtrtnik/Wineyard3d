precision mediump float;

varying vec2 vVertexPosition;
uniform sampler2D uTex;

void main(void)
{
  vec2 texCoord = vec2(vVertexPosition.s, vVertexPosition.t) * 0.5 + 0.5;
  vec4 originalSample = texture2D(uTex, texCoord);
  float brightness = (originalSample.r * 0.2126) + (originalSample.g * 0.7152) + (originalSample.b * 0.0722);
  
  if(brightness > 0.85)
  {
    gl_FragColor = originalSample;
  }
  else
  {
    gl_FragColor = originalSample * brightness;
  }
}
