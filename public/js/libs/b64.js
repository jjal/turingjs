var b64 = (function() {

var hash = {'=': 0};

Array.prototype.forEach.call(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    function(c, i){hash[c] = i});


function b64decode(s) {
    var h = hash,
        i = 0,
        j = 0,
        n = s.length,
        bytes = new Uint8Array(n * 6 / 8),
        a1, a2, a3, a4;

    for(;i < n; i += 4, j += 3) {
        a1 = h[s[i]];
        a2 = h[s[i + 1]];
        a3 = h[s[i + 2]];
        a4 = h[s[i + 3]];

        bytes[j] = (a1 << 2) | (a2 >> 4);
        bytes[j + 1] = (a2 << 4) | (a3 >> 2);
        bytes[j + 2] = (a3 << 6) | a4;
    }

    return bytes.subarray(0, j - (s[n - 1] === '=' ? 1 : 0) - (s[n - 2] === '=' ? 1 : 0));
}

var b64encode = typeof importScripts === 'function' ?
//worker
function(bytes) {
    var dataURL = new FileReaderSync().readAsDataURL(new Blob([bytes])),
        startPos = dataURL.indexOf(',') + 1;

    return dataURL.slice(startPos);
} :
//browser
function(bytes, callback) {
    var dataURL, startPos,
        fr = new FileReader;

    fr.onloadend = function() {
        dataURL = fr.result;
        startPos = dataURL.indexOf(',') + 1;
        callback(dataURL.slice(startPos));
    };
    fr.readAsDataURL(new Blob([bytes]));
};

return {
    encode: b64encode,
    decode: b64decode
};

})();
