"use strict";

var chart;
var tree;
var currentDialog = null;

function run() {
  // chart setup
  chart = new EpiVis.Chart("chart_canvas", chartListener);

  // interface setup
  tree = new TreeView.TreeView("chart_tree");

  $("#file_local").change(function() {
    loadFile(previewFile);
  });
  $("#button_import_csv").click(function() {
    loadFile(parseFile);
  });
  $("#button_import_api").click(function() {
    loadEpidata();
  });
  $("#button_draw_line").click(function() {
    addCustomLine();
  });
  $("#button_run_regression").click(function() {
    runRegression($("#regress_dropdown").val());
  });
  $("#box_overlay").click(function() {
    closeDialog();
  });
  connectSubOptions([
    "radio_simple",
    "radio_epiweek",
    "radio_epi",
    "radio_decimal",
    "radio_monthly"
  ]);
  connectSubOptions([
    "radio_fluview",
    "radio_flusurv",
    "radio_gft",
    "radio_ght",
    "radio_twitter",
    "radio_wiki",
    "radio_nidss_flu",
    "radio_nidss_dengue",
    "radio_cdc",
    "radio_quidel",
    "radio_sensors",
    "radio_nowcast",
    "radio_covidcast",
    "radio_covid_hosp"
  ]);
  connectSubOptions([
    "radio_fluview_recent",
    "radio_fluview_static",
    "radio_fluview_offset"
  ]);
  connectSubOptions([
    "radio_flusurv_recent",
    "radio_flusurv_static",
    "radio_flusurv_offset"
  ]);
  connectSubOptions([
    "radio_nidss_flu_recent",
    "radio_nidss_flu_static",
    "radio_nidss_flu_offset"
  ]);
  connectSubOptions(["check_wiki_hour"]);
  connectSubOptions(["check_date"]);
  connectSubOptions(["check_group"]);
  connectSubOptions([
    "radio_covid_hosp_recent",
    "radio_covid_hosp_static"
  ]);

  // top button bar
  setActionTooltip(
    "file_csv",
    function() {
      openDialog("dialog_csv");
    },
    "import dataset from local CSV file"
  );
  setActionTooltip(
    "file_api",
    function() {
      openDialog("dialog_api");
    },
    "import dataset from Delphi API"
  );
  setActionTooltip(
    "file_draw",
    function() {
      openDialog("dialog_draw");
    },
    "add a line manually"
  );
  setActionTooltip(
    "file_kernels",
    function() {
      openDialog("dialog_kernels");
    },
    "create dataset via kernel function"
  );
  setActionTooltip("file_tree", showLeftSection, "show or hide tree view");
  setActionTooltip(
    "file_fullscreen",
    function() {
      screenfull.toggle();
    },
    "toggle fullscreen mode"
  );
  setActionTooltip(
    "action_randomize",
    chartRandomizeColors,
    "randomize colors"
  );
  setActionTooltip("action_autoscale", chartAutoScale, "fit data to screen");
  setActionTooltip("action_showpoints", chartShowPoints, "show or hide points");
  setActionTooltip("action_multiscale", multiScale, "scale by 1/mean");
  setActionTooltip(
    "action_regress",
    function() {
      fillRegressionDialog();
      openDialog("dialog_regress");
    },
    "perform regression"
  );
  setActionTooltip("action_reset", resetChart, "reset scaling and shifting");
  setActionTooltip("action_screenshot", screenshot, "take a screenshot");
  setActionTooltip("action_directlink", showDirectLink, "link to this view");
  setActionTooltip(
    "action_undo",
    chartUndo,
    'undo <span style="color: #d42">//not implemented</span>'
  );
  setActionTooltip(
    "action_redo",
    chartRedo,
    'redo <span style="color: #d42">//not implemented</span>'
  );
  setActionTooltip(
    "navmode_pan",
    function() {
      setNavMode(EpiVis.Chart.NavMode.pan);
    },
    "pan mode"
  );
  setActionTooltip(
    "navmode_crop",
    function() {
      setNavMode(EpiVis.Chart.NavMode.crop);
    },
    "crop mode"
  );
  setActionTooltip(
    "navmode_zoom",
    function() {
      setNavMode(EpiVis.Chart.NavMode.zoom);
    },
    "zoom mode"
  );

  // escape key closes dialog
  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      closeDialog();
    }
  });

  // dynamic resizing
  $(window).resize(resize);
  resize();

  // populate covidcast options from live metadata
  initializeCovidcastOptions();

  // maybe load config encoded in path fragment
  loadDirectLinkFragment();
}

