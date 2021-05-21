// dfarrow

// var Chart = function (canvasID, listener) {
//   function prepareAnimation() {
//     if (animation !== null && animation.isRunning()) {
//       animation.finish(false);
//     }
//   }
//   function animateDateRange(x1, x2) {
//     const d1 = x2date(x1);
//     const d2 = x2date(x2);
//     const cx = (d1 + d2) / 2;
//     const dx = (d2 - d1) * 1.25;
//     return self.animatePan(cx - dx / 2, yMin, cx + dx / 2, yMax);
//   }
//   this.animatePan = function (x1, y1, x2, y2) {
//     const before = {
//       x1: xMin,
//       y1: yMin,
//       x2: xMax,
//       y2: yMax,
//     };
//     const after = {
//       x1: x1,
//       y1: y1,
//       x2: x2,
//       y2: y2,
//     };
//     return function () {
//       function update(dt, a) {
//         const b = 1 - a;
//         self.setViewport(
//           b * before.x1 + a * after.x1,
//           b * before.y1 + a * after.y1,
//           b * before.x2 + a * after.x2,
//           b * before.y2 + a * after.y2,
//         );
//       }
//       prepareAnimation();
//       animation = new Animate.Task(update, 60, 0.75, Animate.Ease.double_sine);
//       animation.start();
//     };
//   };

//   datasets.push(sampleDataset);
//   this.autoScale();
//   // animate it for even more fun
//   demoAnimation = new Animate.Task(
//     function (dx, x) {
//       const two_pi = Math.PI * 2;
//       function sin(a, b) {
//         return (Math.sin(x * a * two_pi + b) + 1) / 2;
//       }
//       function hex(a) {
//         a = Math.floor(a * 255);
//         return a < 16 ? '0' + a.toString(16) : a.toString(16);
//       }
//       const r = 0.5 * sin(0.05, (1 / 3) * two_pi);
//       const g = 0.5 * sin(0.05, (2 / 3) * two_pi);
//       const b = 0.5 * sin(0.05, (0 / 3) * two_pi);
//       sampleDataset.color = '#' + hex(r) + hex(g) + hex(b);
//       self.render();
//     },
//     1,
//     0,
//     Animate.Ease.sine,
//   );
//   demoAnimation.start();
//   // user interaction
// };

var Animate = (function () {
  var self = {};
  var Task = function (target, fps, duration, ease) {
    // setup
    if (typeof duration === 'undefined' || duration === null) {
      duration = 0;
    }
    if (typeof ease === 'undefined' || ease === null) {
      ease = Animate.Ease.linear;
    }
    // private variables
    var timerID = null;
    var startTime = 0;
    var lastUpdateTime = 0;
    // public methods
    var start = function () {
      if (this.isRunning()) {
        return;
      }
      lastUpdateTime = startTime = getTime();
      timerID = setTimeout(update, 1000 / fps);
    };
    var finish = function (callTarget) {
      if (!this.isRunning()) {
        return;
      }
      clearTimeout(timerID);
      timerID = null;
      if (typeof callTarget === 'undefined' || callTarget !== false) {
        target(getTime() - lastUpdateTime, 1);
      }
    };
    var isRunning = function () {
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
      if (duration > 0) {
        var position = Math.min(1, Math.max(0, (time - startTime) / duration));
        target(dt, ease(position));
        if (isRunning() && position < 1) {
          timerID = setTimeout(update, 1000 / fps);
        } else {
          timerID = null;
        }
      } else {
        target(dt, time - startTime);
        if (isRunning()) {
          timerID = setTimeout(update, 1000 / fps);
        }
      }
      lastUpdateTime = time;
    }
  };
  var Ease = {
    linear: function (x) {
      return x;
    },
    sine: function (x) {
      return (1 - Math.cos(x * Math.PI)) / 2;
    },
    double_sine: function (x) {
      return Ease.sine(Ease.sine(x));
    },
  };
  var blend = function (before, after, position) {
    return (1 - position) * before + position * after;
  };
  self.Task = Task;
  self.Ease = Ease;
  self.blend = blend;
  return self;
})();
