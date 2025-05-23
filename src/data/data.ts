export interface LabelValue {
  value: string;
  label: string;
}

const HHS_REGIONS: LabelValue[] = [
  { value: 'hhs1', label: 'HHS Region 1' },
  { value: 'hhs2', label: 'HHS Region 2' },
  { value: 'hhs3', label: 'HHS Region 3' },
  { value: 'hhs4', label: 'HHS Region 4' },
  { value: 'hhs5', label: 'HHS Region 5' },
  { value: 'hhs6', label: 'HHS Region 6' },
  { value: 'hhs7', label: 'HHS Region 7' },
  { value: 'hhs8', label: 'HHS Region 8' },
  { value: 'hhs9', label: 'HHS Region 9' },
  { value: 'hhs10', label: 'HHS Region 10' },
];

const CENSUS_REGIONS: LabelValue[] = [
  { value: 'cen1', label: 'Census Region 1' },
  { value: 'cen2', label: 'Census Region 2' },
  { value: 'cen3', label: 'Census Region 3' },
  { value: 'cen4', label: 'Census Region 4' },
  { value: 'cen5', label: 'Census Region 5' },
  { value: 'cen6', label: 'Census Region 6' },
  { value: 'cen7', label: 'Census Region 7' },
  { value: 'cen8', label: 'Census Region 8' },
  { value: 'cen9', label: 'Census Region 9' },
];

const US_STATES = [
  { value: 'AK', label: 'AK' },
  { value: 'AL', label: 'AL' },
  { value: 'AR', label: 'AR' },
  { value: 'AZ', label: 'AZ' },
  { value: 'CA', label: 'CA' },
  { value: 'CO', label: 'CO' },
  { value: 'CT', label: 'CT' },
  { value: 'DC', label: 'DC' },
  { value: 'DE', label: 'DE' },
  { value: 'FL', label: 'FL' },
  { value: 'GA', label: 'GA' },
  { value: 'HI', label: 'HI' },
  { value: 'IA', label: 'IA' },
  { value: 'ID', label: 'ID' },
  { value: 'IL', label: 'IL' },
  { value: 'IN', label: 'IN' },
  { value: 'KS', label: 'KS' },
  { value: 'KY', label: 'KY' },
  { value: 'LA', label: 'LA' },
  { value: 'MA', label: 'MA' },
  { value: 'MD', label: 'MD' },
  { value: 'ME', label: 'ME' },
  { value: 'MI', label: 'MI' },
  { value: 'MN', label: 'MN' },
  { value: 'MO', label: 'MO' },
  { value: 'MS', label: 'MS' },
  { value: 'MT', label: 'MT' },
  { value: 'NC', label: 'NC' },
  { value: 'ND', label: 'ND' },
  { value: 'NE', label: 'NE' },
  { value: 'NH', label: 'NH' },
  { value: 'NJ', label: 'NJ' },
  { value: 'NM', label: 'NM' },
  { value: 'NV', label: 'NV' },
  { value: 'NY', label: 'NY' },
  { value: 'OH', label: 'OH' },
  { value: 'OK', label: 'OK' },
  { value: 'OR', label: 'OR' },
  { value: 'PA', label: 'PA' },
  { value: 'RI', label: 'RI' },
  { value: 'SC', label: 'SC' },
  { value: 'SD', label: 'SD' },
  { value: 'TN', label: 'TN' },
  { value: 'TX', label: 'TX' },
  { value: 'UT', label: 'UT' },
  { value: 'VA', label: 'VA' },
  { value: 'VT', label: 'VT' },
  { value: 'WA', label: 'WA' },
  { value: 'WI', label: 'WI' },
  { value: 'WV', label: 'WV' },
  { value: 'WY', label: 'WY' },
];

const US_TERRITORIES = [
  { value: 'as', label: 'American Samoa' },
  { value: 'mp', label: 'Mariana Islands' },
  { value: 'gu', label: 'Guam' },
  { value: 'pr', label: 'Puerto Rico' },
  { value: 'vi', label: 'Virgin Islands' },
];

const US_CITIES = [
  { value: 'ord', label: 'Chicago' },
  { value: 'lax', label: 'Los Angeles' },
  { value: 'jfk', label: 'New York City' },
];