const initializeCovidcastOptions = () => {

  const validNameRegex = /^[-_\w\d]+$/;

  const getSortedUnique = (rows, key) => {
    const set = {};
    rows.forEach(row => {
      set[row[key]] = 1;
    });
    const items = [];
    Object.entries(set).forEach(keyval => items.push(keyval[0]));
    return items.sort();
  }

  const populateDropdown = (element, names) => {
    names.forEach(name => {
      if (name.match(validNameRegex)) {
        element.append(`<option value="${name}">${name}</option>`);
      } else {
        console.log('invalid name:', name);
      }
    });
  };

  Epidata.api.covidcast_meta((result, message, epidata) => {
    if (result !== 1) {
      console.log('failed to fetch covidcast metadata:', message);
      return;
    }
    populateDropdown(
        $('#select_covidcast_data_source'),
        getSortedUnique(epidata, 'data_source'));
    populateDropdown(
        $('#select_covidcast_signal'),
        getSortedUnique(epidata, 'signal'));
    populateDropdown(
        $('#select_covidcast_geo_type'),
        getSortedUnique(epidata, 'geo_type'));
  });
}

function setActionTooltip(id, action, tooltip) {
  var button = $("#" + id);
  button.click(function() {
    action();
    hideTooltip();
  });
  button.hover(showTooltip(tooltip), hideTooltip);
}

function showTooltip(message) {
  return function(event) {
    var bar = $("#top_bar");
    var tt = $("#tooltip");
    tt.html('<i class="fa fa-info-circle"></' + "i>&nbsp;&nbsp;" + message);
    tt.css({
      top: bar.offset().top + bar.height(),
      left: event.pageX - tt.width() / 2
    });
    tt.show(0);
  };
}

function hideTooltip(event) {
  $("#tooltip").hide(0);
}

const successFunction = (title) => {
  return function(datasets) {
    datasets.forEach(data => {
      data.parentTitle = title;
    });
    var info = new CSV.Info();
    info.numCols = datasets.length;
    info.numRows = datasets[0].data.length;
    info.data = new CSV.DataGroup("[API] " + title, datasets);
    info.print();
    var node = new TreeView.Node(info.data.getTitle());
    loadDataGroup(node, info.data.getData());
    tree.append(node);
    closeDialog();
  };
};

const onFailure = (message) => {
  alert(message);
};

