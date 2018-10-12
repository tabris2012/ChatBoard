import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
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
 
  toggleDrawer = (side, open) => () => { //カリー化：関数オブジェクトを返す
    this.setState({
      [side]: open,
    });

    if (open) { //サイドメニューを開くときにフォルダ取得
      Request.post('http://localhost/api/folder', (err, res, body) => {
        var data = JSON.parse(body);
        
        if (err) {
          console.log('Request error: '+ err.message);
          return;
        }

        console.log(data);

        this.setState({
          'folderList': data,
        });
      }); 
    }
  };

  loadHistory = (node, parent) => {
    var path = node;

    if (parent != null) {
      path = parent.path+"/"+node;
    }
    
    window.loadHistory("history",path);
    this.props.updateState({
      'title': path,
    })
  }
 
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
            /*onClick="loadHistory('history', 'test_history')"
            onKeyDown={this.toggleDrawer('left', false)}*/
          >
            <div className={classes.list}>
              <MuiTreeView
                tree={this.state.folderList}
                onLeafClick={(node, parent) => {
                  this.toggleDrawer('left', false)();
                  this.loadHistory(node, parent);}}
              />
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