const WebGLHelper = require('./WebGLHelper');

class VirApiManager {
    constructor(wmodule, canvasID) {
        this.wasmApi = wmodule; 
        this.webglHelper = new WebGLHelper(canvasID);
        this.virApi = new this.wasmApi.VirApi();
    }

    GetVirApi() {
        return this.virApi;
    }

    SetVirApi() {
        const { wasmApi, webglHelper, virApi } = this;

        virApi.InitWebGL = () => {
            webglHelper.initWebGl();
        }

        virApi.DownloadAndMakeTexture = (_url) => {
            var url = wasmApi.UTF8ToString(_url);
            document.getElementById('urlText').value = url;
            webglHelper.loadIcon(url);
        }
    }
}

module.exports = VirApiManager;