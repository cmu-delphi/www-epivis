# Status
[![Deploy Status](http://delphi.midas.cs.cmu.edu/~automation/public/github_deploy_repo/badge.php?repo=cmu-delphi/www-epivis)](#)

# About
An interactive tool for visualizing epidemiological time-series data.

The site is live at http://delphi.midas.cs.cmu.edu/epivis/

# Legacy Changelog
````
=== v35: 2016-11-14 ===
   ./epivis.html
      * link to 3rd party libs instead of hosting them

=== v34: 2016-08-05 ===
   ./epivis.html
      + added description for authorization token under ILINet
      (by Paul)

=== v33: 2016-06-16 ===
   js/epivis.js
      + don't request focus if in an iframe

=== v32: 2016-04-20 ===
   js/epivis.js
      + don't interpolate missing values (unless enabled)

=== v31: 2016-04-16 ===
   ./epivis.html
      + location for source `cdc`
   js/delphi_epidata.js
      * from https://github.com/undefx/delphi-epidata
   js/epidata.js
      + location for source `cdc`

=== v30: 2016-04-15 ===
   ./epivis.html
      + YYYYWW epiweek date column
   js/csv.js
      + YYYYWW epiweek date column

=== v29: 2016-04-09 ===
   ./epivis.html
      + all locations for `nowcast`
   js/epidata.js
      * new `nowcast` start week

=== v28: 2016-04-07 ===
   ./epivis.html
      + sources `cdc` and `sensors`
      * createDataset handles different dates
   js/delphi_epidata.js
      * from https://github.com/undefx/delphi-epidata
   js/epidata.js
      + sources `cdc` and `sensors`

=== v27: 2016-04-06 ===
   ./epivis.html
      + source `stateili`
   js/delphi_epidata.js
      * from https://github.com/undefx/delphi-epidata
   js/epidata.js
      + source `stateili`
      * fixed first `ght` epiweek

=== v26: 2016-04-01 ===
   ./epivis.html
      + census regions for fluview, ilinet, and twitter

=== v25: 2016-03-22 ===
   ./epivis.html
      + added screenshot button and function

=== v24: 2016-02-18 ===
   ./epivis.html
      + param `auth` for source `ilinet`
   js/delphi_epidata.js
      * from https://github.com/undefx/delphi-epidata
   js/epidata.js
      + param `auth` for source `ilinet`

=== v23: 2016-01-29 ===
   ./epivis.html
      + signal `ght`

=== v22: 2015-12-15 ===
   ./epivis.html
      + source `nowcast`
      * fixed wording and default value for `fluview` lag parameter
   js/delphi_epidata.js
      * from https://github.com/undefx/delphi-epidata
   js/epidata.js
      + source `nowcast`

=== v21: 2015-12-11 ===
   ./epivis.html
      + source `signals`
   js/delphi_epidata.js
      * from https://github.com/undefx/delphi-epidata
   js/epidata.js
      + source `signals`

=== v20: 2015-12-03 ===
   ./epivis.html
      + source `ght`
   css/epivis.css
      * increased option_label width
   js/delphi_epidata.js
      * from https://github.com/undefx/delphi-epidata
   js/epidata.js
      + source `ght`

=== v19: 2015-09-18 ===
   js/epidata.js
      + added `value` column for wiki

=== v18: 2015-09-15 ===
   ./epivis.html
      + ILINet support
   js/delphi_epidata.js
      * from https://github.com/undefx/delphi-epidata
   js/epidata.js
      + ILINet support

=== v17: 2015-08-20 ===
   ./epivis.html
      + NIDSS dengue support
   js/delphi_epidata.js
      * from https://github.com/undefx/delphi-epidata
   js/epidata.js
      + NIDSS dengue support
      * NIDSS flu update

=== v16: 2015-08-11 ===
   ./epivis.html
      + NIDSS support
   js/delphi_epidata.js
      + from https://github.com/undefx/delphi-epidata
   js/epidata.js
      + NIDSS support
      + New wiki field
      * wrapper for delphi_epidata.js

=== v15: 2015-07-31 ===
   ./epivis.html
      + auth token for twitter
   js/epidata.js
      + auth token for twitter

=== v14: 2015-07-24 ===
   ./epivis.html
      + parse CSVOptions from CSV comment
      + auto load file when CSVOptions present
      + bulk add/remove grouped datasets
   js/csv.js
      + ignore lines starting with '#'

=== v13: 2015-07-23 ===
   ./epivis.html
      * createDataset requires kernel to be non-null
      * fixed preview box wrapping
   js/epivis.js
      + range check for week in Date.fromEpiweek
      * fix (hack) for week 53 in years with 52 weeks

=== v12: 2015-07-09 ===
   ./epivis.html
      + draw custom line
   js/epivis.js
      * fixed autoscale with multiple datasets

=== v11: 2015-07-03 ===
   ./epivis.html
      + meta viewport tag
      + meta mobile-web-app-capable tag
      + link to manifest.json
      + link to icon.png
      + new buttons for CSV, API, kernels
      + fullscreen support
      + android homescreen support
      * improved dialog support
      * better tooltip positioning
      * hide tooltip after button click
      * adjustments to top bar
      * import via dialog
      - "flag" buttons for UI layout
      - sample CSV files
   ./icon.png
      + basic icon for android homescreen
   ./manifest.json
      + basic manifest for android homescreen
   css/epivis.css
      * increased size of top bar
      * adjusted button look and feel
      * changed import color scheme
      - bottom section now inside dialog
   js/epivis.js
      * default dataset lineWidth 1 to 2
      * various linting

=== v10: 2015-07-02 ===
   ./epivis.html
      + 97 GFT cities
      + UI tooltips for top-bar buttons
   css/epivis.css
      + tooltip class

=== v9: 2015-06-30 ===
   ./epivis.html
      + experimental overlay/dialog
   css/epivis.css
      + overlay/dialog classes

=== v8: 2015-06-24 ===
   ./epivis.html
      + twitter from Epidata API
      + wiki from Epidata API
      * major improvements to Epidata API
      * tentatively enabled multiscale button
   css/epivis.css
      * some padding for option labels
      * tree view width from 200px to 15%
   js/epidata.js
      + Delphi Epidata API (supporting all data sources)
   js/epivis.js
      + scale and vertical offset per dataset
      + dataset scale by mean
      * small tweaks for jsHint

=== v7: 2015-06-23 ===
   ./epivis.html
      + page title
      + more documentation for file loading
      + fetch from Epidata API (FluView and GFT)
      * better mime type detection (excel types)
      * converted double quotes to single quotes
   css/epivis.css
      + extra classes for documentation
   js/csv.js
      + export CSV.DataGroup
      * small syntax adjustments

=== v6: 2015-03-24 ===
   ./epivis.html
      + automatic file preview

=== v5: 2015-03-17 ===
   ./epivis.html
      + kernel: product
   js/csv.js
      * fixed loading without date column
      * fixed loading 1-column CSV
   js/epivis.js
      + <Chart>.showPoints
      + <Chart>.isShowingPoints
   js/treeview.js
      + <TreeView>.getAllDatasets

=== v4: 2015-01-21 ===
   ./epivis.html
      + kernels: sum and iliplus

=== v3: 2015-01-20 ===
   ./changelog.txt
      + separate changelog file
   ./epivis.html
      + link to this changelog
      + createDataset (very experimental)
      + Kernels (kernel generators)
      * fixed randomize button's id
   css/epivis.css
      + reasonable anchor colors
   js/csv.js
      * Use Date.fromEpiweek
   js/epivis.js
      + Date.fromEpiweek
      + <Date>.toString
   js/treeview.js
      + <TreeView>.getSelectedDatasets

=== v2: 2014-12-22 ===
   + randomize color button
   + autoscale button

=== v1: 2014-12-22 ===
   * original version
````
