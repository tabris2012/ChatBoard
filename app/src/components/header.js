import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DrawerSideMenu from './drawer-side-menu';
 
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
 
class ButtonAppBar extends React.Component {
  state = {
    'title': window.current_filepath,
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
              <DrawerSideMenu updateState={this.updateState}/>
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              {this.state.title}
            </Typography>
            <Button color="inherit">Login</Button>
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