function loadEpidata() {
  if ($("#radio_fluview").is(":checked")) {
    (function() {
      var region = $("#select_fluview_region :selected").val();
      var title = "FluView: " + $("#select_fluview_region :selected").text();
      var issue, lag;
      var auth = $("#text_fluview_auth").val();

      if ($("#radio_fluview_static").is(":checked")) {
        issue = parseInt($("#text_fluview_static").val(), 10);
        title +=
          " (reported " + Math.floor(issue / 100) + "w" + (issue % 100) + ")";
      } else if ($("#radio_fluview_offset").is(":checked")) {
        lag = parseInt($("#text_fluview_offset").val(), 10);
        title += " (lagged " + lag + " week" + (lag != 1 ? "s" : "") + ")";
      }

      Epidata.fetchFluView(
        successFunction(title),
        onFailure,
        region,
        issue,
        lag,
        auth
      );
    })();
  } else if ($("#radio_flusurv").is(":checked")) {
    (function() {
      var location = $("#select_flusurv_location :selected").val();
      var title = "FluSurv: " + $("#select_flusurv_location :selected").text();
      var issue, lag;

      if ($("#radio_flusurv_static").is(":checked")) {
        issue = parseInt($("#text_flusurv_static").val(), 10);
        title +=
          " (reported " + Math.floor(issue / 100) + "w" + (issue % 100) + ")";
      } else if ($("#radio_flusurv_offset").is(":checked")) {
        lag = parseInt($("#text_flusurv_offset").val(), 10);
        title += " (lagged " + lag + " week" + (lag != 1 ? "s" : "") + ")";
      }

      Epidata.fetchFluSurv(
        successFunction(title),
        onFailure,
        location,
        issue,
        lag
      );
    })();
  } else if ($("#radio_gft").is(":checked")) {
    (function() {
      var location = $("#select_gft_location :selected").val();
      var title = "GFT: " + $("#select_gft_location :selected").text();
      Epidata.fetchGFT(successFunction(title), onFailure, location);
    })();
  } else if ($("#radio_ght").is(":checked")) {
    (function() {
      var auth = $("#text_ght_auth").val();
      var location = $("#select_ght_location :selected").val();
      var query = $("#text_ght_query").val();
      var title =
        "GHT: " +
        $("#select_ght_location :selected").text() +
        "[" +
        $("#text_ght_query").val() +
        "]";
      Epidata.fetchGHT(
        successFunction(title),
        onFailure,
        auth,
        location,
        query
      );
    })();
  } else if ($("#radio_twitter").is(":checked")) {
    (function() {
      var auth = $("#text_twitter_auth").val();
      var location = $("#select_twitter_location :selected").val();
      var resolution = $("#select_twitter_resolution :selected").val();
      var title =
        "Twitter: " +
        $("#select_twitter_location :selected").text() +
        ", " +
        $("#select_twitter_resolution :selected").text();
      Epidata.fetchTwitter(
        successFunction(title),
        onFailure,
        auth,
        location,
        resolution
      );
    })();
  } else if ($("#radio_wiki").is(":checked")) {
    (function() {
      var article = $("#select_wiki_article :selected").val();
      var resolution = $("#select_wiki_resolution :selected").val();
      var hour;

      if ($("#check_wiki_hour").is(":checked")) {
        hour = parseInt($("#text_wiki_hour").val(), 10);
      }

      var title =
        "Wiki: " +
        $("#select_wiki_article :selected").text() +
        ", " +
        $("#select_wiki_resolution :selected").text() +
        (typeof hour !== "undefined" ? " (hour=" + hour + ")" : "");
      Epidata.fetchWiki(
        successFunction(title),
        onFailure,
        article,
        resolution,
        hour
      );
    })();
  } else if ($("#radio_nidss_flu").is(":checked")) {
    (function() {
      var region = $("#select_nidss_flu_region :selected").val();
      var title =
        "NIDSS-influenza: " + $("#select_nidss_flu_region :selected").text();
      var issue, lag;

      if ($("#radio_nidss_flu_static").is(":checked")) {
        issue = parseInt($("#text_nidss_flu_static").val(), 10);
        title +=
          " (reported " + Math.floor(issue / 100) + "w" + (issue % 100) + ")";
      } else if ($("#radio_nidss_flu_offset").is(":checked")) {
        lag = parseInt($("#text_nidss_flu_offset").val(), 10);
        title += " (lagged " + lag + " week" + (lag > 1 ? "s" : "") + ")";
      }

      Epidata.fetchNIDSS_flu(
        successFunction(title),
        onFailure,
        region,
        issue,
        lag
      );
    })();
  } else if ($("#radio_nidss_dengue").is(":checked")) {
    (function() {
      var location = $("#select_nidss_dengue_location :selected").val();
      var title =
        "NIDSS-Dengue: " + $("#select_nidss_dengue_location :selected").text();
      Epidata.fetchNIDSS_dengue(successFunction(title), onFailure, location);
    })();
  } else if ($("#radio_cdc").is(":checked")) {
    (function() {
      var auth = $("#text_cdc_auth").val();
      var location_v = $("#select_cdc_location :selected").val();
      var location_t = $("#select_cdc_location :selected").text();
      var title = "CDC Page Hits: " + location_t;
      Epidata.fetchCDC(successFunction(title), onFailure, auth, location_v);
    })();
  } else if ($("#radio_quidel").is(":checked")) {
    (function() {
      var auth = $("#text_quidel_auth").val();
      var location_v = $("#select_quidel_location :selected").val();
      var location_t = $("#select_quidel_location :selected").text();
      var title = "Quidel Data: " + location_t;
      Epidata.fetchQuidel(successFunction(title), onFailure, auth, location_v);
    })();
  } else if ($("#radio_sensors").is(":checked")) {
    (function() {
      var auth = $("#text_sensors_auth").val();
      var name_v = $("#select_sensors_name :selected").val();
      var name_t = $("#select_sensors_name :selected").text();
      var location_v = $("#select_sensors_location :selected").val();
      var location_t = $("#select_sensors_location :selected").text();
      var title = "Delphi Sensor " + name_t + ": " + location_t;
      Epidata.fetchSensors(
        successFunction(title),
        onFailure,
        auth,
        name_v,
        location_v
      );
    })();
  } else if ($("#radio_nowcast").is(":checked")) {
    (function() {
      var location_v = $("#select_nowcast_location :selected").val();
      var location_t = $("#select_nowcast_location :selected").text();
      var title = "Delphi Nowcast: " + location_t;
      Epidata.fetchNowcast(successFunction(title), onFailure, location_v);
    })();
  } else if ($("#radio_covidcast").is(":checked")) {
    (() => {
      const dataSource = $("#select_covidcast_data_source :selected").val();
      const signal = $("#select_covidcast_signal :selected").val();
      const timeType = 'day';
      const geoType = $("#select_covidcast_geo_type :selected").val();
      const geoValue = $("#text_covidcast_geo_value").val();
      const title = `Delphi COVIDcast: ${geoValue} ${signal} (${dataSource})`;
      Epidata.fetchCovidcast(
          successFunction(title),
          onFailure,
          dataSource,
          signal,
          timeType,
          geoType,
          geoValue);
    })();
  } else if ($("#radio_covid_hosp").is(":checked")) {
    (() => {
      const state_v = $("#select_covid_hosp_state :selected").val();
      const state_t = $("#select_covid_hosp_state :selected").text();
      let title = "COVID Hospitalization: " + state_t;
      let issue;
      if ($("#radio_covid_hosp_static").is(":checked")) {
        issue = parseInt($("#text_covid_hosp_static").val(), 10);
        title += " (issued on " + issue + ")";
      } else {
        title += " (most recent issue)";
      }

      Epidata.fetchCovidHosp(
          successFunction(title),
          onFailure,
          state_v,
          issue);
    })();
  } else {
    alert("invalid api");
  }
}

