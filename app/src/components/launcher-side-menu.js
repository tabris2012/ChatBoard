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
import FavIcon from '@material-ui/icons/Grade';
import {requestAPI} from './api-call';
import TreeMenu from './tree-menu';
import NewFavDialog from './newFav-dialog';
import RenameFavDialog from './renameFav-dialog';

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
      favList: [],
      newFav: false,
      renameFav: false,
    };
  }

  fromFav = {
    group: "",
    value: "",
    url: "",
  };
 
  toggleDrawer = (side, open) => () => { //カリー化：関数オブジェクトを返す
    if (!open) {
      this.setState({
        [side]: open,
      });
    } else {//サイドメニューを開くときにお気に入り取得
      requestAPI({path: '/api/favorite'}, (err, res, body) => {
        var data = JSON.parse(body);
        
        if (err) {
          console.log('Request error: '+ err.message);
          return;
        }

        this.setState({
          [side]: open,
          favList: data,
        });
      }); 
    }
  };

  addFavorite = (groupName,valueName,url_path) => {
    if (groupName == "") { //groupName無しの時は第1層に追加
      this.state.favList.push({
        value: valueName,
        url: url_path,
      });
    }
    else {
      var findGroup = false;
      this.state.favList.some((oneGroup) => {
        if ((oneGroup.nodes != null) && (oneGroup.value == groupName)) {
          oneGroup.nodes.push({
            value: valueName,
            url: url_path,
          });
          findGroup = true;
          return true;
        }
      });
      if (!findGroup) {//最後まで見つからなかったら新規作成
        this.state.favList.push({
          value: groupName,
          nodes: [{
            value: valueName,
            url: url_path,
          }]
        });
      }
    }

    requestAPI({
      path: '/api/favorite/save',
      json: {
        data: this.state.favList,
      },
    }, (err, res, body) => {
      
      if (err) {
        console.log('Request error: '+ err.message);
        return;
      }
    }); 

    this.setState({
      favList: this.state.favList, //編集したことを通知
    });
  };

  openLink = (node, parent) => {
    var targetLayer = null

    if (parent == null) { //第1層検索
      targetLayer = this.state.favList;
    } else {//第2層検索
      targetLayer = parent.nodes;
    }

    targetLayer.forEach((oneGroup) => {
      if ((oneGroup.nodes == null) && (oneGroup.value == node)) {
        window.open(oneGroup.url);
      }
    });
  }

  renameFavorite = (toFav) => { //toFavがnullのときは削除
    if (this.fromFav.group == "") { //groupName無しの時は第1層探索
      var targetPos = 0;

      this.state.favList.some((oneNode) => {
        if ((oneNode.nodes == null) && (oneNode.value == this.fromFav.value)) {
          if (toFav == null) {
            this.state.favList.splice(targetPos,1);
          } else { //変数
            oneNode.value = toFav.value;
            oneNode.url = toFav.url;
          }
          return true;
        }

        targetPos += 1;
      });
    } else if (this.fromFav.value == "") { //valueが無いときgroupを編集
      var targetPos = 0;

      this.state.favList.some((oneGroup) => {
        if ((oneGroup.nodes != null) && (oneGroup.value == this.fromFav.group)) {
          if (toFav == null) {
            this.state.favList.splice(targetPos,1);
          } else { //変数
            oneGroup.value = toFav.group;
          }
          return true;
        }

        targetPos += 1;
      });
    } else {
      this.state.favList.some((oneGroup) => {
        if ((oneGroup.nodes != null) && (oneGroup.value == this.fromFav.group)) {
          var targetPos = 0;

          oneGroup.nodes.some((oneNode) => {
            if ((oneNode.nodes == null) && (oneNode.value == this.fromFav.value)) {
              if (toFav == null) {
                oneGroup.nodes.splice(targetPos,1);
              } else { //変数
                oneNode.value = toFav.value;
                oneNode.url = toFav.url;
              }
              return true;
            }

            targetPos += 1;
          });

          return true;
        }
      });
      //最後まで見つからなかったら何もしない
    }

    requestAPI({
      path: '/api/favorite/save',
      json: {
        data: this.state.favList,
      },
    }, (err, res, body) => {
      
      if (err) {
        console.log('Request error: '+ err.message);
        return;
      }
    }); 

    this.setState({
      favList: this.state.favList, //編集したことを通知
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
            onClick={this.toggleDialog('newFav')(true)}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="New" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <TreeMenu
            menuList={this.state.favList}
            onLeafClick={(node) => window.open(node.url)}
            onIconLeafClick={(node, parent) => {
              this.fromFav = {
                group: (parent==null ? "" : parent.value),
                value: node.value,
                url: node.url,
              }
              this.toggleDialog('renameFav')(true)()}}
            onIconRootClick={(node) => {
              this.fromFav = {
                group: node.value,
                value: "",
                url: "",
              }
              this.toggleDialog('renameFav')(true)()}}
        />
        </List>
      </div>
    );
 
    return (
      <div>
        <FavIcon onClick={this.toggleDrawer('right', true)} />
        <SwipeableDrawer
          open={this.state.right}
          anchor="right"
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
        <NewFavDialog 
          open={this.state.newFav}
          toggleDialog={this.toggleDialog('newFav')}
          addFavorite={this.addFavorite}
        />
        <RenameFavDialog 
          open={this.state.renameFav}
          toggleDialog={this.toggleDialog('renameFav')}
          fromFav={this.fromFav}
          renameFavorite={this.renameFavorite}
        />
      </div>
    );
  }
}
 
SwipeableTemporaryDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};
 
export default withStyles(styles)(SwipeableTemporaryDrawer);