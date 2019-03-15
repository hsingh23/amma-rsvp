import localforage from 'localforage';

export const errorLogger = error => {
  console.error(error);
  return error;
};

export const getFormData = (obj, form, namespace) => {
  var fd = form || [];
  var formKey;

  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      formKey = namespace ? `${namespace}[${property}]` : property;
      if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
        getFormData(obj[property], fd, formKey);
      } else {
        fd.push(`${formKey}=${encodeURIComponent(obj[property])}`);
      }
    }
  }
  return fd.join('&');
};

export const bulkAdd = async () => {
  try {
    const pending = (await localforage.getItem('pendingRSVP')) || [];
    if (pending.length > 0 && localStorage.sessid) {
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
        csv.push([
          email, // 'email',
          firstName, // 'first_name',
          '', // 'middle_name',
          lastName, // 'last_name',
          '', // 'spiritual_name',
          '', // 'other_members',
          '', // 'address',
          '', // 'city',
          '', // 'state_short',
          zipcode, // postal_code',
          country, // 'country_abbrev',
          '', // 'home_phone',
          '', // 'work_phone',
          '', // 'mobile_phone',
          'HTML', // 'email_format',
          'YES', // 'receive_email',
          'ANY', // 'email_frequency',
          '', // 'year_met_mother',
          'Amma RSVP App', // 'source',
          'YES', // 'receive_letter',
          '', // 'comments_by_admin',
          'YES', // 'auto_add_to_groups',
        ])
      );
      await fetch(
        'https://lists.ammagroups.org/dbaccess/api_ajax.php',
        {
          body: getFormData({ csv, sessid: localStorage.sessid, func_name: 'bulk_add' }),
          method: 'POST',
          headers: new Headers({ 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' }),
        },
        errorLogger
      )
        .then(resp => resp.json(), errorLogger)
        .then(resp => {
          if (resp && resp.success === 1) {
            return localforage.setItem('pendingRSVP', []);
          }
        }, errorLogger);
    }
  } catch (e) {
    console.error(e);
  }
};
