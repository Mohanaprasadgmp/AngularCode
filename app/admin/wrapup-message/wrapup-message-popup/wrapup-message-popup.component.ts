import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wrapup-message-popup',
  templateUrl: './wrapup-message-popup.component.html',
  styleUrls: ['./wrapup-message-popup.component.scss'],
})
export class WrapupMessagePopupComponent {
  action!: string;
  local_data: any;
  addWrapupCode!: string;
  oldEditWrapup!: any;
  editWrapupCode!: string;
  deleteWrapName: '';
  constructor(
    public toastr: ToastrService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WrapupMessagePopupComponent>
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    console.log(data);
    if (data.action === 'editWrapup') {
      this.oldEditWrapup = data.wrapupDetail;
      this.editWrapupCode = data.wrapupDetail.wuP_Code;
    }
    if (data.action === 'deleteWrapup') {
      this.deleteWrapName = data.wrapupDetail.wuP_Code;
    }
  }

  addWrapup = () => {
    let addWrapupParams = {
      action: 'addAdminWrapup',
      Id: 0,
      CreatedBy: sessionStorage.getItem('awsAgentID'),
      CreatedDate: new Date(),
      UpdatedBy: sessionStorage.getItem('awsAgentID'),
      WUP_Code: this.addWrapupCode,
      department: sessionStorage.getItem('screenToDisplay'),
    };

    // console.log(this.action);
    this.dialogRef.close({ event: this.action, data: addWrapupParams });
  };

  editWrapup = () => {
    let editWrapupParams = {
      action: 'editAdminWrapup',
      Id: this.oldEditWrapup.id,
      CreatedBy: this.oldEditWrapup.CreatedBy,
      UpdatedBy: sessionStorage.getItem('awsAgentID'),
      WUP_Code: this.editWrapupCode,
      olddata: JSON.stringify(this.oldEditWrapup),
      newdata: JSON.stringify({
        WUP_Code: this.editWrapupCode,
        CreatedBy: this.oldEditWrapup.CreatedBy,
      }),
      department: sessionStorage.getItem('screenToDisplay'),
    };
    // console.log('editWrapupParams', editWrapupParams);
    this.dialogRef.close({ event: this.action, data: editWrapupParams });
  };

  deleteWrapup = () => {
    // console.log(this.data);
    let deleteWrapupParams = {
      action: 'deleteAdminWrapup',
      id: this.data.wrapupDetail.id,
      CreatedBy: this.data.wrapupDetail.CreatedBy,
      CreatedDate: this.data.wrapupDetail.CreatedDate,
      UpdatedBy: sessionStorage.getItem('awsAgentID'),
      UpdatedDate: new Date(),
      wuP_Code: this.data.wrapupDetail.wuP_Code,
      department: sessionStorage.getItem('screenToDisplay'),
    };
    // console.log('deleteWrapupParams', deleteWrapupParams);
    this.dialogRef.close({ event: this.action, data: deleteWrapupParams });
  };
  onClose = () => {
    this.dialogRef.close();
  };

  checkLength = (code: any) => {
    if (code.length > 28) {
      this.toastr.warning('Maximum character is reached');
    }
  };

  validateAddInput() {
    if (this.addWrapupCode.length > 0 && this.addWrapupCode[0] === ' ') {
      // Remove whitespace from the beginning of the input this.addWrapupCode
      this.addWrapupCode = this.addWrapupCode.trimLeft();
    }
  }

  validateEditInput() {
    if (this.editWrapupCode.length > 0 && this.editWrapupCode[0] === ' ') {
      // Remove whitespace from the beginning of the input this.editWrapupCode
      this.editWrapupCode = this.editWrapupCode.trimLeft();
    }
  }
}
