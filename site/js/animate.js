// dfarrow
var Animate = (function() {
   var self = {};
   var Task = function(target, fps, duration, ease) {
      // setup
      if(typeof duration === 'undefined' || duration === null) {
         duration = 0;
      }
      if(typeof ease === 'undefined' || ease === null) {
         ease = Animate.Ease.linear;
      }
      // private variables
      var timerID = null;
      var startTime = 0;
      var lastUpdateTime = 0;
      // public methods
      var start = function() {
         if(this.isRunning()) {
            return;
         }
         lastUpdateTime = startTime = getTime();
         timerID = setTimeout(update, 1000 / fps);
      };
      var finish = function(callTarget) {
         if(!this.isRunning()) {
            return;
         }
         clearTimeout(timerID);
         timerID = null;
         if(typeof callTarget === 'undefined' || callTarget !== false) {
            target(getTime() - lastUpdateTime, 1);
         }
      };
      var isRunning = function() {
         return timerID !== null;
      };
      this.start = start;
      this.finish = finish;
      this.isRunning = isRunning;
      // private methods
      function getTime() {
         return Date.now() / 1000;
      }
      function update() {
         var time = getTime();
         var dt = time - lastUpdateTime;
         if(duration > 0) {
            var position = Math.min(1, Math.max(0, (time - startTime) / duration));
            target(dt, ease(position));
            if(isRunning() && position < 1) {
               timerID = setTimeout(update, 1000 / fps);
            } else {
               timerID = null;
            }
         } else {
            target(dt, time - startTime);
            if(isRunning()) {
               timerID = setTimeout(update, 1000 / fps);
            }
         }
         lastUpdateTime = time;
      }
   };
   var Ease = {
      linear: function(x) {
         return x;
      },
      sine: function(x) {
         return (1 - Math.cos(x * Math.PI)) / 2;
      },
      double_sine: function(x) {
         return Ease.sine(Ease.sine(x));
      },
   };
   var blend = function(before, after, position) {
      return ((1 - position) * before) + (position * after);
   };
   self.Task = Task;
   self.Ease = Ease;
   self.blend = blend;
   return self;
})();
