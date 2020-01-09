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
        if(resource === null || resource === undefined)
            return false;
    });

    return resource;
}

function getBlob(path) {

}

function getFile(url, type, callback) {
    console.log("getFile: " + url);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
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
            var cb_arg = xhr.response;
            if(xhr.status === 404)
                cb_arg = null;
            
            callback(cb_arg);
        }
    };

    xhr.send();
};

function getType(path) {
    var s = path.split('.');
    return s[s.length - 1];
}
