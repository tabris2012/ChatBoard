import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
 
export default class DeleteFileDialog extends React.Component {
  state = {
  };

  onClickDelete = () => {
    this.props.deleteFile();
  };
 
  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.toggleDialog(false)}
        aria-labelledby="dialog-title"
      >
        <DialogTitle id="dialog-title">{"Delete Channel"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete this channel?:
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.toggleDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              this.onClickDelete();
              this.props.toggleDialog(false)();}}
            color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
