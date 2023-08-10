import { Component, OnInit } from '@angular/core';
import { WrapupService } from '../../services/wrapup.service';
import { MatDialog } from '@angular/material/dialog';
import { WrapupMessagePopupComponent } from './wrapup-message-popup/wrapup-message-popup.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-wrapup-message',
  templateUrl: './wrapup-message.component.html',
  styleUrls: ['./wrapup-message.component.scss'],
})
export class WrapupMessageComponent implements OnInit {
  current_page = 1;
  records_per_page = 9;
  btn_prev = true;
  btn_next = false;
  customerContentToShow = [];
  paginationAvailable = false;
  wrapupList = [];
  wrapupIsPresent = false;
  searchKey!: string;
  constructor(
    public wrapupService: WrapupService,
    public dialog: MatDialog,
    public toastr: ToastrService
  ) {}
  ngOnInit(): void {
    // console.log('Wrapup Works');
    this.wrapupService
      .getAdminWrapup({
        action: 'getAdminWrapup',
        id: 0,
      })
      .subscribe((response) => {
        // console.log('Response is ', response.body);

        if (
          response &&
          response.body &&
          response.body.length > this.records_per_page
        ) {
          this.paginationAvailable = true;
          this.wrapupList = response.body;
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
          this.wrapupList = response.body;
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
          this.wrapupIsPresent = true;
        } else {
          this.wrapupIsPresent = false;
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
      if (this.wrapupList[i]) {
        this.customerContentToShow.push(this.wrapupList[i]);
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
    console.log(Math.ceil(this.wrapupList.length / this.records_per_page));
    return Math.ceil(this.wrapupList.length / this.records_per_page);
  };

  addWrapups = () => {
    let dataToShare = {
      action: 'addWrapup',
    };
    const dialogRef = this.dialog.open(WrapupMessagePopupComponent, {
      data: dataToShare,
    });
    dialogRef.afterClosed().subscribe((result) => {
      let params = result.data;
      // console.log(params);
      this.wrapupService.addAdminWrapup(params).subscribe((response) => {
        // console.log('response ', response);
        if (response.body === 'Successfully Inserted') {
          this.toastr.success('Data inserted successfully');
          this.wrapupService
            .getAdminWrapup({
              action: 'getAdminWrapup',
              id: 0,
            })
            .subscribe((response) => {
              this.customerContentToShow = [];
              this.wrapupList = [];
              if (
                response &&
                response.body &&
                response.body.length > this.records_per_page
              ) {
                this.wrapupList = response.body;
                this.numPages();
                this.current_page = 1;
                this.btn_next = false;
                this.btn_prev = true;
                this.paginationAvailable = true;
                for (let i = 0; i < this.records_per_page; i++) {
                  if (response.body[i]) {
                    this.customerContentToShow.push(response.body[i]);
                    console.log(
                      'customerContentToShow ',
                      this.customerContentToShow
                    );
                  }
                }
              } else {
                this.wrapupList = response.body;
                this.numPages();
                this.current_page = 1;
                this.btn_next = false;
                this.btn_prev = true;
                this.paginationAvailable = false;
                for (let i = 0; i < response.body.length; i++) {
                  if (response.body[i]) {
                    this.customerContentToShow.push(response.body[i]);
                    console.log(
                      'customerContentToShow ',
                      this.customerContentToShow
                    );
                  }
                }
              }

              if (response.body.length > 0) {
                this.wrapupIsPresent = true;
              } else {
                this.wrapupIsPresent = false;
              }
            });
        }
      });
    });
  };

  editWrapups = (wrapupData: any) => {
    let dataToShare = {
      action: 'editWrapup',
      wrapupDetail: wrapupData,
    };
    const dialogRef = this.dialog.open(WrapupMessagePopupComponent, {
      data: dataToShare,
    });
    dialogRef.afterClosed().subscribe((result) => {
      let params = result.data;
      // console.log(params);
      this.wrapupService.editAdminWrapup(params).subscribe((response) => {
        // console.log('response ', response);
        // if (response.body.length > 0) {
        //   this.wrapupIsPresent = true;
        // } else {
        //   this.wrapupIsPresent = false;
        // }
        if (response.body === 'Updated Successfully') {
          this.toastr.success('Data updated successfully');
          this.wrapupService
            .getAdminWrapup({
              action: 'getAdminWrapup',
              id: 0,
            })
            .subscribe((response) => {
              this.customerContentToShow = [];
              this.wrapupList = [];
              if (
                response &&
                response.body &&
                response.body.length > this.records_per_page
              ) {
                this.wrapupList = response.body;
                this.numPages();
                this.current_page = 1;
                this.btn_next = false;
                this.btn_prev = true;
                this.paginationAvailable = true;
                for (let i = 0; i < this.records_per_page; i++) {
                  if (response.body[i]) {
                    this.customerContentToShow.push(response.body[i]);
                    console.log(
                      'customerContentToShow ',
                      this.customerContentToShow
                    );
                  }
                }
              } else {
                this.wrapupList = response.body;
                this.numPages();
                this.current_page = 1;
                this.btn_next = false;
                this.btn_prev = true;
                this.paginationAvailable = false;
                for (let i = 0; i < response.body.length; i++) {
                  if (response.body[i]) {
                    this.customerContentToShow.push(response.body[i]);
                    console.log(
                      'customerContentToShow ',
                      this.customerContentToShow
                    );
                  }
                }
              }

              if (response.body.length > 0) {
                this.wrapupIsPresent = true;
              } else {
                this.wrapupIsPresent = false;
              }
            });
        } else {
          this.toastr.error('update unsuccessfull');
        }
      });
    });
  };

  deleteWrapups = (wrapupData: any) => {
    let dataToShare = {
      action: 'deleteWrapup',
      wrapupDetail: wrapupData,
    };
    const dialogRef = this.dialog.open(WrapupMessagePopupComponent, {
      data: dataToShare,
    });
    dialogRef.afterClosed().subscribe((result) => {
      let params = result.data;
      // console.log(params);
      this.wrapupService.deleteAdminWrapup(params).subscribe((response) => {
        // console.log(response);
        if (response.body === 'Successfully Deleted') {
          this.toastr.success('Data deleted successfully.');
          this.wrapupService
            .getAdminWrapup({
              action: 'getAdminWrapup',
              id: 0,
            })
            .subscribe((response) => {
              this.customerContentToShow = [];
              this.wrapupList = [];
              if (
                response &&
                response.body &&
                response.body.length > this.records_per_page
              ) {
                this.wrapupList = response.body;
                this.numPages();
                this.current_page = 1;
                this.btn_next = false;
                this.btn_prev = true;
                this.paginationAvailable = true;
                for (let i = 0; i < this.records_per_page; i++) {
                  if (response.body[i]) {
                    this.customerContentToShow.push(response.body[i]);
                    console.log(
                      'customerContentToShow ',
                      this.customerContentToShow
                    );
                  }
                }
              } else {
                this.wrapupList = response.body;
                this.numPages();
                this.current_page = 1;
                this.btn_next = false;
                this.btn_prev = true;
                this.paginationAvailable = false;
                for (let i = 0; i < response.body.length; i++) {
                  if (response.body[i]) {
                    this.customerContentToShow.push(response.body[i]);
                    console.log(
                      'customerContentToShow ',
                      this.customerContentToShow
                    );
                  }
                }
              }

              if (response.body.length > 0) {
                this.wrapupIsPresent = true;
              } else {
                this.wrapupIsPresent = false;
              }
            });
        } else {
          this.toastr.error('Data Deletion unsuccessfull.');
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
}
