<div id="dialog_draw" class="box_dialog">
         <h1>Add Custom Line</h1>
         <div class="option_label"><label><input type="text" name="draw_title" id="draw_title" value="My Line" /> Descriptive Name</label></div><span class="explanation">(short string)</span>
         <br />
         <br />
         <div class="option_label"><label><input type="text" name="draw_date1" id="draw_date1" size="10" maxlength="10" value="2014-01-01" /> Start Date</label></div><span class="explanation">(format is YYYY-MM-DD or YYYYWW)</span>
         <br />
         <div class="option_label"><label><input type="text" name="draw_value1" id="draw_value1" size="10" maxlength="10" value="0" /> Start Value</label></div><span class="explanation">(any floating point number)</span>
         <br />
         <br />
         <div class="option_label"><label><input type="text" name="draw_date2" id="draw_date2" size="10" maxlength="10" value="2015-01-01" /> End Date</label></div><span class="explanation">(format is YYYY-MM-DD or YYYYWW)</span>
         <br />
         <div class="option_label"><label><input type="text" name="draw_value2" id="draw_value2" size="10" maxlength="10" value="1" /> End Value</label></div><span class="explanation">(any floating point number)</span>
         <br />
         <br /><span class="explanation">Tip: you can make a vertical line by using the same date at both endpoints!</span><br />
         <br />
         <input type="button" id="button_draw_line" value="Draw Line" />
      </div>