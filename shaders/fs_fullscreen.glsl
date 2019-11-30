precision mediump float;

varying vec2      vertPos;
uniform sampler2D u_texture;
uniform float deltaX;
uniform float deltaY;

void main()
{
    vec2 texCoord = vec2( vertPos.s + deltaX, vertPos.t + deltaY ) * 0.5 + 0.5;
    vec3 texColor = texture2D( u_texture, texCoord.st ).rgb;
    gl_FragColor  = vec4( texColor.rgb, 1.0 );
}
