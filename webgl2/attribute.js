function renderCt() {
  const vertexShaderSource = `#version 300 es
    #pragma vscode_glsllint_stage: vert

    in float aPointSize;
    in vec2 aPositionnn;
    in vec3 aColor;

    out vec3 vColor;

    void main() {
        vColor = aColor;
        gl_PointSize = aPointSize;
        gl_Position = vec4(aPositionnn, 0.0, 1.0);
    }`;
  const fragmentShaderSource = `#version 300 es
    #pragma vscode_glsllint_stage: frag

    precision mediump float;

    out vec4 fragColor;
    in vec3 vColor;
    void main()
    {
        fragColor = vec4(vColor, 1.0);
    }`;

  const canvas = document.querySelector("#myCanvas");
  /** @type {WebGLRenderingContext} */
  const gl = canvas.getContext("webgl2");
  const program = gl.createProgram();

  // stp link to vertex - fragment to program
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  gl.attachShader(program, vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader));
    console.log(gl.getShaderInfoLog(fragmentShader));
  }

  gl.useProgram(program);

  // x= 0, y= 0, width = 100px
  const bufferData = new Float32Array([
    -1, 1,     100,     1,0,0,
    1, 1,   33,     0,1,0,
    1, -1 , 50,         0,0,1
]);

  //   get positioo c ++  => js
  const aPositionnnLoc = gl.getAttribLocation(program, "aPositionnn");
  const aPosiSizeLoc = gl.getAttribLocation(program, "aPointSize");
  const aColorLoc = gl.getAttribLocation(program, "aColor");

  gl.enableVertexAttribArray(aPositionnnLoc);
  gl.enableVertexAttribArray(aPosiSizeLoc);
  gl.enableVertexAttribArray(aColorLoc);

  // tao buffer object
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
// gl.vertexAttribPointer: Tell webgl how to unraval our chain of js ints and floats into the values that our shader expects and needs   
//  aPositionnnLoc : vi tri attribute
// x va y => 2
// don't normalize the data 
// gl.FLOAT
// 3 * 4 : [3] byte dl  dinh, [4] la 1 float = 4 bytes
// 0: buffer start 0 | 2*4  => 2 vị trí và 4 bytes (1 float) //     0, 0,     100,     1,0,0, = 6
gl.vertexAttribPointer(aPositionnnLoc, 2, gl.FLOAT, false, 6 * 4, 0);
gl.vertexAttribPointer(aPosiSizeLoc, 1, gl.FLOAT, false, 6 * 4, 2 * 4);
gl.vertexAttribPointer(aColorLoc, 1, gl.FLOAT, false, 6 * 4, 3 * 4);
  gl.drawArrays(gl.TRIANGLES , 0, 3);
}

renderCt();
