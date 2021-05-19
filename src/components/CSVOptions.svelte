

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