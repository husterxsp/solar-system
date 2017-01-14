/**
 * @author husterxsp@gmail.com
 **/

function setupShaders() {
    var fragmentShader = loadShaderFromDOM('FragmentShader');
    var vertexShader = loadShaderFromDOM('VertexShader');

    var orbitFragShader = loadShaderFromDOM('OrbitFragShader');
    var orbitVertexShader = loadShaderFromDOM('OrbitVertexShader');

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    orbitProgram = gl.createProgram();
    gl.attachShader(orbitProgram, orbitVertexShader);
    gl.attachShader(orbitProgram, orbitFragShader);
    gl.linkProgram(orbitProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Failed to setup shader shaderProgram');
    }
    if (!gl.getProgramParameter(orbitProgram, gl.LINK_STATUS)) {
        alert('Failed to setup shader orbitProgram');
    }

    gl.useProgram(shaderProgram);

    shaderProgram.aVertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    shaderProgram.aVertexNormal = gl.getAttribLocation(shaderProgram, 'aVertexNormal');
    shaderProgram.aTextureCoord = gl.getAttribLocation(shaderProgram, 'aTextureCoord');

    gl.enableVertexAttribArray(shaderProgram.aVertexPosition);
    gl.enableVertexAttribArray(shaderProgram.aVertexNormal);
    gl.enableVertexAttribArray(shaderProgram.aTextureCoord);

    shaderProgram.uPMatrix = gl.getUniformLocation(shaderProgram, 'uPMatrix');
    shaderProgram.uMMatrix = gl.getUniformLocation(shaderProgram, 'uMMatrix');
    shaderProgram.uVMatrix = gl.getUniformLocation(shaderProgram, 'uVMatrix');
    shaderProgram.uMVMatrix = gl.getUniformLocation(shaderProgram, 'uMVMatrix');
    shaderProgram.uNMatrix = gl.getUniformLocation(shaderProgram, 'uNMatrix');
    shaderProgram.uSampler = gl.getUniformLocation(shaderProgram, 'uSampler');
    shaderProgram.uAmbientColor = gl.getUniformLocation(shaderProgram, 'uAmbientColor');
    shaderProgram.uLightColor = gl.getUniformLocation(shaderProgram, 'uLightColor');
    shaderProgram.radius = gl.getUniformLocation(shaderProgram, 'radius');
    shaderProgram.uUseLighting = gl.getUniformLocation(shaderProgram, 'uUseLighting');

    gl.useProgram(orbitProgram);

    orbitProgram.uPMatrix = gl.getUniformLocation(orbitProgram, 'uPMatrix');
    orbitProgram.uVMatrix = gl.getUniformLocation(orbitProgram, 'uVMatrix');
    orbitProgram.radius = gl.getUniformLocation(orbitProgram, 'radius');
    orbitProgram.theta = gl.getAttribLocation(orbitProgram, 'theta');

    gl.useProgram(shaderProgram);
}

function getTexture(src) {
    var texture = gl.createTexture();
    texture.image = new Image();
    texture.image.onload = function () {
        loadTexture(texture);
    }
    texture.image.src = src;
    return texture;
}

function setupBuffers() {
    gl.enable(gl.DEPTH_TEST);

    var latitudes = 50; // 纬度带
    var longitudes = 50; // 经度带
    var radius = 1;

    var vertexPosition = []; // 顶点数据
    var normal = []; // 法向量数据
    var textureCoord = []; // 纹理数据

    for (var latNum = 0; latNum <= latitudes; latNum++) {
        var theta = (latNum / latitudes) * Math.PI;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var longNum = 0; longNum <= longitudes; longNum++) {
            var phi = (longNum / longitudes) * Math.PI * 2;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = sinTheta * cosPhi;
            var y = cosTheta;
            var z = sinTheta * sinPhi;

            var u = 1 - (longNum / longitudes);
            var v = 1 - (latNum / latitudes);

            normal.push(x, y, z);
            textureCoord.push(u, v);
            vertexPosition.push(radius * x, radius * y, radius * z);
        }
    }

    // first----first + 1
    // |        /   |
    // |       /    |
    // |      /     |
    // second----second + 1
    var indices = []; // 索引数据
    for (var latNum = 0; latNum < latitudes; latNum++) {
        for (var longNum = 0; longNum < longitudes; longNum++) {
            var first = (latNum * (longitudes + 1)) + longNum;
            var second = first + 1 + longitudes;
            indices.push(first, second, first + 1, second, second + 1, first + 1);
        }
    }

    // 缓冲区，顶点，纹理，向量
    normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
    normalBuffer.itemSize = 3;
    normalBuffer.numItems = normal.length / 3;

    textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoord), gl.STATIC_DRAW);
    textureCoordBuffer.itemSize = 2;
    textureCoordBuffer.numItems = textureCoord.length / 2;

    vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPosition), gl.STATIC_DRAW);
    vertexPositionBuffer.itemSize = 3;
    vertexPositionBuffer.numItems = vertexPosition.length / 3;

    indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    indicesBuffer.itemSize = 1;
    indicesBuffer.numItems = indices.length;

    gl.useProgram(orbitProgram);
    var thetaArr = [];
    for (var i = 0; i < 360; i++) {
        thetaArr.push(Math.PI * i / 180);
    }
    orbitBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, orbitBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(thetaArr), gl.STATIC_DRAW);

}