function resize() {
  var canvas = $("#chart_canvas");
  var button = $("#file_fullscreen");
  canvas[0].width = canvas.width();
  canvas[0].height = canvas.height();
  chart.render();

  if (
    screenfull.enabled &&
    (canvas.height() <= 480 || screenfull.isFullscreen)
  ) {
    button.show();
  } else {
    button.hide();
  }
}

function showLeftSection(show) {
  var button = $("#file_tree");
  var canvas = $("#chart_canvas");
  var left = $("#chart_tree");
  show =
    typeof show === "undefined"
      ? !button.hasClass("ui_flag_icon_selected")
      : show;

  if (show) {
    canvas.removeClass("hide_left");
    canvas.addClass("show_left");
    button.addClass("ui_flag_icon_selected");
    left.show();
  } else {
    canvas.removeClass("show_left");
    canvas.addClass("hide_left");
    button.removeClass("ui_flag_icon_selected");
    left.hide();
  }

  resize();
}

function multiScale() {
  tree.getSelectedDatasets()[0].forEach(data => data.scaleMean());
  chart.render();
}

function runRegression(index) {
  const selected = tree.getSelectedDatasets()[0];
  if (selected.length < 2) {
    multiScale();
  } else {
    for (let i = 0; i < selected.length; i++) {
      if (i != index) {
        selected[i].regress(selected[index]);
      }
    }
    chart.render();
  }
  closeDialog();
}

