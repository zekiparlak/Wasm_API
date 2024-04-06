const ApiWasm_TestModule = require('./WasmAPI/ApiWasm_Test');
const VirApiManager = require('./VirApiJS/VirApiManager');

var wmodule;
var api;
var virapiManager;
var url = "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/0/0/0";
var load = 0;

function RandomRange(minR, maxR) {
    return Math.floor(Math.random() * (maxR - minR)) + minR;
}

function changeTexture() {
    api.TextureRequest(document.getElementById('urlText').value);
}

function onSetUrl() {
    let lon = document.getElementById('Lon').value;
    let lat = document.getElementById('Lat').value;
    let load = document.getElementById('Load').value;

    document.getElementById('urlText').value = api.LatLonToTileUrl(lon, lat, load);
    changeTexture();
}

class Point {
    constructor(_x, _y) {
        this.X = _x;
        this.Y = _y;
    }
}

function jsPerformanceTest() {
    var n = 10000000;
    var coeffs = 0.005;
    var sum = 0;
    for (var i = 0; i < n; i++) {
        var p = new Point((i % 100) * 5, (i % 100) * 3);
        sum += (i + coeffs * p.X - i + coeffs * p.Y);;
        p = null;
    }
    return sum;
}

function jsTest() {
    let start;
    let diffSum = 0;
    let n = 100;
    let res;
    for(var i = 0; i < n; i++){
        start = performance.now();
        res = jsPerformanceTest();
        diffSum += performance.now() - start;
    }
    document.getElementById("testResult").innerText += " Avarage JavaScript: " + (diffSum / n) + " miliseconds \n";
}

function wasmTest() {
    let start;
    let diffSum = 0;
    let n = 100;
    let res;
    for (var i = 0; i < n; i++) {
        start = performance.now();
        res = api.Test_WASM_Performance();
        diffSum += performance.now() - start;
    }
    document.getElementById("testResult").innerText += " Avarage WASM: " + (diffSum / n) + " miliseconds \n";
}

function callbackBtn() {
    var callback = new wmodule.Callback();
    callback.DoCallback = (minP, maxP) => {
        var minPoint = wmodule.wrapPointer(minP, wmodule.Point);
        var maxPoint = wmodule.wrapPointer(maxP, wmodule.Point);
        var msg = "Min Point :(" + minPoint.X + " , " + minPoint.Y + ")\n";
        msg += "Max Point :(" + maxPoint.X + " , " + maxPoint.Y + ")\n";

        document.getElementById("callbackResult").innerText = msg;
    }

    var len = 100;
    var heap = new Int32Array(len);
    for (var i = 0; i < len; i++) {
        heap[i] = (new wmodule.Point(RandomRange(0, 1000), RandomRange(0, 1000))).ptr;
    }

    var arraybuffer = wmodule._malloc(Int32Array.BYTES_PER_ELEMENT * len);
    wmodule.HEAP32.set(heap, arraybuffer >> 2);
    api.TestCallback(callback, arraybuffer, len);
}

function setCanvasEvents(){
    var cnv = document.getElementById('glcanvas');
    cnv.addEventListener('wheel', (e) => {
        const pos = {
            x: e.clientX - cnv.offsetLeft,
            y: e.clientY - cnv.offsetTop
        };

        if (e.deltaY < 0) load++;
        else if(e.deltaY > 0) load--;

        if(load <= 0) load = 0;
        else if(load >= 19) load = 19;

        api.ChangeTexture_OnWheel(pos.x, pos.y, load, cnv.clientWidth / 2, cnv.clientHeight / 2);
    });
}

function ui_Settings() {
    document.getElementById('Lon').value = 0;
    document.getElementById('Lat').value = 0;
    document.getElementById('Load').value = 0;
    document.getElementById('urlText').value = url;
    document.getElementById('textureBtn').onclick = changeTexture;
    document.getElementById('setUrl').onclick = onSetUrl;
    document.getElementById('jsPerTest').onclick = jsTest;
    document.getElementById('wasmPerTest').onclick = wasmTest;
    document.getElementById('doCallback').onclick = callbackBtn;
}

function startApi() {
    ui_Settings();
    setCanvasEvents();

    ApiWasm_TestModule().then(module => {
        wmodule = module;

        virapiManager = new VirApiManager(wmodule, 'glcanvas');
        virapiManager.SetVirApi();
        api = new wmodule.Api(virapiManager.GetVirApi());
        api.TextureRequest(url);

        document.getElementById("tests").innerText = api.TestMessage("Electron App") + "\n";

        var lenptr = wmodule._malloc(Int32Array.BYTES_PER_ELEMENT);

        var arraybuffer = api.TestFloatArray(lenptr);
        var len = wmodule.getValue(lenptr, 'i32');
        var farr = new Float32Array(wmodule.HEAPF32.buffer, arraybuffer, len);

        document.getElementById("tests").innerText += "\nFloat Array Example\n" + farr.join("\n");
    })
}

startApi();
