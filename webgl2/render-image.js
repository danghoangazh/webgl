import { makeTextCanvas } from "./common.js";

const loadImage = () =>
  new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = "/hinh3.jpg";
  });

function renderCt() {
  const vertexShaderSource = `#version 300 es
      #pragma vscode_glsllint_stage: vert
  
      layout(location=0) in vec4 aPosition;
      layout(location=1) in vec2 aTexCoord;
      
      out vec2 vTexCoord;

      void main() {
        vTexCoord = aTexCoord;
        gl_Position = aPosition;
      }`;
  const fragmentShaderSource = `#version 300 es
      #pragma vscode_glsllint_stage: frag
  
      precision mediump float;
  
      in vec2 vTexCoord;
      uniform sampler2D uSampler;
      out vec4 fragColor;
      void main()
      {
        fragColor = texture(uSampler, vTexCoord);
      }`;
  /** @type {WebGLRenderingContext} */

  const canvas = document.querySelector("#myCanvas");
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

  /*  cb data */
  // x= 0, y= 0, width = 100px

  const vertexBufferData = new Float32Array([0, 1, 0, -1, 1, 1, 1, -1]);
  // toa do texture trung vs sv
  const texCoordBufferData = new Float32Array([0, 1, 0, 0, 1, 1, 1, 0]);

  const pixels = new Uint8Array([
    255, 255, 255, 230, 25, 75, 60, 180, 75, 255, 225, 25, 67, 99, 216, 245,
    130, 49, 145, 30, 180, 70, 240, 240, 240, 50, 230, 188, 246, 12, 250, 190,
    190, 0, 128, 128, 230, 190, 255, 154, 99, 36, 255, 250, 200, 0, 0, 0,
  ]);
  /* --- END ---*/
  //   get positioo c ++  => js
  //   const aPositionLoc = gl.getAttribLocation(program, "aPosition"); DUNG LOCATION NEN COMMENT
  //   const aTexCoordLoc = gl.getAttribLocation(program, "aTexCoord"); DUNG LOCATION
  //   gl.enableVertexAttribArray(aPositionLoc);
  //   gl.enableVertexAttribArray(aTexCoordLoc);
  //

  // tao buffer object => tu location tren
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexBufferData, gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);
  //
  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, texCoordBufferData, gl.STATIC_DRAW);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(1);

  async function run() {
    // init texture imnage
    let image = await loadImage();
    const texture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGB,
      image.width,
      image.height,
      0,
      gl.RGB,
      gl.UNSIGNED_BYTE,
      image
    );

    //   gl.generateMipmap(gl.TEXTURE_2D)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    //
    const vertexBufferData = new Float32Array([0, 1, 0, -1, 1, 1, 1, -1]);
    // toa do texture trung vs sv
    const texCoordBufferData = new Float32Array([0, 1, 0, 0, 1, 1, 1, 0]);

    const pixels = new Uint8Array([
      255, 255, 255, 230, 25, 75, 60, 180, 75, 255, 225, 25, 67, 99, 216, 245,
      130, 49, 145, 30, 180, 70, 240, 240, 240, 50, 230, 188, 246, 12, 250, 190,
      190, 0, 128, 128, 230, 190, 255, 154, 99, 36, 255, 250, 200, 0, 0, 0,
    ]);
    /* --- END ---*/
    //   get positioo c ++  => js
    //   const aPositionLoc = gl.getAttribLocation(program, "aPosition"); DUNG LOCATION NEN COMMENT
    //   const aTexCoordLoc = gl.getAttribLocation(program, "aTexCoord"); DUNG LOCATION
    //   gl.enableVertexAttribArray(aPositionLoc);
    //   gl.enableVertexAttribArray(aTexCoordLoc);
    //

    // tao buffer object => tu location tren
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexBufferData, gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    //
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoordBufferData, gl.STATIC_DRAW);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(1);

    async function run() {
      // init texture imnage
      let image = await loadImage();
      const texture = gl.createTexture();
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGB,
        image.width,
        image.height,
        0,
        gl.RGB,
        gl.UNSIGNED_BYTE,
        image
      );

      //   gl.generateMipmap(gl.TEXTURE_2D)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    run();
  }
}
renderCt();

export default function drawImage() {
  console.log("drawImage");
  renderCt();
}
