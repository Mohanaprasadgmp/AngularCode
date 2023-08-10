import { Component } from '@angular/core';
import { ReportService } from '../../services/report.service';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
@Component({
  selector: 'app-auditlog',
  templateUrl: './auditlog.component.html',
  styleUrls: ['./auditlog.component.scss'],
})
export class AuditlogComponent {
  showTable = false;
  fileName = 'AuditLog.xlsx';
  constructor(public reportService: ReportService) {}
  loginAuditData = [];
  dataAuditData = [];
  btn_prev = true;
  btn_next = false;
  selectedReport = '--Not Selected--';
  fromDate: Date;
  toDate: Date;
  minToDate: string;
  maxToDate: string;
  nextPage = () => {};

  previousPage = () => {};

  changePage = (page) => {};

  numPages = () => {};

  calculateToDateOptions() {
    // consol.log('Hi');
    // consol.log(this.fromDate);
    if (this.fromDate) {
      const currentDate = moment().startOf('day');
      const maxDate = moment(this.fromDate).add(2, 'months');
      const selectedDate = moment(this.fromDate).startOf('day');

      this.minToDate = moment(this.fromDate).format('YYYY-MM-DD[T]HH:mm');
      this.maxToDate = maxDate.isAfter(currentDate)
        ? currentDate.format('YYYY-MM-DD[T]HH:mm')
        : maxDate.format('YYYY-MM-DD[T]HH:mm');

      if (selectedDate.isAfter(maxDate)) {
        this.toDate = null;
      } else {
        this.toDate = this.fromDate;
      }
    } else {
      this.minToDate = null;
      this.maxToDate = null;
      this.toDate = null;
    }
  }

