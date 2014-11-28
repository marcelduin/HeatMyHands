function Controller(){
  this.cpu = new CPU(this);
  this.gpu = new GPU(this);
  this.net = new Net(this);
  this.slider = new Slider(this);

  this.started = false;
  this.currentState = 0;

  this._int = null;
  this._int2 = null;
  this._to = null;
};

Controller.prototype = {
  _numWorkers: document.querySelector('#num_workers'),
  _numShaders: document.querySelector('#num_shaders'),
  _numConnections: document.querySelector('#num_connections'),
  _numTotalConnections: document.querySelector('#num_tot_connections'),
  _fps: document.querySelector('#fps'),

  init: function(){
    this.cpu.init();
    this.gpu.init();
    this.slider.init();

    var ualc = navigator.userAgent.toLowerCase();

    this.isMobile = /ipad|iphone|ipod/.test(ualc)
      || /android/.test(ualc);

    if(this.isMobile) document.documentElement.classList.add('mobile');

    var self = this;

    this.slider.onchange = function(bool){
      self[self.started?'stop':'start']();
    };

    this._int = setInterval(function(){
      self.printInfo();
    },1000);
  },

  start: function(){
    if(this.started) return;
    this.started = true;
    this.cpu.start();
    this.gpu.start();
    this.net.start();

    document.documentElement.classList.add('started');

    var self = this;
    this._to = setTimeout(function(){
      self.setState(self.currentState+1);
      self._int2 = setInterval(function(){
        document.documentElement.classList.add('busy');
        self.setState(self.currentState+1);
      },60000);
    },2000);
  },

  stop: function(){
    if(!this.started) return;
    this.started = false;
    this.cpu.stop();
    this.gpu.stop();
    this.net.stop();

    document.documentElement.classList.remove('started');
    document.documentElement.classList.remove('busy');

    clearInterval(this._int2);
    clearTimeout(this._to);
    this.setState(0);
  },

  setState: function(state){
    this.currentState = state = Math.min(state,3);
    console.log('state:',state);
    document.body.className = state ? 'state-'+state : '';
  },

  printInfo: function(){
    this._numWorkers.textContent = this.cpu.workers.length;
    this._numShaders.textContent = this.gpu.shaders.length;
    this._fps.textContent = this.gpu.fps;
    this._numConnections.textContent = this.net.connections.length;
    this._numTotalConnections.textContent = this.net.totalConnections;
  }
};
