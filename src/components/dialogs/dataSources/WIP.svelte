
  <div class="csv_options" id="radio_cdc_options" style="display: none;">
    <div class="option_label">
      <input type="text" name="text_cdc_auth" id="text_cdc_auth" size="8" />
    </div>
    <span class="explanation">(authorization token)</span>
    <br />
    <div class="option_label">
      <select name="select_cdc_location" id="select_cdc_location" />
    </div>
    <span class="explanation">(location to filter data by)</span>
  </div>

  <div class="csv_options" id="radio_quidel_options" style="display: none;">
    <div class="option_label">
      <input type="text" name="text_quidel_auth" id="text_quidel_auth" size="8" />
    </div>
    <span class="explanation">(authorization token)</span>
    <br />
    <div class="option_label">
      <select name="select_quidel_location" id="select_quidel_location" />
    </div>
    <span class="explanation">(location to filter data by)</span>
  </div>
  <div class="csv_options" id="radio_nidss_flu_options" style="display: none;">
    <div class="option_label">
      <select name="select_nidss_flu_region" id="select_nidss_flu_region" />
    </div>
    <span class="explanation">(region to filter data by)</span>
    <br />
    <div class="option_label">
      <label
        ><input type="radio" name="nidss_flu_issue_radio" id="radio_nidss_flu_recent" checked /> Most Recent Issue</label
      >
    </div>
    <span class="explanation">(fetch the most up-to-date/stable data)</span>
    <br />
    <div class="option_label">
      <label><input type="radio" name="nidss_flu_issue_radio" id="radio_nidss_flu_static" /> Specific Issue</label>
    </div>
    <span class="explanation">(fetch data "as-of" a specific week)</span>
    <br />
    <div class="option_label">
      <label><input type="radio" name="nidss_flu_issue_radio" id="radio_nidss_flu_offset" /> Lagged Data</label>
    </div>
    <span class="explanation">(fetch data lagged by a number of weeks)</span>
    <br />
    <div class="csv_options" id="radio_nidss_flu_recent_options">
      <span class="explanation">(this option has no additional parameters)</span>
      <br />
    </div>
    <div class="csv_options" id="radio_nidss_flu_static_options" style="display: none;">
      <div class="option_label">
        <label><input type="text" id="text_nidss_flu_static" value="201530" /> What week was the data published?</label>
      </div>
      <span class="explanation">(format: YYYYWW)</span>
      <br />
    </div>
    <div class="csv_options" id="radio_nidss_flu_offset_options" style="display: none;">
      <div class="option_label">
        <label><input type="text" id="text_nidss_flu_offset" value="1" /> How many weeks is the data lagged by?</label>
      </div>
      <span class="explanation">(a positive integer)</span>
      <br />
    </div>
  </div>
  <div class="csv_options" id="radio_nidss_dengue_options" style="display: none;">
    <div class="option_label">
      <select name="select_nidss_dengue_location" id="select_nidss_dengue_location" />
    </div>
    <span class="explanation">(location to filter data by)</span>
  </div>
  <div class="csv_options" id="radio_sensors_options" style="display: none;">
    <div class="option_label">
      <input type="text" name="text_sensors_auth" id="text_sensors_auth" size="8" />
    </div>
    <span class="explanation">(authorization token)</span>
    <br />
    <div class="option_label">
      <select name="select_sensors_name" id="select_sensors_name" />
    </div>
    <span class="explanation">(data source from which signal is built)</span>
    <br />
    <div class="option_label">
      <select name="select_sensors_location" id="select_sensors_location" />
    </div>
    <span class="explanation">(location to filter data by)</span>
  </div>
  <div class="csv_options" id="radio_nowcast_options" style="display: none;">
    <div class="option_label">
      <select name="select_nowcast_location" id="select_nowcast_location" />
    </div>
    <span class="explanation">(location to filter data by)</span>
  </div>
  <div class="csv_options" id="radio_covid_hosp_options" style="display: none;">
    <div class="option_label">
      <select name="select_covid_hosp_state" id="select_covid_hosp_state" />
    </div>
    <span class="explanation">(location to filter data by)</span>
    <br />
    <div class="option_label">
      <label
        ><input type="radio" name="covid_hosp_issue_radio" id="radio_covid_hosp_recent" checked /> Most Recent Issue</label
      >
    </div>
    <span class="explanation">(fetch the most up-to-date/stable data)</span>
    <br />
    <div class="option_label">
      <label><input type="radio" name="covid_hosp_issue_radio" id="radio_covid_hosp_static" /> Specific Issue</label>
    </div>
    <span class="explanation">(fetch data "as-of" a specific date)</span>
    <br />
    <div class="csv_options" id="radio_covid_hosp_recent_options">
      <span class="explanation">(this option has no additional parameters)</span>
      <br />
    </div>
    <div class="csv_options" id="radio_covid_hosp_static_options" style="display: none;">
      <div class="option_label">
        <label
          ><input type="text" id="text_covid_hosp_static" value="20201116" /> What date was the dataset published?</label
        >
      </div>
      <span class="explanation">(format: YYYYMMDD)</span>
      <br />
    </div>
  </div>
  <div class="csv_options" id="radio_covidcast_options" style="display: none;">
    <div class="option_label">
      <select name="select_covidcast_source" id="select_covidcast_data_source">
        <!-- populated on page load using API endpoint `covidcast_meta` -->
      </select>
    </div>
    <span class="explanation">(upstream data source)</span>
    <br />
    <div class="option_label">
      <select name="select_covidcast_signal" id="select_covidcast_signal">
        <!-- populated on page load using API endpoint `covidcast_meta` -->
      </select>
    </div>
    <span class="explanation">(delphi indicator name)</span>
    <br />
    <div class="option_label">
      <select name="select_covidcast_geo_type" id="select_covidcast_geo_type">
        <!-- populated on page load using API endpoint `covidcast_meta` -->
      </select>
    </div>
    <span class="explanation">(geographic resolution)</span>
    <br />
    <div class="option_label">
      <input type="text" name="text_covidcast_geo_value" id="text_covidcast_geo_value" />
    </div>
    <span class="explanation">(location, e.g. 'PA' or '42003')</span>
    <br />
  </div>