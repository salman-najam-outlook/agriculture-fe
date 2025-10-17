import { getCountries } from "country-state-picker";
export let countries = [
{
    Name: 'Afghanistan',
    Code: 'AF',
    Timezone: 'Afghanistan Standard Time',
    UTC: 'UTC+04:30',
    MobileCode: 93
}, {
    Name: 'Åland Islands',
    Code: 'AX',
    Timezone: 'FLE Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: '358-18'
}, {
    Name: 'Albania',
    Code: 'AL',
    Timezone: 'Central Europe Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 355
}, {
    Name: 'Algeria',
    Code: 'DZ',
    Timezone: 'W. Central Africa Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 213
}, {
    Name: 'American Samoa',
    Code: 'AS',
    Timezone: 'UTC-11',
    UTC: 'UTC-11:00',
    MobileCode: '1-684'
}, {
    Name: 'Andorra',
    Code: 'AD',
    Timezone: 'W. Europe Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 376
}, {
    Name: 'Angola',
    Code: 'AO',
    Timezone: 'W. Central Africa Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 244
}, {
    Name: 'Anguilla',
    Code: 'AI',
    Timezone: 'SA Western Standard Time',
    UTC: 'UTC-04:00',
    MobileCode: '1-264'
},
{
    Name: 'Antigua and Barbuda',
    Code: 'AG',
    Timezone: 'SA Western Standard Time',
    UTC: 'UTC-04:00',
    MobileCode: '1-268'
}, {
    Name: 'Argentina',
    Code: 'AR',
    Timezone: 'Argentina Standard Time',
    UTC: 'UTC-03:00',
    MobileCode: 54
}, {
    Name: 'Armenia',
    Code: 'AM',
    Timezone: 'Caucasus Standard Time',
    UTC: 'UTC+04:00',
    MobileCode: 374
}, {
    Name: 'Aruba',
    Code: 'AW',
    Timezone: 'SA Western Standard Time',
    UTC: 'UTC-04:00',
    MobileCode: 297
}, {
    Name: 'Australia',
    Code: 'AU',
    Timezone: 'AUS Eastern Standard Time',
    UTC: 'UTC+10:00',
    MobileCode: 61
}, {
    Name: 'Austria',
    Code: 'AT',
    Timezone: 'W. Europe Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 43
}, {
    Name: 'Azerbaijan',
    Code: 'AZ',
    Timezone: 'Azerbaijan Standard Time',
    UTC: 'UTC+04:00',
    MobileCode: 994
}, {
    Name: 'Bahamas, The',
    Code: 'BS',
    Timezone: 'Eastern Standard Time',
    UTC: 'UTC-05:00',
    MobileCode: '1-242'
}, {
    Name: 'Bahrain',
    Code: 'BH',
    Timezone: 'Arab Standard Time',
    UTC: 'UTC+03:00',
    MobileCode: 973
}, {
    Name: 'Bangladesh',
    Code: 'BD',
    Timezone: 'Bangladesh Standard Time',
    UTC: 'UTC+06:00',
    MobileCode: 880
}, {
    Name: 'Barbados',
    Code: 'BB',
    Timezone: 'SA Western Standard Time',
    UTC: 'UTC-04:00',
    MobileCode: '1-246'
}, {
    Name: 'Belarus',
    Code: 'BY',
    Timezone: 'Belarus Standard Time',
    UTC: 'UTC+03:00',
    MobileCode: 375
}, {
    Name: 'Belgium',
    Code: 'BE',
    Timezone: 'Romance Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 32
}, {
    Name: 'Belize',
    Code: 'BZ',
    Timezone: 'Central America Standard Time',
    UTC: 'UTC-06:00',
    MobileCode: 501
}, {
    Name: 'Benin',
    Code: 'BJ',
    Timezone: 'W. Central Africa Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 229
}, {
    Name: 'Bermuda',
    Code: 'BM',
    Timezone: 'Atlantic Standard Time',
    UTC: 'UTC-04:00',
    MobileCode: '1-441'
}, {
    Name: 'Bhutan',
    Code: 'BT',
    Timezone: 'Bangladesh Standard Time',
    UTC: 'UTC+06:00',
    MobileCode: 975
}, {
    Name: 'Bolivarian Republic of Venezuela',
    Code: 'VE',
    Timezone: 'Venezuela Standard Time',
    UTC: 'UTC-04:30',
    MobileCode: 58
}, {
    Name: 'Bolivia',
    Code: 'BO',
    Timezone: 'SA Western Standard Time',
    UTC: 'UTC-04:00',
    MobileCode: 591
}, {
    Name: 'Bonaire, Sint Eustatius and Saba',
    Code: 'BQ',
    Timezone: 'SA Western Standard Time',
    UTC: 'UTC-04:00',
    MobileCode: 599
}, {
    Name: 'Bosnia and Herzegovina',
    Code: 'BA',
    Timezone: 'Central European Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 387
}, {
    Name: 'Botswana',
    Code: 'BW',
    Timezone: 'South Africa Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 267
}, 
{
    Name: 'Brazil',
    Code: 'BR',
    Timezone: 'E. South America Standard Time',
    UTC: 'UTC-03:00',
    MobileCode: 55
},{
    Name: 'British Indian Ocean Territory',
    Code: 'IO',
    Timezone: 'Central Asia Standard Time',
    UTC: 'UTC+06:00',
    MobileCode: 246
}, {
    Name: 'Brunei',
    Code: 'BN',
    Timezone: 'Singapore Standard Time',
    UTC: 'UTC+08:00',
    MobileCode: 673
}, {
    Name: 'Bulgaria',
    Code: 'BG',
    Timezone: 'FLE Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 359
}, {
    Name: 'Burkina Faso',
    Code: 'BF',
    Timezone: 'Greenwich Standard Time',
    UTC: 'UTC',
    MobileCode: 226
}, {
    Name: 'Burundi',
    Code: 'BI',
    Timezone: 'South Africa Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 257
}, {
    Name: 'Cabo Verde',
    Code: 'CV',
    Timezone: 'Cape Verde Standard Time',
    UTC: 'UTC-01:00',
    MobileCode: 238
}, {
    Name: 'Cambodia',
    Code: 'KH',
    Timezone: 'SE Asia Standard Time',
    UTC: 'UTC+07:00',
    MobileCode: 855
}, {
    Name: 'Cameroon',
    Code: 'CM',
    Timezone: 'W. Central Africa Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 237
}, {
    Name: 'United States/Canada',
    Code: 'CA',
    Timezone: 'Eastern Standard Time',
    UTC: 'UTC-05:00',
    MobileCode: 1
}, {
    Name: 'Cayman Islands',
    Code: 'KY',
    Timezone: 'SA Pacific Standard Time',
    UTC: 'UTC-05:00',
    MobileCode: '1-345'
}, {
    Name: 'Central African Republic',
    Code: 'CF',
    Timezone: 'W. Central Africa Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 236
}, {
    Name: 'Chad',
    Code: 'TD',
    Timezone: 'W. Central Africa Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 235
}, {
    Name: 'Chile',
    Code: 'CL',
    Timezone: 'Pacific SA Standard Time',
    UTC: 'UTC-03:00',
    MobileCode: 56
}, {
    Name: 'China',
    Code: 'CN',
    Timezone: 'China Standard Time',
    UTC: 'UTC+08:00',
    MobileCode: 86
}, {
    Name: 'Christmas Island',
    Code: 'CX',
    Timezone: 'SE Asia Standard Time',
    UTC: 'UTC+07:00',
    MobileCode: 61
}, {
    Name: 'Cocos (Keeling) Islands',
    Code: 'CC',
    Timezone: 'Myanmar Standard Time',
    UTC: 'UTC+06:30',
    MobileCode: 61
}, {
    Name: 'Colombia',
    Code: 'CO',
    Timezone: 'SA Pacific Standard Time',
    UTC: 'UTC-05:00',
    MobileCode: 57
}, {
    Name: 'Comoros',
    Code: 'KM',
    Timezone: 'E. Africa Standard Time',
    UTC: 'UTC+03:00',
    MobileCode: 269
}, {
    Name: 'Congo',
    Code: 'CG',
    Timezone: 'W. Central Africa Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 242
}, {
    Name: 'Congo (DRC)',
    Code: 'CD',
    Timezone: 'W. Central Africa Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 243
}, {
    Name: 'Cook Islands',
    Code: 'CK',
    Timezone: 'Hawaiian Standard Time',
    UTC: 'UTC-10:00',
    MobileCode: 682
}, {
    Name: 'Costa Rica',
    Code: 'CR',
    Timezone: 'Central America Standard Time',
    UTC: 'UTC-06:00',
    MobileCode: 506
}, {
    Name: "Côte d'Ivoire",
    Code: 'CI',
    Timezone: 'Greenwich Standard Time',
    UTC: 'UTC',
    MobileCode: 225
}, {
    Name: 'Croatia',
    Code: 'HR',
    Timezone: 'Central European Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 385
}, {
    Name: 'Cuba',
    Code: 'CU',
    Timezone: 'Eastern Standard Time',
    UTC: 'UTC-05:00',
    MobileCode: 53
}, {
    Name: 'Curaçao',
    Code: 'CW',
    Timezone: 'SA Western Standard Time',
    UTC: 'UTC-04:00',
    MobileCode: 599
}, {
    Name: 'Cyprus',
    Code: 'CY',
    Timezone: 'E. Europe Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 357
}, {
    Name: 'Czech Republic',
    Code: 'CZ',
    Timezone: 'Central Europe Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 420
}, {
    Name: 'Democratic Republic of Timor-Leste',
    Code: 'TL',
    Timezone: 'Tokyo Standard Time',
    UTC: 'UTC+09:00',
    MobileCode: 670
}, {
    Name: 'Denmark',
    Code: 'DK',
    Timezone: 'Romance Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 45
}, {
    Name: 'Djibouti',
    Code: 'DJ',
    Timezone: 'E. Africa Standard Time',
    UTC: 'UTC+03:00',
    MobileCode: 253
}, {
    Name: 'Dominica',
    Code: 'DM',
    Timezone: 'SA Western Standard Time',
    UTC: 'UTC-04:00',
    MobileCode: '1-767'
}, {
    Name: 'Ecuador',
    Code: 'EC',
    Timezone: 'SA Pacific Standard Time',
    UTC: 'UTC-05:00',
    MobileCode: 593
}, {
    Name: 'Egypt',
    Code: 'EG',
    Timezone: 'Egypt Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 20
}, {
    Name: 'El Salvador',
    Code: 'SV',
    Timezone: 'Central America Standard Time',
    UTC: 'UTC-06:00',
    MobileCode: 503
}, {
    Name: 'Equatorial Guinea',
    Code: 'GQ',
    Timezone: 'W. Central Africa Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 240
}, {
    Name: 'Eritrea',
    Code: 'ER',
    Timezone: 'E. Africa Standard Time',
    UTC: 'UTC+03:00',
    MobileCode: 291
}, {
    Name: 'Estonia',
    Code: 'EE',
    Timezone: 'FLE Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 372
}, {
    Name: 'Ethiopia',
    Code: 'ET',
    Timezone: 'E. Africa Standard Time',
    UTC: 'UTC+03:00',
    MobileCode: 251
}, {
    Name: 'Falkland Islands (Islas Malvinas)',
    Code: 'FK',
    Timezone: 'SA Eastern Standard Time',
    UTC: 'UTC-03:00',
    MobileCode: 500
}, {
    Name: 'Faroe Islands',
    Code: 'FO',
    Timezone: 'GMT Standard Time',
    UTC: 'UTC',
    MobileCode: 298
}, {
    Name: 'Fiji Islands',
    Code: 'FJ',
    Timezone: 'Fiji Standard Time',
    UTC: 'UTC+12:00',
    MobileCode: 679
}, {
    Name: 'Finland',
    Code: 'FI',
    Timezone: 'FLE Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 358
}, {
    Name: 'France',
    Code: 'FR',
    Timezone: 'Romance Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 33
}, {
    Name: 'French Guiana',
    Code: 'GF',
    Timezone: 'SA Eastern Standard Time',
    UTC: 'UTC-03:00',
    MobileCode: 594
}, {
    Name: 'French Polynesia',
    Code: 'PF',
    Timezone: 'Hawaiian Standard Time',
    UTC: 'UTC-10:00',
    MobileCode: 689
},
{
    Name: 'Gabon',
    Code: 'GA',
    Timezone: 'W. Central Africa Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 241
}, {
    Name: 'Gambia, The',
    Code: 'GM',
    Timezone: 'Greenwich Standard Time',
    UTC: 'UTC',
    MobileCode: 220
}, {
    Name: 'Georgia',
    Code: 'GE',
    Timezone: 'Georgian Standard Time',
    UTC: 'UTC+04:00',
    MobileCode: 995
}, {
    Name: 'Germany',
    Code: 'DE',
    Timezone: 'W. Europe Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 49
}, {
    Name: 'Ghana',
    Code: 'GH',
    Timezone: 'Greenwich Standard Time',
    UTC: 'UTC',
    MobileCode: 233
}, {
    Name: 'Gibraltar',
    Code: 'GI',
    Timezone: 'W. Europe Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 350
}, {
    Name: 'Greece',
    Code: 'GR',
    Timezone: 'GTB Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 30
}, {
    Name: 'Greenland',
    Code: 'GL',
    Timezone: 'Greenland Standard Time',
    UTC: 'UTC-03:00',
    MobileCode: 299
}, {
    Name: 'Grenada',
    Code: 'GD',
    Timezone: 'SA Western Standard Time',
    UTC: 'UTC-04:00',
    MobileCode: '1-473'
}, {
    Name: 'Guadeloupe',
    Code: 'GP',
    Timezone: 'SA Western Standard Time',
    UTC: 'UTC-04:00',
    MobileCode: 590
}, {
    Name: 'Guam',
    Code: 'GU',
    Timezone: 'West Pacific Standard Time',
    UTC: 'UTC+10:00',
    MobileCode: '1-671'
}, {
    Name: 'Guatemala',
    Code: 'GT',
    Timezone: 'Central America Standard Time',
    UTC: 'UTC-06:00',
    MobileCode: 502
}, {
    Name: 'Guernsey',
    Code: 'GG',
    Timezone: 'GMT Standard Time',
    UTC: 'UTC',
    MobileCode: '44-1481'
}, {
    Name: 'Guinea',
    Code: 'GN',
    Timezone: 'Greenwich Standard Time',
    UTC: 'UTC',
    MobileCode: 224
}, {
    Name: 'Guinea-Bissau',
    Code: 'GW',
    Timezone: 'Greenwich Standard Time',
    UTC: 'UTC',
    MobileCode: 245
}, {
    Name: 'Guyana',
    Code: 'GY',
    Timezone: 'SA Western Standard Time',
    UTC: 'UTC-04:00',
    MobileCode: 592
}, {
    Name: 'Haiti',
    Code: 'HT',
    Timezone: 'Eastern Standard Time',
    UTC: 'UTC-05:00',
    MobileCode: 509
}, {
    Name: 'Honduras',
    Code: 'HN',
    Timezone: 'Central America Standard Time',
    UTC: 'UTC-06:00',
    MobileCode: 504
}, {
    Name: 'Hong Kong SAR',
    Code: 'HK',
    Timezone: 'China Standard Time',
    UTC: 'UTC+08:00',
    MobileCode: 852
}, {
    Name: 'Hungary',
    Code: 'HU',
    Timezone: 'Central Europe Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 36
}, {
    Name: 'Iceland',
    Code: 'IS',
    Timezone: 'Greenwich Standard Time',
    UTC: 'UTC',
    MobileCode: 354
}, {
    Name: 'India',
    Code: 'IN',
    Timezone: 'India Standard Time',
    UTC: 'UTC+05:30',
    MobileCode: 91
}, {
    Name: 'Indonesia',
    Code: 'ID',
    Timezone: 'SE Asia Standard Time',
    UTC: 'UTC+07:00',
    MobileCode: 62
}, {
    Name: 'Iran',
    Code: 'IR',
    Timezone: 'Iran Standard Time',
    UTC: 'UTC+03:30',
    MobileCode: 98
}, {
    Name: 'Iraq',
    Code: 'IQ',
    Timezone: 'Arabic Standard Time',
    UTC: 'UTC+03:00',
    MobileCode: 964
}, {
    Name: 'Ireland',
    Code: 'IE',
    Timezone: 'GMT Standard Time',
    UTC: 'UTC',
    MobileCode: 353
}, {
    Name: 'Israel',
    Code: 'IL',
    Timezone: 'Israel Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 972
}, {
    Name: 'Italy',
    Code: 'IT',
    Timezone: 'W. Europe Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 39
}, {
    Name: 'Jamaica',
    Code: 'JM',
    Timezone: 'SA Pacific Standard Time',
    UTC: 'UTC-05:00',
    MobileCode: '1-876'
}, {
    Name: 'Jan Mayen',
    Code: 'SJ',
    Timezone: 'W. Europe Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 47
}, {
    Name: 'Japan',
    Code: 'JP',
    Timezone: 'Tokyo Standard Time',
    UTC: 'UTC+09:00',
    MobileCode: 81
}, {
    Name: 'Jersey',
    Code: 'JE',
    Timezone: 'GMT Standard Time',
    UTC: 'UTC',
    MobileCode: '44-1534'
}, {
    Name: 'Jordan',
    Code: 'JO',
    Timezone: 'Jordan Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 962
}, {
    Name: 'Kazakhstan',
    Code: 'KZ',
    Timezone: 'Central Asia Standard Time',
    UTC: 'UTC+06:00',
    MobileCode: 7
}, {
    Name: 'Kenya',
    Code: 'KE',
    Timezone: 'E. Africa Standard Time',
    UTC: 'UTC+03:00',
    MobileCode: 254
}, {
    Name: 'Kiribati',
    Code: 'KI',
    Timezone: 'UTC+12',
    UTC: 'UTC+12:00',
    MobileCode: 686
}, {
    Name: 'Korea',
    Code: 'KR',
    Timezone: 'Korea Standard Time',
    UTC: 'UTC+09:00',
    MobileCode: 82
},
{
    Name: 'Kuwait',
    Code: 'KW',
    Timezone: 'Arab Standard Time',
    UTC: 'UTC+03:00',
    MobileCode: 965
}, {
    Name: 'Kyrgyzstan',
    Code: 'KG',
    Timezone: 'Central Asia Standard Time',
    UTC: 'UTC+06:00',
    MobileCode: 996
}, {
    Name: 'Laos',
    Code: 'LA',
    Timezone: 'SE Asia Standard Time',
    UTC: 'UTC+07:00',
    MobileCode: 856
}, {
    Name: 'Latvia',
    Code: 'LV',
    Timezone: 'FLE Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 371
}, {
    Name: 'Lebanon',
    Code: 'LB',
    Timezone: 'Middle East Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 961
}, {
    Name: 'Lesotho',
    Code: 'LS',
    Timezone: 'South Africa Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 266
}, {
    Name: 'Liberia',
    Code: 'LR',
    Timezone: 'Greenwich Standard Time',
    UTC: 'UTC',
    MobileCode: 231
}, {
    Name: 'Libya',
    Code: 'LY',
    Timezone: 'E. Europe Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 218
}, {
    Name: 'Liechtenstein',
    Code: 'LI',
    Timezone: 'W. Europe Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 423
}, {
    Name: 'Lithuania',
    Code: 'LT',
    Timezone: 'FLE Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 370
}, {
    Name: 'Luxembourg',
    Code: 'LU',
    Timezone: 'W. Europe Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 352
}, {
    Name: 'Macao SAR',
    Code: 'MO',
    Timezone: 'China Standard Time',
    UTC: 'UTC+08:00',
    MobileCode: 853
}, {
    Name: 'Macedonia, Former Yugoslav Republic of',
    Code: 'MK',
    Timezone: 'Central European Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 389
}, {
    Name: 'Madagascar',
    Code: 'MG',
    Timezone: 'E. Africa Standard Time',
    UTC: 'UTC+03:00',
    MobileCode: 261
}, {
    Name: 'Malawi',
    Code: 'MW',
    Timezone: 'South Africa Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 265
}, {
    Name: 'Malaysia',
    Code: 'MY',
    Timezone: 'Singapore Standard Time',
    UTC: 'UTC+08:00',
    MobileCode: 60
}, {
    Name: 'Maldives',
    Code: 'MV',
    Timezone: 'West Asia Standard Time',
    UTC: 'UTC+05:00',
    MobileCode: 960
}, {
    Name: 'Mali',
    Code: 'ML',
    Timezone: 'Greenwich Standard Time',
    UTC: 'UTC',
    MobileCode: 223
}, {
    Name: 'Malta',
    Code: 'MT',
    Timezone: 'W. Europe Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 356
}, {
    Name: 'Man, Isle of',
    Code: 'IM',
    Timezone: 'GMT Standard Time',
    UTC: 'UTC',
    MobileCode: '44-1624'
}, {
    Name: 'Marshall Islands',
    Code: 'MH',
    Timezone: 'UTC+12',
    UTC: 'UTC+12:00',
    MobileCode: 692
}, {
    Name: 'Martinique',
    Code: 'MQ',
    Timezone: 'SA Western Standard Time',
    UTC: 'UTC-04:00',
    MobileCode: 596
}, {
    Name: 'Mauritania',
    Code: 'MR',
    Timezone: 'Greenwich Standard Time',
    UTC: 'UTC',
    MobileCode: 222
}, {
    Name: 'Mauritius',
    Code: 'MU',
    Timezone: 'Mauritius Standard Time',
    UTC: 'UTC+04:00',
    MobileCode: 230
}, {
    Name: 'Mayotte',
    Code: 'YT',
    Timezone: 'E. Africa Standard Time',
    UTC: 'UTC+03:00',
    MobileCode: 262
}, {
    Name: 'Mexico',
    Code: 'MX',
    Timezone: 'Central Standard Time (Mexico)',
    UTC: 'UTC-06:00',
    MobileCode: 52
}, {
    Name: 'Micronesia',
    Code: 'FM',
    Timezone: 'West Pacific Standard Time',
    UTC: 'UTC+10:00',
    MobileCode: 691
}, {
    Name: 'Moldova',
    Code: 'MD',
    Timezone: 'GTB Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 373
}, {
    Name: 'Monaco',
    Code: 'MC',
    Timezone: 'W. Europe Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 377
}, {
    Name: 'Mongolia',
    Code: 'MN',
    Timezone: 'Ulaanbaatar Standard Time',
    UTC: 'UTC+08:00',
    MobileCode: 976
}, {
    Name: 'Montenegro',
    Code: 'ME',
    Timezone: 'Central European Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 382
}, {
    Name: 'Montserrat',
    Code: 'MS',
    Timezone: 'SA Western Standard Time',
    UTC: 'UTC-04:00',
    MobileCode: '1-664'
}, {
    Name: 'Morocco',
    Code: 'MA',
    Timezone: 'Morocco Standard Time',
    UTC: 'UTC',
    MobileCode: 212
}, {
    Name: 'Mozambique',
    Code: 'MZ',
    Timezone: 'South Africa Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 258
}, {
    Name: 'Myanmar',
    Code: 'MM',
    Timezone: 'Myanmar Standard Time',
    UTC: 'UTC+06:30',
    MobileCode: 95
}, {
    Name: 'Namibia',
    Code: 'NA',
    Timezone: 'Namibia Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 264
}, {
    Name: 'Nauru',
    Code: 'NR',
    Timezone: 'UTC+12',
    UTC: 'UTC+12:00',
    MobileCode: 674
}, {
    Name: 'Nepal',
    Code: 'NP',
    Timezone: 'Nepal Standard Time',
    UTC: 'UTC+05:45',
    MobileCode: 977
}, {
    Name: 'Netherlands',
    Code: 'NL',
    Timezone: 'W. Europe Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 31
}, {
    Name: 'New Caledonia',
    Code: 'NC',
    Timezone: 'Central Pacific Standard Time',
    UTC: 'UTC+11:00',
    MobileCode: 687
}, {
    Name: 'New Zealand',
    Code: 'NZ',
    Timezone: 'New Zealand Standard Time',
    UTC: 'UTC+12:00',
    MobileCode: 64
}, {
    Name: 'Nicaragua',
    Code: 'NI',
    Timezone: 'Central America Standard Time',
    UTC: 'UTC-06:00',
    MobileCode: 505
}, {
    Name: 'Niger',
    Code: 'NE',
    Timezone: 'W. Central Africa Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 227
}, {
    Name: 'Nigeria',
    Code: 'NG',
    Timezone: 'W. Central Africa Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 234
}, {
    Name: 'Niue',
    Code: 'NU',
    Timezone: 'UTC-11',
    UTC: 'UTC-11:00',
    MobileCode: 683
}, {
    Name: 'Norfolk Island',
    Code: 'NF',
    Timezone: 'Central Pacific Standard Time',
    UTC: 'UTC+11:00',
    MobileCode: 672
}, {
    Name: 'North Korea',
    Code: 'KP',
    Timezone: 'Korea Standard Time',
    UTC: 'UTC+09:00',
    MobileCode: 850
}, {
    Name: 'Northern Mariana Islands',
    Code: 'MP',
    Timezone: 'West Pacific Standard Time',
    UTC: 'UTC+10:00',
    MobileCode: '1-670'
}, {
    Name: 'Norway',
    Code: 'NO',
    Timezone: 'W. Europe Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 47
}, {
    Name: 'Oman',
    Code: 'OM',
    Timezone: 'Arabian Standard Time',
    UTC: 'UTC+04:00',
    MobileCode: 968
}, {
    Name: 'Pakistan',
    Code: 'PK',
    Timezone: 'Pakistan Standard Time',
    UTC: 'UTC+05:00',
    MobileCode: 92
}, {
    Name: 'Palau',
    Code: 'PW',
    Timezone: 'Tokyo Standard Time',
    UTC: 'UTC+09:00',
    MobileCode: 680
}, {
    Name: 'Palestinian Authority',
    Code: 'PS',
    Timezone: 'Egypt Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 970
}, {
    Name: 'Panama',
    Code: 'PA',
    Timezone: 'SA Pacific Standard Time',
    UTC: 'UTC-05:00',
    MobileCode: 507
}, {
    Name: 'Papua New Guinea',
    Code: 'PG',
    Timezone: 'West Pacific Standard Time',
    UTC: 'UTC+10:00',
    MobileCode: 675
}, {
    Name: 'Paraguay',
    Code: 'PY',
    Timezone: 'Paraguay Standard Time',
    UTC: 'UTC-04:00',
    MobileCode: 595
}, {
    Name: 'Peru',
    Code: 'PE',
    Timezone: 'SA Pacific Standard Time',
    UTC: 'UTC-05:00',
    MobileCode: 51
},
{
    Name: 'Perú',
    Code: 'PE',
    Timezone: 'SA Pacific Standard Time',
    UTC: 'UTC-05:00',
    MobileCode: 51
}, {
    Name: 'Philippines',
    Code: 'PH',
    Timezone: 'Singapore Standard Time',
    UTC: 'UTC+08:00',
    MobileCode: 63
}, {
    Name: 'Pitcairn Islands',
    Code: 'PN',
    Timezone: 'Pacific Standard Time',
    UTC: 'UTC-08:00',
    MobileCode: 870
}, {
    Name: 'Poland',
    Code: 'PL',
    Timezone: 'Central European Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 48
}, {
    Name: 'Portugal',
    Code: 'PT',
    Timezone: 'GMT Standard Time',
    UTC: 'UTC',
    MobileCode: 351
}, {
    Name: 'Qatar',
    Code: 'QA',
    Timezone: 'Arab Standard Time',
    UTC: 'UTC+03:00',
    MobileCode: 974
}, {
    Name: 'Reunion',
    Code: 'RE',
    Timezone: 'Mauritius Standard Time',
    UTC: 'UTC+04:00',
    MobileCode: 262
}, {
    Name: 'Romania',
    Code: 'RO',
    Timezone: 'GTB Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 40
}, {
    Name: 'Russia',
    Code: 'RU',
    Timezone: 'Russian Standard Time',
    UTC: 'UTC+03:00',
    MobileCode: 7
}, {
    Name: 'Rwanda',
    Code: 'RW',
    Timezone: 'South Africa Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 250
}, {
    Name: 'Saint Barthélemy',
    Code: 'BL',
    Timezone: 'SA Western Standard Time',
    UTC: 'UTC-04:00',
    MobileCode: 590
}, {
    Name: 'Saint Helena, Ascension and Tristan da Cunha',
    Code: 'SH',
    Timezone: 'Greenwich Standard Time',
    UTC: 'UTC',
    MobileCode: 290
}, {
    Name: 'Saint Kitts and Nevis',
    Code: 'KN',
    Timezone: 'SA Western Standard Time',
    UTC: 'UTC-04:00',
    MobileCode: '1-869'
}, {
    Name: 'Saint Lucia',
    Code: 'LC',
    Timezone: 'SA Western Standard Time',
    UTC: 'UTC-04:00',
    MobileCode: '1-758'
}, {
    Name: 'Saint Martin (French part)',
    Code: 'MF',
    Timezone: 'SA Western Standard Time',
    UTC: 'UTC-04:00',
    MobileCode: 590
}, {
    Name: 'Saint Pierre and Miquelon',
    Code: 'PM',
    Timezone: 'Greenland Standard Time',
    UTC: 'UTC-03:00',
    MobileCode: 508
}, {
    Name: 'Saint Vincent and the Grenadines',
    Code: 'VC',
    Timezone: 'SA Western Standard Time',
    UTC: 'UTC-04:00',
    MobileCode: '1-784'
}, {
    Name: 'Samoa',
    Code: 'WS',
    Timezone: 'Samoa Standard Time',
    UTC: 'UTC+13:00',
    MobileCode: 685
}, {
    Name: 'San Marino',
    Code: 'SM',
    Timezone: 'W. Europe Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 378
}, {
    Name: 'São Tomé and Príncipe',
    Code: 'ST',
    Timezone: 'Greenwich Standard Time',
    UTC: 'UTC',
    MobileCode: 239
}, {
    Name: 'Saudi Arabia',
    Code: 'SA',
    Timezone: 'Arab Standard Time',
    UTC: 'UTC+03:00',
    MobileCode: 966
}, {
    Name: 'Senegal',
    Code: 'SN',
    Timezone: 'Greenwich Standard Time',
    UTC: 'UTC',
    MobileCode: 221
}, {
    Name: 'Serbia',
    Code: 'RS',
    Timezone: 'Central Europe Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 381
}, {
    Name: 'Seychelles',
    Code: 'SC',
    Timezone: 'Mauritius Standard Time',
    UTC: 'UTC+04:00',
    MobileCode: 248
}, {
    Name: 'Sierra Leone',
    Code: 'SL',
    Timezone: 'Greenwich Standard Time',
    UTC: 'UTC',
    MobileCode: 232
}, {
    Name: 'Singapore',
    Code: 'SG',
    Timezone: 'Singapore Standard Time',
    UTC: 'UTC+08:00',
    MobileCode: 65
}, {
    Name: 'Sint Maarten (Dutch part)',
    Code: 'SX',
    Timezone: 'SA Western Standard Time',
    UTC: 'UTC-04:00',
    MobileCode: 599
}, {
    Name: 'Slovakia',
    Code: 'SK',
    Timezone: 'Central Europe Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 421
}, {
    Name: 'Slovenia',
    Code: 'SI',
    Timezone: 'Central Europe Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 386
}, {
    Name: 'Solomon Islands',
    Code: 'SB',
    Timezone: 'Central Pacific Standard Time',
    UTC: 'UTC+11:00',
    MobileCode: 677
}, {
    Name: 'Somalia',
    Code: 'SO',
    Timezone: 'E. Africa Standard Time',
    UTC: 'UTC+03:00',
    MobileCode: 252
}, {
    Name: 'South Africa',
    Code: 'ZA',
    Timezone: 'South Africa Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 27
}, 
{
    Name: 'South Sudan',
    Code: 'SS',
    Timezone: 'E. Africa Standard Time',
    UTC: 'UTC+03:00',
    MobileCode: 211
}, {
    Name: 'Spain',
    Code: 'ES',
    Timezone: 'Romance Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 34
}, {
    Name: 'Sri Lanka',
    Code: 'LK',
    Timezone: 'Sri Lanka Standard Time',
    UTC: 'UTC+05:30',
    MobileCode: 94
}, {
    Name: 'Sudan',
    Code: 'SD',
    Timezone: 'E. Africa Standard Time',
    UTC: 'UTC+03:00',
    MobileCode: 249
}, {
    Name: 'Suriname',
    Code: 'SR',
    Timezone: 'SA Eastern Standard Time',
    UTC: 'UTC-03:00',
    MobileCode: 597
}, {
    Name: 'Svalbard',
    Code: 'SJ',
    Timezone: 'W. Europe Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 47
}, {
    Name: 'Swaziland',
    Code: 'SZ',
    Timezone: 'South Africa Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 268
}, {
    Name: 'Sweden',
    Code: 'SE',
    Timezone: 'W. Europe Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 46
}, {
    Name: 'Switzerland',
    Code: 'CH',
    Timezone: 'W. Europe Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 41
}, {
    Name: 'Syria',
    Code: 'SY',
    Timezone: 'Syria Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 963
}, {
    Name: 'Taiwan',
    Code: 'TW',
    Timezone: 'Taipei Standard Time',
    UTC: 'UTC+08:00',
    MobileCode: 886
}, {
    Name: 'Tajikistan',
    Code: 'TJ',
    Timezone: 'West Asia Standard Time',
    UTC: 'UTC+05:00',
    MobileCode: 992
}, {
    Name: 'Tanzania',
    Code: 'TZ',
    Timezone: 'E. Africa Standard Time',
    UTC: 'UTC+03:00',
    MobileCode: 255
}, {
    Name: 'Thailand',
    Code: 'TH',
    Timezone: 'SE Asia Standard Time',
    UTC: 'UTC+07:00',
    MobileCode: 66
}, {
    Name: 'Togo',
    Code: 'TG',
    Timezone: 'Greenwich Standard Time',
    UTC: 'UTC',
    MobileCode: 228
}, {
    Name: 'Tokelau',
    Code: 'TK',
    Timezone: 'Tonga Standard Time',
    UTC: 'UTC+13:00',
    MobileCode: 690
}, {
    Name: 'Tonga',
    Code: 'TO',
    Timezone: 'Tonga Standard Time',
    UTC: 'UTC+13:00',
    MobileCode: 676
}, {
    Name: 'Trinidad and Tobago',
    Code: 'TT',
    Timezone: 'SA Western Standard Time',
    UTC: 'UTC-04:00',
    MobileCode: '1-868'
}, {
    Name: 'Tunisia',
    Code: 'TN',
    Timezone: 'W. Central Africa Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 216
}, {
    Name: 'Turkey',
    Code: 'TR',
    Timezone: 'Turkey Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 90
}, {
    Name: 'Turkmenistan',
    Code: 'TM',
    Timezone: 'West Asia Standard Time',
    UTC: 'UTC+05:00',
    MobileCode: 993
}, {
    Name: 'Turks and Caicos Islands',
    Code: 'TC',
    Timezone: 'Eastern Standard Time',
    UTC: 'UTC-05:00',
    MobileCode: '1-649'
}, {
    Name: 'Tuvalu',
    Code: 'TV',
    Timezone: 'UTC+12',
    UTC: 'UTC+12:00',
    MobileCode: 688
},{
    Name: 'Uganda',
    Code: 'UG',
    Timezone: 'E. Africa Standard Time',
    UTC: 'UTC+03:00',
    MobileCode: 256
}, {
    Name: 'Ukraine',
    Code: 'UA',
    Timezone: 'FLE Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 380
}, {
    Name: 'United Arab Emirates',
    Code: 'AE',
    Timezone: 'Arabian Standard Time',
    UTC: 'UTC+04:00',
    MobileCode: 971
}, {
    Name: 'United Kingdom',
    Code: 'GB',
    Timezone: 'GMT Standard Time',
    UTC: 'UTC',
    MobileCode: 44
}, {
    Name: 'United States',
    Code: 'US',
    Timezone: 'Pacific Standard Time',
    UTC: 'UTC-08:00',
    MobileCode: 1
}, {
    Name: 'Uruguay',
    Code: 'UY',
    Timezone: 'Montevideo Standard Time',
    UTC: 'UTC-03:00',
    MobileCode: 598
}, {
    Name: 'Uzbekistan',
    Code: 'UZ',
    Timezone: 'West Asia Standard Time',
    UTC: 'UTC+05:00',
    MobileCode: 998
}, {
    Name: 'Vanuatu',
    Code: 'VU',
    Timezone: 'Central Pacific Standard Time',
    UTC: 'UTC+11:00',
    MobileCode: 678
}, {
    Name: 'Vatican City',
    Code: 'VA',
    Timezone: 'W. Europe Standard Time',
    UTC: 'UTC+01:00',
    MobileCode: 379
}, {
    Name: 'Vietnam',
    Code: 'VN',
    Timezone: 'SE Asia Standard Time',
    UTC: 'UTC+07:00',
    MobileCode: 84
}, {
    Name: 'Virgin Islands, U.S.',
    Code: 'VI',
    Timezone: 'SA Western Standard Time',
    UTC: 'UTC-04:00',
    MobileCode: '1-340'
}, {
    Name: 'Virgin Islands, British',
    Code: 'VG',
    Timezone: 'SA Western Standard Time',
    UTC: 'UTC-04:00',
    MobileCode: '1-284'
}, {
    Name: 'Wallis and Futuna',
    Code: 'WF',
    Timezone: 'UTC+12',
    UTC: 'UTC+12:00',
    MobileCode: 681
}, {
    Name: 'Yemen',
    Code: 'YE',
    Timezone: 'Arab Standard Time',
    UTC: 'UTC+03:00',
    MobileCode: 967
}, {
    Name: 'Zambia',
    Code: 'ZM',
    Timezone: 'South Africa Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 260
}, {
    Name: 'Zimbabwe',
    Code: 'ZW',
    Timezone: 'South Africa Standard Time',
    UTC: 'UTC+02:00',
    MobileCode: 263
}
];

