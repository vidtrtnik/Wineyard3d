var mvMatrix = glMatrix.mat4.create();
var nMatrix = glMatrix.mat4.create();
var pMatrix = glMatrix.mat4.create();

class wy3d_Renderer {
    constructor(wy3d, resolution_x, resolution_y, pp) {
        this.wy3d = wy3d;
        this.pp = pp;

        this.resolution_x = resolution_x;
        this.resolution_y = resolution_y;

        this.mainShader = null;
        this.blurHShader = null;
        this.blurVShader = null;
        this.grayscaleShader = null;
        this.brightTreshShader = null;
        this.combineShader = null;
        this.fullscreenShader = null;
        this.initShaders();

        this.then = 0;
        this.fovDeg = 45;
        this.fov = degToRad(this.fovDeg);
        this.zNear = 0.1;
        this.zFar = 100.0;
        this.aspectRatio = resolution_x / resolution_y;

        this.setGL([0.0, 0.0, 0.0], resolution_x, resolution_y);
        this.setPMatrix();

        this.fboQuad = null;
        this.fsBuf = null;

        if (this.pp) {
            this.fboNoPP = createFB(resolution_x, resolution_y);
            this.fboBrightTresh = createFB(resolution_x, resolution_y);
            this.fboBlurH = createFB(resolution_x, resolution_y);
            this.fboBlurV = createFB(resolution_x, resolution_y);
            this.fboGrayscale = createFB(resolution_x, resolution_y);
        }

        this.fsBuf = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.fsBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);

