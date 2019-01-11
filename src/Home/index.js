import React, { Component } from 'react';
import { Formik } from 'formik';
import withStyles from '@material-ui/core/styles/withStyles';
import { Form } from './form';
import * as Yup from 'yup';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 5}px ${theme.spacing.unit * 5}px ${theme.spacing.unit * 5}px`,
  },
});

const validationSchema = Yup.object({
  email: Yup.string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  firstName: Yup.string('Enter your First Name').required('First Name is required'),
  lastName: Yup.string('Enter your Last Name').required('Last Name is required'),
  zipcode: Yup.string('Enter your Zipcode').required('Zipcode is required'),
  country: Yup.string('Enter your Country').required('Country is required'),
  agree: Yup.boolean().oneOf([true], 'Must Accept Terms and Conditions'),
});

class InputForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    const values = { email: '', firstName: '', lastName: '', zipcode: '', country: 'US', agree: true };
    return (
      <React.Fragment>
        <div className={classes.container}>
          <div className={classes.paper}>
            <h1>Stay in touch</h1>
            <Formik render={props => <Form {...props} />} initialValues={values} validationSchema={validationSchema} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(InputForm);
