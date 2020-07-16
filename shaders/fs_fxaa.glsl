// adapted from http://horde3d.org/wiki/index.php?title=Shading_Technique_-_FXAA

precision highp float;

uniform sampler2D uTex;
uniform float fbx;
uniform float fby;
varying vec2 vVertexPosition;

void main( void ) {
    vec2 vTextureCoords = vec2(vVertexPosition.s, vVertexPosition.t) * 0.5 + 0.5;

    float FXAA_SPAN_MAX = 16.0;
    float FXAA_REDUCE_MUL = 1.0 / FXAA_SPAN_MAX;
    float FXAA_REDUCE_MIN = 1.0 / 128.0;

    vec3 rgbNW = texture2D(uTex, vTextureCoords + (vec2(-1.0,-1.0) / vec2(fbx, fby))).xyz;
    vec3 rgbNE = texture2D(uTex, vTextureCoords + (vec2(1.0,-1.0) / vec2(fbx, fby))).xyz;
    vec3 rgbSW = texture2D(uTex, vTextureCoords + (vec2(-1.0,1.0) / vec2(fbx, fby))).xyz;
    vec3 rgbSE = texture2D(uTex, vTextureCoords + (vec2(1.0,1.0) / vec2(fbx, fby))).xyz;
    vec3 rgbM = texture2D(uTex, vTextureCoords).xyz;

    vec3 luma = vec3(0.2126, 0.7152, 0.0722);
    float lumaNW = dot(rgbNW, luma);
    float lumaNE = dot(rgbNE, luma);
    float lumaSW = dot(rgbSW, luma);
    float lumaSE = dot(rgbSE, luma);
    float lumaM  = dot(rgbM,  luma);

    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));

    vec2 dir;
    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));

    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);

    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);

    dir = min(vec2( FXAA_SPAN_MAX,  FXAA_SPAN_MAX),
          max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),
          dir * rcpDirMin)) / vec2(fbx, fby);

    vec3 rgbA = (1.0/2.0) * (
        texture2D(uTex, vTextureCoords.xy + dir * (1.0 / 3.0 - 0.5)).xyz +
        texture2D(uTex, vTextureCoords.xy + dir * (2.0 / 3.0 - 0.5)).xyz);
    vec3 rgbB = rgbA * (1.0/2.0) + (1.0/4.0) * (
        texture2D(uTex, vTextureCoords.xy + dir * (0.0 / 3.0 - 0.5)).xyz +
        texture2D(uTex, vTextureCoords.xy + dir * (3.0 / 3.0 - 0.5)).xyz);
    float lumaB = dot(rgbB, luma);

    if((lumaB < lumaMin) || (lumaB > lumaMax)){
        gl_FragColor.xyz=rgbA;
    }else{
        gl_FragColor.xyz=rgbB;
    }
}