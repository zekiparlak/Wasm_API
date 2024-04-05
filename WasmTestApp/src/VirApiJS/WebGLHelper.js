class WebGLHelper{
    constructor(canvasID){
        this.cnv = document.getElementById(canvasID);
        this.gl = this.cnv.getContext('webgl');

        if (!this.gl) {
            console.error('WebGL not supported');
            return;
        }

        this.drawingBuffers = null;
    }

    initWebGl(){
        const vsSource = `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;

            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_texCoord = a_texCoord;
            }
        `;

        const fsSource = `
            precision mediump float;
            varying vec2 v_texCoord;
            uniform sampler2D u_texture;

            void main() {
                gl_FragColor = texture2D(u_texture, v_texCoord);
            }
        `;

        const shaderProgram = this.initShaderProgram(vsSource, fsSource);

        this.programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(shaderProgram, 'a_position'),
                texCoord: this.gl.getAttribLocation(shaderProgram, 'a_texCoord'),
            },
                uniformLocations: {
                texture: this.gl.getUniformLocation(shaderProgram, 'u_texture'),
            }
        };  
    }

    initShaderProgram(vsSource, fsSource){
        const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fsSource);
    
        const shaderProgram = this.gl.createProgram();
        this.gl.attachShader(shaderProgram, vertexShader);
        this.gl.attachShader(shaderProgram, fragmentShader);
        this.gl.linkProgram(shaderProgram);
    
        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
            console.error('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(shaderProgram));
            return null;
        }
    
        return shaderProgram;
    }

    loadShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
    
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
    
        return shader;
    }   
    
    loadIcon(url){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'arraybuffer';
        xhr.send();
        xhr.onload = () => {  
          if (xhr.status === 200) {            
            var blob = new Blob([xhr.response], { type: xhr.getResponseHeader('Content-Type') });
            var urlCreator = window.URL || window.webkitURL;
            var mainImage = new Image();
            
            mainImage.onload = () => {
                this.setViewPort(mainImage.width, mainImage.height)                
                this.drawingBuffers = this.fillBuffers(mainImage)      
                window.URL.revokeObjectURL(mainImage.src)
                this.drawIcon();                
            };            

            mainImage.crossOrigin = ''
            mainImage.src = urlCreator.createObjectURL(blob)  
          }
        };
    }

    setViewPort(imageW, imageH){
        const {canvas} = this.gl
        canvas.width = imageW; canvas.height = imageH
        this.gl.viewport(0, 0, canvas.width, canvas.height);
    }

    fillBuffers(image){
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        const positions = [
          -1, 1,
           1, -1,
           1, 1,
           1, -1,
          -1, 1,
          -1, -1
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
      
        const textureCoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer);
        const textureCoordinates = [
          0, 0,
          1, 1,
          1, 0,
          1, 1,
          0, 0,
          0, 1
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), this.gl.STATIC_DRAW)
      
        return {positionBuffer, textureCoordBuffer, texture : this.createTexture(image)}
    }

    createTexture(image) {
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image)
        this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
        this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
        return texture;
    }

    drawIcon() {
        const {program, attribLocations} = this.programInfo
        const {vertexPosition,texCoord } = attribLocations
        const {positionBuffer,textureCoordBuffer, texture} = this.drawingBuffers
    
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    
        this.gl.useProgram(program);
    
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)
        this.gl.vertexAttribPointer(vertexPosition, 2, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(vertexPosition)
    
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer)
        this.gl.vertexAttribPointer(texCoord, 2, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(texCoord)
    
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
    
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
    }
}

module.exports = WebGLHelper;