class wy3d_Resource {
    constructor(name, path) {
        this.name = name;
        this.type = getType(path);
        this.res = loadResource(this.type, path);
    }


    getName() {
        return this.name;
    }

    getType() {
        return this.type;
    }

    getRes() {
        return this.res;
    }
}

function loadResource(type, path) {
    var resource = null;
    getFile(path, type, function (contents) {
        resource = contents;
    });

    return resource;
}

function getBlob(path) {

}

function getFile(url, type, callback) {
    console.log("getFile: " + url);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    //xhr.responseType = 'arraybuffer';
    xhr.overrideMimeType("text/plain; charset=x-user-defined");
    xhr.onload = function () {
        if (type == 'wy3dt') {
            var response = xhr.responseText;
            var buffer = new Uint8Array(response.length);
            for (var i = 0; i < buffer.length; i++)
                buffer[i] = response.charCodeAt(i);

            var png = UPNG.decode(buffer);
            callback(png);
        } else {
            callback(xhr.response);
        }
    };

    //xhr.send(null);
    xhr.send();
};

function getType(path) {
    var s = path.split('.');
    return s[s.length - 1];
}
