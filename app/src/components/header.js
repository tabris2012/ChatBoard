import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DrawerSideMenu from './drawer-side-menu';
import LaunchSideMenu from './launcher-side-menu';
 
const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

const default_filename = 'default';
 
class ButtonAppBar extends React.Component {
  constructor(props) {
    super(props);
    window.loadHistory("history", default_filename);
    
    this.state = {
      title: default_filename,
    }
  }

  updateState = (state) => {
    this.setState(state);
  }

  render () {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <DrawerSideMenu filename={this.state.title} updateState={this.updateState}/>
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              {'# '+this.state.title}
            </Typography>
            <IconButton color="inherit">
              <LaunchSideMenu />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
 
ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};
 
export default withStyles(styles)(ButtonAppBar);