export const getEuropeanCountries = (languageCode, countryList) => {
    console.log(`Fetching European countries for language: ${languageCode}`);
  const countries = [
    {
      "name": "Austria",
      "translatedName": "Austria",
      "code": "AT",
      "dial_code": "+43"
    },
    {
      "name": "Belgium",
      "translatedName": "Belgium",
      "code": "BE",
      "dial_code": "+32"
    },
    {
      "name": "Bulgaria",
      "translatedName": "Bulgaria",
      "code": "BG",
      "dial_code": "+359"
    },
    {
      "name": "Croatia",
      "translatedName": "Croatia",
      "code": "HR",
      "dial_code": "+385"
    },
    {
      "name": "Cyprus",
      "translatedName": "Cyprus",
      "code": "CY",
      "dial_code": "+357"
    },
    {
      "name": "Czechia",
      "translatedName": "Czechia",
      "code": "CZ",
      "dial_code": "+420"
    },
    {
      "name": "Denmark",
      "translatedName": "Denmark",
      "code": "DK",
      "dial_code": "+45"
    },
    {
      "name": "Estonia",
      "translatedName": "Estonia",
      "code": "EE",
      "dial_code": "+372"
    },
    {
      "name": "Finland",
      "translatedName": "Finland",
      "code": "FI",
      "dial_code": "+358"
    },
    {
      "name": "France",
      "translatedName": "France",
      "code": "FR",
      "dial_code": "+33"
    },
    {
      "name": "Germany",
      "translatedName": "Germany",
      "code": "DE",
      "dial_code": "+49"
    },
    {
      "name": "Greece",
      "translatedName": "Greece",
      "code": "GR",
      "dial_code": "+30"
    },
    {
      "name": "Hungary",
      "translatedName": "Hungary",
      "code": "HU",
      "dial_code": "+36"
    },
    {
      "name": "Ireland",
      "translatedName": "Ireland",
      "code": "IE",
      "dial_code": "+353"
    },
    {
      "name": "Italy",
      "translatedName": "Italy",
      "code": "IT",
      "dial_code": "+39"
    },
    {
      "name": "Latvia",
      "translatedName": "Latvia",
      "code": "LV",
      "dial_code": "+371"
    },
    {
      "name": "Lithuania",
      "translatedName": "Lithuania",
      "code": "LT",
      "dial_code": "+370"
    },
    {
      "name": "Luxembourg",
      "translatedName": "Luxembourg",
      "code": "LU",
      "dial_code": "+352"
    },
    {
      "name": "Malta",
      "translatedName": "Malta",
      "code": "MT",
      "dial_code": "+356"
    },
    {
      "name": "Netherlands",
      "translatedName": "Netherlands",
      "code": "NL",
      "dial_code": "+31"
    },
    {
      "name": "Poland",
      "translatedName": "Poland",
      "code": "PL",
      "dial_code": "+48"
    },
    {
      "name": "Portugal",
      "translatedName": "Portugal",
      "code": "PT",
      "dial_code": "+351"
    },
    {
      "name": "Romania",
      "translatedName": "Romania",
      "code": "RO",
      "dial_code": "+40"
    },
    {
      "name": "Slovakia",
      "translatedName": "Slovakia",
      "code": "SK",
      "dial_code": "+421"
    },
    {
      "name": "Slovenia",
      "translatedName": "Slovenia",
      "code": "SI",
      "dial_code": "+386"
    },
    {
      "name": "Spain",
      "translatedName": "Spain",
      "code": "ES",
      "dial_code": "+34"
    },
    {
      "name": "Sweden",
      "translatedName": "Sweden",
      "code": "SE",
      "dial_code": "+46"
    },
    {
      "name": "United Kingdom (Northern Ireland)",
      "translatedName": "United Kingdom (Northern Ireland)",
      "code": "XI",
      "dial_code": "+44"
    }
  ];

  // Define translations for Indonesian (id)
  const translations = {
    "Austria": "Austria",
    "Belgium": "Belgia",
    "Bulgaria": "Bulgaria",
    "Croatia": "Kroasia",
    "Cyprus": "Siprus",
    "Czechia": "Ceko",
    "Denmark": "Denmark",
    "Estonia": "Estonia",
    "Finland": "Finlandia",
    "France": "Prancis",
    "Germany": "Jerman",
    "Greece": "Yunani",
    "Hungary": "Hongaria",
    "Ireland": "Irlandia",
    "Italy": "Italia",
    "Latvia": "Latvia",
    "Lithuania": "Lituania",
    "Luxembourg": "Luksemburg",
    "Malta": "Malta",
    "Netherlands": "Belanda",
    "Poland": "Polandia",
    "Portugal": "Portugal",
    "Romania": "Rumania",
    "Slovakia": "Slowakia",
    "Slovenia": "Slovenia",
    "Spain": "Spanyol",
    "Sweden": "Swedia",
    "United Kingdom (Northern Ireland)": "Britania Raya (Irlandia Utara)"
  };

  if(countryList ) {
    let translatedArr = countryList?.map(country => {
        return {
            name: country,
            translatedName: translations[country] || country
        }
    })
    return translatedArr
  }
  else if (languageCode === 'id' || languageCode === 'ID' || languageCode === 'Indonesian') {
    console.log('Mapping countries to Indonesian names');
    // If languageCode is 'id', map the countries to their Indonesian translated names
    return countries.map(country => {
        let tmpObj= {
            name: country.name,
            code: country.code,
            dial_code: country.dial_code,
            translatedName: translations[country.name] || country.name // Use translated name, or fallback to original if not found
        }
        return tmpObj
    });
  } else {
    console.log('Returning original country names');
    // Otherwise, return the original array where translatedName is the same as name
    return countries;
  }
};


