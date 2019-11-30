precision highp float;

varying vec2 vVertexPosition;
uniform sampler2D uTex;

void main(void)
{
  vec2 texCoord = vec2( vVertexPosition.s, vVertexPosition.t ) * 0.5 + 0.5;
  highp vec4 originalSample = texture2D(uTex, texCoord);
  highp float brightness = (originalSample.r * 0.2126) + (originalSample.g * 0.7152) + (originalSample.b * 0.0722);
  //gl_FragColor = originalSample.rgb * brightness;
  if(brightness > 0.85) //0.25
  {
    gl_FragColor = originalSample;
  }
  else
  {
    //gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    gl_FragColor = originalSample * brightness;
  }
}
