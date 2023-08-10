import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-logoutpopup',
  templateUrl: './logoutpopup.component.html',
  styleUrls: ['./logoutpopup.component.scss'],
})
export class LogoutpopupComponent {
  constructor(public dialogRef: MatDialogRef<LogoutpopupComponent>) {}
  onClose = () => {
    this.dialogRef.close();
  };

  logout = () => {
    this.dialogRef.close({ event: 'logout' });
  };
}
