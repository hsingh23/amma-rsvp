import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SyncIcon from '@material-ui/icons/Sync';
import { NavLink } from 'react-router-dom';
import { bulkAdd } from './util';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

function ButtonAppBar(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={bulkAdd}>
            <SyncIcon />
          </IconButton>
          <NavLink
            to="/"
            className={classes.grow}
            activeStyle={{
              fontWeight: 'bold',
              color: 'inherit',
              textDecoration: 'inherit',
            }}>
            <Typography variant="h6" color="inherit">
              Amma RSVP
            </Typography>
          </NavLink>
          <NavLink
            to="/login"
            style={{
              fontWeight: 'bold',
              color: 'inherit',
              textDecoration: 'inherit',
            }}>
            <Button color="inherit">Login</Button>
          </NavLink>
        </Toolbar>
      </AppBar>
    </div>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);
