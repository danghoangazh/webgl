function drawCanvas() {
  const canvas = document.getElementById("glcanvas");
  let gl = canvas.getContext("webgl");
  if (!gl) return;

  const vertex_shader = `
    attribute vec4 a_position;
    uniform vec4 u_offset;
    void main() {
      gl_Position = a_position + u_offset;
    }`;
  const fragment_shaer = `
  
    void main(){
      gl_FragColor = vec4(1, 0, 0.5, 1);
    }
    `;
  function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }
  // create 2 shader
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex_shader);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment_shaer);
  // link 2 shader vao program
  function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }
  //   tạo progarm
  var program = createProgram(gl, vertexShader, fragmentShader);
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  //

  // tao buffer store dât
  var positionBuffer = gl.createBuffer();
  // binding de su dung webgl resource
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var positions = [
    // toa do x, y
    0, 0, 0, 0.5, 0.7, 0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);
}

drawCanvas()