import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranscriptService } from '../../../services/transcript.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-calltranscriptpopup',
  templateUrl: './calltranscriptpopup.component.html',
  styleUrls: ['./calltranscriptpopup.component.scss'],
})
export class CalltranscriptpopupComponent {
  action!: string;
  local_data: any;
  mcareCaseID!: string;
  contactid!: string;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CalltranscriptpopupComponent>,
    public transcriptService: TranscriptService,
    public toastr: ToastrService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    this.mcareCaseID = this.local_data.mcareCaseID;
    this.contactid = this.local_data.contactID;
  }
  updateCaseID = () => {
    let deleteHolidayParams = {
      action: 'updatemCareCaseId',
      contactID: this.contactid,
      mCareCaseid: this.mcareCaseID,
      department: sessionStorage.getItem('screenToDisplay'),
    };

    this.dialogRef.close({
      event: this.action,
      data: deleteHolidayParams,
    });
  };

  onClose = () => {
    this.dialogRef.close();
  };
}
