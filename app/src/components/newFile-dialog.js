import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
const path = require('path');
 
export default class NewFileDialog extends React.Component {
  inputText = "";

  changeInputText = (event) => {
    this.inputText = event.target.value;
  };

  onClickSave = () => {
    var dirname = path.dirname(this.inputText);
    const basename = path.basename(this.inputText);

    if (dirname == './') { //カレントディレクトリの表示は消す
      dirname = '';
    }
    
    this.props.makeFile(basename,dirname);
  };
 
  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.toggleDialog(false)}
        aria-labelledby="dialog-title"
      >
        <DialogTitle id="dialog-title">{"New Channel"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter new Channel name:
          </DialogContentText>
          <TextField 
            autoFocus
            margin="dense"
            id="name"
            label="#"
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
