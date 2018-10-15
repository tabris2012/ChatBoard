import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
 
export default class NewFavDialog extends React.Component {
  inputText = {
    group: "",
    value: "",
    url: "",
  }

  changeInputText = (target) => (event) => {
    this.inputText[target] = event.target.value;
  };

  onClickSave = () => {
    this.props.addFavorite(this.inputText.group,
      this.inputText.value, this.inputText.url);
  };
 
  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.toggleDialog(false)}
        aria-labelledby="dialog-title"
      >
        <DialogTitle id="dialog-title">{"New Favorite"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter new Favorite info:
          </DialogContentText>
          <TextField 
            autoFocus
            margin="dense"
            id="group"
            label="Group"
            fullWidth
            onChange={this.changeInputText('group')}
          />
          <TextField 
            required
            margin="dense"
            id="name"
            label="Name"
            fullWidth
            onChange={this.changeInputText('value')}
          />
          <TextField 
            required
            margin="dense"
            id="url"
            label="URL"
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
              this.onClickSave();
              this.props.toggleDialog(false)();}}
            color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