function resetChart() {
  tree.getSelectedDatasets()[0].forEach(data => data.scaleAndShift(1, 0));
  chart.render();
}

function screenshot() {
  const image = new Image();
  image.src = $('#chart_canvas')[0].toDataURL();
  const newWindow = window.open('');
  newWindow.document.write(image.outerHTML);
}

function chartAutoScale() {
  chart.autoScale(true);
}

function chartUndo() {
  //chart.multiScale();
  alert("undo is not implemented yet");
}

function chartRedo() {
  //chart.multiScale();
  alert("redo is not implemented yet");
}

function chartRandomizeColors() {
  chart.randomizeColors();
}

function chartShowPoints() {
  var cls = "ui_flag_icon_selected";
  chart.showPoints();

  if (chart.isShowingPoints()) {
    $("#action_showpoints").addClass(cls);
  } else {
    $("#action_showpoints").removeClass(cls);
  }
}

function setNavMode(mode) {
  chart.setNavMode(mode);
}

function loadFile(action) {
  if ($("#file_local")[0].files.length == 0) {
    return;
  }

  var file;

  try {
    file = $("#file_local")[0].files[0];

    if (
      file.type !== "text/csv" &&
      file.type !== "application/vnd.ms-excel" &&
      file.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      if (
        !confirm(
          "*Unknown file type.*\n\nBrowser reports mime type of [" +
            file.type +
            "]; expected [text/csv].\n\nAttempt to load anyway?"
        )
      ) {
        return;
      }
    }

    if (file.size > 1 << 20) {
      if (
        !confirm(
          "*Large file.*\n\nBrowser reports file size of [" +
            file.size +
            " bytes].\n\nAttempt to load anyway?"
        )
      ) {
        return;
      }
    }
  } catch (e) {
    alert(e + "\n(Hint: Double check that you selected the right file.)");
  }

  var reader = new FileReader();

  reader.onload = function(e) {
    console.log("Loaded " + reader.result.length + " bytes");
    action(reader.result);
  };

  reader.onerror = function(e) {
    alert("Failed to read file: " + reader.error);
  };

  reader.readAsText(file);
}

function getCSVOptions() {
  var options = new CSV.Options();
  options.transpose = $("#check_transpose").is(":checked");
  options.hasHeader = $("#check_header").is(":checked");

  if ($("#check_date").is(":checked")) {
    if ($("#radio_simple").is(":checked")) {
      options.dateType = CSV.Options.DateType.Simple;
      options.dateCol1 = parseInt($("#text_simple_0").val(), 10);
      options.dateFormat = "YYYY-MM-DD";
    }

    if ($("#radio_epiweek").is(":checked")) {
      options.dateType = CSV.Options.DateType.Epiweek;
      options.dateCol1 = parseInt($("#text_epiweek_0").val(), 10);
    }

    if ($("#radio_epi").is(":checked")) {
      options.dateType = CSV.Options.DateType.Epi;
      options.dateCol1 = parseInt($("#text_epi_0").val(), 10);
      options.dateCol2 = parseInt($("#text_epi_1").val(), 10);
    }

    if ($("#radio_decimal").is(":checked")) {
      options.dateType = CSV.Options.DateType.Decimal;
      options.dateCol1 = parseInt($("#text_decimal_0").val(), 10);
    }

    if ($("#radio_monthly").is(":checked")) {
      options.dateType = CSV.Options.DateType.Monthly;
      options.dateCol1 = parseInt($("#text_monthly_0").val(), 10);
      options.dateCol2 = parseInt($("#text_monthly_1").val(), 10);
    }
  } else {
    options.dateType = null;
  }

  options.hasGroup = $("#check_group").is(":checked");

  if (options.hasGroup) {
    options.groupColumn = parseInt($("#text_group_0").val(), 10);
  }

  options.print();
  return options;
}

