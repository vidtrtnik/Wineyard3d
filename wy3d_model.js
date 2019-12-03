function wy3d_Model(resource) {
    this.v = parseModel_vertices(resource.res);
    this.i = parseModel_indices(resource.res);
    this.n = parseModel_normals(resource.res);
    this.t = parseModel_texcoords(resource.res);
    this.b = parseModel_boundingbox(resource.res);

    this.vertexBuffer = initVertexBuffer(this.v);
    this.indexBuffer = initIndexBuffer(this.i);
    this.normalBuffer = initNormalBuffer(this.n);
    this.textureBuffer = initTextureBuffer(this.t);
    this.boundingBox = this.b;
}

function parseModel_vertices(content) {
    var vertices;
    vertices = content.replace(/\s/g, '');

    vertices = vertices.split('v');
    vertices = vertices[1].split('i');
    vertices = vertices[0].split(',');

    var verticesArray = [];
    for (var i = 0; i < vertices.length; i++) {
        verticesArray.push(parseFloat(vertices[i]));
    }
    return verticesArray;
}

function parseModel_indices(content) {
    var indices;
    indices = content.replace(/\s/g, '');

    indices = indices.split('v');
    indices = indices[1].split('i');
    indices = indices[1].split('n');
    indices = indices[0].split(',');

    var indicesArray = [];
    for (var i = 0; i < indices.length; i++) {
        indicesArray.push(parseInt(indices[i]));
    }
    return indicesArray;
}

function parseModel_normals(content) {
    var normals;
    normals = content.replace(/\s/g, '');

    normals = normals.split('v');
    normals = normals[1].split('i');
    normals = normals[1].split('n');
    normals = normals[1].split('t');
    normals = normals[0].split(',');

    var normalsArray = [];
    for (var i = 0; i < normals.length; i++) {
        normalsArray.push(parseFloat(normals[i]));
    }
    return normalsArray;
}

function parseModel_texcoords(content) {
    var texcoords;
    texcoords = content.replace(/\s/g, '');

    texcoords = texcoords.split('t');
    texcoords = texcoords[1].split(',');

    var texcoordsArray = [];
    for (var i = 0; i < texcoords.length; i++) {
        texcoordsArray.push(parseFloat(texcoords[i]));
    }
    return texcoordsArray;
}

function parseModel_boundingbox(content) {
    var bbdim;
    bbdim = content.replace(/\s/g, '');

    bbdim = bbdim.split('b');
    bbdim = bbdim[1].split(',');

    var bbdimArray = [];
    for (var i = 0; i < bbdim.length; i++) {
        bbdimArray.push(parseFloat(bbdim[i]));
    }
    return bbdimArray;
}

function initVertexBuffer(vertices) {
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    return vertexBuffer;
}

function initIndexBuffer(indices) {
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    return indexBuffer;
}

function initNormalBuffer(normals) {
    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    return normalBuffer;
}

function initTextureBuffer(texcoords) {
    var textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

    return textureBuffer;
}
