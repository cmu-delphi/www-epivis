
 <div id="dialog_api" class="box_dialog">
         <h1>Load from Epidata API</h1>
         <div class="option_label"><label><input type="radio" name="source_radio" id="radio_fluview" checked="checked" /> FluView</label></div><span class="explanation">(source: <a target="_blank" href="https://gis.cdc.gov/grasp/fluview/fluportaldashboard.html">cdc.gov</a>)</span>
         <br />
         <div class="option_label"><label><input type="radio" name="source_radio" id="radio_flusurv" /> FluSurv</label></div><span class="explanation">(source: <a target="_blank" href="https://gis.cdc.gov/GRASP/Fluview/FluHospRates.html">cdc.gov</a>)</span>
         <br />
         <div class="option_label"><label><input type="radio" name="source_radio" id="radio_gft" /> Google Flu Trends</label></div><span class="explanation">(source: <a target="_blank" href="https://www.google.org/flutrends/">google.com</a>)</span>
         <br />
         <div class="option_label"><label><input type="radio" name="source_radio" id="radio_ght" /> Google Health Trends</label></div><span class="explanation">(source: private Google API)</span>
         <br />
         <div class="option_label"><label><input type="radio" name="source_radio" id="radio_twitter" /> HealthTweets</label></div><span class="explanation">(source: <a target="_blank" href="http://www.healthtweets.org/">healthtweets.org</a>)</span>
         <br />
         <div class="option_label"><label><input type="radio" name="source_radio" id="radio_wiki" /> Wikipedia Access</label></div><span class="explanation">(source: <a target="_blank" href="https://dumps.wikimedia.org/other/pagecounts-raw/">dumps.wikimedia.org</a>)</span>
         <br />
         <div class="option_label"><label><input type="radio" name="source_radio" id="radio_cdc" /> CDC Page Hits</label></div><span class="explanation">(source: private CDC dataset)</span>
         <br />
         <div class="option_label"><label><input type="radio" name="source_radio" id="radio_quidel" /> Quidel Data</label></div><span class="explanation">(source: private Quidel dataset)</span>
         <br />
         <div class="option_label"><label><input type="radio" name="source_radio" id="radio_nidss_flu" /> NIDSS - Influenza</label></div><span class="explanation">(source: <a target="_blank" href="http://nidss.cdc.gov.tw/en/CDCWNH01.aspx?dc=wnh">nidss.cdc.gov.tw</a>)</span>
         <br />
         <div class="option_label"><label><input type="radio" name="source_radio" id="radio_nidss_dengue" /> NIDSS - Dengue</label></div><span class="explanation">(source: <a target="_blank" href="http://nidss.cdc.gov.tw/en/SingleDisease.aspx?dc=1&amp;dt=4&amp;disease=061&amp;position=1">nidss.cdc.gov.tw</a>)</span>
         <br />
         <div class="option_label"><label><input type="radio" name="source_radio" id="radio_sensors" /> Delphi Sensors</label></div><span class="explanation">(source: <a target="_blank" href="https://delphi.cmu.edu/">delphi.cmu.edu</a>)</span>
         <br />
         <div class="option_label"><label><input type="radio" name="source_radio" id="radio_nowcast" /> Delphi Nowcast</label></div><span class="explanation">(source: <a target="_blank" href="https://delphi.cmu.edu/">delphi.cmu.edu</a>)</span>
         <br />
         <div class="option_label"><label><input type="radio" name="source_radio" id="radio_covidcast" /> Delphi COVIDcast</label></div><span class="explanation">(source: <a target="_blank" href="https://delphi.cmu.edu/">delphi.cmu.edu</a>)</span>
         <br />
         <div class="option_label"><label><input type="radio" name="source_radio" id="radio_covid_hosp" /> COVID Hospitalization</label></div><span class="explanation">(source: <a target="_blank" href="https://healthdata.gov/dataset/covid-19-reported-patient-impact-and-hospital-capacity-state-timeseries">healthdata.gov</a>)</span>
         <div class="csv_options" id="radio_fluview_options">
            <div class="option_label">
               <select name="select_fluview_region" id="select_fluview_region">
                 // TODO
               </select>
            </div><span class="explanation">(region to filter data by)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="fluview_issue_radio" id="radio_fluview_recent" checked="checked" /> Most Recent Issue</label></div><span class="explanation">(fetch the most up-to-date/stable data)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="fluview_issue_radio" id="radio_fluview_static" /> Specific Issue</label></div><span class="explanation">(fetch data "as-of" a specific week)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="fluview_issue_radio" id="radio_fluview_offset" /> Lagged Data</label></div><span class="explanation">(fetch data lagged by a number of weeks)</span>
            <br />
            <div class="csv_options" id="radio_fluview_recent_options">
               <span class="explanation">(this option has no additional parameters)</span>
               <br />
            </div>
            <div class="csv_options" id="radio_fluview_static_options" style="display: none;">
               <div class="option_label"><label><input type="text" id="text_fluview_static" value="201520" /> What MMWR week should the data come from?</label></div> <span class="explanation">(format: YYYYWW)</span>
               <br />
            </div>
            <div class="csv_options" id="radio_fluview_offset_options" style="display: none;">
               <div class="option_label"><label><input type="text" id="text_fluview_offset" value="0" /> How many weeks is the data lagged by?</label></div> <span class="explanation">(a non-negative integer)</span>
               <br />
            </div>
            <div class="option_label">
               <input type="text" name="text_fluview_auth" id="text_fluview_auth" size="8" />
            </div><span class="explanation">(authorization token; required for imputed data for non-participating states; in any case, the API will return data for regions and participating states)</span>
            <br />
         </div>
         <div class="csv_options" id="radio_flusurv_options" style="display: none;">
            <div class="option_label">
               <select name="select_flusurv_location" id="select_flusurv_location">

               </select>
            </div><span class="explanation">(location to filter data by)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="flusurv_issue_radio" id="radio_flusurv_recent" checked="checked" /> Most Recent Issue</label></div><span class="explanation">(fetch the most up-to-date/stable data)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="flusurv_issue_radio" id="radio_flusurv_static" /> Specific Issue</label></div><span class="explanation">(fetch data "as-of" a specific week)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="flusurv_issue_radio" id="radio_flusurv_offset" /> Lagged Data</label></div><span class="explanation">(fetch data lagged by a number of weeks)</span>
            <br />
            <div class="csv_options" id="radio_flusurv_recent_options">
               <span class="explanation">(this option has no additional parameters)</span>
               <br />
            </div>
            <div class="csv_options" id="radio_flusurv_static_options" style="display: none;">
               <div class="option_label"><label><input type="text" id="text_flusurv_static" value="201520" /> What MMWR week should the data come from?</label></div> <span class="explanation">(format: YYYYWW)</span>
               <br />
            </div>
            <div class="csv_options" id="radio_flusurv_offset_options" style="display: none;">
               <div class="option_label"><label><input type="text" id="text_flusurv_offset" value="0" /> How many weeks is the data lagged by?</label></div> <span class="explanation">(a non-negative integer)</span>
               <br />
            </div>
         </div>
         <div class="csv_options" id="radio_gft_options" style="display: none;">
            <div class="option_label">
               <select name="select_gft_location" id="select_gft_location">

               </select>
            </div><span class="explanation">(location to filter data by)</span>
            <br />
         </div>
         <div class="csv_options" id="radio_ght_options" style="display: none;">
            <div class="option_label">
               <input type="text" name="text_ght_auth" id="text_ght_auth" size="8" />
            </div><span class="explanation">(authorization token)</span>
            <br />
            <div class="option_label">
               <select name="select_ght_location" id="select_ght_location">

               </select>
            </div><span class="explanation">(location to filter data by)</span>
            <br />
            <div class="option_label">
               <input type="text" name="text_ght_query" id="text_ght_query" />
            </div><span class="explanation">(search query or topic ID)</span>
            <br />
         </div>
         <div class="csv_options" id="radio_twitter_options" style="display: none;">
            <div class="option_label">
               <input type="text" name="text_twitter_auth" id="text_twitter_auth" size="8" />
            </div><span class="explanation">(authorization token)</span>
            <br />
            <div class="option_label">
               <select name="select_twitter_location" id="select_twitter_location">

               </select>
            </div><span class="explanation">(location to filter data by)</span>
            <br />
            <div class="option_label">
               <select name="select_twitter_resolution" id="select_twitter_resolution">
                  <option value="daily" selected="selected">Daily</option>
                  <option value="weekly">Weekly</option>
               </select>
            </div><span class="explanation">(temporal resolution)</span>
            <br />
         </div>
         <div class="csv_options" id="radio_wiki_options" style="display: none;">
            <div class="option_label">
               <select name="select_wiki_article" id="select_wiki_article">

               </select>
            </div><span class="explanation">(article to filter data by)</span>
            <br />
            <div class="option_label">
               <select name="select_wiki_resolution" id="select_wiki_resolution">
                  <option value="daily" selected="selected">Daily</option>
                  <option value="weekly">Weekly</option>
               </select>
            </div><span class="explanation">(temporal resolution)</span>
            <br />
            <div class="option_label"><label><input type="checkbox" id="check_wiki_hour" /> Specific Hour</label></div><span class="explanation">(filter by hour of day, otherwise return sum of all counts)</span>
            <br />
            <div class="csv_options" id="check_wiki_hour_options" style="display: none;">
               <label><input type="text" id="text_wiki_hour" value="0" /> Which hour should be used? <span class="explanation">(0-23, timezone is UTC)</span></label>
            </div>
            <br />
         </div>
         <div class="csv_options" id="radio_cdc_options" style="display: none;">
            <div class="option_label">
               <input type="text" name="text_cdc_auth" id="text_cdc_auth" size="8" />
            </div><span class="explanation">(authorization token)</span>
            <br />
            <div class="option_label">
               <select name="select_cdc_location" id="select_cdc_location">

               </select>
            </div><span class="explanation">(location to filter data by)</span>
         </div>
         <div class="csv_options" id="radio_quidel_options" style="display: none;">
            <div class="option_label">
               <input type="text" name="text_quidel_auth" id="text_quidel_auth" size="8" />
            </div><span class="explanation">(authorization token)</span>
            <br />
            <div class="option_label">
               <select name="select_quidel_location" id="select_quidel_location">

               </select>
            </div><span class="explanation">(location to filter data by)</span>
         </div>
         <div class="csv_options" id="radio_nidss_flu_options" style="display: none;">
            <div class="option_label">
               <select name="select_nidss_flu_region" id="select_nidss_flu_region">

               </select>
            </div><span class="explanation">(region to filter data by)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="nidss_flu_issue_radio" id="radio_nidss_flu_recent" checked="checked" /> Most Recent Issue</label></div><span class="explanation">(fetch the most up-to-date/stable data)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="nidss_flu_issue_radio" id="radio_nidss_flu_static" /> Specific Issue</label></div><span class="explanation">(fetch data "as-of" a specific week)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="nidss_flu_issue_radio" id="radio_nidss_flu_offset" /> Lagged Data</label></div><span class="explanation">(fetch data lagged by a number of weeks)</span>
            <br />
            <div class="csv_options" id="radio_nidss_flu_recent_options">
               <span class="explanation">(this option has no additional parameters)</span>
               <br />
            </div>
            <div class="csv_options" id="radio_nidss_flu_static_options" style="display: none;">
               <div class="option_label"><label><input type="text" id="text_nidss_flu_static" value="201530" /> What week was the data published?</label></div> <span class="explanation">(format: YYYYWW)</span>
               <br />
            </div>
            <div class="csv_options" id="radio_nidss_flu_offset_options" style="display: none;">
               <div class="option_label"><label><input type="text" id="text_nidss_flu_offset" value="1" /> How many weeks is the data lagged by?</label></div> <span class="explanation">(a positive integer)</span>
               <br />
            </div>
         </div>
         <div class="csv_options" id="radio_nidss_dengue_options" style="display: none;">
            <div class="option_label">
               <select name="select_nidss_dengue_location" id="select_nidss_dengue_location">

               </select>
            </div><span class="explanation">(location to filter data by)</span>
         </div>
         <div class="csv_options" id="radio_sensors_options" style="display: none;">
            <div class="option_label">
               <input type="text" name="text_sensors_auth" id="text_sensors_auth" size="8" />
            </div><span class="explanation">(authorization token)</span>
            <br />
            <div class="option_label">
               <select name="select_sensors_name" id="select_sensors_name">

               </select>
            </div><span class="explanation">(data source from which signal is built)</span>
            <br />
            <div class="option_label">
               <select name="select_sensors_location" id="select_sensors_location">

               </select>
            </div><span class="explanation">(location to filter data by)</span>
         </div>
         <div class="csv_options" id="radio_nowcast_options" style="display: none;">
            <div class="option_label">
               <select name="select_nowcast_location" id="select_nowcast_location">

               </select>
            </div><span class="explanation">(location to filter data by)</span>
         </div>
         <div class="csv_options" id="radio_covid_hosp_options" style="display: none;">
            <div class="option_label">
               <select name="select_covid_hosp_state" id="select_covid_hosp_state">

               </select>
            </div><span class="explanation">(location to filter data by)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="covid_hosp_issue_radio" id="radio_covid_hosp_recent" checked="checked" /> Most Recent Issue</label></div><span class="explanation">(fetch the most up-to-date/stable data)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="covid_hosp_issue_radio" id="radio_covid_hosp_static" /> Specific Issue</label></div><span class="explanation">(fetch data "as-of" a specific date)</span>
            <br />
            <div class="csv_options" id="radio_covid_hosp_recent_options">
               <span class="explanation">(this option has no additional parameters)</span>
               <br />
            </div>
            <div class="csv_options" id="radio_covid_hosp_static_options" style="display: none;">
               <div class="option_label"><label><input type="text" id="text_covid_hosp_static" value="20201116" /> What date was the dataset published?</label></div> <span class="explanation">(format: YYYYMMDD)</span>
               <br />
            </div>
         </div>
         <div class="csv_options" id="radio_covidcast_options" style="display: none;">
            <div class="option_label">
               <select name="select_covidcast_source" id="select_covidcast_data_source">
               <!-- populated on page load using API endpoint `covidcast_meta` -->
               </select>
            </div><span class="explanation">(upstream data source)</span>
            <br />
            <div class="option_label">
               <select name="select_covidcast_signal" id="select_covidcast_signal">
               <!-- populated on page load using API endpoint `covidcast_meta` -->
               </select>
            </div><span class="explanation">(delphi indicator name)</span>
            <br />
            <div class="option_label">
               <select name="select_covidcast_geo_type" id="select_covidcast_geo_type">
               <!-- populated on page load using API endpoint `covidcast_meta` -->
               </select>
            </div><span class="explanation">(geographic resolution)</span>
            <br />
            <div class="option_label">
               <input type="text" name="text_covidcast_geo_value" id="text_covidcast_geo_value" />
            </div><span class="explanation">(location, e.g. 'PA' or '42003')</span>
            <br />
         </div>
         <input type="button" id="button_import_api" value="Fetch Data" />
      </div>