export const fluViewRegions: LabelValue[] = [
  { value: 'nat', label: 'U.S. National' },
  ...HHS_REGIONS,
  ...CENSUS_REGIONS,
  ...US_STATES,
  { value: 'ny_minus_jfk', label: 'NY (minus NYC)' },
  ...US_TERRITORIES,
  ...US_CITIES,
];

export const fluSurvRegions = [
  { value: 'network_all', label: 'Entire Network' },
  { value: 'network_eip', label: 'EIP Netowrk' },
  { value: 'network_ihsp', label: 'IHSP Network' },
  { value: 'CA', label: 'CA' },
  { value: 'CO', label: 'CO' },
  { value: 'CT', label: 'CT' },
  { value: 'GA', label: 'GA' },
  { value: 'IA', label: 'IA' },
  { value: 'ID', label: 'ID' },
  { value: 'MD', label: 'MD' },
  { value: 'MI', label: 'MI' },
  { value: 'MN', label: 'MN' },
  { value: 'NM', label: 'NM' },
  { value: 'NY_albany', label: 'NY (Albany)' },
  { value: 'NY_rochester', label: 'NY (Rochester)' },
  { value: 'OH', label: 'OH' },
  { value: 'OK', label: 'OK' },
  { value: 'OR', label: 'OR' },
  { value: 'RI', label: 'RI' },
  { value: 'SD', label: 'SD' },
  { value: 'TN', label: 'TN' },
  { value: 'UT', label: 'UT' },
];

