function Slider(controller, element) {
  this.margin = 40;
  this.swiping = false;
  this.currentOn = false;
};

Slider.prototype = {
  _element: document.querySelector('.slider'),
  _button: document.querySelector('.slider>.button'),
  _on: document.querySelector('.slider>.on'),
  _off: document.querySelector('.slider>.off'),

  init: function(){
    var self = this;

    this.$cnt = $(this._element);
    this.$ = $(this._button);

    var startX = 0;
    var diffX = 0;
    var offsetX = 0;
    var currentX = 0;
    var $win = $(window);
    var cntWidth = this.$cnt[0].offsetWidth;

    function getClientX(e){
      if(e.originalEvent) e = e.originalEvent;
      if(!/^touch/.test(e.type)) return e.clientX;
      else return e.changedTouches[0].clientX;
    };
  
    function sStart(e){
      if(self.swiping || (e.type == 'mousedown' && e.which != 1)) return;
      e.stopPropagation();
      e.preventDefault();
      $win.on('touchmove mousemove',sMove)
        .on('touchend touchcancel touchleave mouseup click',sStop);

      self.swiping = true;
      startX = getClientX(e);
    };
    function sMove(e){
      e.stopPropagation();
      e.preventDefault();
      diffX = (innerWidth>520 && 2 || 1) * (getClientX(e) - startX);
      self.moveTo(offsetX+diffX);
    };
    function sStop(e){
      setTimeout(function(){
        self.swiping = false;
      },10);
      e.stopPropagation();
      e.preventDefault();
      $win.off('touchmove mousemove',sMove)
        .off('touchend touchcancel touchleave mouseup click',sStop);

      self.moveTo(offsetX+diffX);
      offsetX = currentX;
  
      // Snap to closest to center
      snap();
    };
  
    function snap(){
      var onOff = Math.round(offsetX/(cntWidth-2*self.margin));
      if(onOff != self.currentOn && self.onchange) self.onchange(!!onOff);
      self.currentOn = onOff;
      self.moveTo(onOff?cntWidth:0);
      offsetX = currentX;
    };

    this.moveTo = function(x) {
      var w = cntWidth - 2*self.margin;
      self.$[0].style.left = (currentX = Math.max(0, Math.min(w, x)))+'px';
      self._off.style.width = (w-currentX)+'px';
      self._on.style.width = currentX+'px';
    };

    this.$.on('touchstart mousedown',sStart);

  }
};
