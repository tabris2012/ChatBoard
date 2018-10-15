import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
 
export default class RenameFavDialog extends React.Component {
  inputText = {
    group: "",
    value: "",
    url: "",
  }

  changeInputText = (target) => (event) => {
    this.inputText[target] = event.target.value;
  };

  onClickRename = () => {
    this.props.renameFavorite(this.inputText);
  };

  onClickDelete = () => {
    this.props.renameFavorite(null);
  };
 
  render() {
    this.inputText.group = this.props.fromFav.group;
    this.inputText.value = this.props.fromFav.value;
    this.inputText.url = this.props.fromFav.url;

    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.toggleDialog(false)}
        aria-labelledby="dialog-title"
      >
        <DialogTitle id="dialog-title">{"Rename/Delete Favorite"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Rename Favorite:
          </DialogContentText>
          <TextField 
            autoFocus
            margin="dense"
            id="group"
            label="Group"
            defaultValue={this.props.fromFav.group}
            fullWidth
            onChange={this.changeInputText('group')}
          />
          <TextField 
            required
            margin="dense"
            id="name"
            label="Name"
            defaultValue={this.props.fromFav.value}
            fullWidth
            onChange={this.changeInputText('value')}
          />
          <TextField 
            required
            margin="dense"
            id="url"
            label="URL"
            defaultValue={this.props.fromFav.url}
            fullWidth
            onChange={this.changeInputText('url')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.toggleDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              this.onClickRename();
              this.props.toggleDialog(false)();}}
            color="primary" autoFocus>
            Rename
          </Button><Button
            onClick={() => {
              this.onClickDelete();
              this.props.toggleDialog(false)();}}
            color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