export const gftLocations = [
  { value: 'nat', label: 'U.S. National' },
  ...HHS_REGIONS,
  ...US_STATES,
  { value: 'Albany_NY', label: 'Albany, NY' },
  { value: 'Albuquerque_NM', label: 'Albuquerque, NM' },
  { value: 'Anchorage_AK', label: 'Anchorage, AK' },
  { value: 'Arlington_VA', label: 'Arlington, VA' },
  { value: 'Atlanta_GA', label: 'Atlanta, GA' },
  { value: 'Austin_TX', label: 'Austin, TX' },
  { value: 'Baltimore_MD', label: 'Baltimore, MD' },
  { value: 'Baton_Rouge_LA', label: 'Baton Rouge, LA' },
  { value: 'Beaverton_OR', label: 'Beaverton, OR' },
  { value: 'Bellevue_WA', label: 'Bellevue, WA' },
  { value: 'Berkeley_CA', label: 'Berkeley, CA' },
  { value: 'Birmingham_AL', label: 'Birmingham, AL' },
  { value: 'Boise_ID', label: 'Boise, ID' },
  { value: 'Boston_MA', label: 'Boston, MA' },
  { value: 'Buffalo_NY', label: 'Buffalo, NY' },
  { value: 'Cary_NC', label: 'Cary, NC' },
  { value: 'Charlotte_NC', label: 'Charlotte, NC' },
  { value: 'Chicago_IL', label: 'Chicago, IL' },
  { value: 'Cleveland_OH', label: 'Cleveland, OH' },
  { value: 'Colorado_Springs_CO', label: 'Colorado Springs, CO' },
  { value: 'Columbia_SC', label: 'Columbia, SC' },
  { value: 'Columbus_OH', label: 'Columbus, OH' },
  { value: 'Dallas_TX', label: 'Dallas, TX' },
  { value: 'Dayton_OH', label: 'Dayton, OH' },
  { value: 'Denver_CO', label: 'Denver, CO' },
  { value: 'Des_Moines_IA', label: 'Des Moines, IA' },
  { value: 'Durham_NC', label: 'Durham, NC' },
  { value: 'Eugene_OR', label: 'Eugene, OR' },
  { value: 'Fresno_CA', label: 'Fresno, CA' },
  { value: 'Ft_Worth_TX', label: 'Ft Worth, TX' },
  { value: 'Gainesville_FL', label: 'Gainesville, FL' },
  { value: 'Grand_Rapids_MI', label: 'Grand Rapids, MI' },
  { value: 'Greensboro_NC', label: 'Greensboro, NC' },
  { value: 'Greenville_SC', label: 'Greenville, SC' },
  { value: 'Honolulu_HI', label: 'Honolulu, HI' },
  { value: 'Houston_TX', label: 'Houston, TX' },
  { value: 'Indianapolis_IN', label: 'Indianapolis, IN' },
  { value: 'Irvine_CA', label: 'Irvine, CA' },
  { value: 'Irving_TX', label: 'Irving, TX' },
  { value: 'Jacksonville_FL', label: 'Jacksonville, FL' },
  { value: 'Jackson_MS', label: 'Jackson, MS' },
  { value: 'Kansas_City_MO', label: 'Kansas City, MO' },
  { value: 'Knoxville_TN', label: 'Knoxville, TN' },
  { value: 'Las_Vegas_NV', label: 'Las Vegas, NV' },
  { value: 'Lexington_KY', label: 'Lexington, KY' },
  { value: 'Lincoln_NE', label: 'Lincoln, NE' },
  { value: 'Little_Rock_AR', label: 'Little Rock, AR' },
  { value: 'Los_Angeles_CA', label: 'Los Angeles, CA' },
  { value: 'Lubbock_TX', label: 'Lubbock, TX' },
  { value: 'Madison_WI', label: 'Madison, WI' },
  { value: 'Memphis_TN', label: 'Memphis, TN' },
  { value: 'Mesa_AZ', label: 'Mesa, AZ' },
  { value: 'Miami_FL', label: 'Miami, FL' },
  { value: 'Milwaukee_WI', label: 'Milwaukee, WI' },
  { value: 'Nashville_TN', label: 'Nashville, TN' },
  { value: 'Newark_NJ', label: 'Newark, NJ' },
  { value: 'New_Orleans_LA', label: 'New Orleans, LA' },
  { value: 'New_York_NY', label: 'New York, NY' },
  { value: 'Norfolk_VA', label: 'Norfolk, VA' },
  { value: 'Oakland_CA', label: 'Oakland, CA' },
  { value: 'Oklahoma_City_OK', label: 'Oklahoma City, OK' },
  { value: 'Omaha_NE', label: 'Omaha, NE' },
  { value: 'Orlando_FL', label: 'Orlando, FL' },
  { value: 'Philadelphia_PA', label: 'Philadelphia, PA' },
  { value: 'Phoenix_AZ', label: 'Phoenix, AZ' },
  { value: 'Pittsburgh_PA', label: 'Pittsburgh, PA' },
  { value: 'Plano_TX', label: 'Plano, TX' },
  { value: 'Portland_OR', label: 'Portland, OR' },
  { value: 'Providence_RI', label: 'Providence, RI' },
  { value: 'Raleigh_NC', label: 'Raleigh, NC' },
  { value: 'Reno_NV', label: 'Reno, NV' },
  { value: 'Reston_VA', label: 'Reston, VA' },
  { value: 'Richmond_VA', label: 'Richmond, VA' },
  { value: 'Rochester_NY', label: 'Rochester, NY' },
  { value: 'Roswell_GA', label: 'Roswell, GA' },
  { value: 'Sacramento_CA', label: 'Sacramento, CA' },
  { value: 'Salt_Lake_City_UT', label: 'Salt Lake City, UT' },
  { value: 'Santa_Clara_CA', label: 'Santa Clara, CA' },
  { value: 'San_Antonio_TX', label: 'San Antonio, TX' },
  { value: 'San_Diego_CA', label: 'San Diego, CA' },
  { value: 'San_Francisco_CA', label: 'San Francisco, CA' },
  { value: 'San_Jose_CA', label: 'San Jose, CA' },
  { value: 'Scottsdale_AZ', label: 'Scottsdale, AZ' },
  { value: 'Seattle_WA', label: 'Seattle, WA' },
  { value: 'Somerville_MA', label: 'Somerville, MA' },
  { value: 'Spokane_WA', label: 'Spokane, WA' },
  { value: 'Springfield_MO', label: 'Springfield, MO' },
  { value: 'State_College_PA', label: 'State College, PA' },
  { value: 'St_Louis_MO', label: 'St Louis, MO' },
  { value: 'St_Paul_MN', label: 'St Paul, MN' },
  { value: 'Sunnyvale_CA', label: 'Sunnyvale, CA' },
  { value: 'Tampa_FL', label: 'Tampa, FL' },
  { value: 'Tempe_AZ', label: 'Tempe, AZ' },
  { value: 'Tucson_AZ', label: 'Tucson, AZ' },
  { value: 'Tulsa_OK', label: 'Tulsa, OK' },
  { value: 'Washington_DC', label: 'Washington, DC' },
  { value: 'Wichita_KS', label: 'Wichita, KS' },
];