function parseFile(text) {
  var options;
  var info = text.split("\n")[0].trim();

  if (info.startsWith("#{") && info.endsWith("}")) {
    options = JSON.parse(info.substring(1));
    console.log("using CSVOptions from file");
  } else {
    options = getCSVOptions();
    console.log(JSON.stringify(options));
  }

  var title = $("#file_local")[0].files[0].name;
  var csv = CSV.read(title, text, options);
  var node = new TreeView.Node(csv.data.getTitle());
  var data = csv.data.getData();
  loadDataGroup(node, data);
  tree.append(node);
  closeDialog();
}

function previewFile(text) {
  var lines = text.split("\n");
  var preview = "";
  var i;

  for (i = 0; i < Math.min(5, lines.length); i++) {
    preview += lines[i] + "\n";
  }

  $("#preview_box").val(preview);
  var info = lines[0].trim();

  if (info.startsWith("#{") && info.endsWith("}")) {
    parseFile(text);
  }
}

function loadDataGroup(node, data) {
  var nodes = [];
  var group0, i, j, n;

  if (typeof data[0].group !== "undefined") {
    group0 = data[0].getData();

    for (i = 0; i < group0.length; i++) {
      n = new TreeView.Node("[all] " + group0[i].title, node);
      n.setDataset(
        0,
        (function(i) {
          return function(node) {
            for (j = 0; j < data.length; j++) {
              if (node.isSelected()) {
                chart.addDataset(data[j].getData()[i]);
              } else {
                chart.removeDataset(data[j].getData()[i]);
              }
            }
          };
        })(i)
      );
      nodes.push(n);
    }
  }

  for (var i = 0; i < data.length; i++) {
    if (typeof data[i].group === "undefined") {
      // this is an actual dataset
      var n = new TreeView.Node(data[i].title, node);
      n.setDataset(data[i], nodeToggled);
      nodes.push(n);
    } else {
      // this is just a container
      var n = new TreeView.Node(data[i].getTitle(), node);
      loadDataGroup(n, data[i].getData());
      nodes.push(n);
    }
  }

  node.setNodes(nodes);
}

function nodeToggled(node) {
  if (node.isLeaf()) {
    if (node.isSelected()) {
      chart.addDataset(node.getDataset());
    } else {
      chart.removeDataset(node.getDataset());
    }
  }
}

function updateDatePresent() {
  if ($("#check_date").is(":checked")) {
    $("#check_date_options").show(200);
  } else {
    $("#check_date_options").hide(200);
  }
}

function updateGroupPresent() {
  if ($("#check_group").is(":checked")) {
    $("#check_group_options").show(200);
  } else {
    $("#check_group_options").hide(200);
  }
}

function connectSubOptions(labels) {
  var update = function update() {
    for (var i = 0; i < labels.length; i++) {
      if ($("#" + labels[i]).is(":checked")) {
        $("#" + labels[i] + "_options").show(200);
      } else {
        $("#" + labels[i] + "_options").hide(200);
      }
    }
  };

  for (var i = 0; i < labels.length; i++) {
    $("#" + labels[i]).click(update);
  }
}

function addCustomLine() {
  var parseDate = function parseDate(date) {
    if (date.length === 6) {
      var d = parseInt(date);

      if (!isNaN(d)) {
        return EpiVis.Date.fromEpiweek(Math.floor(d / 100), d % 100);
      }
    } else {
      try {
        return EpiVis.Date.parse(date);
      } catch (ex) {}
    }

    return null;
  };

  var title = $("#draw_title").val();
  var date1 = parseDate($("#draw_date1").val());
  var date2 = parseDate($("#draw_date2").val());

  if (date1 === null || date2 === null) {
    alert("Invalid date string.");
    return;
  }

  var value1 = parseFloat($("#draw_value1").val());
  var value2 = parseFloat($("#draw_value2").val());

  if (isNaN(value1) || isNaN(value2)) {
    alert("Invalid float value.");
    return;
  }

  var dataset = new EpiVis.Dataset(
    [new EpiVis.Point(date1, value1), new EpiVis.Point(date2, value2)],
    title
  );
  var node = new TreeView.Node(title);
  node.setDataset(dataset, nodeToggled);
  tree.append(node);
  closeDialog();
}

