precision mediump float;

varying vec2 vVertexPosition;
uniform sampler2D uTex;
uniform float vx;
uniform float vy;
uniform float vz;

void main()
{
    vec2 texCoord = vec2(vVertexPosition.s, vVertexPosition.t) * 0.5 + 0.5;
    vec4 color = texture2D(uTex, texCoord);
    float gray = dot(color.rgb, vec3(vx, vy, vz));
    gl_FragColor = vec4(vec3(gray), 1.0);
}