        this.showFps = true;
    }

    setGL(bkgColor, res_x, res_y) {
        gl.clearColor(bkgColor[0], bkgColor[1], bkgColor[2], 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        if (res_x !== undefined && res_y !== undefined)
            gl.viewport(0, 0, res_x, res_y);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    setPMatrix(camPos, camRot) {
        glMatrix.mat4.identity(pMatrix)
        glMatrix.mat4.perspective(pMatrix, this.fov, this.aspectRatio, this.zNear, this.zFar);

        if (camRot !== undefined)
            rotate(pMatrix, camRot[0], camRot[1], camRot[2]);

        if (camPos !== undefined)
            translate(pMatrix, camPos[0], camPos[1], camPos[2]);
    }

    initShaders() {
        var vs_texture_code = loadResource("vs_texture_code", "./shaders/vs_texture.glsl");
        var fs_texture_code = loadResource("fs_texture_code", "./shaders/fs_texture.glsl");
        this.mainShader = new Shader(vs_texture_code, fs_texture_code);

        var vs_grayscale_code = loadResource("vs_grayscale_code", "./shaders/vs_grayscale.glsl");
        var fs_grayscale_code = loadResource("fs_grayscale_code", "./shaders/fs_grayscale.glsl");
        this.grayscaleShader = new Shader(vs_grayscale_code, fs_grayscale_code);

        var vs_blur_code = loadResource("vs_blur_code", "./shaders/vs_blur.glsl");

        var fs_blurH_code = loadResource("fs_blurH_code", "./shaders/fs_blurH.glsl");
        this.blurHShader = new Shader(vs_blur_code, fs_blurH_code);

        var fs_blurV_code = loadResource("fs_blurV_code", "./shaders/fs_blurV.glsl");
        this.blurVShader = new Shader(vs_blur_code, fs_blurV_code);

        var vs_brightTresh_code = loadResource("vs_brightTresh_code", "./shaders/vs_bright.glsl");
        var fs_brightTresh_code = loadResource("fs_brightTresh_code", "./shaders/fs_bright.glsl");
        this.brightTreshShader = new Shader(vs_brightTresh_code, fs_brightTresh_code);

        var vs_combine_code = loadResource("vs_combine_code", "./shaders/vs_combine.glsl");
        var fs_combine_code = loadResource("fs_combine_code", "./shaders/fs_combine.glsl");
        this.combineShader = new Shader(vs_combine_code, fs_combine_code);

        var vs_fullscreen_code = loadResource("vs_fullscreen_code", "./shaders/vs_fullscreen.glsl");
        var fs_fullscreen_code = loadResource("fs_fullscreen_code", "./shaders/fs_fullscreen.glsl");
        this.fullscreenShader = new Shader(vs_fullscreen_code, fs_fullscreen_code);

        this.setBlurShader(3.50 / this.resolution_x, 3.50 / this.resolution_y);
    }

    setBlurShader(h, v) {
        gl.useProgram(this.blurHShader.shaderProgram);
        gl.uniform1f(this.blurHShader.shaderProgram.h, h);
        gl.useProgram(this.blurVShader.shaderProgram);
        gl.uniform1f(this.blurVShader.shaderProgram.v, v);
    }

    enableRenderToTex(fb) {
        bindFB(fb);
        //gl.enable(gl.CULL_FACE);
        //gl.enable(gl.DEPTH_TEST);
    }

    renderEffect(scene, shader, fb, tex1, tex2) {
        bindFB(fb, tex1);
        //gl.enable(gl.CULL_FACE);
        //gl.enable(gl.DEPTH_TEST);
        this.setPMatrix();
        this.drawEffect(shader, tex1, tex2);
    }

    drawEffect(shader, tex1, tex2) {
        var shaderProgram = shader.shaderProgram;
        gl.useProgram(shaderProgram);

        if (tex2 !== undefined) {
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, tex2);

            gl.uniform1i(shaderProgram.uTex2, 1);
        } else {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, tex1);

            gl.uniform1i(shaderProgram.uTex, 0);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.fsBuf);
        gl.vertexAttribPointer(shaderProgram.aVertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.aVertexPosition);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        gl.disableVertexAttribArray(shaderProgram.aVertexPosition);

        //gl.clear( gl.DEPTH_BUFFER_BIT );
        //gl.enable( gl.DEPTH_TEST );
    }
    
    drawObject(shader, object, ambLight, tex) {
        const position = object.position;
        const rotation = object.rotation;
        const scale = object.scale;

        gl.useProgram(shader.shaderProgram);
        glMatrix.mat4.identity(mvMatrix);
        glMatrix.mat4.identity(nMatrix);

        translate(mvMatrix, position[0], position[1], position[2]);
        rotate(mvMatrix, rotation[0], rotation[1], rotation[2]);

        glMatrix.mat4.invert(nMatrix, mvMatrix);
        glMatrix.mat4.transpose(nMatrix, nMatrix);

        scaling(mvMatrix, scale[0], scale[1], scale[2]);

        gl.bindBuffer(gl.ARRAY_BUFFER, object.model.vertexBuffer);
        gl.vertexAttribPointer(shader.shaderProgram.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shader.shaderProgram.aVertexPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, object.model.textureBuffer);
        gl.vertexAttribPointer(shader.shaderProgram.aVertexTextureCoords, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shader.shaderProgram.aVertexTextureCoords);

        gl.bindBuffer(gl.ARRAY_BUFFER, object.model.normalBuffer);
        gl.vertexAttribPointer(shader.shaderProgram.aVertexNormal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shader.shaderProgram.aVertexNormal);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.model.indexBuffer);

        gl.activeTexture(gl.TEXTURE0);

        if (tex !== undefined && tex !== null)
            gl.bindTexture(gl.TEXTURE_2D, tex);
        else
            gl.bindTexture(gl.TEXTURE_2D, object.texture.tex);

        gl.uniform1i(shader.shaderProgram.uSampler, 0);
        gl.uniform1i(shader.shaderProgram.uUseLightning, true);
        gl.uniform3f(shader.shaderProgram.uAmbientColor, ambLight[0], ambLight[1], ambLight[2]);
        gl.uniform3f(shader.shaderProgram.uLightDirection, 0, 0, 1);
        gl.uniform3f(shader.shaderProgram.uDirectionColor, object.light[0], object.light[1], object.light[2]);

        gl.uniformMatrix4fv(shader.shaderProgram.uPMatrix, false, pMatrix);
        gl.uniformMatrix4fv(shader.shaderProgram.uMVMatrix, false, mvMatrix);
        gl.uniformMatrix4fv(shader.shaderProgram.uNMatrix, false, nMatrix);

        gl.drawElements(gl.TRIANGLES, object.model.i.length, gl.UNSIGNED_SHORT, 0);
    }
    
    renderBackground(bckgTexture, dX, dY) {
        
        gl.clear(gl.DEPTH_BUFFER_BIT);
        gl.disable(gl.DEPTH_TEST);
        gl.clear(gl.DEPTH_BUFFER_BIT);
        
        gl.useProgram(renderer.fullscreenShader.shaderProgram);
        var deltaX = gl.getUniformLocation(renderer.fullscreenShader.shaderProgram, "deltaX");
        var deltaY = gl.getUniformLocation(renderer.fullscreenShader.shaderProgram, "deltaY");
        gl.uniform1f(deltaX, dX);
        gl.uniform1f(deltaY, dY);

        renderer.drawEffect(renderer.fullscreenShader, bckgTexture);
        gl.clear(gl.DEPTH_BUFFER_BIT);
        //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
    }
    
    
}
