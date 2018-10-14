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
import RenameIcon from '@material-ui/icons/Spellcheck';
import MenuIcon from '@material-ui/icons/Menu';
import MuiTreeView from 'material-ui-treeview';
import Request from 'request';
import NewFileDialog from './newFile-dialog';
import DeleteFileDialog from './deleteFile-dialog';
import RenameFileDialog from './renameFile-dialog';

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
      left: false,
      folderList: [],
      newFile: false,
      deleteFile: false,
      renameFile: false,
    };
  }

  addHeader = (json_array) => {
    function depthAddHeader(json_elem) {
      if (json_elem['nodes']) {
        json_elem['nodes'].forEach((child_elem) => {
          depthAddHeader(child_elem);
        })
      }
      else {
        json_elem['value'] = '# '+json_elem['value'];
      }
    }

    json_array.forEach((json_elem) => {
      depthAddHeader(json_elem)
    })
  }
 
  toggleDrawer = (side, open) => () => { //カリー化：関数オブジェクトを返す
    if (!open) {
      this.setState({
        [side]: open,
      });
    } else {//サイドメニューを開くときにフォルダ取得
      Request.post('http://localhost/api/folder', (err, res, body) => {
        var data = JSON.parse(body);
        this.addHeader(data);
        
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

  renameHistory = (toPath) => {
    Request.post({
      url: 'http://localhost/api/history/rename',
      json: {
        fromPath: this.props.filename,
        toPath: toPath,
      },
    }, (err, res, body) => {
      var data = body;
      
      if (err) {
        console.log('Request error: '+ err.message);
        return;
      }

      console.log(data);
      this.loadHistory(toPath,null);
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
              this.toggleDrawer('left', false)();
              this.toggleDialog('newFile')(true)()}}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="New" />
          </ListItem>
          <ListItem button
            onClick={() => {
              this.toggleDrawer('left', false)();
              this.toggleDialog('deleteFile')(true)()}}
          >
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary="Delete" />
          </ListItem>
          <ListItem button
            onClick={() => {
              this.toggleDrawer('left', false)();
              this.toggleDialog('renameFile')(true)()}}
          >
            <ListItemIcon>
              <RenameIcon />
            </ListItemIcon>
            <ListItemText primary="Rename" />
          </ListItem>
        </List>
        <Divider />
        <MuiTreeView
          tree={this.state.folderList}
          onLeafClick={(node, parent) => {
            this.toggleDrawer('left', false)();
            this.loadHistory(node.replace(/^# /g,''), parent);}} //表示上の#を消す
        />
      </div>
    );
 
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
        <RenameFileDialog 
          open={this.state.renameFile}
          toggleDialog={this.toggleDialog('renameFile')}
          filepath={this.props.filename}
          renamePath={this.renameHistory}
        />
      </div>
    );
  }
}
 
SwipeableTemporaryDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};
 
export default withStyles(styles)(SwipeableTemporaryDrawer);