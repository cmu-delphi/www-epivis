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
  setActionTooltip('action_directlink', showDirectLink, 'link to this view');



  // maybe load config encoded in path fragment
  loadDirectLinkFragment();
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

function parseFile(text) {
  var options;
  var info = text.split("\n")[0].trim();

  var csv = CSV.read(title, text, options);
  var node = new TreeView.Node(csv.data.getTitle());
  var data = csv.data.getData();
  loadDataGroup(node, data);
  tree.append(node);
  closeDialog();
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
