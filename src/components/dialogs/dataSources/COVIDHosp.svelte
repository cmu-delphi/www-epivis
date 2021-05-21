<script lang="ts">
  import { currentDate, epiRange, loadDataSet } from '../../../api/EpiData';
  import { firstDate, covidHospLocations as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import SelectIssue from '../inputs/SelectIssue.svelte';
  import { DEFAULT_ISSUE } from '../utils';

  export let id: string;

  let states = regions[0].value;
  let issue = DEFAULT_ISSUE;

  export function importDataSet() {
    const regionLabel = regions.find((d) => d.value === states)?.label ?? '?';
    let title = `[API] COVID Hospitalization: ${regionLabel}`;
    if (issue.issues != null) {
      title += ` (issued on: ${issue.issues})`;
    } else {
      title += ' (most recent issue)';
    }
    return loadDataSet(
      title,
      'covid_hosp_state_timeseries',
      {
        dates: epiRange(firstDate.covid_hosp, currentDate),
      },
      {
        states,
        ...issue,
      },
      [
        'hospital_onset_covid',
        'hospital_onset_covid_coverage',
        'inpatient_beds',
        'inpatient_beds_coverage',
        'inpatient_beds_used',
        'inpatient_beds_used_coverage',
        'inpatient_beds_used_covid',
        'inpatient_beds_used_covid_coverage',
        'previous_day_admission_adult_covid_confirmed',
        'previous_day_admission_adult_covid_confirmed_coverage',
        'previous_day_admission_adult_covid_suspected',
        'previous_day_admission_adult_covid_suspected_coverage',
        'previous_day_admission_pediatric_covid_confirmed',
        'previous_day_admission_pediatric_covid_confirmed_coverage',
        'previous_day_admission_pediatric_covid_suspected',
        'previous_day_admission_pediatric_covid_suspected_coverage',
        'staffed_adult_icu_bed_occupancy',
        'staffed_adult_icu_bed_occupancy_coverage',
        'staffed_icu_adult_patients_confirmed_suspected_covid',
        'staffed_icu_adult_patients_confirmed_suspected_covid_coverage',
        'staffed_icu_adult_patients_confirmed_covid',
        'staffed_icu_adult_patients_confirmed_covid_coverage',
        'total_adult_patients_hosp_confirmed_suspected_covid',
        'total_adult_patients_hosp_confirmed_suspected_covid_coverage',
        'total_adult_patients_hosp_confirmed_covid',
        'total_adult_patients_hosp_confirmed_covid_coverage',
        'total_pediatric_patients_hosp_confirmed_suspected_covid',
        'total_pediatric_patients_hosp_confirmed_suspected_covid_coverage',
        'total_pediatric_patients_hosp_confirmed_covid',
        'total_pediatric_patients_hosp_confirmed_covid_coverage',
        'total_staffed_adult_icu_beds',
        'total_staffed_adult_icu_beds_coverage',
        'inpatient_beds_utilization',
        'inpatient_beds_utilization_coverage',
        'inpatient_beds_utilization_numerator',
        'inpatient_beds_utilization_denominator',
        'percent_of_inpatients_with_covid',
        'percent_of_inpatients_with_covid_coverage',
        'percent_of_inpatients_with_covid_numerator',
        'percent_of_inpatients_with_covid_denominator',
        'inpatient_bed_covid_utilization',
        'inpatient_bed_covid_utilization_coverage',
        'inpatient_bed_covid_utilization_numerator',
        'inpatient_bed_covid_utilization_denominator',
        'adult_icu_bed_covid_utilization',
        'adult_icu_bed_covid_utilization_coverage',
        'adult_icu_bed_covid_utilization_numerator',
        'adult_icu_bed_covid_utilization_denominator',
        'adult_icu_bed_utilization',
        'adult_icu_bed_utilization_coverage',
        'adult_icu_bed_utilization_numerator',
        'adult_icu_bed_utilization_denominator',
      ],
    );
  }
</script>

<SelectField id="{id}-r" label="State" bind:value={states} options={regions} />
<SelectIssue {id} bind:value={issue} hasLag={false} hasIssueDay />
