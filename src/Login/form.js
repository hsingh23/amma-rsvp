import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import LockIcon from '@material-ui/icons/Lock';
import EmailIcon from '@material-ui/icons/Email';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withRouter } from 'react-router-dom';
const errorLogger = error => {
  console.error(error);
  return error;
};

export const Form = withRouter(props => {
  const {
    values: { email, password },
    errors,
    touched,
    handleChange,
    isValid,
    setFieldTouched,
    resetForm,
    history,
  } = props;

  const change = (name, e) => {
    e.persist();
    handleChange(e);
    console.log(errors);
    setFieldTouched(name, true, false);
  };
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        fetch('https://lists.ammagroups.org/test/login', { body: { email, password }, method: 'POST' })
          .then(resp => resp.json(), errorLogger)
          .then(resp => {
            const apiKey = resp && resp.apiKey;
            if (apiKey) {
              localStorage.apiKey = apiKey;
              resetForm();
              history.push('/');
            }
          }, errorLogger);
      }}>
      <CssBaseline />
      <TextField
        id="email"
        name="email"
        helperText={touched.email ? errors.email : ''}
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
        id="password"
        name="password"
        helperText={touched.password ? errors.password : ''}
        error={touched.password && Boolean(errors.password)}
        label="Password"
        fullWidth
        type="password"
        value={password}
        onChange={change.bind(null, 'password')}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          ),
        }}
      />
      <Button type="submit" fullWidth variant="contained" color="primary" disabled={!isValid}>
        Submit
      </Button>
    </form>
  );
});
