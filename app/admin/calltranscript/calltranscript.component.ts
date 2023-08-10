import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranscriptService } from '../../services/transcript.service';
import { CalltranscriptpopupComponent } from './calltranscriptpopup/calltranscriptpopup.component';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
@Component({
  selector: 'app-calltranscript',
  templateUrl: './calltranscript.component.html',
  styleUrls: ['./calltranscript.component.scss'],
})
export class CalltranscriptComponent {
  current_page = 1;
  records_per_page = 7;
  btn_prev = true;
  btn_next = false;
  customerContentToShow = [];
  paginationAvailable = false;
  transcriptList = [];
  transcriptIsPresent = false;

  // showTable = false;
  rows: { button2Enabled: boolean }[] = [];
  contactID: string = '';
  mcareCaseID: string = '';
  transcriptData = [];
  audioUrl: string = 'data:audio/mpeg;base64,';
  showPlayButton = false;
  fromDate!: Date;
  toDate!: Date;
  maxToDate: string;
  minToDate: string;
  constructor(
    public toastr: ToastrService,
    public dialog: MatDialog,
    public transcriptService: TranscriptService
  ) {}

  calculateToDateOptions() {
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

  searchTranscript = () => {
    // this.showTable = true;
    let fromDate = new Date(this.fromDate);
    let toDate = new Date(this.toDate);

    if (fromDate > toDate) {
      this.toastr.warning('FromDate is greater than ToDate!');
    } else if (this.fromDate === null && this.toDate === null) {
      this.toastr.warning('FromDate and ToDate is mandatory!');
    } else if (this.fromDate === null) {
      this.toastr.warning('FromDate and ToDate is mandatory!');
    } else if (this.toDate === null) {
      this.toastr.warning('FromDate and ToDate is mandatory!');
    } else {
      this.audioUrl = '';
      this.showPlayButton = true;
      let params = {
        action: 'getTranscript',
        fromdate: this.fromDate,
        todate: this.toDate,
        contactid: this.contactID,
        caseid: this.mcareCaseID,
        searchedBy: sessionStorage.getItem('awsAgentID'),
        department: sessionStorage.getItem('screenToDisplay'),
      };
      this.transcriptService.getTranscript(params).subscribe((response) => {
        console.log(response);
        // if (response.body.length > 0) {
        //   this.transcriptData = response.body;
        // }
        this.customerContentToShow = [];
        this.transcriptList = [];
        if (response === null) {
          this.transcriptIsPresent = false;
        }
        if (
          response &&
          response.body &&
          response.body.length > this.records_per_page
        ) {
          this.transcriptIsPresent = true;
          this.paginationAvailable = true;
          this.transcriptList = response.body;
          this.numPages();
          this.current_page = 1;
          this.btn_next = false;
          this.btn_prev = true;
          //this.changePage(this.current_page);
          for (let i = 0; i < this.records_per_page; i++) {
            //  this.rows.push({ button2Enabled: false });
            response.body[i]['button2Enabled'] = false;
            if (response.body[i]) {
              this.customerContentToShow.push(response.body[i]);
            }
          }
        } else {
          this.transcriptIsPresent = true;
          this.transcriptList = response.body;
          this.numPages();
          this.current_page = 1;
          this.btn_next = false;
          this.btn_prev = true;
          //this.changePage(this.current_page);
          this.paginationAvailable = false;
          for (let i = 0; i < response.body.length; i++) {
            // this.rows.push({ button2Enabled: false });
            response.body[i]['button2Enabled'] = false;
            if (response.body[i]) {
              this.customerContentToShow.push(response.body[i]);
            }
          }
        }
        console.log(this.customerContentToShow);
        if (response.body.length > 0) {
          this.transcriptIsPresent = true;
        } else {
          this.transcriptIsPresent = false;
        }
      });
    }
  };

  downloadTranscript = (contactid: any) => {
    let params = {
      action: 'downloadTranscript',
      contactID: contactid,
      auditaction: 'DOWNLOAD',
      module: 'CallTranscript',
      newdata: JSON.stringify({
        contactid: contactid,
      }),
      olddata: 'NA',
      actionowner: sessionStorage.getItem('awsAgentID'),
      department: sessionStorage.getItem('screenToDisplay'),
    };
    console.log('transcript params: ', params);
    this.transcriptService.downloadTranscript(params).subscribe((response) => {
      console.log('transcript response: ', response);
      if (Object.keys(response.body).length > 0) {
        this.downloadCSV(response.body, contactid + '.csv');
      } else {
        this.toastr.warning('No transcript is avaible');
      }
    });
  };

  downloadCSV = (data: any[], filename: string) => {
    const csvContent = this.convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  convertToCSV = (data: any[]) => {
    const header = Object.keys(data[0]).join('|') + '\n';
    const rows = data.map((item) => Object.values(item).join('|')).join('\n');
    return header + rows;
  };

  play = (contactid: any, index: any) => {
    this.customerContentToShow[index].button2Enabled =
      !this.customerContentToShow[index].button2Enabled;
    console.log(this.customerContentToShow);
    let params = {
      action: 'startStream',
      contactID: contactid,
    };
    try {
      this.transcriptService.startStream(params).subscribe((response) => {
        console.log('transcript start stream response: ', response);
        this.showPlayButton = false;
        this.audioUrl = 'data:audio/mpeg;base64,' + response.body;
      });
    } catch (error) {
      console.error('Error starting the stream:', error);
    }
  };
  stop = (index: any) => {
    this.customerContentToShow[index].button2Enabled =
      !this.customerContentToShow[index].button2Enabled;
    console.log(this.customerContentToShow);
  };
  editmCareCaseId = (mcareCaseID: any, contactid: any) => {
    let oldmcareCaseID = mcareCaseID;
    let dataToShare = {
      action: 'editmCareCaseId',
      mcareCaseID: mcareCaseID,
      contactID: contactid,
    };
    const dialogRef = this.dialog.open(CalltranscriptpopupComponent, {
      data: dataToShare,
    });
    dialogRef.afterClosed().subscribe((result) => {
      let params = result.data;
      params['oldmcareCaseID'] = oldmcareCaseID;
      params['searchedBy'] = sessionStorage.getItem('awsAgentID');
      this.transcriptService.updatemCareCaseId(params).subscribe((response) => {
        console.log(response);
        this.transcriptService
          .getTranscript({
            action: 'getTranscript',
            fromdate: this.fromDate,
            todate: this.toDate,
            contactid: this.contactID,
            caseid: this.mcareCaseID,
            searchedBy: sessionStorage.getItem('awsAgentID'),
            department: sessionStorage.getItem('screenToDisplay'),
          })
          .subscribe((response) => {
            // if (response.body.length > 0) {
            //   this.transcriptData = response.body;
            // }
            this.customerContentToShow = [];
            this.transcriptList = [];
            if (response === null) {
              this.transcriptIsPresent = false;
            }
            if (
              response &&
              response.body &&
              response.body.length > this.records_per_page
            ) {
              this.paginationAvailable = true;
              this.transcriptIsPresent = true;
              this.transcriptList = response.body;
              this.numPages();
              this.current_page = 1;
              this.btn_next = false;
              this.btn_prev = true;
              //this.changePage(this.current_page);
              for (let i = 0; i < this.records_per_page; i++) {
                if (response.body[i]) {
                  this.customerContentToShow.push(response.body[i]);
                }
              }
            } else {
              this.transcriptList = response.body;
              this.transcriptIsPresent = true;
              this.numPages();
              this.current_page = 1;
              this.btn_next = false;
              this.btn_prev = true;
              //this.changePage(this.current_page);
              this.paginationAvailable = false;
              for (let i = 0; i < response.body.length; i++) {
                if (response.body[i]) {
                  this.customerContentToShow.push(response.body[i]);
                }
              }
            }

            if (response.body.length > 0) {
              this.transcriptIsPresent = true;
            } else {
              this.transcriptIsPresent = false;
            }
          });
      });
    });
  };

  reset = () => {
    //this.showTable = false;
    this.contactID = '';
    this.mcareCaseID = '';
    this.minToDate = null;
    this.maxToDate = null;
    this.fromDate = null;
    this.toDate = null;
    this.transcriptIsPresent = false;
    this.customerContentToShow = [];
  };

  nextPage = () => {
    console.log(this.numPages());
    if (this.current_page < this.numPages()) {
      this.current_page++;
      this.changePage(this.current_page);
    }
  };

  previousPage = () => {
    if (this.current_page > 1) {
      this.current_page--;
      this.changePage(this.current_page);
    }
  };

  changePage = (page) => {
    this.customerContentToShow = [];
    if (page < 1) page = 1;
    if (page > this.numPages()) page = this.numPages();
    for (
      var i = (page - 1) * this.records_per_page;
      i < page * this.records_per_page;
      i++
    ) {
      if (this.transcriptList[i]) {
        this.customerContentToShow.push(this.transcriptList[i]);
      }
    }

    if (page == 1) {
      this.btn_prev = true;
    } else {
      this.btn_prev = false;
    }

    if (page == this.numPages()) {
      this.btn_next = true;
    } else {
      this.btn_next = false;
    }
  };

  numPages = () => {
    return Math.ceil(this.transcriptList.length / this.records_per_page);
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
