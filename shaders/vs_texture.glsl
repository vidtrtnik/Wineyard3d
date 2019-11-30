attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aVertexTextureCoords;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform vec3 uAmbientColor;
uniform vec3 uLightDirection;
uniform vec3 uDirectionColor;

uniform bool uUseLightning;

varying highp vec2 vTextureCoord;
varying highp vec3 vLightWeight;

void main(void)
{
  gl_Position = uPMatrix * uMVMatrix * aVertexPosition;
  vTextureCoord = aVertexTextureCoords;

  if(!uUseLightning)
  {
    vLightWeight = vec3(1.0, 1.0, 1.0);
  }
  else
  {
    highp vec4 transformedNormal = uNMatrix * vec4(aVertexNormal, 1.0);
    highp float directionalLightWeight = max(dot(transformedNormal.xyz, uLightDirection), 0.0);
    vLightWeight = uAmbientColor + (uDirectionColor * directionalLightWeight);
  }
}
