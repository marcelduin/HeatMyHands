function Controller(){
  this.cpu = new CPU(this);
  this.gpu = new GPU(this);
  this.net = new Net(this);
  this.slider = new Slider(this);

  this.started = false;
  this.currentState = 0;
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
  },

  stop: function(){
    if(!this.started) return;
    this.started = false;

    this.cpu.stop();
    this.gpu.stop();
    this.net.stop();

    document.documentElement.classList.remove('started');
  }

};
