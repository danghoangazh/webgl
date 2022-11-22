const loadImage = () =>
  new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = "/hinh3.jpg";
  });

var copyVideo = false;
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

  /*  cb data */
  // x= 0, y= 0, width = 100px

  const vertexBufferData = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);
  // toa do texture trung vs sv
  const texCoordBufferData = new Float32Array([0, 1, 0, 0, 1, 1, 1, 0]);

  const pixels = new Uint8Array([230, 25, 75]);
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

  const texture = initTexture(gl);

  const video = setupVideo("fille_mp4.mp4");

  var then = 0;

  function render(now) {
    now *= 0.001; // convert to seconds
    const deltaTime = now - then;
    then = now;

    if (copyVideo) {
      updateTexture(gl, texture, video);
    }
    drawScene(gl);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function initTexture(gl) {
  const texture = gl.createTexture();
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  const pixel = new Uint8Array([230, 25, 75]);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGB,
    1,
    1,
    0,
    gl.RGB,
    gl.UNSIGNED_BYTE,
    pixel
  );
  //   gl.generateMipmap(gl.TEXTURE_2D)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  return texture;
}

function updateTexture(gl, texture, video) {
  const level = 0;
  const internalFormat = gl.RGBA;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    srcFormat,
    srcType,
    video
  );
}

function setupVideo(url) {
  const video = document.createElement("video");

  var playing = false;
  var timeupdate = false;

  video.playsInline = true;
  video.muted = true;
  video.loop = true;

  // Waiting for these 2 events ensures
  // there is data in the video

  video.addEventListener(
    "playing",
    function () {
      playing = true;
      checkReady();
    },
    true
  );

  video.addEventListener(
    "timeupdate",
    function () {
      timeupdate = true;
      checkReady();
    },
    true
  );

  video.src = url;
  video.play();

  function checkReady() {
    if (playing && timeupdate) {
      copyVideo = true;
    }
  }

  return video;
}

function drawScene(gl) {
  // gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  // gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
// func


export default function drawVideo(){
  // console.log("draw video")
  // renderCt();

}
