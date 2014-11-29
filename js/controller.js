function Controller(){
  this.cpu = new CPU(this);
  this.gpu = new GPU(this);
  this.net = new Net(this);
  this.slider = new Slider(this);

  this.started = false;
  this.currentState = 0;

  this._int = null;
  this._to = null;
};

Controller.prototype = {
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
  }

};
