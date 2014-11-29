function GPU(controller){
  this.controller = controller;
  this.shaders = [];
  this.started = false;

  this.gl = null;
  this.error = false;
  this.quad = null;
  this.vertexShader = null;
  this.fragmentShader = null;
  this.drawn = 0;
  this.fps = 0;
  this.focussed = true;
  this.size = 256;

  this._raf = null;
  this._i = 0;
  this._now = null;
  this._time = null;
  this._pos = null;
};

GPU.prototype = {
  _canvas: document.querySelector('#webgl'),

  init: function(){
    this.error = /MSIE/.test(navigator.userAgent);
    if(!this.error) try {
      this.gl = this._canvas.getContext('webgl') || this._canvas.getContext('experimental-webgl');
      if(!window.WebGLRenderingContext) throw 'Your browser does not support WebGL.';
      this.gl.viewportWidth = this.size;
      this.gl.viewportHeight = this.size;
    }
    catch(e){
      this.error = true;
    }
    if(this.error) return console.warn('Could not initialize WebGL');

    this.vertexShader = Shaders.getShader('vertex',this.gl);
    this.fragmentShader = Shaders.getShader('fragment',this.gl);

    this.gl.blendFunc(this.gl.SRC_ALPHA,this.gl.ONE);
    this.gl.enable(this.gl.BLEND);
    this.gl.clearColor(0,0,0,0);
    this.gl.viewport(0,0,this.size,this.size);

    this.quad = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quad);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([-1.,-1.,1.,-1.,-1.,1.,1.,-1.,1.,1.,-1.,1.]), this.gl.STATIC_DRAW);

    var self = this;
    addEventListener('focus',function(){self.focussed = true});
    addEventListener('blur',function(){self.focussed = false});
  },

  start: function(){
    if(this.started || this.error) return;
    this.started = true;
    console.info('Starting GPU..');

    var self = this;
    (function cycle(){
      self._raf = requestAnimationFrame(cycle);
      self.draw();
    })();
    
    this._int = setInterval(function(){
      self.fps = self.drawn;
      self.drawn = 0;

      if(self.focussed && self.fps >= 40)
        for(var i=0;i<15;i++)
          self.addShader();

    },1000);

    this.addShader();

  },

  stop: function(){
    if(!this.started) return;
    this.started = false;
    console.info('Stopping GPU..');
    cancelAnimationFrame(this._raf);
    clearInterval(this._int);
    var self = this;
    setTimeout(function(){
      while(self.shaders.length)
        self.shaders.shift();
    },1500);
  },

  addShader: function(){
    var shader = this.gl.createProgram();
    shader.start = Date.now();
    this.gl.attachShader(shader,this.vertexShader);
    this.gl.attachShader(shader,this.fragmentShader);
    this.gl.linkProgram(shader);
    if(!this.gl.getProgramParameter(shader, this.gl.LINK_STATUS))
      console.warn('Could not initialise shaders');
    else this.shaders.push(shader);
  },

  draw: function(){
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this._now = Date.now();
    for(this._i=0;this._i<this.shaders.length;this._i++) {
      this._pos = this.gl.getAttribLocation(this.shaders[this._i], 'position');
      this._time = this.gl.getUniformLocation(this.shaders[this._i], 'time');

      this.gl.useProgram(this.shaders[this._i]);
      this.gl.uniform1f(this._time,(this._now-this.shaders[this._i].start)/1000);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quad);
      this.gl.vertexAttribPointer(this._pos, 2, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(this._pos);
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
      this.gl.disableVertexAttribArray(this._pos);
    }
    this.drawn++;
  }

};

var Shaders = {
  vertex: [
    'attribute vec2 position;',
    'varying vec2 pos;',

    'void main() {',
    '  gl_Position = vec4(position.x,position.y,0.0,1.0);',
    '  pos = position;',
    '}'
  ].join('\n'),

  fragment: [
    '#ifdef GL_ES',
    'precision highp float;',
    '#endif',

    'uniform float time;',
    'varying vec2 pos;',

    'void main(){',
    '  gl_FragColor = vec4(1.,.5,.1,((1.-length(pos))*.5)*time*.1);',
    '}'
  ].join('\n'),

  getShader: function(type,gl) {
    var shader=gl.createShader(type=='fragment'?gl.FRAGMENT_SHADER:gl.VERTEX_SHADER)
    gl.shaderSource(shader,Shaders[type]);
    gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))
      console.error('Shader Syntax Error in ['+type+']:\n'+gl.getShaderInfoLog(shader));

    return shader;
  }
};