function createDataset(title, kernel) {
  if (typeof kernel === "undefined" || kernel === null) {
    alert(
      "You need to pass a kernel function like:\n[date, double] kernel(EpiVis.Date date, double[] values)"
    );
    return;
  }

  var selected = tree.getSelectedDatasets();

  if (selected.length === 0) {
    alert("You need to select at least one dataset.");
    return;
  }

  console.log("Using these datasets:");

  for (var i = 0; i < selected.length; i++) {
    console.log("   " + selected[i].title);
  }

  // find the union of dates
  var values = {};

  for (var ds = 0; ds < selected.length; ds++) {
    for (var i = 0; i < selected[ds].data.length; i++) {
      var point = selected[ds].data[i];
      var idx = point.getDate().getIndex();
      values[idx] = values[idx] || {};
      values[idx][ds] = point.getValue();
    }
  }

  var indices = [];

  for (var idx in values) {
    if (values.hasOwnProperty(idx)) {
      indices.push(parseInt(idx));
    }
  }

  indices.sort(function(x, y) {
    return x - y;
  });
  var data = [];

  for (var i = 0; i < indices.length; i++) {
    var idx = indices[i];
    var date = EpiVis.Date.fromIndex(idx);
    var vals = [];

    for (var ds = 0; ds < selected.length; ds++) {
      //todo: use interpolation if necessary
      vals.push(values[idx][ds] || null);
    }

    var result = kernel(date, vals);
    data.push(new EpiVis.Point(result[0], result[1]));
  }

  var node = new TreeView.Node(title);
  var dataset = new EpiVis.Dataset(data, title);
  node.setDataset(dataset, nodeToggled);
  tree.append(node);
}

var chartListener = {
  onNavModeChanged: function onNavModeChanged(navMode) {
    var cls = "ui_flag_icon_selected";
    $("#navmode_pan").removeClass(cls);
    $("#navmode_crop").removeClass(cls);
    $("#navmode_zoom").removeClass(cls);

    switch (navMode) {
      case EpiVis.Chart.NavMode.pan:
        {
          $("#navmode_pan").addClass(cls);
        }
        break;

      case EpiVis.Chart.NavMode.crop:
        {
          $("#navmode_crop").addClass(cls);
        }
        break;

      case EpiVis.Chart.NavMode.zoom:
        {
          $("#navmode_zoom").addClass(cls);
        }
        break;
    }
  }
};
var Kernels = {
  sum: function sum() {
    return function(date, values) {
      var sum = 0;

      for (var i = 0; i < values.length; i++) {
        sum += values[i];
      }

      return [date, sum];
    };
  },
  product: function product() {
    return function(date, values) {
      var product = 1;

      for (var i = 0; i < values.length; i++) {
        product *= values[i];
      }

      return [date, product];
    };
  },
  average: function average() {
    return function(date, values) {
      var sum = 0;

      for (var i = 0; i < values.length; i++) {
        sum += values[i];
      }

      return [date, sum / values.length];
    };
  },
  ratio: function ratio(inverse) {
    return function(date, values) {
      var a, b;

      if (inverse) {
        a = values[1];
        b = values[0];
      } else {
        a = values[0];
        b = values[1];
      }

      return [date, b == 0 ? 0 : a / b];
    };
  },
  scale: function scale(_scale) {
    return function(date, values) {
      return [date, values[0] * _scale];
    };
  },
  iliplus: function iliplus() {
    return function(date, values) {
      return [date, (values[0] * values[1]) / 100];
    };
  }
};

