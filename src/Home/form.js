import React from 'react';
import Button from '@material-ui/core/Button';
import { withSnackbar } from 'notistack';

// import MenuItem from '@material-ui/core/MenuItem';
// import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import NameIcon from '@material-ui/icons/SupervisorAccount';
import HomeIcon from '@material-ui/icons/Home';
import EmailIcon from '@material-ui/icons/Email';
import CssBaseline from '@material-ui/core/CssBaseline';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from 'react-select';

import localforage from 'localforage';
import { bulkAdd } from '../util';

const countries = [
  { label: 'United States (USA)', value: 'USA' },
  { label: 'Canada', value: 'CAN' },
  { label: 'Mexico', value: 'MEX' },
  { label: 'Afghanistan', value: 'AFG' },
  { label: 'Albania', value: 'ALB' },
  { label: 'Algeria', value: 'DZA' },
  { label: 'American Samoa', value: 'ASM' },
  { label: 'Andorra', value: 'AND' },
  { label: 'Angola', value: 'AGO' },
  { label: 'Anguilla', value: 'AIA' },
  { label: 'Antarctica', value: 'ATA' },
  { label: 'Antigua and Barbuda', value: 'ATG' },
  { label: 'Argentina', value: 'ARG' },
  { label: 'Armenia', value: 'ARM' },
  { label: 'Aruba', value: 'ABW' },
  { label: 'Australia', value: 'AUS' },
  { label: 'Austria', value: 'AUT' },
  { label: 'Azerbaijan', value: 'AZE' },
  { label: 'Bahamas', value: 'BHS' },
  { label: 'Bahrain', value: 'BHR' },
  { label: 'Bangladesh', value: 'BGD' },
  { label: 'Barbados', value: 'BRB' },
  { label: 'Belarus', value: 'BLR' },
  { label: 'Belgium', value: 'BEL' },
  { label: 'Belize', value: 'BLZ' },
  { label: 'Benin', value: 'BEN' },
  { label: 'Bermuda', value: 'BMU' },
  { label: 'Bhutan', value: 'BTN' },
  { label: 'Bolivia', value: 'BOL' },
  { label: 'Bonaire', value: 'BES' },
  { label: 'Bosnia and Herzegovina', value: 'BIH' },
  { label: 'Botswana', value: 'BWA' },
  { label: 'Bouvet Island', value: 'BVT' },
  { label: 'Brazil', value: 'BRA' },
  { label: 'British Indian Ocean Territory', value: 'IOT' },
  { label: 'Brunei Darussalam', value: 'BRN' },
  { label: 'Bulgaria', value: 'BGR' },
  { label: 'Burkina Faso', value: 'BFA' },
  { label: 'Burundi', value: 'BDI' },
  { label: 'Cambodia', value: 'KHM' },
  { label: 'Cameroon', value: 'CMR' },
  { label: 'Canada', value: 'CAN' },
  { label: 'Cape Verde', value: 'CPV' },
  { label: 'Cayman Islands', value: 'CYM' },
  { label: 'Central African Republic', value: 'CAF' },
  { label: 'Chad', value: 'TCD' },
  { label: 'Chile', value: 'CHL' },
  { label: 'China', value: 'CHN' },
  { label: 'Christmas Island', value: 'CXR' },
  { label: 'Cocos (Keeling) Islands', value: 'CCK' },
  { label: 'Colombia', value: 'COL' },
  { label: 'Comoros', value: 'COM' },
  { label: 'Congo', value: 'COG' },
  { label: 'Democratic Republic of the Congo', value: 'COD' },
  { label: 'Cook Islands', value: 'COK' },
  { label: 'Costa Rica', value: 'CRI' },
  { label: 'Croatia', value: 'HRV' },
  { label: 'Cuba', value: 'CUB' },
  { label: 'Curacao', value: 'CUW' },
  { label: 'Cyprus', value: 'CYP' },
  { label: 'Czech Republic', value: 'CZE' },
  { label: "Cote d'Ivoire", value: 'CIV' },
  { label: 'Denmark', value: 'DNK' },
  { label: 'Djibouti', value: 'DJI' },
  { label: 'Dominica', value: 'DMA' },
  { label: 'Dominican Republic', value: 'DOM' },
  { label: 'Ecuador', value: 'ECU' },
  { label: 'Egypt', value: 'EGY' },
  { label: 'El Salvador', value: 'SLV' },
  { label: 'Equatorial Guinea', value: 'GNQ' },
  { label: 'Eritrea', value: 'ERI' },
  { label: 'Estonia', value: 'EST' },
  { label: 'Ethiopia', value: 'ETH' },
  { label: 'Falkland Islands (Malvinas)', value: 'FLK' },
  { label: 'Faroe Islands', value: 'FRO' },
  { label: 'Fiji', value: 'FJI' },
  { label: 'Finland', value: 'FIN' },
  { label: 'France', value: 'FRA' },
  { label: 'French Guiana', value: 'GUF' },
  { label: 'French Polynesia', value: 'PYF' },
  { label: 'French Southern Territories', value: 'ATF' },
  { label: 'Gabon', value: 'GAB' },
  { label: 'Gambia', value: 'GMB' },
  { label: 'Georgia', value: 'GEO' },
  { label: 'Germany', value: 'DEU' },
  { label: 'Ghana', value: 'GHA' },
  { label: 'Gibraltar', value: 'GIB' },
  { label: 'Greece', value: 'GRC' },
  { label: 'Greenland', value: 'GRL' },
  { label: 'Grenada', value: 'GRD' },
  { label: 'Guadeloupe', value: 'GLP' },
  { label: 'Guam', value: 'GUM' },
  { label: 'Guatemala', value: 'GTM' },
  { label: 'Guernsey', value: 'GGY' },
  { label: 'Guinea', value: 'GIN' },
  { label: 'Guinea-Bissau', value: 'GNB' },
  { label: 'Guyana', value: 'GUY' },
  { label: 'Haiti', value: 'HTI' },
  { label: 'Heard Island and McDonald Islands', value: 'HMD' },
  { label: 'Holy See (Vatican City State)', value: 'VAT' },
  { label: 'Honduras', value: 'HND' },
  { label: 'Hong Kong', value: 'HKG' },
  { label: 'Hungary', value: 'HUN' },
  { label: 'Iceland', value: 'ISL' },
  { label: 'India', value: 'IND' },
  { label: 'Indonesia', value: 'IDN' },
  { label: 'Iran, Islamic Republic of', value: 'IRN' },
  { label: 'Iraq', value: 'IRQ' },
  { label: 'Ireland', value: 'IRL' },
  { label: 'Isle of Man', value: 'IMN' },
  { label: 'Israel', value: 'ISR' },
  { label: 'Italy', value: 'ITA' },
  { label: 'Jamaica', value: 'JAM' },
  { label: 'Japan', value: 'JPN' },
  { label: 'Jersey', value: 'JEY' },
  { label: 'Jordan', value: 'JOR' },
  { label: 'Kazakhstan', value: 'KAZ' },
  { label: 'Kenya', value: 'KEN' },
  { label: 'Kiribati', value: 'KIR' },
  { label: "Korea, Democratic People's Republic of", value: 'PRK' },
  { label: 'Korea, Republic of', value: 'KOR' },
  { label: 'Kuwait', value: 'KWT' },
  { label: 'Kyrgyzstan', value: 'KGZ' },
  { label: "Lao People's Democratic Republic", value: 'LAO' },
  { label: 'Latvia', value: 'LVA' },
  { label: 'Lebanon', value: 'LBN' },
  { label: 'Lesotho', value: 'LSO' },
  { label: 'Liberia', value: 'LBR' },
  { label: 'Libya', value: 'LBY' },
  { label: 'Liechtenstein', value: 'LIE' },
  { label: 'Lithuania', value: 'LTU' },
  { label: 'Luxembourg', value: 'LUX' },
  { label: 'Macao', value: 'MAC' },
  { label: 'Macedonia, the Former Yugoslav Republic of', value: 'MKD' },
  { label: 'Madagascar', value: 'MDG' },
  { label: 'Malawi', value: 'MWI' },
  { label: 'Malaysia', value: 'MYS' },
  { label: 'Maldives', value: 'MDV' },
  { label: 'Mali', value: 'MLI' },
  { label: 'Malta', value: 'MLT' },
  { label: 'Marshall Islands', value: 'MHL' },
  { label: 'Martinique', value: 'MTQ' },
  { label: 'Mauritania', value: 'MRT' },
  { label: 'Mauritius', value: 'MUS' },
  { label: 'Mayotte', value: 'MYT' },
  { label: 'Mexico', value: 'MEX' },
  { label: 'Micronesia, Federated States of', value: 'FSM' },
  { label: 'Moldova, Republic of', value: 'MDA' },
  { label: 'Monaco', value: 'MCO' },
  { label: 'Mongolia', value: 'MNG' },
  { label: 'Montenegro', value: 'MNE' },
  { label: 'Montserrat', value: 'MSR' },
  { label: 'Morocco', value: 'MAR' },
  { label: 'Mozambique', value: 'MOZ' },
  { label: 'Myanmar', value: 'MMR' },
  { label: 'Namibia', value: 'NAM' },
  { label: 'Nauru', value: 'NRU' },
  { label: 'Nepal', value: 'NPL' },
  { label: 'Netherlands', value: 'NLD' },
  { label: 'New Caledonia', value: 'NCL' },
  { label: 'New Zealand', value: 'NZL' },
  { label: 'Nicaragua', value: 'NIC' },
  { label: 'Niger', value: 'NER' },
  { label: 'Nigeria', value: 'NGA' },
  { label: 'Niue', value: 'NIU' },
  { label: 'Norfolk Island', value: 'NFK' },
  { label: 'Northern Mariana Islands', value: 'MNP' },
  { label: 'Norway', value: 'NOR' },
  { label: 'Oman', value: 'OMN' },
  { label: 'Pakistan', value: 'PAK' },
  { label: 'Palau', value: 'PLW' },
  { label: 'Palestine, State of', value: 'PSE' },
  { label: 'Panama', value: 'PAN' },
  { label: 'Papua New Guinea', value: 'PNG' },
  { label: 'Paraguay', value: 'PRY' },
  { label: 'Peru', value: 'PER' },
  { label: 'Philippines', value: 'PHL' },
  { label: 'Pitcairn', value: 'PCN' },
  { label: 'Poland', value: 'POL' },
  { label: 'Portugal', value: 'PRT' },
  { label: 'Puerto Rico', value: 'PRI' },
  { label: 'Qatar', value: 'QAT' },
  { label: 'Romania', value: 'ROU' },
  { label: 'Russian Federation', value: 'RUS' },
  { label: 'Rwanda', value: 'RWA' },
  { label: 'Reunion', value: 'REU' },
  { label: 'Saint Barthelemy', value: 'BLM' },
  { label: 'Saint Helena', value: 'SHN' },
  { label: 'Saint Kitts and Nevis', value: 'KNA' },
  { label: 'Saint Lucia', value: 'LCA' },
  { label: 'Saint Martin (French part)', value: 'MAF' },
  { label: 'Saint Pierre and Miquelon', value: 'SPM' },
  { label: 'Saint Vincent and the Grenadines', value: 'VCT' },
  { label: 'Samoa', value: 'WSM' },
  { label: 'San Marino', value: 'SMR' },
  { label: 'Sao Tome and Principe', value: 'STP' },
  { label: 'Saudi Arabia', value: 'SAU' },
  { label: 'Senegal', value: 'SEN' },
  { label: 'Serbia', value: 'SRB' },
  { label: 'Seychelles', value: 'SYC' },
  { label: 'Sierra Leone', value: 'SLE' },
  { label: 'Singapore', value: 'SGP' },
  { label: 'Sint Maarten (Dutch part)', value: 'SXM' },
  { label: 'Slovakia', value: 'SVK' },
  { label: 'Slovenia', value: 'SVN' },
  { label: 'Solomon Islands', value: 'SLB' },
  { label: 'Somalia', value: 'SOM' },
  { label: 'South Africa', value: 'ZAF' },
  { label: 'South Georgia and the South Sandwich Islands', value: 'SGS' },
  { label: 'South Sudan', value: 'SSD' },
  { label: 'Spain', value: 'ESP' },
  { label: 'Sri Lanka', value: 'LKA' },
  { label: 'Sudan', value: 'SDN' },
  { label: 'Suriname', value: 'SUR' },
  { label: 'Svalbard and Jan Mayen', value: 'SJM' },
  { label: 'Swaziland', value: 'SWZ' },
  { label: 'Sweden', value: 'SWE' },
  { label: 'Switzerland', value: 'CHE' },
  { label: 'Syrian Arab Republic', value: 'SYR' },
  { label: 'Taiwan', value: 'TWN' },
  { label: 'Tajikistan', value: 'TJK' },
  { label: 'United Republic of Tanzania', value: 'TZA' },
  { label: 'Thailand', value: 'THA' },
  { label: 'Timor-Leste', value: 'TLS' },
  { label: 'Togo', value: 'TGO' },
  { label: 'Tokelau', value: 'TKL' },
  { label: 'Tonga', value: 'TON' },
  { label: 'Trinidad and Tobago', value: 'TTO' },
  { label: 'Tunisia', value: 'TUN' },
  { label: 'Turkey', value: 'TUR' },
  { label: 'Turkmenistan', value: 'TKM' },
  { label: 'Turks and Caicos Islands', value: 'TCA' },
  { label: 'Tuvalu', value: 'TUV' },
  { label: 'Uganda', value: 'UGA' },
  { label: 'Ukraine', value: 'UKR' },
  { label: 'United Arab Emirates', value: 'ARE' },
  { label: 'United Kingdom', value: 'GBR' },
  { label: 'United States (USA)', value: 'USA' },
  { label: 'United States Minor Outlying Islands', value: 'UMI' },
  { label: 'Uruguay', value: 'URY' },
  { label: 'Uzbekistan', value: 'UZB' },
  { label: 'Vanuatu', value: 'VUT' },
  { label: 'Venezuela', value: 'VEN' },
  { label: 'Viet Nam', value: 'VNM' },
  { label: 'British Virgin Islands', value: 'VGB' },
  { label: 'US Virgin Islands', value: 'VIR' },
  { label: 'Wallis and Futuna', value: 'WLF' },
  { label: 'Western Sahara', value: 'ESH' },
  { label: 'Yemen', value: 'YEM' },
  { label: 'Zambia', value: 'ZMB' },
  { label: 'Zimbabwe', value: 'ZWE' },
];

