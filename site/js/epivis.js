/*
 ____   ___    _   _  ___ _____   _____ ____ ___ _____ 
|  _ \ / _ \  | \ | |/ _ \_   _| | ____|  _ \_ _|_   _|
| | | | | | | |  \| | | | || |   |  _| | | | | |  | |  
| |_| | |_| | | |\  | |_| || |   | |___| |_| | |  | |  
|____/ \___/  |_| \_|\___/ |_|   |_____|____/___| |_|  
                                                       
        Automatically generated from sources at:       
        https://github.com/cmu-delphi/www-epivis       
                                                       
 Commit hash: 6c66fa51b7bbf0e7be8b99a4cb6f9bf059d1fd7a 
     Deployed at: 2018-06-26 10:15:52 (1530022552)     
*/



// dfarrow
var EpiVis = (function() {
   var self = {};
   var Date = function(year, month, day) {
      // private static constants
      var DAYS_PER_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      var CUMULATIVE_DAYS_PER_MONTH = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
      var DAY_OF_WEEK_TABLE = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
      // private static functions
      var getIndex = function(year, month, day) {
         var y = (year + 399) % 400;
         var yearOffset = (Math.floor((year - 1) / 400) * 146097) + (y * 365) + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400);
         var monthOffset = CUMULATIVE_DAYS_PER_MONTH[month - 1] + (((month > 2) && Date.isLeapYear(year)) ? 1 : 0);
         var dayOffset = day - 1;
         return yearOffset + monthOffset + dayOffset;
      };
      var getDayOfWeek = function(year, month, day) {
         var y = year - (month < 3 ? 1 : 0);
         return (y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + DAY_OF_WEEK_TABLE[month - 1] + day) % 7;
      };
      // constructor logic
      if(year < 1 || month < 1 || month > 12 || day < 1 || day > DAYS_PER_MONTH[month - 1] + ((month == 2 && Date.isLeapYear(year)) ? 1 : 0)) {
         throw {message: "invalid date", year: year, month: month, day: day};
      }
      // public methods
      this.toString = function() { return year + '/' + month + '/' + day; };
      this.getYear = function() { return year; };
      this.getMonth = function() { return month; };
      this.getDay = function() { return day; };
      this.isLeapYear = function() { return Date.isLeapYear(year); };
      this.getIndex = function() { return getIndex(year, month, day); };
      this.getDayOfWeek = function() { return getDayOfWeek(year, month, day); };
      this.getEpiYear = function() {
         var thisDate = getIndex(year, month, day);
         var firstDate1 = getIndex(year, 1, 4) - getDayOfWeek(year, 1, 4);
         var y;
         if(thisDate < firstDate1) {
            y = -1;
         } else {
            var firstDate2 = getIndex(year + 1, 1, 4) - getDayOfWeek(year + 1, 1, 4);
            y = ((thisDate < firstDate2) ? 0 : 1);
         }
         return year + y;
      };
      this.getEpiWeek = function() {
         var thisDate = getIndex(year, month, day);
         var firstDate1 = getIndex(year, 1, 4) - getDayOfWeek(year, 1, 4);
         var firstDate;
         if (thisDate < firstDate1) {
            firstDate = getIndex(year - 1, 1, 4) - getDayOfWeek(year - 1, 1, 4);
         } else {
            var firstDate2 = getIndex(year + 1, 1, 4) - getDayOfWeek(year + 1, 1, 4);
            firstDate = (thisDate < firstDate2) ? firstDate1 : firstDate2;
         }
         return Math.floor((thisDate - firstDate) / 7) + 1;
      };
      this.addDays = function(num) {
         return Date.fromIndex(this.getIndex() + num);
      };
      this.addWeeks = function(num) {
         return Date.fromIndex(this.getIndex() + 7 * num);
      };
      this.addMonths = function(num) {
         num = Math.floor(num);
         var y = this.getYear();
         var m = this.getMonth();
         var sign = num >= 0 ? +1 : -1;
         num *= sign;
         var yy = Math.floor(num / 12);
         var mm = num % 12;
         y += sign * yy;
         m += sign * mm;
         if(m > 12) {
            m -= 12;
            y++;
         }
         if(m < 1) {
            m += 12;
            y--;
         }
         return new Date(y, m, 1);
      };
      this.addYears = function(num) {
         return new Date(this.getYear() + num, 1, 1);
      };
   };
   Date.isLeapYear = function(year) {
      return (((year % 4) === 0) && ((year % 100) !== 0)) || ((year % 400) === 0);
   };
   Date.parse = function(str) {
      var y, m, d;
      if(str.length === 8) {
         y = parseInt(str.substring(0, 4), 10);
         m = parseInt(str.substring(4, 6), 10);
         d = parseInt(str.substring(6, 8), 10);
      } else if(str.length === 10) {
         y = parseInt(str.substring(0, 4), 10);
         m = parseInt(str.substring(5, 7), 10);
         d = parseInt(str.substring(8, 10), 10);
      } else {
         throw {message: "unknown date format (try YYYYMMDD)", str: str};
      }
      return new Date(y, m, d);
   };
   Date.fromIndex = function(index) {
      var CUMULATIVE_DAYS_PER_MONTH = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
      var x = index;
      var year = Math.floor(index / 365);
      index = index % 365;
      var leaps = Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400);
      index = index - leaps + year * 365;
      year = Math.floor(index / 365) + 1;
      var y = (year + 399) % 400;
      var yearOffset = (Math.floor((year - 1) / 400) * 146097) + (y * 365) + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400);
      if((x - yearOffset) == 365 && Date.isLeapYear(year + 1)) {
         ++year;
         yearOffset += 365;
      }
      index = x - yearOffset;
      var m = 1;
      var leap = Date.isLeapYear(year) ? 1 : 0;
      while(m < 12 && (CUMULATIVE_DAYS_PER_MONTH[m] + ((m >= 2) ? leap : 0)) <= index) {
         ++m;
      }
      index -= CUMULATIVE_DAYS_PER_MONTH[m - 1] + (((m > 2) && Date.isLeapYear(year)) ? 1 : 0);
      return new Date(year, m, index + 1);
   };
   Date.fromEpiweek = function(year, week) {
      if(week < 1 || week > 54) {
         throw {message: "invalid epiweek", year: year, week: week};
      }
      var date = new EpiVis.Date(year, 6, 1);
      while(date.getEpiYear() < year) { date = date.addYears(+1); }
      while(date.getEpiYear() > year) { date = date.addYears(-1); }
      while(date.getEpiWeek() < week) { date = date.addWeeks(+1); }
      while(date.getEpiWeek() > week) { date = date.addWeeks(-1); }
      while(date.getDayOfWeek() < 3) { date = date.addDays(+1); }
      while(date.getDayOfWeek() > 3) { date = date.addDays(-1); }
      if(date.getEpiYear() !== year || date.getEpiWeek() !== week) {
         // fix for week 53 in years with only 52 weeks
         console.log('warning: invalid epiweek', year, week);
         date = new EpiVis.Date(year, 12, 31);
      }
      return date;
   };
   Date.getDayName = function(dayOfWeek, longName) {
      var DAY_NAMES_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      if(typeof longName === 'undefined' || longName) {
         return DAY_NAMES_LONG[dayOfWeek];
      } else {
         return DAY_NAMES_SHORT[dayOfWeek];
      }
   };
   Date.getMonthName = function(month, longName) {
      var MONTH_NAMES_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      var MONTH_NAMES_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      if(typeof longName === 'undefined' || longName) {
         return MONTH_NAMES_LONG[month - 1];
      } else {
         return MONTH_NAMES_SHORT[month - 1];
      }
   };
   var Point = function(date, value) {
      this.getDate = function() { return date; };
      this.getValue = function() { return value; };
   };
   var Dataset = function(data, title) {
      function getComponent() {
         var x = 0x20 + Math.floor(Math.random() * 0xC0);
         return ("0" + x.toString(16)).slice(-2);
      }
      function getRandomColor() {
         return "#" + getComponent() + getComponent() + getComponent();
      }
      var self = {};
      self.data = data;
      self.title = (typeof title === 'undefined') ? '' : title;
      self.color = getRandomColor();
      self.lineWidth = 2;
      self.scale = 1;
      self.verticalOffset = 0;
      self.horizontalOffset = 0;
      var a, b, i, gaps = [];
      for(i = 1; i < data.length; i++) {
         a = data[i - 1].getDate().getIndex();
         b = data[i].getDate().getIndex();
         gaps.push(b - a);
      }
      gaps.sort(function(p, q){return p - q;});
      self.gap = gaps.length > 0 ? gaps[Math.floor(gaps.length / 2)] : 1;
      self.randomize = function() {
         self.color = getRandomColor();
      };
      self.reset = function() {
         self.scale = 1;
         self.verticalOffset = 0;
         self.horizontalOffset = 0;
      };
      self.scaleMean = function() {
         var i, value, num = 0, sum = 0;
         for(i = 0; i < self.data.length; i++) {
            value = self.data[i].getValue();
            if(!isNaN(value)) {
               num++;
               sum += value;
            }
         }
         if(num > 0) {
            self.scaleAndShift(1 / (sum / num), 0);
         }
      };

      self.scaleAndShift = function(scaler, shift){
         self.scale = scaler;
         self.verticalOffset = shift;
      };

      self.getDataHash = function(){
         var dataHash = {};
         for(i = 0; i < self.data.length; i++) {
            value = self.data[i].getValue();
            key = self.data[i].getDate();
            if(!isNaN(value)) {
               dataHash[key]=value;
            }
         }
         return dataHash;
      };

      self.regress = function(dataset){
         var datahash = dataset.getDataHash();
         var x = [];
         var y = [];
         for(i = 0; i < self.data.length; i++) {
            value = self.data[i].getValue();
            key = self.data[i].getDate();
            if(!isNaN(value) && key in datahash) {
               x.push(value);
               y.push(datahash[key]);
            }
         }
         // Run regression
         var x_sum = x.reduce(function(a, b) { return a + b; });
         var y_sum = y.reduce(function(a, b) { return a + b; });
         var x_avg = x_sum / x.length;
         var y_avg = y_sum / y.length;
         var cov_sum = 0;
         var x_var_sum = 0;
         for(i = 0; i < x.length; i++) {
            cov_sum += x[i]*y[i]-x_avg*y_avg;
            x_var_sum += Math.pow(x[i], 2) - Math.pow(x_avg, 2);
         }
         var beta = cov_sum/x_var_sum;
         var alpha = y_avg - beta*x_avg;
         self.scaleAndShift(beta*dataset.scale,alpha*dataset.scale);
      };
      return self;
   };
   var NavMode = {
      pan: 0,
      crop: 1,
      zoom: 2,
   };
   var Chart = function(canvasID, listener) {
      listener = (typeof listener === 'undefined') ? null : listener;
      var Align = {
         left: 0,
         right: 1,
         bottom: 2,
         top: 3,
         center: 4
      };
      var canvas = $("#" + canvasID);
      var chart = canvas[0];
      var self = this;
      var buttons = [];
      var ctx = chart.getContext("2d");
      var datasets = [];
      var demoAnimation = null;
      var xMin = new Date(2014, 1, 1).getIndex(), xMax = new Date(2016, 1, 1).getIndex(), yMin = -1, yMax = 1;
      var highlightedDate = null;
      var animation = null;
      var navMode = NavMode.pan;
      var navBox = null;
      var forceZoom = false;
      var forceCrop = false;
      var showPoints = false;
      var interpolate = false;
      var mouse = {
         pressed: false,
         dragging: false,
         hovering: false,
         position: null,
         down: null,
      };
      function consumeEvent(e, handler) {
         e.preventDefault();
         handler(e);
      }
      function mousePosition(e) {
         if(e.type.toLowerCase().indexOf('touch') === 0) {
            e = e.originalEvent.changedTouches[0];
         }
         return {
            x: e.pageX - canvas.offset().left,
            y: e.pageY - canvas.offset().top
         };
      }
      function mouseDown(e) {
         var m = mousePosition(e);
         mouse.pressed = true;
         mouse.dragging = false;
         mouse.hovering = false;
         mouse.position = m;
         mouse.down = m;
         if(navMode == NavMode.crop) {
            navBox = {x: m.x, y: m.y, w: 0, h: 0};
         }
      }
      function mouseMove(e) {
         var m = mousePosition(e);
         mouse.dragging = mouse.pressed;
         mouse.hovering = !mouse.pressed;
         if(mouse.dragging) {
            var deltaX = -m.x + mouse.position.x;
            var deltaY = +m.y - mouse.position.y;
            if(navMode == NavMode.pan) {
               var dx = deltaX;
               var dy = deltaY;
               var x = (dx / chart.width) * (xMax - xMin);
               var y = (dy / chart.height) * (yMax - yMin);
               self.setViewport(xMin + x, yMin + y, xMax + x, yMax + y);
            } else if(navMode == NavMode.zoom) {
               var scale = 4 / ((chart.width + chart.height) / 2);
               var dx = deltaX * scale;
               var dy = deltaY * scale;
               var zx = (dx >= 0) ? (1 / (1 + dx)) : (1 + Math.abs(dx));
               var zy = (dy >= 0) ? (1 / (1 + dy)) : (1 + Math.abs(dy));
               self.zoom(zx, zy);
            } else if(navMode == NavMode.crop) {
               navBox.w += -deltaX;
               navBox.h += +deltaY;
            }
         }
         if(mouse.hovering) {
            self.highlight(Date.fromIndex(Math.floor(x2date(m.x) + 0.5)));
         }
         mouse.position = m;
         self.render();
      }
      function mouseUp(e) {
         var m = mousePosition(e);
         var m1 = mouse.down;
         var m2 = m;
         mouse.pressed = false;
         mouse.dragging = false;
         mouse.hovering = true;
         mouse.position = m;
         mouse.down = null;
         if(m1 !== null) {
            mouseClick(m1, m2);
         }
         if(navBox !== null) {
            var box = navBox;
            navBox = null;
            if(navMode == NavMode.crop) {
               var x = Math.min(box.x, box.x + box.w);
               var y = Math.max(box.y, box.y + box.h);
               var w = +Math.abs(box.w);
               var h = -Math.abs(box.h);
               if(Math.abs(w) * Math.abs(h) >= 50) {
                  self.setViewport(x2date(x), y2value(y), x2date(x + w), y2value(y + h));
               } else {
                  console.log("Crop box was very small, this was probably unintended. If you really want to apply the crop, use the following command:");
                  console.log("   chart.setViewport(" + x2date(x) + ", " + y2value(y) + ", " + x2date(x + w) + ", " + y2value(y + h) + ");");
               }
            }
         }
         self.setNavMode(NavMode.pan);
      }
      function mouseOver(e) {
         canvas.focus();
      }
      function mouseOut(e) {
         navBox = null;
         var m = mousePosition(e.originalEvent);
         mouseUp(e.originalEvent);
         mouse.hovering = false;
         self.highlight(null);
         canvas.blur();
      }
      function mouseClick(m1, m2) {
         var hit = false;
         for(var i = 0; i < buttons.length; i++) {
            if(contains(buttons[i].box, m1) && contains(buttons[i].box, m2)) {
               hit = true;
               buttons[i].handler();
            }
         }
         if(hit) {
            self.render();
         }
      }
      function keyDown(e) {
         if(e.keyCode == 16) {
            forceCrop = true;
            self.setNavMode(NavMode.crop);
         } else if(e.keyCode == 17) {
            forceZoom = true;
            self.setNavMode(NavMode.zoom);
         }
      }
      function keyUp(e) {
         if(e.keyCode == 16) {
            forceCrop = false;
         } else if(e.keyCode == 17) {
            forceZoom = false;
         }
         self.setNavMode(NavMode.pan);
      }
      function mouseWheel(e) {
         // scroll info
         var mode = e.originalEvent.deltaMode;
         var delta = e.originalEvent.deltaY;
         var ticks = Math.abs(delta);
         var amount;
         // zoom calculation
         if(mode === 0) {
            // DOM_DELTA_PIXEL
            amount = 1 + ticks / 500;
         } else if(mode == 1) {
            // DOM_DELTA_LINE
            amount = 1 + ticks / 10;
         } else if(mode == 2) {
            // DOM_DELTA_PAGE
            amount = 1 + ticks / 2;
         } else {
            // unknown mode
            amount = 1.5;
         }
         if(delta > 0) {
            amount = 1 / amount;
         }
         // pan so that the zoom is centered under the mouse
         var m = mousePosition(e.originalEvent);
         var dx, dy;
         var cx = (xMin + xMax) / 2;
         var cy = (yMin + yMax) / 2;
         var fx = +(m.x - chart.width / 2) / (chart.width / 2);
         var fy = -(m.y - chart.height / 2) / (chart.height / 2);
         dx = ((xMax - xMin) / 2) * fx;
         dy = ((yMax - yMin) / 2) * fy;
         self.setViewport(xMin + dx, yMin + dy, xMax + dx, yMax + dy);
         // zoom
         self.zoom(amount, amount);
         // pan back to the original location
         dx = ((xMax - xMin) / 2) * fx;
         dy = ((yMax - yMin) / 2) * fy;
         self.setViewport(xMin - dx, yMin - dy, xMax - dx, yMax - dy);
         self.render();
      }
      function addButton(box, handler) {
         buttons.push({box: box, handler: handler});
      }
      function contains(box, point) {
         return box.x <= point.x && point.x <= (box.x + box.w) && box.y < point.y && point.y < (box.y + box.h);
      }
      function date2x(date) {
         return ((date - xMin) / (xMax - xMin)) * chart.width;
      }
      function x2date(x) {
         return xMin + ((x / chart.width) * (xMax - xMin));
      }
      function value2y(value) {
         return (1 - ((value - yMin) / (yMax - yMin))) * chart.height;
      }
      function y2value(y) {
         return yMin - (((y / chart.height) - 1) * (yMax - yMin));
      }
      function drawText(str, x, y, angle, alignX, alignY, scale, font) {
         scale = typeof scale !== 'undefined' ? scale : 1;
         font = typeof font !== 'undefined' ? font : 'Calibri';
         var size = Math.round(12 * scale);
         ctx.font = size + 'px ' + font;
         var w = ctx.measureText(str).width;
         var h = size;
         var dx = 0;
         var dy = 0;
         if(alignX == Align.left) {
            dx = 0;
         } else if(alignX == Align.right) {
            dx = -w;
         } else if(alignX == Align.center) {
            dx = -w / 2;
         } else {
            ctx.fillStyle = '#f00';
         }
         if(alignY == Align.bottom) {
            dy = 0;
         } else if(alignY == Align.top) {
            dy = h;
         } else if(alignY == Align.center) {
            dy = h / 2;
         } else {
            ctx.fillStyle = '#f00';
         }
         ctx.save();
         ctx.translate(x, y);
         ctx.rotate(angle);
         ctx.fillText(str, dx, dy);
         ctx.restore();
         return {x: x + dx, y: y + dy - h, w: w, h: h};
      }
      function zeroPad(num) {
         return (num < 10) ? ("0" + num) : ("" + num);
      }
      function prepareAnimation() {
         if(animation !== null && animation.isRunning()) {
            animation.finish(false);
         }
      }
      function animateDateRange(x1, x2) {
         var d1 = x2date(x1);
         var d2 = x2date(x2);
         var cx = (d1 + d2) / 2;
         var dx = (d2 - d1) * 1.25;
         return self.animatePan(cx - (dx / 2), yMin, cx + (dx / 2), yMax);
      }
      function getPointValue(dataset, index) {
         var temp = dataset.data[index].getValue();
         if(isNaN(temp)) {
            return temp;
         }
         return dataset.verticalOffset + (temp * dataset.scale);
      }
      this.animatePan = function(x1, y1, x2, y2) {
         var before = {
            x1: xMin,
            y1: yMin,
            x2: xMax,
            y2: yMax,
         };
         var after = {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
         };
         return function() {
            function update(dt, a) {
               var b = 1 - a;
               self.setViewport(
                  b * before.x1 + a * after.x1,
                  b * before.y1 + a * after.y1,
                  b * before.x2 + a * after.x2,
                  b * before.y2 + a * after.y2
               );
            }
            prepareAnimation();
            animation = new Animate.Task(update, 60, 0.75, Animate.Ease.double_sine);
            animation.start();
         };
      };
      this.render = function() {
         // reset buttons
         buttons = [];
         // clear the chart
         ctx.lineWidth = 1;
         ctx.fillStyle = "#fff";
         ctx.fillRect(0, 0, chart.width, chart.height);
         if(datasets.length === 0) {
            // no data
            return;
         }
         var daysPerPixel = (xMax - xMin) / chart.width;
         //console.log(daysPerPixel);
         var labels = {
            day_long: (daysPerPixel < 0.010),
            day_short: (daysPerPixel < 0.02),
            day_num: (daysPerPixel < 0.04),
            day_blank: (daysPerPixel < 0.08),
            epiweek_long: (daysPerPixel < 0.12),
            epiweek_short: (daysPerPixel < 0.20),
            epiweek_blank: (daysPerPixel < 0.50),
            month_long: (daysPerPixel < 0.38),
            month_short: (daysPerPixel < 1.20),
            month_blank: (daysPerPixel < 3.00),
            year_long: (daysPerPixel < 8.00),
            year_short: (daysPerPixel < 15.00),
            year_blank: (daysPerPixel < 25.00),
         };
         // x-axis
         var interval = Math.pow(2, Math.floor(Math.log((yMax - yMin) / 4) / Math.log(2)));
         ctx.fillStyle = "#888";
         ctx.strokeStyle = "#ddd";
         ctx.beginPath();
         for(var i = Math.ceil(yMin / interval); i <= Math.floor(yMax / interval); i++) {
            var y = value2y(i * interval);
            ctx.moveTo(0, y);
            ctx.lineTo(chart.width, y);
            drawText("" + (i * interval), 0, y - 2, 0, Align.left, Align.bottom);
         }
         if(mouse.position !== null) {
            var y = mouse.position.y;
            var value = y2value(mouse.position.y);
            ctx.moveTo(0, y);
            ctx.lineTo(chart.width, y);
            drawText("" + value, chart.width - 2, y - 2, 0, Align.right, Align.bottom);
         }
         ctx.stroke();
         // y-axis
         var firstDay = Date.fromIndex(Math.floor(xMin));
         var lastDay = Date.fromIndex(Math.ceil(xMax));
         var day;
         function drawLabel(label, x1, x2, y, highlight) {
            // box for mouse click
            var box = {
               x: x1,
               y: y,
               w: x2 - x1,
               h: 15,
            };
            // background
            if(highlight) {
               ctx.fillStyle = "#eee";
               ctx.fillRect(x1, y, x2 - x1, 15);
               // frame
               ctx.strokeStyle = "#888";
               ctx.beginPath();
               ctx.moveTo(x1, y + 15);
               ctx.lineTo(x1, y);
               ctx.moveTo(x2, y);
               ctx.lineTo(x2, y + 15);
               ctx.stroke();
               ctx.fillStyle = "#000";
            } else {
               ctx.fillStyle = "#888";
            }
            // label
            var width = drawText(label, 0, -100, 0, Align.center, Align.top).w + 10;
            var left = x1;
            var right = x2;
            if(left < 0) {
               left = Math.min(0, x2 - width);
            }
            if(right >= chart.width) {
               right = Math.max(chart.width - 1, x1 + width);
            }
            drawText(label, (left + right) / 2, y, 0, Align.center, Align.top);
            return box;
         }
         // highlighted day
         if(highlightedDate !== null) {
            var idx = highlightedDate.getIndex();
            var x1 = date2x(idx - 0.5);
            var x2 = date2x(idx + 0.5);
            ctx.fillStyle = "#eee";
            ctx.strokeStyle = "#888";
            ctx.fillRect(x1, 0, Math.max(1, x2 - x1), chart.height);
         }
         // value at cursor
         if(mouse.position !== null) {
            ctx.fillStyle = "#eee";
            ctx.strokeStyle = "#888";
            ctx.fillRect(0, mouse.position.y - 0.5, chart.width, 1);
         }
         // day labels
         if(labels.day_long || labels.day_short || labels.day_num || labels.day_blank) {
            day = firstDay;
            while(day.getIndex() <= lastDay.getIndex()) {
               var idx = day.getIndex();
               var x1 = date2x(idx - 0.5);
               var x2 = date2x(idx + 0.5);
               var x = (x1 + x2) / 2;
               var labelNum = zeroPad(day.getDay());
               var label;
               if(labels.day_long || labels.day_short) {
                  var labelName = Date.getDayName(day.getDayOfWeek(), labels.day_long);
                  if(labels.day_long) {
                     label = labelName + ", " + labelNum;
                  } else {
                     label = labelName + "-" + labelNum;
                  }
               } else if(labels.day_num) {
                  label = labelNum;
               } else {
                  label = "'";
               }
               var highlight = (highlightedDate !== null) && (highlightedDate.getIndex() == day.getIndex());
               var box = drawLabel(label, x1, x2, 45, highlight);
               addButton(box, animateDateRange(x1, x2));
               day = day.addDays(1);
            }
         }
         // week labels
         if(labels.epiweek_long || labels.epiweek_short || labels.epiweek_blank) {
            day = Date.fromIndex(firstDay.getIndex() - firstDay.getDayOfWeek());
            while(day.getIndex() <= lastDay.getIndex()) {
               var idx = day.getIndex();
               var dow = day.getDayOfWeek();
               var x1 = date2x(idx - dow - 0.5);
               var x2 = date2x(idx + (6 - dow) + 0.5);
               var labelWeek = zeroPad(day.getEpiWeek());
               var label;
               if(labels.epiweek_long) {
                  var labelYear = day.getEpiYear() + "";
                  label = labelYear + "w" + labelWeek;
               } else if(labels.epiweek_short) {
                  label = "w" + labelWeek;
               } else {
                  label = "'";
               }
               var highlight = (highlightedDate !== null) && (highlightedDate.getEpiYear() == day.getEpiYear() && highlightedDate.getEpiWeek() == day.getEpiWeek());
               var box = drawLabel(label, x1, x2, 30, highlight);
               addButton(box, animateDateRange(x1, x2));
               day = day.addWeeks(1);
            }
         }
         // month labels
         if(labels.month_long || labels.month_short || labels.month_blank) {
            day = firstDay;
            while(day.getIndex() <= lastDay.getIndex()) {
               var thisMonth = new Date(day.getYear(), day.getMonth(), 1);
               var nextMonth = thisMonth.addMonths(1);
               var x1 = date2x(thisMonth.getIndex() - 0.5);
               var x2 = date2x(nextMonth.getIndex() - 0.5);
               var label;
               if(labels.month_long || labels.month_short) {
                  label = Date.getMonthName(day.getMonth(), labels.month_long);
               } else {
                  label = "'";
               }
               var highlight = (highlightedDate !== null) && (highlightedDate.getYear() == day.getYear() && highlightedDate.getMonth() == day.getMonth());
               var box = drawLabel(label, x1, x2, 15, highlight);
               addButton(box, animateDateRange(x1, x2));
               day = nextMonth;
            }
         }
         // year labels
         if(labels.year_long || labels.year_short || labels.year_blank) {
            day = firstDay;
            while(day.getIndex() <= lastDay.getIndex()) {
               var thisYear = new Date(day.getYear(), 1, 1);
               var nextYear = thisYear.addYears(1);
               var x1 = date2x(thisYear.getIndex() - 0.5);
               var x2 = date2x(nextYear.getIndex() - 0.5);
               var label;
               if(labels.year_long) {
                  label = "" + thisYear.getYear();
               } else if(labels.year_short) {
                  label = "'" + zeroPad(thisYear.getYear() % 100);
               } else {
                  label = "'";
               }
               var highlight = (highlightedDate !== null) && (highlightedDate.getYear() == day.getYear());
               var box = drawLabel(label, x1, x2, 0, highlight);
               addButton(box, animateDateRange(x1, x2));
               day = nextYear;
            }
         }
         // highlighted day
         if(highlightedDate !== null) {
            var dayName = Date.getDayName(highlightedDate.getDayOfWeek(), false);
            var monthName = Date.getMonthName(highlightedDate.getMonth(), false);
            var epiweek = zeroPad(highlightedDate.getEpiWeek());
            var label = dayName + ", " + monthName + " " + highlightedDate.getDay() + ", " + highlightedDate.getYear() + " [" + highlightedDate.getEpiYear() + "w" + epiweek + "]";
            ctx.fillStyle = "#000";
            var x = Math.max(chart.width * 0.1, Math.min(chart.width * 0.9, date2x(highlightedDate.getIndex())));
            drawText(label, x, chart.height - 10, 0, Align.center, Align.center);
         }
         /*function isSegmentVisible(src, dst) {
            var x1 = src.getDate().getIndex();
            var x2 = dst.getDate().getIndex();
            var y1 = src.getValue();
            var y2 = dst.getValue();
            // src is inside the viewport
            if(xMin < x1 && x1 < xMax && yMin < y1 && y1 < yMax) {
               return true;
            }
            // dst is inside the viewport
            if(xMin < x2 && x2 < xMax && yMin < y2 && y2 < yMax) {
               return true;
            }
            // neither endpoint is inside the viewpoint
            var dx = x2 - x1;
            var dy = y2 - y1;
            var corners = [[xMin, yMin], [xMin, yMax], [xMax, yMax], [xMax, yMin]];
            var sum = 0;
            for(var i = 0; i < 4; i++) {
               if(dx * (corners[i][1] - y1) - dy * (corners[i][0] - x1) >= 0) {
                  sum++;
               } else {
                  sum--;
               }
            }
            // if the corners are on different sides of the line, there is an intersection
            return Math.abs(sum) != 4;
         }*/
         // data
         for(var ds = 0; ds < datasets.length; ds++) {
            var data = datasets[ds].data;
            var scale = datasets[ds].scale;
            var verticalOffset = datasets[ds].verticalOffset;
            var first = true;
            var date1 = 0, date2 = 0;
            ctx.fillStyle = datasets[ds].color;
            ctx.beginPath();
            for(var i = 0; i < data.length; i++) {
               var y = value2y(getPointValue(datasets[ds], i));
               if(isNaN(y)) {
                  continue;
               }
               date1 = date2;
               date2 = data[i].getDate().getIndex();
               if(date2 - date1 !== datasets[ds].gap) {
                  first = !interpolate;
               }
               var x = date2x(date2);
               /*if(!isSegmentVisible(data[Math.max(0, i - 1)], data[i])) {
                  console.log("skipped " + i, data[i].getDate().getYear(),  data[i].getDate().getMonth(),  data[i].getDate().getDay(), data[i].getValue());
                  continue;
               }*/
               if(first) {
                  first = false;
                  ctx.moveTo(x, y);
               } else {
                  ctx.lineTo(x, y);
               }
               if(showPoints) {
                  var w = datasets[ds].lineWidth * 2;
                  ctx.fillRect(x - w, y - w, 2 * w, 2 * w);
               }
            }
            ctx.strokeStyle = datasets[ds].color;
            ctx.lineWidth = datasets[ds].lineWidth;
            ctx.stroke();
         }
         ctx.lineWidth = 1;
         // legend
         var labelOffset = 0;
         for(var ds = 0; ds < datasets.length; ds++) {
            ctx.fillStyle = datasets[ds].color;
            var label = "-" + datasets[ds].title;
            drawText(label, chart.width - 10, chart.height - 10 - labelOffset, 0, Align.right, Align.bottom);
            labelOffset += 12;
         }
         // nav box
         if(navMode == NavMode.crop && navBox !== null) {
            ctx.strokeStyle = "#000";
            ctx.strokeRect(navBox.x, navBox.y, navBox.w, navBox.h);
         }
      };
      this.addDataset = function(ds) {
         if(demoAnimation !== null) {
            demoAnimation.finish();
            demoAnimation = null;
            datasets = [];
         }
         for(var i = 0; i < datasets.length; i++) {
            if(datasets[i] === ds) {
               // don't add it twice
               return;
            }
         }
         datasets.push(ds);
         this.render();
      };
      this.removeDataset = function(ds) {
         for(var i = 0; i < datasets.length; i++) {
            if(datasets[i] === ds) {
               // remove and stop looking
               datasets.splice(i, 1);
               break;
            }
         }
         this.render();
      };
      this.autoScale = function(shouldAnimate) {
         if(datasets.length === 0) { return; }
         shouldAnimate = (typeof shouldAnimate !== 'undefined' && shouldAnimate === true);
         var temp = datasets[0].data;
         var _xMin = temp[0].getDate().getIndex() - 0.5;
         var _xMax = temp[temp.length - 1].getDate().getIndex() + 0.5;
         var _yMin = getPointValue(datasets[0], 0);
         var _yMax = _yMin;
         for(var ds = 0; ds < datasets.length; ds++) {
            var data = datasets[ds].data;
            _xMin = Math.min(_xMin, data[0].getDate().getIndex() - 0.5);
            _xMax = Math.max(_xMax, data[data.length - 1].getDate().getIndex() + 0.5);
            for(var i = 0; i < data.length; i++) {
               var v = getPointValue(datasets[ds], i);
               if(isNaN(_yMin) || v < _yMin) { _yMin = v; }
               if(isNaN(_yMax) || v > _yMax) { _yMax = v; }
            }
         }
         var dy = (_yMax - _yMin) / 0.75, cy = (_yMin + _yMax) / 2;
         _yMin = cy - (dy / 2);
         _yMax = cy + (dy / 2);
         if(shouldAnimate) {
            var playAnimation = this.animatePan(_xMin, _yMin, _xMax, _yMax);
            playAnimation();
         } else {
            this.setViewport(_xMin, _yMin, _xMax, _yMax);
         }
      };
      this.randomizeColors = function() {
         for(var ds = 0; ds < datasets.length; ds++) {
            datasets[ds].randomize();
         }
         this.render();
      };
      this.showPoints = function(show) {
         showPoints = typeof show !== 'undefined' ? show === true : !showPoints;
         this.render();
      };
      this.interpolate = function(interp) {
         interpolate = typeof interp !== 'undefined' ? interp === true : !interpolate;
         this.render();
      };
      this.isShowingPoints = function() {
         return showPoints;
      };
      this.zoom = function(x, y) {
         // x-axis
         var xMid = (xMin + xMax) / 2;
         var xRange = (xMax - xMin) / x;
         xRange = Math.max(1, xRange);
         xRange = Math.min(365.25 * 100, xRange);
         xMin = xMid - xRange / 2;
         xMax = xMid + xRange / 2;
         // y-axis
         var yMid = (yMin + yMax) / 2;
         var yRange = (yMax - yMin) / y;
         yMin = yMid - yRange / 2;
         yMax = yMid + yRange / 2;
         // render
         this.render();
      };
      this.setViewport = function(x1, y1, x2, y2) {
         xMin = x1;
         xMax = x2;
         yMin = y1;
         yMax = y2;
         this.render();
      };
      this.highlight = function(date) {
         var update = false;
         if(highlightedDate === null) {
            if(date !== null) {
               update = true;
            }
         } else {
            if(date === null || highlightedDate.getIndex() != date.getIndex()) {
               update = true;
            }
         }
         if(update) {
            highlightedDate = date;
            this.render();
         }
      };
      this.setNavMode = function(mode) {
         if(forceCrop) {
            mode = NavMode.crop;
         }
         if(forceZoom) {
            mode = NavMode.zoom;
         }
         if(mode !== navMode) {
            navMode = mode;
            switch(navMode) {
               case NavMode.pan: {
                  canvas.css("cursor", "default");
               } break;
               case NavMode.crop: {
                  canvas.css("cursor", "crosshair");
               } break;
               case NavMode.zoom: {
                  canvas.css("cursor", "nesw-resize");
               } break;
            }
            if(navMode !== NavMode.crop) {
               navBox = null;
            }
            listener.onNavModeChanged(navMode);
         }
         this.render();
      };
      this.getNavMode = function() {
         return navMode;
      };
      // initial dataset, just for fun
      var data = Array(365);
      var now = moment();
      var baseIndex = new EpiVis.Date(now.year(), now.month() + 1, now.date()).getIndex() - 182;
      for(var i = 0; i < data.length; i++) {
         var x = 6 - (12 * i) / (data.length - 1);
         var xp = x * Math.PI;
         var v = (x === 0) ? 1 : (Math.sin(xp) / xp);
         data[i] = new EpiVis.Point(new EpiVis.Date.fromIndex(baseIndex + i), v);
      }
      var sampleDataset = new EpiVis.Dataset(data, 'EpiVis Sample');
      datasets.push(sampleDataset);
      this.autoScale();
      // animate it for even more fun
      demoAnimation = new Animate.Task(function(dx, x) {
         var two_pi = Math.PI * 2;
         function sin(a, b) { return (Math.sin(x * a * two_pi + b) + 1) / 2; }
         function hex(a) { a = Math.floor(a * 255); return (a < 16) ? ("0" + a.toString(16)) : a.toString(16); }
         var r = 0.5 * sin(0.05, (1 / 3) * two_pi);
         var g = 0.5 * sin(0.05, (2 / 3) * two_pi);
         var b = 0.5 * sin(0.05, (0 / 3) * two_pi);
         sampleDataset.color = "#" + hex(r) + hex(g) + hex(b);
         self.render();
      }, 1, 0, Animate.Ease.sine);
      demoAnimation.start();
      //sampleDataset.lineWidth = 5;
      //sampleDataset.color = '#dd3311';
      // user interaction
      if(window.self === window.top) {
         // only focus if this is the top-level window (e.g. not in an iframe)
         canvas.focus();
      }
      canvas.on("mousedown touchstart", function(e) { consumeEvent(e, mouseDown); });
      canvas.on("mouseup touchend", function(e) { consumeEvent(e, mouseUp); });
      canvas.on("mouseover touchenter", function(e) { consumeEvent(e, mouseOver); });
      canvas.on("mouseout touchleave", function(e) { consumeEvent(e, mouseOut); });
      canvas.on("mousemove touchmove", function(e) { consumeEvent(e, mouseMove); });
      canvas.on("wheel", function(e) { consumeEvent(e, mouseWheel); });
      canvas.on("keydown", function(e) { consumeEvent(e, keyDown); });
      canvas.on("keyup", function(e) { consumeEvent(e, keyUp); });
   };
   self.Date = Date;
   self.Point = Point;
   self.Dataset = Dataset;
   self.Chart = Chart;
   self.Chart.NavMode = NavMode;
   return self;
})();
