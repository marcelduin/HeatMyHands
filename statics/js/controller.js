function Controller(){
  this.cpu = new CPU(this);
  this.gpu = new GPU(this);
  this.net = new Net(this);
  this.slider = new Slider(this);

  this.started = false;
  this.audio = [];
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

    this.playAudio('/statics/audio/switch.mp3');
    this.playAudio('/statics/audio/noise.mp3');

    var self = this;
    this._to1 = setTimeout(function(){self.playAudio('/statics/audio/shatter.mp3')},92500);
    this._to2 = setTimeout(function(){self.playAudio('/statics/audio/shatter.mp3')},152500);
  },

  stop: function(){
    if(!this.started) return;
    this.started = false;

    this.cpu.stop();
    this.gpu.stop();
    this.net.stop();

    document.documentElement.classList.remove('started');

    this.playAudio('/statics/audio/switch.mp3');
    this.stopAudio('/statics/audio/noise.mp3');

    clearTimeout(this._to1);
    clearTimeout(this._to2);
  },

  getAudio: function(src){
    var aud = this.audio[src];
    if(!aud) {
      aud = this.audio[src] = new Audio;
      aud.src = src;
    }
    return aud;
  },

  playAudio: function(src){
    this.getAudio(src).play();
  },

  stopAudio: function(src){
    this.getAudio(src).pause();
    this.getAudio(src).currentTime = 0;
  }

};