export const Form = withSnackbar(props => {
  const {
    values: { firstName, lastName, email, zipcode, country, agree },
    errors,
    touched,
    handleChange,
    isValid,
    setFieldTouched,
    resetForm,
    setFieldValue,
    enqueueSnackbar
  } = props;

  function handleEnter(event) {
    if (event.keyCode === 13) {
      const form = event.target.form;
      const index = Array.prototype.indexOf.call(form, event.target);
      form.elements[index + 1].focus();
      event.preventDefault();
    }
  }

  const change = (name, e) => {
    e.persist();
    handleChange(e);
    setFieldTouched(name, true, false);
  };
  return (
    <form
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="none"
      spellCheck="false"
      onSubmit={async e => {
        e.preventDefault();
        enqueueSnackbar('Thank you!', {variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'right', }, autoHideDuration: 3000});

        const pending = (await localforage.getItem('pendingRSVP')) || [];
        pending.push({
          firstName,
          lastName,
          email,
          zipcode,
          country,
        });
        await localforage.setItem('pendingRSVP', pending);
        await bulkAdd();
        resetForm();
      }}>
      <CssBaseline />
      <TextField
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck="false"
        id="firstName"
        name="firstName"
        helperText={touched.firstName ? errors.firstName : ''}
        error={touched.firstName && Boolean(errors.firstName)}
        label="First Name"
        value={firstName}
        onKeyDown={handleEnter}
        onChange={change.bind(null, 'firstName')}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <NameIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck="false"
        id="lastName"
        name="lastName"
        helperText={touched.lastName ? errors.lastName : ''}
        error={touched.lastName && Boolean(errors.lastName)}
        label="Last Name"
        value={lastName}
        onChange={change.bind(null, 'lastName')}
        onKeyDown={handleEnter}

        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <NameIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck="false"
        id="email"
        name="email"
        helperText={touched.email ? errors.email : ''}
        onKeyDown={handleEnter}
        error={touched.email && Boolean(errors.email)}
        label="Email"
        fullWidth
        value={email}
        onChange={change.bind(null, 'email')}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck="false"
        id="zipcode"
        name="zipcode"
        helperText={touched.zipcode ? errors.zipcode : ''}
        error={touched.zipcode && Boolean(errors.zipcode)}
        label="Zip/Postal code"
        fullWidth
        onKeyDown={handleEnter}
        type="text"
        value={zipcode}
        onChange={change.bind(null, 'zipcode')}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <HomeIcon />
            </InputAdornment>
          ),
        }}
      />

      <div style={{ margin: '5px 0' }}>
        <Select
          label="Country"
          id="country"
          name="country"
          error={touched.country && Boolean(errors.country)}
          onChange={({ value }) => {
            setFieldValue('country', value);
            setFieldTouched('country', true, false);
          }}
          value={country ? countries.find(o => o.value === country) : ''}
          ignoreCase
          autoBlur
          options={countries}
        />
      </div>
      <FormGroup row>
        <FormControlLabel
          control={<Checkbox id="agree" name="agree" error={touched.agree && Boolean(errors.agree)} onChange={change.bind(null, 'agree')} checked={agree} />}
          label="I agree to receive email communication from Amma Groups"
        />
      </FormGroup>
      <Button type="submit" fullWidth variant="contained" color="primary" disabled={!isValid}>
        Submit
      </Button>
      
    </form>
  );
});
