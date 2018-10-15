import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
 
export default class RenameFileDialog extends React.Component {
  inputText="";

  changeInputText = (event) => {
    this.inputText = event.target.value;
  };

  onClickRename = () => {
    this.props.renamePath(this.inputText);
  };

  onClickDelete = () => {
    this.props.renamePath(null);
  };
 
  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.toggleDialog(false)}
        aria-labelledby="dialog-title"
      >
        <DialogTitle id="dialog-title">{"Rename Channel"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Rename this Channel name:
          </DialogContentText>
          <TextField 
            autoFocus
            margin="dense"
            id="name"
            label="#"
            defaultValue={this.props.filepath}
            fullWidth
            onChange={this.changeInputText}
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
          </Button>
          <Button
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
