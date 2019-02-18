import React, { PureComponent } from 'react';
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
import localforage from 'localforage';

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

class Header extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      pendingChanges: 0,
    };
    setInterval(this.checkLocalForage, 500);
  }

  checkLocalForage = async () => {
    const pending = (await localforage.getItem('pendingRSVP')) || [];
    if (pending.length !== this.state.pendingChanges) {
      this.setState({ pendingChanges: pending.length });
    }
    if (localStorage.sessid && !this.state.loggedIn) {
      this.setState({ loggedIn: true });
    }
  };
  logout = () => {
    delete localStorage.sessid;
    this.setState({ loggedIn: false });
  };
  render() {
    const { classes } = this.props;
    const { pendingChanges } = this.state;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            {pendingChanges > 0 && (
              <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={bulkAdd}>
                <SyncIcon /> {pendingChanges}
              </IconButton>
            )}
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
            {this.state.loggedIn ? (
              <Button
                style={{
                  fontWeight: 'bold',
                  color: 'inherit',
                  textDecoration: 'inherit',
                }}
                onClick={this.logout}>
                Logout
              </Button>
            ) : (
              <NavLink
                to="/login"
                style={{
                  fontWeight: 'bold',
                  color: 'inherit',
                  textDecoration: 'inherit',
                }}>
                <Button color="inherit">Login</Button>
              </NavLink>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
