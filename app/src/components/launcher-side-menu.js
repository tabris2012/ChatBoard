import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import FavIcon from '@material-ui/icons/Grade';
import MuiTreeView from 'material-ui-treeview';
import Request from 'request';
import NewFileDialog from './newFile-dialog';
import DeleteFileDialog from './deleteFile-dialog';

const styles = {
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
};
 
class SwipeableTemporaryDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.default_filename = this.props.filename;

    this.state = {
      right: false,
      folderList: [],
      newFile: false,
      deleteFile: false,
    };
  }
 
  toggleDrawer = (side, open) => () => { //カリー化：関数オブジェクトを返す
    if (!open) {
      this.setState({
        [side]: open,
      });
    } else {//サイドメニューを開くときにフォルダ取得
      Request.post('http://localhost/api/folder', (err, res, body) => {
        var data = JSON.parse(body);
        
        if (err) {
          console.log('Request error: '+ err.message);
          return;
        }

        this.setState({
          [side]: open,
          folderList: data,
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
      title: path,
    })
  };

  deleteHistory = () => {
    Request.post({
      url: 'http://localhost/api/history/delete',
      json: {
        path: this.props.filename,
      },
    }, (err, res, body) => {
      var data = body;
      
      if (err) {
        console.log('Request error: '+ err.message);
        return;
      }

      console.log(data);
      this.loadHistory(this.default_filename,null);
    }); 
  }

  toggleDialog = (target) => (open) => () => {
    this.setState({
      [target]: open,
    });
  };
 
  render() {
    const { classes } = this.props;

    const sideList = (
      <div className={classes.list}>
        <List>
          <ListItem button
            onClick={() => {
              this.toggleDrawer('right', false)();
              this.toggleDialog('newFile')(true)()}}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="New" />
          </ListItem>
          <ListItem button
            onClick={() => {
              this.toggleDrawer('right', false)();
              this.toggleDialog('deleteFile')(true)()}}
          >
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary="Delete" />
          </ListItem>
        </List>
        <Divider />
        <MuiTreeView
          tree={this.state.folderList}
          onLeafClick={(node, parent) => {
            this.toggleDrawer('right', false)();
            this.loadHistory(node, parent);}}
        />
      </div>
    );
 
    return (
      <div>
        <FavIcon onClick={this.toggleDrawer('right', true)} />
        <SwipeableDrawer
          open={this.state.right}
          onClose={this.toggleDrawer('right', false)}
          onOpen={this.toggleDrawer('right', true)}
        >
          <div
            tabIndex={0}
            role="button"
            /*onClick="loadHistory('history', 'test_history')"
            onKeyDown={this.toggleDrawer('right', false)}*/
          >
            {sideList}
          </div>
        </SwipeableDrawer>
        <NewFileDialog 
          open={this.state.newFile}
          toggleDialog={this.toggleDialog('newFile')}
          makeFile={(filename, parent) =>{this.loadHistory(filename, {path: parent})}}
        />
        <DeleteFileDialog 
          open={this.state.deleteFile}
          toggleDialog={this.toggleDialog('deleteFile')}
          deleteFile={this.deleteHistory}
        />
      </div>
    );
  }
}
 
SwipeableTemporaryDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};
 
export default withStyles(styles)(SwipeableTemporaryDrawer);