var rotationMatrix = mat4.create();
var modelMatrix = mat4.create();
var viewMatrix = mat4.create();
var modelview = mat4.create();
var projectionMatrix = mat4.create();
var normalMatrix = mat4.create();

function drawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    // 投影
    mat4.perspective(projectionMatrix, Math.PI / 10, gl.viewportWidth / gl.viewportHeight, .1, 1000000);
    // 视图
    viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, [0, GUIObj.lookAtY, GUIObj.lookAtZ], [0, 0, -1], [0, 1, 0]);
    render();
}

function render() {

    var light = GUIObj.light;

    gl.useProgram(shaderProgram);

    var pointColor = [
        GUIObj.pointColor[0] / 255,
        GUIObj.pointColor[1] / 255,
        GUIObj.pointColor[2] / 255,
    ];
    var ambientColor = [
        GUIObj.ambientColor[0] / 255,
        GUIObj.ambientColor[1] / 255,
        GUIObj.ambientColor[2] / 255,
    ];
    gl.uniform3fv(shaderProgram.uLightColor, pointColor);
    gl.uniform3fv(shaderProgram.uAmbientColor, ambientColor);

    // 顶点数据
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    // vertexAttribPointer 用于指定顶点数组
    gl.vertexAttribPointer(shaderProgram.aVertexPosition, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // 纹理数据
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.aTextureCoord, textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // 向量数据
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(shaderProgram.aVertexNormal, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);

    gl.uniformMatrix4fv(shaderProgram.uVMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(shaderProgram.uPMatrix, false, projectionMatrix);

    gl.uniform1i(shaderProgram.uUseLighting, false);
    planetList[0].setMatrix();
    planetList[0].setTexture();
    planetList[0].draw();

    gl.uniform1i(shaderProgram.uUseLighting, true);
    for (var i = 1; i < planetList.length; i++) {
        planetList[i].setMatrix();
        planetList[i].setTexture();
        planetList[i].draw();
    }

    gl.useProgram(orbitProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, orbitBuffer);
    gl.vertexAttribPointer(orbitProgram.theta, 1, gl.FLOAT, false, 0, 0)

    gl.uniformMatrix4fv(orbitProgram.uPMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(orbitProgram.uVMatrix, false, viewMatrix);
    for (var i = 0; i < planetList.length; i++) {
        planetList[i].drawOrbit();
    }
}

var frame = 0;

function tick() {
    frame++;
    for (var i = 0; i < planetList.length; i++) {
        planetList[i].animate();
    }
    drawScene();
    requestAnimationFrame(tick);
}

var GUIObj = {
    message: 'Solar system',
    lookAtY: 100,
    lookAtZ: 150,
    pointColor: [204, 204, 204],
    ambientColor: [51, 51, 51],
};

function initGUI() {
    var gui = new dat.gui.GUI();
    gui.remember(GUIObj);
    gui.add(GUIObj, 'message');
    gui.add(GUIObj, 'lookAtY').min(-200).max(200).step(1);
    gui.add(GUIObj, 'lookAtZ').min(10).max(500).step(1);
    gui.addColor(GUIObj, 'pointColor');
    gui.addColor(GUIObj, 'ambientColor');
}

var planetList = [];

function initPlanets() {
    for (var i = 0; i < planets.length; i++) {
        planetList.push(new Planet(planets[i]));
    }
}

function init() {
    canvas = document.getElementById('webgl');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl = createGLContext(canvas);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    setupShaders();
    setupBuffers();
    initPlanets();
    initGUI();
    tick();
}

init();
