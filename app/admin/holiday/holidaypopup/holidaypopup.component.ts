import { Component, Inject, Optional } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-holidaypopup',
  templateUrl: './holidaypopup.component.html',
  styleUrls: ['./holidaypopup.component.scss'],
})
export class HolidaypopupComponent {
  action!: string;
  local_data: any;
  editHolidayName!: string;
  editHolidayFromDate!: any;
  editHolidayToDate!: any;
  editcsc!: boolean;
  edithr!: boolean;
  editHolidayMessage = '';
  editOldHolidayDetails!: any;
  addAnnouncement = '';
  addName!: string;
  addFromDate!: string;
  addToDate!: string;
  hrSelected = false;
  cscSelected = false;
  mintoDateEdit!: string;
  minfromDateEdit!: string;
  mintoDateAdd!: string;
  minfromDateAdd!: string;
  currentDateObj: any;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<HolidaypopupComponent>
  ) {
    this.currentDateObj = new Date();
    this.mintoDateEdit = this.currentDateObj.toISOString().slice(0, 16);
    this.minfromDateEdit = this.currentDateObj.toISOString().slice(0, 16);
    this.mintoDateAdd = this.currentDateObj.toISOString().slice(0, 16);
    this.minfromDateAdd = this.currentDateObj.toISOString().slice(0, 16);
    this.local_data = { ...data };
    this.action = this.local_data.action;
    // console.log(data);
    if (data.action === 'editHoliday') {
      console.log(data);
      this.editOldHolidayDetails = data.holidayDetail;
      this.editHolidayName = data.holidayDetail.holidayname;
      this.editHolidayFromDate = this.convertDataEdit(
        data.holidayDetail.fromdate
      );
      this.editHolidayToDate = this.convertDataEdit(data.holidayDetail.todate);
      this.editcsc = data.holidayDetail.csc;
      this.edithr = data.holidayDetail.hr;
      this.editHolidayMessage = data.holidayDetail.holidaymessage;
    }
  }

  selectedCheckBox = (event: any, department: string) => {
    // console.log(department);
    // console.log(event);

    if (department === 'CSC') {
      // console.log(1);
      this.cscSelected = !this.cscSelected;
      // console.log(this.cscSelected);
    }
    if (department === 'HR') {
      this.hrSelected = !this.hrSelected;
      // console.log(this.hrSelected);
    }
  };

  editCheckBox = (event: any, department: string) => {
    // console.log(department);
    // console.log(event);

    if (department === 'CSC') {
      // console.log(1);
      this.editcsc = !this.editcsc;
      // console.log(this.editcsc);
    }
    if (department === 'HR') {
      this.edithr = !this.edithr;
      // console.log(this.edithr);
    }
  };

  convertDataEdit = (date: any) => {
    const utcTimestamp = new Date(date);

    // Extract date components
    const year = utcTimestamp.getUTCFullYear();
    const month = String(utcTimestamp.getUTCMonth() + 1).padStart(2, '0');
    const day = String(utcTimestamp.getUTCDate()).padStart(2, '0');

    // Extract time components
    const hours = String(utcTimestamp.getUTCHours()).padStart(2, '0');
    const minutes = String(utcTimestamp.getUTCMinutes()).padStart(2, '0');

    // Formatted date-time string
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
    return formattedDateTime;
  };

  addHoliday = () => {
    let addHolidayParams = {};
    // let fromDate = new Date(this.addFromDate);
    // let toDate = new Date(this.addToDate);

    if (this.addFromDate > this.addToDate) {
      this.toastr.warning('From Date is greater than To Date!');
    } else {
      addHolidayParams = {
        action: 'addAdminHolidays',
        createdby: sessionStorage.getItem('awsAgentID'),
        csc: this.cscSelected,
        fromdate: this.addFromDate,
        holidaymessage: this.addAnnouncement,
        holidayname: this.addName,
        hr: this.hrSelected,
        todate: this.addToDate,
        updatedby: '',
        department: sessionStorage.getItem('screenToDisplay'),
      };
      // console.log(this.action);
      this.dialogRef.close({ event: this.action, data: addHolidayParams });
    }
  };

  editHoliday = () => {
    let editHolidayParams = {};
    // let fromDate = new Date(this.editHolidayFromDate);
    // let toDate = new Date(this.editHolidayToDate);
    if (this.editHolidayFromDate > this.editHolidayToDate) {
      this.toastr.warning('From Date is greater than To Date!');
    } else {
      editHolidayParams = {
        action: 'editAdminHolidays',
        createdby: sessionStorage.getItem('awsAgentID'),
        createddate: this.editOldHolidayDetails.createddate,
        csc: this.editcsc,
        fromdate: this.editHolidayFromDate,
        holidayID: this.editOldHolidayDetails.holidayID,
        holidaymessage: this.editHolidayMessage,
        holidayname: this.editHolidayName,
        hr: this.edithr,
        todate: this.editHolidayToDate,
        olddata: JSON.stringify(this.editOldHolidayDetails),
        newdata: JSON.stringify({
          holidayname: this.editHolidayName,
          holidaymessage: this.editHolidayMessage,
          createdby: sessionStorage.getItem('awsAgentID'),
          fromdate: this.editHolidayFromDate,
          todate: this.editHolidayToDate,
          holidayID: this.editOldHolidayDetails.holidayID,
          createddate: this.editOldHolidayDetails.createddate,
          updatedby: sessionStorage.getItem('awsAgentID'),
          csc: this.editcsc,
          hr: this.edithr,
          updateddate: new Date(),
        }),
        updateddate: new Date(),
        updatedby: sessionStorage.getItem('awsAgentID'),
        department: sessionStorage.getItem('screenToDisplay'),
      };
      // console.log('editHolidayParams ', editHolidayParams);
      // console.log(this.action);
      this.dialogRef.close({
        event: this.action,
        data: editHolidayParams,
      });
    }
  };

  deleteHoliday = () => {
    let deleteHolidayParams = {
      action: 'deleteAdminHolidays',
      createdby: this.data.holidayDetail.createdby,
      csc: this.data.holidayDetail.csc,
      fromdate: this.data.holidayDetail.fromdate,
      holidayID: this.data.holidayDetail.holidayID,
      holidaymessage: this.data.holidayDetail.holidaymessage,
      holidayname: this.data.holidayDetail.holidayname,
      hr: this.data.holidayDetail.hr,
      todate: this.data.holidayDetail.todate,
      department: sessionStorage.getItem('screenToDisplay'),
      updatedby:
        this.data.holidayDetail.updatedby === null
          ? ''
          : this.data.holidayDetail.updatedby === null,
    };
    this.dialogRef.close({
      event: this.action,
      data: deleteHolidayParams,
    });
  };

  onClose = () => {
    this.dialogRef.close();
  };

  validateAddInput() {
    const regex = /^[a-zA-Z0-9\s]*$/;
    if (!regex.test(this.addAnnouncement)) {
      this.addAnnouncement = this.addAnnouncement.replace(
        /[^a-zA-Z0-9\s]/g,
        ''
      );
    }
    // if (this.addAnnouncement.length > 0 && this.addAnnouncement[0] === ' ') {
    //   // Remove whitespace from the beginning of the input this.addAnnouncement
    //   this.addAnnouncement = this.addAnnouncement.trimLeft();
    // }
  }

  validateEditInput() {
    const regex = /^[a-zA-Z0-9\s]*$/;
    if (!regex.test(this.editHolidayMessage)) {
      this.editHolidayMessage = this.editHolidayMessage.replace(
        /[^a-zA-Z0-9\s]/g,
        ''
      );
    }
    // if (
    //   this.editHolidayMessage.length > 0 &&
    //   this.editHolidayMessage[0] === ' '
    // ) {
    //   // Remove whitespace from the beginning of the input this.editHolidayMessage
    //   this.editHolidayMessage = this.editHolidayMessage.trimLeft();
    // }
  }
}
