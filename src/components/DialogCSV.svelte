<div id="dialog_csv" class="box_dialog">
         <h1>Load from CSV File</h1>
         <label><input type="file" id="file_local" /> Select Local File</label>
         <br />
         <textarea id="preview_box" placeholder="Select a file above to preview its contents." readonly="readonly" rows="5" wrap="off" style="width: 100%;"></textarea>
         <br />
         <div class="option_label"><label><input type="checkbox" id="check_transpose" /> Transpose</label></div><span class="explanation">(treat rows as columns and vice versa)</span>
         <br />
         <div class="option_label"><label><input type="checkbox" id="check_header" checked="checked" /> Has Header Row</label></div><span class="explanation">(extract column names, then discard first row)</span>
         <br />
         <div class="option_label"><label><input type="checkbox" id="check_date" checked="checked" /> Has Date Column</label></div><span class="explanation">(otherwise assume daily starting on 2000-01-01)</span>
         <div class="csv_options" id="check_date_options">
            <div class="option_label"><label><input type="radio" name="date_radio" id="radio_simple" checked="checked" /> Date String</label></div><span class="explanation">(format: YYYY-MM-DD; ex: 2015-05-02)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="date_radio" id="radio_epiweek" /> Epiweek</label></div><span class="explanation">(format: YYYYWW; ex: 201522)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="date_radio" id="radio_epi" /> Epi Week</label></div><span class="explanation">(format: YYYY, WW; ex: 2015, 22)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="date_radio" id="radio_decimal" /> Decimal Date</label></div><span class="explanation">(format: YYYY.YYY; ex: 2015.456)</span>
            <br />
            <div class="option_label"><label><input type="radio" name="date_radio" id="radio_monthly" /> Monthly Data</label></div><span class="explanation">(format: YYYY, MM; ex: 2015, 05)</span>
            <br /><span class="explanation">(all columns are zero-indexed)</span>
            <div class="csv_options" id="radio_simple_options">
               <label><input type="text" id="text_simple_0" value="0" /> Which column contains dates?</label>
            </div>
            <div class="csv_options" id="radio_epiweek_options" style="display: none;">
               <label><input type="text" id="text_epiweek_0" value="0" /> Which column contains the epiweek?</label>
            </div>
            <div class="csv_options" id="radio_epi_options" style="display: none;">
               <label><input type="text" id="text_epi_0" value="2" /> Which column contains the epi year?</label>
               <br />
               <label><input type="text" id="text_epi_1" value="3" /> Which column contains the epi week?</label>
            </div>
            <div class="csv_options" id="radio_decimal_options" style="display: none;">
               <label><input type="text" id="text_decimal_0" value="0" /> Which column contains dates?</label>
            </div>
            <div class="csv_options" id="radio_monthly_options" style="display: none;">
               <label><input type="text" id="text_monthly_0" value="0" /> Which column contains the year?</label>
               <br />
               <label><input type="text" id="text_monthly_1" value="1" /> Which column contains the month?</label>
            </div>
         </div>
         <br />
         <div class="option_label"><label><input type="checkbox" id="check_group" /> Group By</label></div><span class="explanation">(for when multiple overlapping time series are in the same file; ex: FluView Regional data)</span>
         <div class="csv_options" id="check_group_options" style="display: none;">
            <label><input type="text" id="text_group_0" value="1" /> Which column should be grouped?</label>
         </div>
         <br />
         <br />
         <input type="button" id="button_import_csv" value="Import CSV" />
      </div>