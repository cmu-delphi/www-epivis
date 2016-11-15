// dfarrow
var CSV = (function() {
   var self = {};
   var DateType = {
      Simple: 0,
      Epi: 1,
      Decimal: 2,
      Monthly: 3,
      Epiweek: 4,
   };
   var Options = function() {
      var self = {};
      self.transpose = false;
      self.hasHeader = false;
      self.dateType = DateType.Simple;
      self.dateCol1 = 0;
      self.dateCol2 = 0;
      self.dateFormat = "YYYY-MM-DD";
      self.hasGroup = false;
      self.groupColumn = 0;
      self.print = function() {
         console.log("transpose: " + self.transpose);
         console.log("hasHeader: " + self.hasHeader);
         console.log("(hasDate): " + (self.dateType !== null));
         console.log("dateType: " + self.dateType);
         console.log("dateCol1: " + self.dateCol1);
         console.log("dateCol2: " + self.dateCol2);
         console.log("dateFormat: " + self.dateFormat);
         console.log("hasGroup: " + self.hasGroup);
         console.log("groupColumn: " + self.groupColumn);
      };
      return self;
   };
   Options.DateType = DateType;
   var Info = function() {
      var self = {};
      self.data = [];
      self.numLines = 0;
      self.numRows = 0;
      self.numCols = 0;
      self.numComments = 0;
      self.numCommentsAfterHeader = 0;
      self.lastComment = 0;
      self.print = function() {
         console.log("Num lines: " + self.numLines);
         console.log("Data size: " + self.numRows + "r x " + self.numCols + "c");
         console.log("Total comments: " + self.numComments);
         console.log("Comments after header: " + self.numCommentsAfterHeader);
         console.log("Last comment: line #" + self.lastComment);
      };
      return self;
   };
   var DataGroup = function(title, data) {
      var self = {};
      self.getTitle = function() { return title; };
      self.getData = function() { return data; };
      self.group = true;
      return self;
   };
   var read = function(title, file, options) {
      var info = new Info();
      var lines = [];
      var numColumns = 0;
      file = file.split("\n");
      for(var i = 0; i < file.length; i++) {
         var line = file[i].trim();
         if(line[0] !== '#') {
            lines.push(line);
            numColumns = Math.max(numColumns, split(line).length);
         }
      }
      if(options.transpose) {
         lines = transpose(lines, lines.length, numColumns);
         numColumns = 0;
         for(var i = 0; i < lines.length; i++) {
            var line = lines[i];
            numColumns = Math.max(numColumns, split(line).length);
         }
      }
      info.numLines = lines.length;
      var numRows = 0;
      var foundHeader = false;
      var labels = new Array(numColumns);
      for(var i = 0, lineNum = 1; i < lines.length; i++, lineNum++) {
         var line = lines[i];
         var values = split(line);
         if(values.length == numColumns) {
            if(options.hasHeader && !foundHeader) {
               //Header
               var j = 0;
               for(var col = 0; col < values.length; col++) {
                  if(isDateColumn(options, col)) {
                     continue;
                  }
                  labels[j++] = values[col];
               }
               foundHeader = true;
               lines.splice(i--, 1);
            } else {
               ++numRows;
            }
         } else if(values.length == 1 && values[0][0] == "+") {
            //group
         } else {
            lines.splice(i--, 1);
            info.numComments++;
            if(foundHeader) {
               info.numCommentsAfterHeader++;
            }
            info.lastComment = lineNum;
         }
      }
      if(options.hasGroup) {
         lines = groupBy(options, lines);
      }
      var data = parseAll(options, labels, lines, 0);
      if(data.length === 0) {
         throw "Nothing loaded";
      }
      info.numCols = numColumns;
      info.numRows = numRows;
      info.data = new DataGroup(title, data);
      info.print();
      return info;
   };
   var transpose = function(input, numRows, numCols) {
      var data = new Array(numRows);
      for(var i = 0; i < data.length; i++) {
         data[i] = new Array(numCols);
      }
      for(var row = 0; row < numRows; row++) {
         var values = split(input[row]);
         for(var col = 0; col < values.length; col++) {
            data[row][col] = values[col];
         }
      }
      var output = [];
      for(var col = 0; col < numCols; col++) {
         var line = "";
         for(var row = 0; row < numRows; row++) {
            line += ",";
            if(data[row][col] !== null) {
               line += "\"" + data[row][col] + "\"";
            }
         }
         output.push(line.substring(1));
      }
      return output;
   };
   var groupBy = function(options, input) {
      var output = [];
      var group = null;
      while(input.length > 0) {
         var values = split(input[0]);
         group = values[options.groupColumn];
         output.push("\"+" + group + "\"");
         for(var i = 0; i < input.length; i++) {
            values = split(input[i]);
            if(group == values[options.groupColumn]) {
               output.push(input.splice(i--, 1)[0]);
            }
         }
      }
      return output;
   };
   var parseAll = function(options, columns, lines, level) {
      var datasets = [];
      var subLines = getDataLines(lines);
      if(subLines.length > 0) {
         var temp = parseGroup(options, columns, subLines);
         for(var i = 0; i < temp.length; i++) {
            datasets.push(temp[i]);
         }
      }
      while(lines.length > 0) {
         var values = split(lines[0]);
         if(values.length == 1 && values[0][0] == "+") {
            var title = values[0].replace("+", "");
            var newLevel = values[0].lastIndexOf("+") + 1;
            if(newLevel > level) {
               lines.splice(0, 1);
               var subsets = parseAll(options, columns, lines, newLevel);
               var data = new DataGroup(title, subsets);
               datasets.push(data);
            } else {
               break;
            }
         } else {
            throw "Expected a group";
         }
      }
      return datasets;
   };
   var getDataLines = function(lines) {
      var dataLines = [];
      for(var i = 0; i < lines.length; i++) {
         var values = split(lines[i]);
         if(values.length == 1 && values[0][0] == "+") {
            break;
         }
         dataLines.push(lines.splice(i--, 1)[0]);
      }
      return dataLines;
   };
   var parseGroup = function(options, columns, lines) {
      var numColumns = columns.length;
      if(options.dateType !== null) {
         switch(options.dateType) {
            case Options.DateType.Simple:
               numColumns -= 1;
               break;
            case Options.DateType.Decimal:
            case Options.DateType.Epiweek:
               numColumns -= 1;
               break;
            case Options.DateType.Epi:
            case Options.DateType.Monthly:
               numColumns -= 2;
               break;
         }
      }
      var datas = new Array(numColumns);
      for(var i = 0; i < datas.length; i++) {
         datas[i] = new Array(lines.length);
      }
      var index = 0;
      for(var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
         var line = lines[lineIndex];
         var values = split(line);
         //Data
         var j = 0;
         for(var i = 0; i < values.length; i++) {
            if(isDateColumn(options, i)) {
               continue;
            }
            //Date
            var date;
            var value;
            try {
               if(options.dateType !== null) {
                  switch(options.dateType) {
                     case Options.DateType.Simple: {
                        var m = moment(values[options.dateCol1], options.dateFormat);
                        date = new EpiVis.Date(m.year(), m.month() + 1, m.date());
                     }
                     break;
                     case Options.DateType.Epiweek: {
                        var ew = parseInt(values[options.dateCol1], 10);
                        var year = Math.floor(ew / 100);
                        var week = ew % 100;
                        date = EpiVis.Date.fromEpiweek(year, week);
                     }
                     break;
                     case Options.DateType.Epi: {
                        var year = parseInt(values[options.dateCol1], 10);
                        var week = parseInt(values[options.dateCol2], 10);
                        date = EpiVis.Date.fromEpiweek(year, week);
                     }
                     break;
                     case Options.DateType.Decimal: {
                        var y = parseFloat(values[options.dateCol1]);
                        var year = Math.floor(y);
                        var days = Math.floor((y - year) * 365.25);
                        date = new EpiVis.Date(year, 1, 1).addDays(days);
                     }
                     break;
                     case Options.DateType.Monthly: {
                        var year = parseInt(values[options.dateCol1], 10);
                        var month = parseInt(values[options.dateCol2], 10);
                        date = new EpiVis.Date(year, month, 15);
                     }
                     break;
                  }
               } else {
                  date = new EpiVis.Date(2000, 1, 1).addDays(lineIndex);
               }
            } catch(e) {
               date = null;
            }
            //Value
            value = parseFloat(values[i]);
            if(isNaN(value)) {
               value = 0;
            }
            datas[j][index] = new EpiVis.Point(date, value);
            j++;
         }
         index++;
      }
      var datasets = [];
      for(var i = 0; i < datas.length; i++) {
         var title = (typeof columns[i] !== "undefined") ? (columns[i] + " (col " + (i + 1) + ")") : ("Column " + i);
         var ds = new EpiVis.Dataset(datas[i], title);
         datasets.push(ds);
      }
      return datasets;
   };
   var isDateColumn = function(options, column) {
      if(options.dateType !== null) {
         switch(options.dateType) {
            case Options.DateType.Simple: {
               return column == options.dateCol1;
            }
            case Options.DateType.Epiweek: {
               return column == options.dateCol1;
            }
            case Options.DateType.Epi: {
               return column == options.dateCol1 || column == options.dateCol2;
            }
            case Options.DateType.Decimal: {
               return column == options.dateCol1;
            }
            case Options.DateType.Monthly: {
               return column == options.dateCol1 || column == options.dateCol2;
            }
         }
      }
      return false;
   };
   var split = function(line) {
      var tokenizer = new Tokenizer(line);
      var fields = [];
      var value;
      while((value = tokenizer.next()) !== null) {
         fields.push(value);
      }
      return fields;
   };
   var Tokenizer = function(line) {
      var str = line;
      var i = 0;
      var self = {};
      self.next = function() {
         if(str === null) {
            return null;
         }
         if(i >= str.length) {
            str = null;
            return "";
         }
         var first = str[i];
         var quote = (first === "\"");
         if(quote) {
            var end = str.indexOf("\"", i + 1);
            var token = str.substring(i + 1, end);
            i = end + 2;
            if(str.indexOf(",", end + 1) < 0) {
               str = null;
            }
            return token;
         } else {
            var done = false;
            var end = str.indexOf(",", i);
            if(end < 0) {
               end = str.length;
               done = true;
            }
            var token = str.substring(i, end);
            i = end + 1;
            if(done) {
               str = null;
            }
            return token;
         }
      };
      return self;
   };
   self.Options = Options;
   self.Info = Info;
   self.DataGroup = DataGroup;
   self.read = read;
   return self;
})();