  viewAuditReport = () => {
    this.showTable = true;
    // consol.log(this.selectedReport);
    let params = {};
    if (this.selectedReport === 'Data Audit Report') {
      this.dataAuditData = [];
      params = {
        action: 'getDataAudit',
        FromDate: this.fromDate,
        ToDate: this.toDate,
      };
      // consol.log('Params ', params);
      this.reportService.getDataAudit(params).subscribe((response) => {
        // consol.log(response);
        for (let i = 0; i < response.body.length; i++) {
          response.body[i].remarks = '';

          if (
            response.body[i].module === 'HolidayManagement' &&
            response.body[i].action === 'INSERT'
          ) {
            // consol.log('Holiday Insert');
            let jsonObjectInsert = JSON.parse(response.body[i].newdata);
            response.body[i].remarks =
              "HolidayName '" +
              jsonObjectInsert.holidayname +
              "' has been inserted";
          }

          if (
            response.body[i].module === 'WrapUpManagement' &&
            response.body[i].action === 'INSERT'
          ) {
            let jsonObjectInsert = JSON.parse(response.body[i].newdata);
            response.body[i].remarks =
              "Wrapup Code '" +
              jsonObjectInsert.WUP_Code +
              "' has been inserted";
          }

          if (
            response.body[i].module === 'BroadcastManagement' &&
            response.body[i].action === 'INSERT'
          ) {
            // consol.log('broadcast ', response.body);
            response.body[i].remarks =
              "New Broadcast message '" +
              JSON.parse(response.body[i].newdata).message +
              "' has been created for " +
              JSON.parse(response.body[i].newdata).agentorqueue +
              '. ';
          }

          if (
            response.body[i].module === 'HolidayManagement' &&
            response.body[i].action === 'DELETE'
          ) {
            // consol.log('Holiday delete');
            let jsonObjectDelete = JSON.parse(response.body[i].newdata);
            response.body[i].remarks =
              "HolidayName '" +
              jsonObjectDelete.holidayname +
              "' has been deleted";
          }

          if (
            response.body[i].module === 'WrapUpManagement' &&
            response.body[i].action === 'DELETE'
          ) {
            // consol.log('Wrap up delete');
            let jsonObjectDelete = JSON.parse(response.body[i].newdata);
            response.body[i].remarks =
              "Wrapup Code '" +
              jsonObjectDelete.wuP_Code +
              "' has been deleted";
          }

          if (
            response.body[i].module === 'HolidayManagement' &&
            response.body[i].action === 'UPDATE'
          ) {
            // consol.log('Holiday update');
            let jsonObject1;
            if (response.body[i].olddata !== 'NA') {
              jsonObject1 = JSON.parse(response.body[i].olddata);
            }
            let jsonObject2;
            if (response.body[i].olddata !== 'NA') {
              jsonObject2 = JSON.parse(response.body[i].newdata);
            }

            if (
              jsonObject1 !== null &&
              jsonObject1 !== undefined &&
              jsonObject2 !== null &&
              jsonObject2 !== undefined
            ) {
              if (
                JSON.parse(jsonObject1).holidayname !==
                JSON.parse(jsonObject2).holidayname
              ) {
                response.body[i].remarks =
                  response.body[i].remarks +
                  "Holidayname changed from '" +
                  JSON.parse(jsonObject1).holidayname +
                  "' to '" +
                  JSON.parse(jsonObject2).holidayname;
                +"'. ";
              }
              if (
                JSON.parse(jsonObject1).holidaymessage !==
                JSON.parse(jsonObject2).holidaymessage
              ) {
                response.body[i].remarks =
                  response.body[i].remarks +
                  "HolidayMessage changed from '" +
                  JSON.parse(jsonObject1).holidaymessage +
                  "' to '" +
                  JSON.parse(jsonObject2).holidaymessage +
                  "'. ";
              }
              if (
                JSON.parse(jsonObject1).fromdate !==
                JSON.parse(jsonObject2).fromdate
              ) {
                response.body[i].remarks =
                  response.body[i].remarks +
                  "FromDate changed from '" +
                  JSON.parse(jsonObject1).fromdate +
                  "' to '" +
                  JSON.parse(jsonObject2).fromdate +
                  "'. ";
              }
              if (
                JSON.parse(jsonObject1).todate !==
                JSON.parse(jsonObject2).todate
              ) {
                response.body[i].remarks =
                  response.body[i].remarks +
                  "ToDate changed from '" +
                  JSON.parse(jsonObject1).todate +
                  "' to '" +
                  JSON.parse(jsonObject2).todate +
                  "'. ";
              }
              if (JSON.parse(jsonObject1).csc !== JSON.parse(jsonObject2).csc) {
                response.body[i].remarks =
                  response.body[i].remarks +
                  "CSC changed from '" +
                  JSON.parse(jsonObject1).csc +
                  "' to '" +
                  JSON.parse(jsonObject2).csc +
                  "'. ";
              }
              if (JSON.parse(jsonObject1).hr !== JSON.parse(jsonObject2).hr) {
                response.body[i].remarks =
                  response.body[i].remarks +
                  "HR changed from '" +
                  JSON.parse(jsonObject1).hr +
                  "' to '" +
                  JSON.parse(jsonObject2).hr +
                  "'. ";
              }
            }
          }

          if (
            response.body[i].module === 'WrapUpManagement' &&
            response.body[i].action === 'UPDATE'
          ) {
            let jsonObject1;
            if (response.body[i].olddata !== 'NA') {
              jsonObject1 = JSON.parse(response.body[i].olddata);
            }
            let jsonObject2;
            if (response.body[i].olddata !== 'NA') {
              jsonObject2 = JSON.parse(response.body[i].newdata);
            }

            if (
              jsonObject1 !== null &&
              jsonObject1 !== undefined &&
              jsonObject2 !== null &&
              jsonObject2 !== undefined
            ) {
              if (
                JSON.parse(jsonObject1).wuP_Code !==
                JSON.parse(jsonObject2).WUP_Code
              ) {
                response.body[i].remarks =
                  response.body[i].remarks +
                  "Wrapup Code changed from '" +
                  JSON.parse(jsonObject1).wuP_Code +
                  "' to '" +
                  JSON.parse(jsonObject2).WUP_Code +
                  "'";
              }
            }
          }

          if (
            response.body[i].module === 'Call Transcript' &&
            response.body[i].action === 'INSERT'
          ) {
            response.body[i].remarks =
              'Call Transcript has been searched for period from ' +
              JSON.stringify(
                JSON.parse(response.body[i].newdata).fromdate
              ).replace('T', ' ') +
              ' to ' +
              JSON.stringify(
                JSON.parse(response.body[i].newdata).todate
              ).replace('T', ' ');
          }

          if (
            response.body[i].module === 'Call Transcript' &&
            response.body[i].action === 'UPDATE'
          ) {
            response.body[i].remarks =
              'mCARE Ref No. has been updated from ' +
              response.body[i].olddata +
              ' to ' +
              response.body[i].newdata;
          }
        }
        this.dataAuditData = response.body;
        // consol.log('Data Audit Report ', this.dataAuditData);
      });
    } else if (this.selectedReport === 'Login Audit Report') {
      this.loginAuditData = [];
      params = {
        action: 'getLoginAudit',
        FromDate: this.fromDate,
        ToDate: this.toDate,
      };
      // consol.log('Params ', params);
      this.reportService.getLoginAudit(params).subscribe((response) => {
        // consol.log(response);
        this.loginAuditData = response.body;
      });
    }
  };

  exportexcel = () => {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    if (this.selectedReport === 'Data Audit Report') {
      this.fileName = 'Data Audit Report.xlsx';
    }
    if (this.selectedReport === 'Login Audit Report') {
      this.fileName = 'Login Audit Report.xlsx';
    }
    XLSX.writeFile(wb, this.fileName);
  };

  // clearField = () => {
  //   this.fromDate = '';
  //   this.toDate = '';
  // };

  reset = () => {
    this.showTable = false;
    this.selectedReport = '';
    this.fromDate = null;
    this.minToDate = null;
    this.maxToDate = null;
    this.toDate = null;
  };
  convertDate = (str: any) => {
    if (str !== null) {
      const utcTimestamp = new Date(str);

      // Extract date components
      const year = utcTimestamp.getUTCFullYear();
      const month = String(utcTimestamp.getUTCMonth() + 1).padStart(2, '0');
      const day = String(utcTimestamp.getUTCDate()).padStart(2, '0');

      // Extract time components
      const hours = String(utcTimestamp.getUTCHours()).padStart(2, '0');
      const minutes = String(utcTimestamp.getUTCMinutes()).padStart(2, '0');

      // Formatted date-time string
      //const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
      const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
      return formattedDateTime;
    }
  };
}