export const getAllCountries = (languageCode, countryList) => {
  const countries = getCountries()

  // Define translations for Indonesian (id)
  const translations = {
    "Afghanistan": "Afghanistan",
    "Albania": "Albania",
    "Algeria": "Aljazair",
    "Andorra": "Andorra",
    "Angola": "Angola",
    "Anguilla": "Anguilla",
    "Antigua and Barbuda": "Antigua dan Barbuda",
    "Argentina": "Argentina",
    "Armenia": "Armenia",
    "Aruba": "Aruba",
    "Australia": "Australia",
    "Austria": "Austria",
    "Azerbaijan": "Azerbaijan",
    "Bahamas": "Bahama",
    "Bahrain": "Bahrain",
    "Bangladesh": "Bangladesh",
    "Barbados": "Barbados",
    "Belarus": "Belarus",
    "Belgium": "Belgia",
    "Belize": "Belize",
    "Benin": "Benin",
    "Bermuda": "Bermuda",
    "Bhutan": "Bhutan",
    "Bolivia": "Bolivia",
    "Bosnia and Herzegovina": "Bosnia dan Herzegovina",
    "Botswana": "Botswana",
    "Brazil": "Brasil",
    "Brunei Darussalam": "Brunei Darussalam",
    "Bulgaria": "Bulgaria",
    "Burkina Faso": "Burkina Faso",
    "Burundi": "Burundi",
    "Cambodia": "Kamboja",
    "Cameroon": "Kamerun",
    "Canada": "Kanada",
    "Cape Verde": "Tanjung Verde",
    "Cayman Islands": "Kepulauan Cayman",
    "Central African Republic": "Republik Afrika Tengah",
    "Chad": "Chad",
    "Chile": "Cile",
    "China": "Tiongkok",
    "Christmas Island": "Pulau Natal",
    "Cocos (Keeling) Islands": "Kepulauan Cocos (Keeling)",
    "Colombia": "Kolombia",
    "Comoros": "Komoro",
    "Congo": "Kongo",
    "Cook Islands": "Kepulauan Cook",
    "Costa Rica": "Kosta Rika",
    "Cote D'Ivoire": "Pantai Gading",
    "Croatia": "Kroasia",
    "Cuba": "Kuba",
    "Cyprus": "Siprus",
    "Czech Republic": "Republik Ceko",
    "Democratic Republic of the Congo": "Republik Demokratik Kongo",
    "Denmark": "Denmark",
    "Djibouti": "Jibuti",
    "Dominica": "Dominika",
    "Dominican Republic": "Republik Dominika",
    "Ecuador": "Ekuador",
    "Egypt": "Mesir",
    "El Salvador": "El Salvador",
    "Equatorial Guinea": "Guinea Ekuatorial",
    "Eritrea": "Eritrea",
    "Estonia": "Estonia",
    "Ethiopia": "Etiopia",
    "Falkland Islands": "Kepulauan Falkland",
    "Faroe Islands": "Kepulauan Faroe",
    "Federated States of Micronesia": "Federasi Mikronesia",
    "Fiji": "Fiji",
    "Finland": "Finlandia",
    "France": "Prancis",
    "French Guiana": "Guyana Prancis",
    "French Polynesia": "Polinesia Prancis",
    "French Southern Territories": "Wilayah Selatan Prancis",
    "Gabon": "Gabon",
    "Gambia": "Gambia",
    "Georgia": "Georgia",
    "Germany": "Jerman",
    "Ghana": "Ghana",
    "Gibraltar": "Gibraltar",
    "Great Britain (UK)": "Britania Raya (UK)",
    "Greece": "Yunani",
    "Greenland": "Greenland",
    "Grenada": "Grenada",
    "Guadeloupe": "Guadeloupe",
    "Guatemala": "Guatemala",
    "Guinea": "Guinea",
    "Guinea-Bissau": "Guinea-Bissau",
    "Guyana": "Guyana",
    "Haiti": "Haiti",
    "Honduras": "Honduras",
    "Hong Kong": "Hong Kong",
    "Hungary": "Hongaria",
    "Iceland": "Islandia",
    "India": "India",
    "Indonesia": "Indonesia",
    "Iran": "Iran",
    "Iraq": "Irak",
    "Ireland": "Irlandia",
    "Israel": "Israel",
    "Italy": "Italia",
    "Jamaica": "Jamaika",
    "Japan": "Jepang",
    "Jordan": "Yordania",
    "Kazakhstan": "Kazakhstan",
    "Kenya": "Kenya",
    "Kiribati": "Kiribati",
    "North Korea": "Korea Utara",
    "South Korea": "Korea Selatan",
    "Kuwait": "Kuwait",
    "Kyrgyzstan": "Kirgizstan",
    "Laos": "Laos",
    "Latvia": "Latvia",
    "Lebanon": "Lebanon",
    "Lesotho": "Lesotho",
    "Liberia": "Liberia",
    "Libya": "Libya",
    "Liechtenstein": "Liechtenstein",
    "Lithuania": "Lituania",
    "Luxembourg": "Luksemburg",
    "Macao": "Makau",
    "Macedonia": "Makedonia",
    "Madagascar": "Madagaskar",
    "Malawi": "Malawi",
    "Malaysia": "Malaysia",
    "Maldives": "Maladewa",
    "Mali": "Mali",
    "Malta": "Malta",
    "Marshall Islands": "Kepulauan Marshall",
    "Martinique": "Martinik",
    "Mauritania": "Mauritania",
    "Mauritius": "Mauritius",
    "Mayotte": "Mayotte",
    "Mexico": "Meksiko",
    "Moldova": "Moldova",
    "Monaco": "Monako",
    "Mongolia": "Mongolia",
    "Montserrat": "Montserrat",
    "Morocco": "Maroko",
    "Mozambique": "Mozambik",
    "Myanmar": "Myanmar",
    "Namibia": "Namibia",
    "Nauru": "Nauru",
    "Nepal": "Nepal",
    "Netherlands": "Belanda",
    "Netherlands Antilles": "Antillen Belanda",
    "New Caledonia": "Kaledonia Baru",
    "New Zealand": "Selandia Baru",
    "Nicaragua": "Nikaragua",
    "Niger": "Niger",
    "Nigeria": "Nigeria",
    "Niue": "Niue",
    "Norfolk Island": "Pulau Norfolk",
    "Northern Mariana Islands": "Kepulauan Mariana Utara",
    "Norway": "Norwegia",
    "NULL": "NULL", // Keep as NULL or define a translation if known
    "Oman": "Oman",
    "Pakistan": "Pakistan",
    "Palau": "Palau",
    "Palestinian Territory": "Wilayah Palestina",
    "Panama": "Panama",
    "Papua New Guinea": "Papua Nugini",
    "Paraguay": "Paraguay",
    "Peru": "Peru",
    "Philippines": "Filipina",
    "Pitcairn": "Pitcairn",
    "Poland": "Polandia",
    "Portugal": "Portugal",
    "Qatar": "Qatar",
    "Reunion": "Reunion",
    "Romania": "Rumania",
    "Russian Federation": "Federasi Rusia",
    "Rwanda": "Rwanda",
    "S. Georgia and S. Sandwich Islands": "Georgia Selatan dan Kepulauan Sandwich Selatan",
    "Saint Helena": "Saint Helena",
    "Saint Kitts and Nevis": "Saint Kitts dan Nevis",
    "Saint Lucia": "Saint Lucia",
    "Saint Pierre and Miquelon": "Saint Pierre dan Miquelon",
    "Saint Vincent and the Grenadines": "Saint Vincent dan Grenadines",
    "Samoa": "Samoa",
    "San Marino": "San Marino",
    "Sao Tome and Principe": "Sao Tome dan Principe",
    "Saudi Arabia": "Arab Saudi",
    "Senegal": "Senegal",
    "Seychelles": "Seychelles",
    "Sierra Leone": "Sierra Leone",
    "Singapore": "Singapura",
    "Slovakia": "Slowakia",
    "Slovenia": "Slovenia",
    "Solomon Islands": "Kepulauan Solomon",
    "Somalia": "Somalia",
    "South Africa": "Afrika Selatan",
    "Spain": "Spanyol",
    "Sri Lanka": "Sri Lanka",
    "Sudan": "Sudan",
    "Suriname": "Suriname",
    "Svalbard and Jan Mayen": "Svalbard dan Jan Mayen",
    "Swaziland": "Swaziland",
    "Sweden": "Swedia",
    "Switzerland": "Swiss",
    "Syria": "Suriah",
    "Taiwan": "Taiwan",
    "Tajikistan": "Tajikistan",
    "Tanzania": "Tanzania",
    "Thailand": "Thailand",
    "Togo": "Togo",
    "Tokelau": "Tokelau",
    "Tonga": "Tonga",
    "Trinidad and Tobago": "Trinidad dan Tobago",
    "Tunisia": "Tunisia",
    "Turkey": "Turki",
    "Turkmenistan": "Turkmenistan",
    "Turks and Caicos Islands": "Kepulauan Turks dan Caicos",
    "Tuvalu": "Tuvalu",
    "Uganda": "Uganda",
    "Ukraine": "Ukraina",
    "United Arab Emirates": "Uni Emirat Arab",
    "United States of America": "Amerika Serikat",
    "Uruguay": "Uruguay",
    "Uzbekistan": "Uzbekistan",
    "Vanuatu": "Vanuatu",
    "Venezuela": "Venezuela",
    "Vietnam": "Vietnam",
    "Virgin Islands (British)": "Kepulauan Virgin (Inggris)",
    "Virgin Islands (U.S.)": "Kepulauan Virgin (AS)",
    "Wallis and Futuna": "Wallis dan Futuna",
    "Western Sahara": "Sahara Barat",
    "Yemen": "Yaman",
    "Zambia": "Zambia",
    "Zimbabwe": "Zimbabwe"
  };

  console.log(countryList, "getAllCountries", languageCode, countryList, ((languageCode === 'id' || languageCode === 'ID' || languageCode === 'Indonesian') && countryList))
  if( countryList ) {
       console.log(countryList, "getAllCountries11", languageCode, countryList)
    let translatedArr = countryList?.map(country => {
        return {
            name: country,
            translatedName: translations[country] || country
        }
    })
    return translatedArr
  }
  else if (languageCode === 'id' || languageCode === 'ID' || languageCode === 'Indonesian') {
    // If languageCode is 'id', map the countries to their Indonesian translated names
    return countries.map(country => ({
      ...country,
      translatedName: translations[country.name] || country.name // Use translated name, or fallback to original if not found
    }));
  } else {
    // Otherwise, return the original array where translatedName is the same as name
    return countries.map(country => {
        return {
            ...country,
            translatedName: country.name // Use original name as translatedName
        };
    });
  }
};