function openDialog(name) {
  currentDialog = name;
  $("#box_overlay").show(0, function() {
    $("#box_overlay").animate(
      {
        opacity: 0.9
      },
      200
    );
  });
  $("#" + name).show(0, function() {
    $("#" + name).animate(
      {
        opacity: 1
      },
      200
    );
  });
}

function closeDialog() {
  if (currentDialog === null) {
    return;
  }

  var name = currentDialog;
  currentDialog = null;
  $("#box_overlay").animate(
    {
      opacity: 0
    },
    200,
    function() {
      $("#box_overlay").hide();
    }
  );
  $("#" + name).animate(
    {
      opacity: 0
    },
    200,
    function() {
      $("#" + name).hide();
    }
  );
}

function fillRegressionDialog() {
  $("#regress_dropdown").empty();
  $.each(tree.getSelectedDatasets()[1], (i, name) => {
    $("#regress_dropdown").append(
      $("<option>", {
        value: i,
        text: name
      })
    );
  });
}

const showDirectLink = () => {
  const [href, anySkipped] = getDirectLink();
  $('#dialog_directlink_text').text(href);
  const warningText = $('#dialog_directlink_warning');
  if (anySkipped) {
    warningText.show();
  } else {
    warningText.hide();
  }
  openDialog("dialog_directlink");
};

const getDirectLink = () => {
  const config = {
    'chart': {
      'viewport': chart.getViewport(),
      'showPoints': chart.isShowingPoints(),
    },
    'datasets': [],
  };
  let anySkipped = false;
  tree.getSelectedDatasets()[0].forEach(data => {
    if (data.params) {
      config.datasets.push({
        'color': data.color,
        'title': data.title,
        'parentTitle': data.parentTitle,
        'params': data.params,
      });
    } else {
      console.log('unable to get direct link to dataset:', data.title);
      anySkipped = true;
    }
  });
  if (anySkipped) {
    console.log('unable to link some datasets');
  }
  let href = window.location.href;
  // remove the existing fragment, if present
  let idx = href.indexOf('#');
  if (idx >= 0) {
    href = href.substring(0, idx);
  }
  // append the generated fragment
  href += '#' + btoa(JSON.stringify(config));
  return [href, anySkipped];
};

const loadDirectLinkFragment = () => {
  // check for a path fragment
  if (!window.location.hash) {
    console.log('no config linked');
    return;
  }

  // attempt to decode the config in the fragment
  let config;
  try {
    config = JSON.parse(atob(window.location.hash.substring(1)));
  } catch {
    console.log('invalid path fragment');
    return;
  }

  // load, select, and format each dataset
  config.datasets.forEach(data => {
    const func = {
      'fluview': Epidata.fetchFluView,
      'flusurv': Epidata.fetchFluSurv,
      'gft': Epidata.fetchGFT,
      'ght': Epidata.fetchGHT,
      'twtr': Epidata.fetchTwitter,
      'wiki': Epidata.fetchWiki,
      'cdcp': Epidata.fetchCDC,
      'quidel': Epidata.fetchQuidel,
      'nidss_flu': Epidata.fetchNIDSS_flu,
      'nidss_dengue': Epidata.fetchNIDSS_dengue,
      'sensors': Epidata.fetchSensors,
      'nowcast': Epidata.fetchNowcast,
      'covidcast': Epidata.fetchCovidcast,
      'covid_hosp': Epidata.fetchCovidHosp,
    }[data.params[0]];
    const onSuccess = (datasets) => {
      const loader = successFunction(data.parentTitle);
      loader(datasets);
      const rootNode = tree.getRootNodes().slice(-1)[0];
      tree.toggleNode(rootNode);
      rootNode.getNodes().forEach((node) => {
        if (node.getDataset().title === data.title) {
          node.getDataset().color = data.color;
          tree.toggleNode(node);
        }
      });
    };
    func(onSuccess, onFailure, ...data.params.slice(1));
  });

  // apply chart-level settings
  chart.setViewport(...config.chart.viewport);
  if (config.chart.showPoints) {
    chartShowPoints();
  }
};

$(document).ready(run);
