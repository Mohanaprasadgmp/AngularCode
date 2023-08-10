import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HolidayService } from '../../services/holiday.service';
import { HolidaypopupComponent } from './holidaypopup/holidaypopup.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.scss'],
})
export class HolidayComponent implements OnInit {
  current_page = 1;
  records_per_page = 9;
  btn_prev = true;
  btn_next = false;
  customerContentToShow = [];
  paginationAvailable = false;
  holidayList = [];
  holidayIsPresent = false;
  searchKey!: string;
  constructor(
    public holidayService: HolidayService,
    public dialog: MatDialog,
    public toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.holidayService
      .getAdminHolidays({
        action: 'getAdminHolidays',
      })
      .subscribe((response) => {
        console.log('Response is ', response.body);
        // if (response.body.length > 0) {
        //   this.holidayList = response.body;
        //   this.holidayIsPresent = true;
        // } else {
        //   this.holidayIsPresent = false;
        // }
        if (
          response &&
          response.body &&
          response.body.length > this.records_per_page
        ) {
          this.paginationAvailable = true;
          this.holidayList = response.body;
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
          this.holidayList = response.body;
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
          this.holidayIsPresent = true;
        } else {
          this.holidayIsPresent = false;
        }
      });
  }

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
      if (this.holidayList[i]) {
        this.customerContentToShow.push(this.holidayList[i]);
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
    console.log(Math.ceil(this.holidayList.length / this.records_per_page));
    return Math.ceil(this.holidayList.length / this.records_per_page);
  };

  addHolidays = () => {
    let dataToShare = {
      action: 'addHoliday',
    };
    const dialogRef = this.dialog.open(HolidaypopupComponent, {
      data: dataToShare,
    });
    dialogRef.afterClosed().subscribe((result) => {
      let params = result.data;
      // console.log(params);

      this.holidayService.addAdminHolidays(params).subscribe((response) => {
        console.log(response);
        if (response.body === 'Holiday Already Present for that Date') {
          this.toastr.warning('Holiday Already Present for that Date');
          return;
        }
        if (response.body === 'Successfully Inserted') {
          this.toastr.success('Data Inserted Successfully.');
          this.holidayService
            .getAdminHolidays({
              action: 'getAdminHolidays',
            })
            .subscribe((response) => {
              console.log('Getting value again');
              // if (response.body.length > 0) {
              //   this.holidayList = response.body;
              //   this.holidayIsPresent = true;
              // } else {
              //   this.holidayIsPresent = false;
              // }
              this.customerContentToShow = [];
              this.holidayList = [];
              if (
                response &&
                response.body &&
                response.body.length > this.records_per_page
              ) {
                this.paginationAvailable = true;
                this.holidayList = response.body;
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
                this.holidayList = response.body;
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
                this.holidayIsPresent = true;
              } else {
                this.holidayIsPresent = false;
              }
            });
        } else {
          this.toastr.error('Data insertion unsuccessfull.');
        }
      });
    });
  };

  deleteHoliday = (holidayData: any) => {
    let dataToShare = {
      action: 'deleteHoliday',
      holidayDetail: holidayData,
    };
    const dialogRef = this.dialog.open(HolidaypopupComponent, {
      data: dataToShare,
    });
    dialogRef.afterClosed().subscribe((result) => {
      let params = result.data;
      // console.log(params);

      this.holidayService.deleteAdminHolidays(params).subscribe((response) => {
        console.log(response);
        if (response.body === 'Successfully Deleted') {
          this.toastr.success('Data deleted successfully.');
          this.holidayService
            .getAdminHolidays({
              action: 'getAdminHolidays',
            })
            .subscribe((response) => {
              // if (response.body.length > 0) {
              //   this.holidayList = response.body;
              //   this.holidayIsPresent = true;
              // } else {
              //   this.holidayIsPresent = false;
              // }
              // this.holidayList = response.body;
              this.customerContentToShow = [];
              this.holidayList = [];
              if (
                response &&
                response.body &&
                response.body.length > this.records_per_page
              ) {
                this.paginationAvailable = true;
                this.holidayList = response.body;
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
                this.holidayList = response.body;
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
                this.holidayIsPresent = true;
              } else {
                this.holidayIsPresent = false;
              }
            });
        } else {
          this.toastr.error('Data Deletion unsuccessfull.');
        }
      });
    });
  };

  editHoliday = (holidayData: any) => {
    // console.log('holidayData ', holidayData);

    let dataToShare = {
      action: 'editHoliday',
      holidayDetail: holidayData,
    };
    const dialogRef = this.dialog.open(HolidaypopupComponent, {
      data: dataToShare,
    });
    dialogRef.afterClosed().subscribe((result) => {
      let params = result.data;
      console.log(params);

      this.holidayService.editAdminHolidays(params).subscribe((response) => {
        // console.log(response);
        if (response.body === 'Holiday Already Present for that Date') {
          this.toastr.warning('Holiday Already Present for that Date');
          return;
        }
        if (response.body === 'Successfully Updated') {
          this.toastr.success('Data updated successfully.');
          this.holidayService
            .getAdminHolidays({
              action: 'getAdminHolidays',
            })
            .subscribe((response) => {
              // if (response.body.length > 0) {
              //   this.holidayList = response.body;
              //   this.holidayIsPresent = true;
              // } else {
              //   this.holidayIsPresent = false;
              // }
              // this.holidayList = response.body;
              this.customerContentToShow = [];
              this.holidayList = [];
              if (
                response &&
                response.body &&
                response.body.length > this.records_per_page
              ) {
                this.paginationAvailable = true;
                this.holidayList = response.body;
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
                this.holidayList = response.body;
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
                this.holidayIsPresent = true;
              } else {
                this.holidayIsPresent = false;
              }
            });
        } else {
          this.toastr.error('Data update unsuccessfull.');
        }
      });
    });
  };

  searchTable = () => {
    var table = document.getElementById('myTable');
    var filter = this.searchKey;
    var rows = table.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
      var cells = rows[i].getElementsByTagName('td');
      var found = false;

      for (var j = 0; j < cells.length; j++) {
        var cell = cells[j];
        if (cell) {
          var cellText = cell.innerHTML.toLowerCase();
          if (cellText.indexOf(filter) > -1) {
            found = true;
            break;
          }
        }
      }

      if (found) {
        rows[i].style.display = '';
      } else {
        rows[i].style.display = 'none';
      }
    }
  };

  convertData = (date: any) => {
    const utcTimestamp = new Date(date);

    // Extract date components
    const year = utcTimestamp.getUTCFullYear();
    const month = String(utcTimestamp.getUTCMonth() + 1).padStart(2, '0');
    const day = String(utcTimestamp.getUTCDate()).padStart(2, '0');

    // Extract time components
    const hours = String(utcTimestamp.getUTCHours()).padStart(2, '0');
    const minutes = String(utcTimestamp.getUTCMinutes()).padStart(2, '0');

    // Formatted date-time string
    // const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
    const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
    return formattedDateTime;
  };
}
