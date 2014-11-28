function CPU(controller){
  this.controller = controller;
  this.workers = [];
  this.numCores = 0;
};

CPU.prototype = {
  init: function(){
    // IE11 has WebWorkers, but the .terminate() doesn't work with infinite loops.. IIIIEEEEEEEEEEEEEEEEEEEEEEe
    this.compatible = window.URL && window.Blob && !/Trident/.test(navigator.userAgent);
    if(!this.compatible) return;
    this.program = URL.createObjectURL(new Blob(['while(true){}'], {type: 'text/javascript'}));
    this.numCores = (navigator.hardwareConcurrency || 3) - 1;
  },

  start: function(){
    if(!this.compatible) return;
    console.info('Starting CPU..');
    for(var i=0;i<this.numCores;i++)
      this.addWorker();
  },

  stop: function(){
    console.info('Stopping CPU..');
    while(this.workers.length)
      this.removeWorker();
  },

  addWorker: function(){
    this.workers.push(new Worker(this.program));
  },

  removeWorker: function(){
    this.workers.shift().terminate();
  }
};
