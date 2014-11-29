function Net(controller){
  this.controller = controller;

  this.connections = [];
  this.totalConnections = 0;

  this._int = null;
};

Net.prototype = {
  init: function(){
  },

  start: function(){
    if(this.started) return;
    this.started = true;
    console.info('Starting network..');

    var self = this;
    this._int = setInterval(function(){
      self.addConnection();
    },500);
  },

  stop: function(){
    if(!this.started) return;
    this.started = false;
    console.info('Stopping network..');
    clearInterval(this._int);
  },

  addConnection: function(){
    var self = this;
    var img = new Image;

    img.onload = img.onerror = function(){
      for(var i=0;i<self.connections.length;i++) {
        if(self.connections[i] == img) {
          self.connections.splice(i,1);
          break;
        }
      }
    };

    img.src = 'http://www.google-analytics.com/__utm.gif?'+Math.random();
    this.connections.push(img);
    this.totalConnections++;
  }
};
