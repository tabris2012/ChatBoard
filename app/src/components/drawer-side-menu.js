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
import MenuIcon from '@material-ui/icons/Menu';
import TreeMenu from './tree-menu';
import NewFileDialog from './newFile-dialog';
import RenameFileDialog from './renameFile-dialog';
import {requestAPI} from './api-call';

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
    this.filename = "";

    this.state = {
      left: false,
      folderList: [],
      newFile: false,
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
      requestAPI({path: '/api/folder'}, (err, res, body) => {
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
  
  renameHistory = (toPath) => { //toPathがnullのときは削除
    requestAPI(toPath==null ? {
      path: '/api/history/delete',
      json: {
        path: this.filename,
      },
    } : {
      path: '/api/history/rename',
      json: {
        fromPath: this.filename,
        toPath: toPath,
      },
    }, (err, res, body) => {
      var data = body;
      
      if (err) {
        console.log('Request error: '+ err.message);
        return;
      }

      this.toggleDrawer('left', true)();
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
        </List>
        <Divider />
        <TreeMenu 
          menuList={this.state.folderList}
          onLeafClick={(node, parent) => {
            this.loadHistory(node.value.replace(/^# /g,''), parent);
            this.toggleDrawer('left', false)();}} //表示上の#を消す
          onIconLeafClick={(node, parent) => {
            this.filename=(parent==null ? node.value.replace(/^# /g,'') : parent.path+"/"+node.value.replace(/^# /g,''))
            this.toggleDialog('renameFile')(true)();}}
          onIconRootClick={(node, parent) => {
            this.filename=(parent==null ? node.value.replace(/^# /g,'') : parent.path+"/"+node.value.replace(/^# /g,''))
            this.toggleDialog('renameFile')(true)();}}
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
        <RenameFileDialog 
          open={this.state.renameFile}
          toggleDialog={this.toggleDialog('renameFile')}
          filepath={this.filename}
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