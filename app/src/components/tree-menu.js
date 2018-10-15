import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import InputIcon from '@material-ui/icons/Input';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});

class TreeMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dummy: true,
    };
  }
  
  expandStates = {}; //初期化

  handleClick = (nodePath) => () => {
    this.expandStates[nodePath] = !this.expandStates[nodePath];
    this.setState({ //変更通知のためダミーセット
      dummy: !this.state.dummy,
    })
  };

  render() {
    const { classes } = this.props;
    const menuList = [];

    const addMenuList = (node, parent, parentPath, parentList) => {
      if (node.nodes == null) { //Leafnode
        parentList.push(
          <ListItem button
            className={parentPath=="" ? "" : classes.nested}
            onClick={() => this.props.onLeafClick(node)}>
            <ListItemText primary={node.value} />
            <ListItemSecondaryAction>
              <IconButton aria-label="Delete">
                <InputIcon onClick={() => this.props.onIconLeafClick(node,parent)}/>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      } else {
        const nodePath = parentPath+"_"+node.value;
        if (this.expandStates[nodePath] == null) {
          this.expandStates[nodePath] = false; //開閉state初期値
        }

        parentList.push(
          <ListItem button
            onClick={this.handleClick(nodePath)}>
            <ListItemIcon>
              {this.expandStates[nodePath] ? <ExpandLess /> : <ExpandMore />}
            </ListItemIcon>
            <ListItemText primary={node.value} />
            <ListItemSecondaryAction>
              <IconButton aria-label="Delete">
                <InputIcon onClick={() => this.props.onIconRootClick(node,parent)}/>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
        
        const childList = [];

        node.nodes.forEach((oneNode) => {
          addMenuList(oneNode, node, nodePath, childList);
        });

        parentList.push(
          <Collapse in={this.expandStates[nodePath]}>
            <List disablePadding>
              {childList}
            </List>
          </Collapse>
        );
      }
    }

    this.props.menuList.forEach((oneNode) => {
      addMenuList(oneNode, null, "", menuList);
    })

    return (
      <List>
        {menuList}
      </List>
    );
  }
}

TreeMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TreeMenu);