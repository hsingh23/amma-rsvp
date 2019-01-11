import localforage from 'localforage';

export const errorLogger = error => {
  console.error(error);
  return error;
};

export const bulkAdd = async () => {
  try {
    const pending = (await localforage.getItem('pendingRSVP')) || [];
    if (pending.length > 0 && localStorage.apiKey) {
      const csv = [];
      csv[0] = [
        'DO NOT REMOVE/EDIT top 2 rows (tips and header)',
        '30 characters',
        '20 chars',
        '30 chars',
        '30 chars',
        '100 chars',
        '100 chars',
        '60 chars',
        '2 chars',
        '',
        '3 chars USA or CAN',
        '###-###-####',
        '###-###-####',
        '###-###-####',
        'HTML or TEXT',
        'YES or NO',
        'ANY or MONTHLY',
        'YYYY',
        '100 chars',
        'YES or NO',
        '500 chars',
        'YES or NO',
      ];
      csv[1] = [
        'email',
        'first_name',
        'middle_name',
        'last_name',
        'spiritual_name',
        'other_members',
        'address',
        'city',
        'state_short',
        'zip/postal_code',
        'country_abbrev',
        'home_phone',
        'work_phone',
        'mobile_phone',
        'email_format',
        'receive_email',
        'email_frequency',
        'year_met_mother',
        'source',
        'receive_letter',
        'comments_by_admin',
        'auto_add_to_groups',
      ];
      pending.forEach(({ firstName, lastName, email, zipcode, country }) =>
        csv.push([email, firstName, '', lastName, '', '', '', '', '', '', zipcode, country, '', '', 'HTML', 'YES', 'ANY', '', 'Amma RSVP App', 'YES', '', 'YES'])
      );
      await fetch('https://lists.ammagroups.org/test/dbaccess/api_ajax.php', {
        body: JSON.stringify({ csv, api_key: localStorage.apiKey, func_name: 'bulk_add' }),
        method: 'POST',
      })
        .then(resp => resp.json(), errorLogger)
        .then(resp => {
          if (resp && resp.success === 1) {
            return localforage.setItem('pendingRSVP', []);
          }
        });
    }
  } catch (e) {
    console.error(e);
  }
};