export const ghtLocations = [{ value: 'US', label: 'U.S. National' }, ...US_STATES];

export const twitterLocations = [
  { value: 'nat', label: 'U.S. National' },
  ...HHS_REGIONS,
  ...CENSUS_REGIONS,
  ...US_STATES,
];

export const wikiArticles = [
  { value: 'amantadine', label: 'amantadine' },
  { value: 'antiviral_drugs', label: 'antiviral drugs' },
  { value: 'avian_influenza', label: 'avian influenza' },
  { value: 'canine_influenza', label: 'canine influenza' },
  { value: 'cat_flu', label: 'cat flu' },
  { value: 'chills', label: 'chills' },
  { value: 'common_cold', label: 'common cold' },
  { value: 'cough', label: 'cough' },
  { value: 'equine_influenza', label: 'equine influenza' },
  { value: 'fatigue_(medical)', label: 'fatigue (medical)' },
  { value: 'fever', label: 'fever' },
  { value: 'flu_season', label: 'flu season' },
  { value: 'gastroenteritis', label: 'gastroenteritis' },
  { value: 'headache', label: 'headache' },
  { value: 'hemagglutinin_(influenza)', label: 'hemagglutinin (influenza)' },
  { value: 'human_flu', label: 'human flu' },
  { value: 'influenza', label: 'influenza' },
  { value: 'influenzalike_illness', label: 'influenzalike illness' },
  { value: 'influenzavirus_a', label: 'influenzavirus a' },
  { value: 'influenzavirus_c', label: 'influenzavirus c' },
  { value: 'influenza_a_virus', label: 'influenza a virus' },
  { value: 'influenza_a_virus_subtype_h10n7', label: 'influenza a virus subtype h10n7' },
  { value: 'influenza_a_virus_subtype_h1n1', label: 'influenza a virus subtype h1n1' },
  { value: 'influenza_a_virus_subtype_h1n2', label: 'influenza a virus subtype h1n2' },
  { value: 'influenza_a_virus_subtype_h2n2', label: 'influenza a virus subtype h2n2' },
  { value: 'influenza_a_virus_subtype_h3n2', label: 'influenza a virus subtype h3n2' },
  { value: 'influenza_a_virus_subtype_h3n8', label: 'influenza a virus subtype h3n8' },
  { value: 'influenza_a_virus_subtype_h5n1', label: 'influenza a virus subtype h5n1' },
  { value: 'influenza_a_virus_subtype_h7n2', label: 'influenza a virus subtype h7n2' },
  { value: 'influenza_a_virus_subtype_h7n3', label: 'influenza a virus subtype h7n3' },
  { value: 'influenza_a_virus_subtype_h7n7', label: 'influenza a virus subtype h7n7' },
  { value: 'influenza_a_virus_subtype_h7n9', label: 'influenza a virus subtype h7n9' },
  { value: 'influenza_a_virus_subtype_h9n2', label: 'influenza a virus subtype h9n2' },
  { value: 'influenza_b_virus', label: 'influenza b virus' },
  { value: 'influenza_pandemic', label: 'influenza pandemic' },
  { value: 'influenza_prevention', label: 'influenza prevention' },
  { value: 'influenza_vaccine', label: 'influenza vaccine' },
  { value: 'malaise', label: 'malaise' },
  { value: 'myalgia', label: 'myalgia' },
  { value: 'nasal_congestion', label: 'nasal congestion' },
  { value: 'nausea', label: 'nausea' },
  { value: 'neuraminidase_inhibitor', label: 'neuraminidase inhibitor' },
  { value: 'orthomyxoviridae', label: 'orthomyxoviridae' },
  { value: 'oseltamivir', label: 'oseltamivir' },
  { value: 'paracetamol', label: 'paracetamol' },
  { value: 'rhinorrhea', label: 'rhinorrhea' },
  { value: 'rimantadine', label: 'rimantadine' },
  { value: 'shivering', label: 'shivering' },
  { value: 'sore_throat', label: 'sore throat' },
  { value: 'swine_influenza', label: 'swine influenza' },
  { value: 'total', label: 'total' },
  { value: 'viral_neuraminidase', label: 'viral neuraminidase' },
  { value: 'viral_pneumonia', label: 'viral pneumonia' },
  { value: 'vomiting', label: 'vomiting' },
  { value: 'zanamivir', label: 'zanamivir' },
];

