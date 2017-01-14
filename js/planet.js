/**
 * 创建行星对象
 */
function Planet(args) {
    this.name = args.name;
    this.rotRadius = args.rotRadius;
    this.rotPeriod = args.rotPeriod;
    this.revRadius = args.revRadius * 8;
    this.revPeriod = args.revPeriod;
    this.ring = args.ring;
    this.orbitIncl = args.orbitIncl;

    this.texture = getTexture(args.texture);
    this.matrix = mat4.create();
}

Planet.prototype = {
    constructor: Planet,
    draw: function () {
        gl.drawElements(gl.TRIANGLES, indicesBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    },
    animate: function () {
        // 旋转平移
        var rotMatrix = mat4.create();
        var traMatrix = mat4.create();
        var rotAngle = frame / this.rotPeriod;
        
        mat4.rotate(rotMatrix, rotMatrix, rotAngle, [0, 1, 0]);
        if (this.revPeriod) {
            var traAngle = -frame / this.revPeriod;
            mat4.translate(traMatrix, traMatrix,
                [this.revRadius * Math.cos(traAngle), 0, this.revRadius * Math.sin(traAngle)]);      
        }
        mat4.multiply(this.matrix, traMatrix, rotMatrix);
        mat4.multiply(this.matrix, this.matrix, modelMatrix);
    },
    setMatrix: function () {
        mat4.multiply(modelview, viewMatrix, this.matrix);
        gl.uniformMatrix4fv(shaderProgram.uMVMatrix, false, modelview);
        gl.uniformMatrix4fv(shaderProgram.uMMatrix, false, this.matrix);
        gl.uniform1f(shaderProgram.radius, this.rotRadius);

        // 逆转置
        mat4.invert(normalMatrix, this.matrix);
        mat4.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix4fv(shaderProgram.uNMatrix, false, normalMatrix);
    },
    setTexture: function () {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
    },
    drawOrbit: function () {
        gl.uniform1f(orbitProgram.radius, this.revRadius);
        gl.drawArrays(gl.LINE_LOOP, 0, 360);
    }
};