export const getSubProducts = (languageCode, subProductList) => {
    let translatedObj = {
        id:{
        1: "0102 21 , 0102 29 Sapi hidup",
    2: "0201 Daging sapi, segar atau dingin",
    3: "0202 Daging sapi, beku",
    4: "0206 10 Jeroan sapi yang dapat dimakan, segar atau dingin",
    5: "0206 22 Hati sapi yang dapat dimakan, beku",
    6:
      "0206 29 Jeroan sapi yang dapat dimakan (tidak termasuk lidah dan hati), dibekukan",
    7:
      "1602 50 Daging, sisa daging, darah, sapi olahan atau diawetkan lainnya",
    8:
      "4101 Kulit dan kulit sapi mentah (segar, atau diasinkan, dikeringkan, dikapur, diasamkan atau diawetkan secara lain, tetapi tidak disamak, tidak diolah secara perkamen atau diolah lebih lanjut), dihilangkan bulunya atau dibelah maupun tidak",
    9:
      "4104 Kulit dan kulit sapi yang disamak atau berkerak, tanpa bulu, dibelah maupun tidak, tetapi tidak diolah lebih lanjut",
    10:
      "4107 Kulit sapi, diolah lebih lanjut setelah penyamakan atau pengerasan kulit, termasuk kulit yang diolah secara perkamen, tanpa bulu, dibelah maupun tidak, selain kulit samak dari pos 41.14",
    11: "1801 Biji kakao, utuh atau pecah, mentah atau dipanggang",
    12: "1802 Cangkang kakao, sekam, kulit dan sisa kakao lainnya",
    13: "1803 Pasta kakao, dihilangkan lemaknya maupun tidak",
    14: "1804 Mentega kakao, lemak dan minyak",
    15:
      "1805 Kakao bubuk, tidak mengandung tambahan gula atau bahan pemanis lainnya",
    16: "1806 Coklat dan olahan makanan lain yang mengandung kakao",
    17:
      "0901 Kopi, digongseng atau dihilangkan kafeinnya maupun tidak; sekam dan kulit kopi; pengganti kopi yang mengandung kopi dalam proporsi berapa pun",
    18: "1207 10 Kacang dan inti sawit",
    19:
      "1511 Minyak kelapa sawit dan fraksinya, dimurnikan maupun tidak, tetapi tidak dimodifikasi secara kimia",
    20:
      "1513 21 Inti sawit mentah dan minyak babassu serta fraksinya, dimurnikan maupun tidak, tetapi tidak dimodifikasi secara kimia",
    21:
      "1513 29 Minyak inti sawit dan babassu serta fraksinya, dimurnikan maupun tidak, tetapi tidak dimodifikasi secara kimia (tidak termasuk minyak mentah)",
    22:
      "2306 60 Bungkil minyak dan residu padat lainnya dari kacang atau inti sawit, digiling atau dalam bentuk pelet maupun tidak, hasil ekstraksi lemak atau minyak dari kacang atau kernel",
    23:
      "2905 45 Gliserol, dengan kemurnian 95 % atau lebih (dihitung berdasarkan berat produk kering)",
    24: "2915 70 Asam palmitat, asam stearat, garam dan esternya",
    25:
      "2915 90 Asam monokarboksilat asiklik jenuh, anhidrida, halida, peroksida dan asam peroksinya; turunan halogenasi, sulfonasi, nitrasi atau nitrosasinya (tidak termasuk asam format, asam asetat, asam mono-, di- atau trikloroasetat, asam propionat, asam butanoat, asam pentanoat, asam palmitat, asam stearat, garam dan esternya, dan anhidrida asetat)",
    26: "3823 11 Asam stearat, industri",
    27: "3823 12 Asam oleat, industri",
    28:
      "3823 19 Asam lemak monokarboksilat industri; minyak asam dari penyulingan (tidak termasuk asam stearat, asam oleat dan asam lemak minyak tinggi)",
    29: "3823 70 Alkohol lemak industri",
    30:
      "4001 Karet alam, balata, gutta-percha, guayule, chicle dan getah alam semacam itu, dalam bentuk asal atau dalam bentuk pelat, lembaran atau strip",
    31:
      "4005 Karet majemuk, tidak divulkanisasi, dalam bentuk asal atau dalam pelat, lembaran atau strip",
    32:
      "4006 Karet yang tidak divulkanisasi dalam bentuk lain (misalnya batangan, tabung dan bentuk profil) dan barang (misalnya cakram dan cincin)",
    33: "4007 Benang dan tali karet yang divulkanisasi",
    34:
      "4008 Pelat, lembaran, strip, batang dan bentuk profil, dari karet vulkanisasi selain karet keras",
    35:
      "4010 Belt atau belting pengangkut atau transmisi, dari karet vulkanisasi",
    36: "4011 Ban pneumatik baru, dari karet",
    37:
      "4012 Ban pneumatik vulkanisir atau bekas dari karet; ban padat atau bantalan, tapak ban dan penutup ban, dari karet",
    38: "4013 Ban dalam, dari karet",
    39:
      "4015 Pakaian dan aksesoris pakaian (termasuk sarung tangan, sarung tangan dan mitt), untuk segala keperluan, dari karet vulkanisasi selain karet keras",
    40:
      "4016 Barang lain dari karet vulkanisasi selain karet keras, tidak dirinci pada pos lain dalam Bab 40",
    41:
      "4017 Karet keras (misalnya ebonit) dalam segala bentuk termasuk sisa dan skrap; barang dari karet keras",
    42: "1201 Kacang kedelai, pecah maupun tidak",
    43: "1208 10 Tepung dan tepung kacang kedelai",
    44:
      "1507 Minyak kacang kedelai dan fraksinya, dimurnikan maupun tidak, tetapi tidak dimodifikasi secara kimia",
    45:
      "2304 Bungkil minyak dan residu padat lainnya, digiling atau tidak atau dalam bentuk pelet, hasil ekstraksi minyak kacang kedelai",
    46:
      "4401 Kayu bakar, dalam bentuk batang kayu, dalam billet, dalam ranting, dalam kayu bakar atau dalam bentuk semacam itu; kayu dalam bentuk serpihan atau partikel; serbuk gergaji dan limbah serta skrap kayu, diaglomerasi maupun tidak dalam bentuk kayu bulat, briket, pelet atau bentuk semacam itu",
    47:
      "4402 Arang kayu (termasuk arang tempurung atau arang kacang), diaglomerasi maupun tidak",
    48:
      "4403 Kayu dalam keadaan kasar, dikupas kulit kayu atau gubalnya maupun tidak, atau berbentuk persegi kasar",
    49:
      "4404 Kayu Hoop; tiang terbelah; tiang pancang, tiang pancang dan tiang pancang dari kayu, runcing tetapi tidak digergaji memanjang; tongkat kayu, dipotong secara kasar tetapi tidak dibalik, dibengkokkan atau dikerjakan dengan cara lain, cocok untuk pembuatan tongkat jalan, payung, gagang perkakas atau sejenisnya; kayu chip dan sejenisnya",
    50: "4405 Wol kayu; tepung kayu",
    51:
      "4406 Bantalan rel kereta api atau trem (ikatan silang) dari kayu",
    52:
      "4407 Kayu digergaji atau dikelupas memanjang, diiris atau dikupas, diketam, diampelas atau disambung ujung maupun tidak, dengan ketebalan melebihi 6 mm",
    53:
      "4408 Lembaran untuk pelapisan (termasuk yang diperoleh dengan cara mengiris kayu yang dilaminasi), untuk kayu lapis atau untuk kayu laminasi yang serupa lainnya dan kayu lainnya, digergaji memanjang, diiris atau dikupas, diratakan, diamplas, disambung atau disambung ujung maupun tidak, dengan ketebalan tidak melebihi 6mm",
    54:
      "4409 Kayu (termasuk strip dan friezes untuk lantai parket, tidak dirakit) dibentuk terus menerus (berlidah, beralur, rabat, dilubangi, bersendi V, manik-manik, dibentuk, dibulatkan atau sejenisnya) di sepanjang tepi, ujung atau mukanya, baik atau tidak direncanakan, diampelas atau bersendi ujung",
    55:
      "4410 Papan partikel, papan untai berorientasi (OSB) dan papan semacam itu (misalnya, papan wafer) dari kayu atau bahan mengandung lignin lainnya, diaglomerasi dengan resin atau bahan pengikat organik lainnya maupun tidak",
    56:
      "4411 Papan serat dari kayu atau bahan mengandung lignin lainnya, direkatkan dengan resin atau bahan organik lainnya maupun tidak",
    57: "4412 Kayu lapis, panel veneer dan kayu laminasi semacam itu",
    58:
      "4413 Kayu dipadatkan, dalam bentuk balok, pelat, strip atau profil",
    59:
      "4414 Bingkai kayu untuk lukisan, foto, cermin atau benda semacam itu",
    60:
      "4415 Kotak pengepakan, kotak, peti, drum dan pengepakan semacam itu, dari kayu; drum kabel dari kayu; palet, palet kotak dan papan muatan lainnya, dari kayu;",
    61:
      "kerah palet dari kayu (tidak termasuk bahan pengemas yang digunakan secara eksklusif sebagai bahan pengemas untuk menopang, melindungi atau membawa produk lain yang dipasarkan)",
    62:
      "4416 Tong, tong, tong, bak dan produk-produk tembaga lainnya serta bagiannya, dari kayu, termasuk tongkat",
    63:
      "4417 Perkakas, badan perkakas, gagang perkakas, badan dan gagang sapu atau sikat, dari kayu; bahan boot atau sepatu dan pohon, dari kayu",
    64:
      "4418 Pekerjaan tukang kayu dan pertukangan dari kayu, termasuk panel kayu seluler, panel lantai rakitan, sirap dan getar",
    65: "4419 Peralatan makan dan dapur, dari kayu",
    66:
      "4420 Kayu marquetry dan kayu hias; peti mati dan kotak untuk perhiasan atau peralatan makan, dan barang semacam itu, dari kayu; patung-patung dan hiasan lainnya, dari kayu; perabot kayu tidak termasuk dalam Bab 94",
    67: "4421 Barang lainnya dari kayu",
    68:
      "Pulp dan kertas dari Bab 47 dan 48 dari Tata Nama Gabungan, dengan pengecualian produk berbahan dasar bambu dan produk hasil daur ulang (limbah dan skrap)",
    69:
      "49 Buku cetak, surat kabar, gambar dan produk industri percetakan lainnya, manuskrip, naskah ketikan dan denah, dari kertas",
    70:
      "9401 Tempat duduk (selain yang dimaksud dalam pos 9402), dapat diubah menjadi tempat tidur maupun tidak, dan bagiannya, dari kayu",
    71:
      "9403 30 , 9403 40 , 9403 50 , 9403 60 dan 9403 91 Perabotan kayu dan bagiannya",
    72: "9406 10 Bangunan prefabrikasi dari kayu",
    }
    }

      if (languageCode === 'id' || languageCode === 'ID' || languageCode === 'Indonesian') {
        let tmpArr = []
        tmpArr = subProductList.map(subP => {
            return {
                id: subP.id,
                name: translatedObj["id"][subP.id]
            }
        })
        return tmpArr
    } else {
    // Otherwise, return the original array where translatedName is the same as name
    return subProductList
  }
    
}
