function Shader(vertexCode, fragmentCode) {
    this.shaderProgram = createShaderProgram(vertexCode, fragmentCode);
    this.attributes = getShaderAttributes(this.shaderProgram);
    this.uniforms = getShaderUniforms(this.shaderProgram);
}

function createShaderProgram(vs_code, fs_code) {
    var shaderProgram = gl.createProgram();
    var vertexShader = createShader(vs_code, gl.VERTEX_SHADER);
    var fragmentShader = createShader(fs_code, gl.FRAGMENT_SHADER);

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log("GLSL LINK ERROR: " + gl.getProgramInfoLog(shaderProgram));
    }

    return shaderProgram;
}

function createShader(code, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, code);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("GLSL COMPILE ERROR: " + gl.getShaderInfoLog(shader));
    }

    return shader;
}

function getShaderAttributes(shaderProgram) {
    var attributes = {};

    const count = gl.getProgramParameter(shaderProgram, gl.ACTIVE_ATTRIBUTES);
    for (var i = 0; i < count; i += 1) {
        const info = gl.getActiveAttrib(shaderProgram, i);
        attributes[info.name] = gl.getAttribLocation(shaderProgram, info.name);
        shaderProgram[info.name] = gl.getAttribLocation(shaderProgram, info.name);
    }

    return attributes;
}

function getShaderUniforms(shaderProgram) {
    var uniforms = {};

    const count = gl.getProgramParameter(shaderProgram, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < count; i += 1) {
        const info = gl.getActiveUniform(shaderProgram, i);
        uniforms[info.name] = gl.getUniformLocation(shaderProgram, info.name);
        shaderProgram[info.name] = gl.getUniformLocation(shaderProgram, info.name);
    }

    return uniforms;
}

function getShaderAttribute(shader, name) {
    var names = Object.keys(shader.attributes);

    for (var i = 0; i < names.length; i++) {
        if (names[i] == name) {
            return i;
        }
    }

    return -1;
}

function getShaderUniform(shader, name) {
    var names = Object.keys(shader.uniforms);

    for (var i = 0; i < names.length; i++) {
        if (names[i] == name) {
            return i;
        }
    }

    return -1;
}

function setShaderUniform(shaderProgram, name, value) {
    const pos = findShaderUniform(shaderProgram, name)
    if (pos != -1) {
        if (isFloat(value)) {
            gl.uniform1f(shaderProgram, value);
        } else if (isInt(value)) {
            gl.uniform1i(shaderProgram, value);
        }
    }
}
