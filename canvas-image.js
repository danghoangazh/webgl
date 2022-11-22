function drawCanvas() {
  let image = new Image();
  image.src = "hinh-demo.png";
  image.onload = function () {
    render(image);
    console.log(image);
  };
}

function render(image) {
  const canvas = document.getElementById("glcanvas");
  let gl = canvas.getContext("webgl");
  if (!gl) return;
  //   const vertex_shader = `
  //     attribute vec4 a_position;
  //     uniform vec4 u_offset;
  //     void main() {
  //       gl_Position = a_position + u_offset;
  //     }`;
  //   const fragment_shaer = `

  //     void main(){
  //       gl_FragColor = vec4(1, 0, 0.5, 1);
  //     }
  //     `;
  const vertex_shader = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;

    uniform vec2 u_resolution;

    varying vec2 v_texCoord;

    void main() {
       vec2 zeroToOne = a_position / u_resolution;

       vec2 zeroToTwo = zeroToOne * 2.0;

       vec2 clipSpace = zeroToTwo - 1.0;

       gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

       v_texCoord = a_texCoord;
    }`;
  const fragment_shaer = `

      precision mediump float;

      uniform sampler2D u_image;

      varying vec2 v_texCoord;

      void main() {
          gl_FragColor = texture2D(u_image, v_texCoord);
      }
        `;

  // create 2 shader
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex_shader);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment_shaer);

  //   tạo progarm
  var program = createProgram(gl, vertexShader, fragmentShader);
  //  lay vi tri
  var positionLocation = gl.getAttribLocation(program, "a_position");
  var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");

  // tao buffer store dât
  var positionBuffer = gl.createBuffer();
  // binding de su dung webgl resource
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Set a rectangle the same size as the image.
  setRectangle(gl, 0, 0, image.width, image.height);

  // provide texture coordinates for the rectangle.
  var texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
    ]),
    gl.STATIC_DRAW
  );

  // Create a texture.
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  // lookup uniforms
  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width-100, gl.canvas.height-100);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Turn on the position attribute
  gl.enableVertexAttribArray(positionLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
  var size = 2; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionBuffer,
    size,
    type,
    normalize,
    stride,
    offset
  );

   // Turn on the texcoord attribute
   gl.enableVertexAttribArray(texcoordLocation);

   // bind the texcoord buffer.
   gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
 
   // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
   var size = 2;          // 2 components per iteration
   var type = gl.FLOAT;   // the data is 32bit floats
   var normalize = false; // don't normalize the data
   var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
   var offset = 0;        // start at the beginning of the buffer
   gl.vertexAttribPointer(
       texcoordLocation, size, type, normalize, stride, offset);

  // set the resolution
  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

  // Draw the rectangle.
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 6;
  gl.drawArrays(primitiveType, offset, count);
}

// UTIL FUMCYION

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
  gl.deleteProgram(program);
}
// set vi tri cac dinh
function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  );
}

drawCanvas();
