import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
//import { folderListItems } from './side-menu';
import MuiTreeView from 'material-ui-treeview';
import MenuIcon from '@material-ui/icons/Menu';
import Request from 'request';

const styles = {
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
};
 
class SwipeableTemporaryDrawer extends React.Component {
  state = {
    left: false,
    folderList: [],
  };
 
  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });

    if (open) { //サイドメニューを開くときにフォルダ取得
      Request.get('http://localhost/api/folder', function (err, res, body){
        var data = JSON.parse(body);
        
        if (err) {
          console.log('Request error: '+ err.message);
          return;
        }

        console.log(data);

        this.setState({
          'folderList': data,
        });
      }.bind(this)); 
    }
  };
 
  render() {
    const { classes } = this.props;
 
    return (
      <div>
        <MenuIcon onClick={this.toggleDrawer('left', true)} />
        <SwipeableDrawer
          open={this.state.left}
          onClose={this.toggleDrawer('left', false)}
          onOpen={this.toggleDrawer('left', true)}
        >
          <div
            tabIndex={0}
            role="button"
            /*onClick={this.toggleDrawer('left', false)}
            onKeyDown={this.toggleDrawer('left', false)}*/
          >
            <div className={classes.list}>
              <MuiTreeView tree={this.state.folderList} />
            </div>
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}
 
SwipeableTemporaryDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};
 
export default withStyles(styles)(SwipeableTemporaryDrawer);