export const cdcLocations = [{ value: 'nat', label: 'U.S. National' }, ...HHS_REGIONS, ...CENSUS_REGIONS, ...US_STATES];

export const quidelLocations = [...HHS_REGIONS];

export const nidssFluLocations = [
  { value: 'nationwide', label: 'Taiwan National' },
  { value: 'central', label: 'Central' },
  { value: 'eastern', label: 'Eastern' },
  { value: 'kaoping', label: 'Kaoping' },
  { value: 'northern', label: 'Northern' },
  { value: 'southern', label: 'Southern' },
  { value: 'taipei', label: 'Taipei' },
];

export const nidssDengueLocations = [
  { value: 'nationwide', label: 'Taiwan National' },
  { value: 'central', label: 'Central' },
  { value: 'eastern', label: 'Eastern' },
  { value: 'kaoping', label: 'Kaoping' },
  { value: 'northern', label: 'Northern' },
  { value: 'southern', label: 'Southern' },
  { value: 'taipei', label: 'Taipei' },
  { value: 'changhua_county', label: 'Changhua County' },
  { value: 'chiayi_city', label: 'Chiayi City' },
  { value: 'chiayi_county', label: 'Chiayi County' },
  { value: 'hsinchu_city', label: 'Hsinchu City' },
  { value: 'hsinchu_county', label: 'Hsinchu County' },
  { value: 'hualien_county', label: 'Hualien County' },
  { value: 'kaohsiung_city', label: 'Kaohsiung City' },
  { value: 'keelung_city', label: 'Keelung City' },
  { value: 'kinmen_county', label: 'Kinmen County' },
  { value: 'lienchiang_county', label: 'Lienchiang County' },
  { value: 'miaoli_county', label: 'Miaoli County' },
  { value: 'nantou_county', label: 'Nantou County' },
  { value: 'new_taipei_city', label: 'New taipei City' },
  { value: 'penghu_county', label: 'Penghu County' },
  { value: 'pingtung_county', label: 'Pingtung County' },
  { value: 'taichung_city', label: 'Taichung City' },
  { value: 'tainan_city', label: 'Tainan City' },
  { value: 'taipei_city', label: 'Taipei City' },
  { value: 'taitung_county', label: 'Taitung County' },
  { value: 'taoyuan_city', label: 'Taoyuan City' },
  { value: 'yilan_county', label: 'Yilan County' },
  { value: 'yunlin_county', label: 'Yunlin County' },
];

export const sensorNames = [
  { value: 'gft', label: 'gft' },
  { value: 'ght', label: 'ght' },
  { value: 'ghtj', label: 'ghtj' },
  { value: 'twtr', label: 'twtr' },
  { value: 'wiki', label: 'wiki' },
  { value: 'cdc', label: 'cdc' },
  { value: 'quid', label: 'quid' },
  { value: 'epic', label: 'epic' },
  { value: 'sar3', label: 'sar3' },
  { value: 'arch', label: 'arch' },
];

export const sensorLocations = fluViewRegions;

export const nowcastLocations = fluViewRegions;

export const covidHospLocations = [
  ...US_STATES,
  { value: 'DC', label: 'District of Columbia' },
  { value: 'PR', label: 'Puerto Rico' },
  { value: 'VI', label: 'Virgin Islands' },
];

// first available epiweek for each data source
export const firstEpiWeek = {
  fluview: 199740,
  flusurv: 200340,
  gft: 200340,
  ght: 200401,
  twitter: 201148,
  wiki: 200750,
  nidss_flu: 200814,
  nidss_dengue: 200301,
  cdc: 201301,
  quidel: 201535,
  sensors: 201030,
  nowcast: 200901,
  covidcast: 202001,
};

// first available date for each data source
export const firstDate = {
  twitter: 20111201,
  wiki: 20071209,
  covidcast: 20170815,
  covid_hosp: 20200101,
};
