import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomerInformationPopupComponent } from './customer-information-popup/customer-information-popup.component';
import { CticustomapiService } from '../services/cticustomapi.service';
import { Subscription } from 'rxjs';
import { CcpService } from '../services/ccp.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-customer-information',
  templateUrl: './customer-information.component.html',
  styleUrls: ['./customer-information.component.scss'],
})
export class CustomerInformationComponent implements OnDestroy {
  current_page = 1;
  records_per_page = 3;
  btn_prev = true;
  btn_next = false;
  customerContentToShow = [];
  paginationAvailable = false;
  customerInformationList = [];
  customerInformationIsPresent;
  toolTipDataToDisplay = [];
  NRICPhoneNumber!: string;
  tablePopupData = [];
  whatScreenToDisplay = '';
  isVisible = false;
  contactSubscription: Subscription;
  hrDataToDisplayForIncomingCall = {};
  hrDataToDisplaySaluation: string;
  hrDataToDisplayName!: string;
  hrDataToDisplayNRIC: string;
  hrDataToDisplaySchool: string;
  hrDataToDisplayDesignation: string;
  hrDataToDisplayEmployeegroup: string;
  tableData: any = [];
  tooltipVisible = false;
  tooltipTimeout: any;
  isConferenceEnabled!: any;
  displayTable = false;
  createNewCaseBtn: boolean = false;
  refreshBtn: boolean;
  createNewCustomerBtn: boolean;
  searchBasedOnGivenTxtBtn: boolean;
  tooltipNewCase: any;
  newCustomerUrl = environment.settings.newCustomerMcareUrl;
  contactID: any;
  showSingpassvalidated = false;
  nric = '';
  callVariable: any;
  constructor(
    public dialog: MatDialog,
    public cticustomapiService: CticustomapiService,
    public ccpService: CcpService
  ) {}
  ngOnInit(): void {
    this.hrDataToDisplaySaluation = '';
    this.hrDataToDisplayNRIC = '';
    this.hrDataToDisplaySchool = '';
    this.hrDataToDisplayDesignation = '';
    this.hrDataToDisplayEmployeegroup = '';

    this.contactSubscription = this.ccpService
      .getContactMessage()
      .subscribe((message) => {
        this.contactSubscriptionHandler(message);
      });

    setInterval(() => {
      // this.whatScreenToDisplay = sessionStorage.getItem('screenToDisplay');
      // if (sessionStorage.getItem('CustomerInfo')) {
      //   this.displayTable = true;
      // } else {
      //   this.displayTable = false;
      // }
      // this.isConferenceEnabled = sessionStorage.getItem('isConferenceEnabled');
      if (
        sessionStorage.getItem('clearAllFields') !== null &&
        sessionStorage.getItem('clearAllFields') !== undefined &&
        sessionStorage.getItem('clearAllFields') === 'true'
      ) {
        this.displayTable = false;
        this.showSingpassvalidated = false;
        this.hrDataToDisplaySaluation = '';
        this.hrDataToDisplayNRIC = '';
        this.hrDataToDisplaySchool = '';
        this.hrDataToDisplayDesignation = '';
        this.hrDataToDisplayEmployeegroup = '';
        this.NRICPhoneNumber = '';
        sessionStorage.setItem('clearAllFields', 'false');
      }
    }, 1000);

    this.whatScreenToDisplay = sessionStorage.getItem('screenToDisplay');
    if (sessionStorage.getItem('CustomerInfo')) {
      this.displayTable = true;
    } else {
      this.displayTable = false;
    }
    this.isConferenceEnabled = sessionStorage.getItem('isConferenceEnabled');
  }

  createNewCustomer = () => {
    window.open(this.newCustomerUrl, '_blank');
  };

  createNewCase = () => {
    this.createNewCaseBtn = !this.createNewCaseBtn;
  };

  detailInformationCustomer = (url: any) => {
    console.log('detailInformationCustomer', url);
    window.open(url, '_blank');
  };

  refresh = () => {
    let contactID = this.contactID;
    this.contactSubscription = this.ccpService
      .getContactMessage()
      .subscribe((message) => {
        this.contactSubscriptionHandler(message);
      });
    this.cticustomapiService
      .getSingpassAuthenticated({
        action: 'getSingpassAuthenticated',
        contactId: contactID,
      })
      .subscribe((response) => {
        console.log(response);
        console.log(response.body);
        if (response && response.body && response.body.length > 0) {
          this.nric = response.body[0].nric;
          if (
            response.body[0].otprequeststatus === 'SUCCESS' &&
            response.body[0].otpvalidationstatus === 'SUCCESS'
          ) {
            this.showSingpassvalidated = true;
          } else {
            this.showSingpassvalidated = false;
          }
        }
      });
  };

  searchBasedOnGivenTxt = () => {
    this.displayTable = true;
    // this.searchBasedOnGivenTxtBtn = !this.searchBasedOnGivenTxtBtn;
    this.NRICPhoneNumber;
    this.cticustomapiService
      .getCustomerInformationData({
        action: 'getCustomerInformationTable',
        searchText: this.NRICPhoneNumber,
        searchBy: 'searchText',
      })
      .subscribe((response) => {
        console.log('Mcare response ', response);
        this.customerContentToShow = [];
        this.customerInformationList = [];

        if (
          response &&
          response.body &&
          response.body.Customers &&
          response.body.Customers.length > this.records_per_page
        ) {
          this.paginationAvailable = true;
          this.customerInformationList = response.body.Customers;
          this.numPages();
          this.current_page = 1;
          this.btn_next = false;
          this.btn_prev = true;
          //this.changePage(this.current_page);
          for (let i = 0; i < this.records_per_page; i++) {
            if (response.body.Customers[i]) {
              this.customerContentToShow.push(response.body.Customers[i]);
            }
          }
          console.log('customerContentToShow ', this.customerContentToShow);
        } else {
          this.customerInformationList = response.body.Customers;
          this.numPages();
          this.current_page = 1;
          this.btn_next = false;
          this.btn_prev = true;
          //this.changePage(this.current_page);
          this.paginationAvailable = false;
          for (let i = 0; i < response.body.Customers.length; i++) {
            if (response.body.Customers[i]) {
              this.customerContentToShow.push(response.body.Customers[i]);
            }
          }
          console.log('customerContentToShow ', this.customerContentToShow);
        }

        if (response.body.Customers.length > 0) {
          this.customerInformationIsPresent = true;
          this.displayTable = true;
        } else {
          this.customerInformationIsPresent = false;
          this.displayTable = false;
        }
      });
  };

  smsStatus = () => {};

  validationStatus = () => {};

  last3Cases = (
    data: any,
    CustomerLink: any,
    CustomerGUID: any,
    CustomerName: any
  ) => {
    let dataToShare = {
      data: data,
      CustomerLink,
      CustomerGUID,
      CustomerName,
    };

    const dialogRef = this.dialog.open(CustomerInformationPopupComponent, {
      data: dataToShare,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  };

  NewCase = (guid: any, name: any) => {
    let url = environment.settings.newCaseMCareUrl.replace(
      '**customerguid**',
      guid
    );
    url = url.replace('**customername**', name);
    console.log('newCaseUrl', url);
    window.open(url, '_blank');
  };
  openTooltipview = (url) => {
    window.open(url, '_blank');
  };

  Redirect = (url) => {
    window.open(url, '_blank');
  };

  mouseEnter = () => {
    this.isVisible = true;
  };

  mouseLeave = () => {
    this.isVisible = false;
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
      if (this.customerInformationList[i]) {
        this.customerContentToShow.push(this.customerInformationList[i]);
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
    return Math.ceil(
      this.customerInformationList.length / this.records_per_page
    );
  };
  async contactSubscriptionHandler(contact) {
    if (contact.event == 'handleContactIncoming') {
      this.contactID = contact.contactId;
      this.callVariable = JSON.parse(JSON.stringify(contact.getAttributes()));

      if (
        sessionStorage.getItem('screenToDisplay') &&
        sessionStorage.getItem('screenToDisplay') === 'HR'
      ) {
        this.cticustomapiService
          .hrpEmployeeDetails({
            action: 'HrpEmployeeDetails',
            phoneNumber: sessionStorage.getItem('callerPhoneNumber'),
          })
          .subscribe((response) => {
            if (response && response.body && response.body[0]) {
              this.hrDataToDisplayName = response.body[0].name;
              this.hrDataToDisplaySaluation =
                response.body[0].salutation + ' ' + response.body[0].name;
              this.hrDataToDisplayNRIC = response.body[0].nric;
              this.hrDataToDisplaySchool = response.body[0].schooldescription;
              this.hrDataToDisplayDesignation =
                response.body[0].designationcode;
              this.hrDataToDisplayEmployeegroup =
                response.body[0].employeegroupdescription;
            }
          });
      }
      this.cticustomapiService
        .getCustomerInformationData({
          action: 'getCustomerInformationTable',
          searchText: sessionStorage
            .getItem('callerPhoneNumber')
            .replace('+65', ''),
          searchBy: 'phoneNumber',
        })
        .subscribe((response) => {
          console.log('Mcare response ', response);
          this.customerContentToShow = [];
          this.customerInformationList = [];
          if (
            response &&
            response.body &&
            response.body.Customers &&
            response.body.Customers.length > this.records_per_page
          ) {
            this.paginationAvailable = true;
            this.customerInformationList = response.body.Customers;
            this.numPages();
            this.current_page = 1;
            this.btn_next = false;
            this.btn_prev = true;
            //this.changePage(this.current_page);
            for (let i = 0; i < this.records_per_page; i++) {
              if (response.body.Customers[i]) {
                this.customerContentToShow.push(response.body.Customers[i]);
              }
            }
            console.log('customerContentToShow ', this.customerContentToShow);
          } else {
            this.customerInformationList = response.body.Customers;
            this.numPages();
            this.current_page = 1;
            this.btn_next = false;
            this.btn_prev = true;
            //this.changePage(this.current_page);
            this.paginationAvailable = false;
            for (let i = 0; i < response.body.Customers.length; i++) {
              if (response.body.Customers[i]) {
                this.customerContentToShow.push(response.body.Customers[i]);
              }
            }
            console.log('customerContentToShow ', this.customerContentToShow);
          }

          if (response.body.Customers.length > 0) {
            this.customerInformationIsPresent = true;
            this.displayTable = true;
          } else {
            this.customerInformationIsPresent = false;
            this.displayTable = false;
          }
        });
    }
    if (contact.event == 'handleCallContactConnecting') {
      this.contactID = contact.contactId;
      if (
        sessionStorage.getItem('screenToDisplay') &&
        sessionStorage.getItem('screenToDisplay') === 'HR'
      ) {
        this.cticustomapiService
          .hrpEmployeeDetails({
            action: 'HrpEmployeeDetails',
            phoneNumber: sessionStorage.getItem('callerPhoneNumber'),
          })
          .subscribe((response) => {
            if (response && response.body && response.body[0]) {
              this.hrDataToDisplayName = response.body[0].name;
              this.hrDataToDisplaySaluation =
                response.body[0].salutation + ' ' + response.body[0].name;
              this.hrDataToDisplayNRIC = response.body[0].nric;
              this.hrDataToDisplaySchool = response.body[0].schooldescription;
              this.hrDataToDisplayDesignation =
                response.body[0].designationcode;
              this.hrDataToDisplayEmployeegroup =
                response.body[0].employeegroupdescription;
            }
          });
      }
      this.cticustomapiService
        .getCustomerInformationData({
          action: 'getCustomerInformationTable',
          searchText: sessionStorage
            .getItem('callerPhoneNumber')
            .replace('+65', ''),
          searchBy: 'phoneNumber',
        })
        .subscribe((response) => {
          console.log('Mcare response ', response);
          this.customerContentToShow = [];
          this.customerInformationList = [];
          if (
            response &&
            response.body &&
            response.body.Customers &&
            response.body.Customers.length > this.records_per_page
          ) {
            this.paginationAvailable = true;
            this.customerInformationList = response.body.Customers;
            this.numPages();
            this.current_page = 1;
            this.btn_next = false;
            this.btn_prev = true;
            //this.changePage(this.current_page);
            for (let i = 0; i < this.records_per_page; i++) {
              if (response.body.Customers[i]) {
                this.customerContentToShow.push(response.body.Customers[i]);
              }
            }
            console.log('customerContentToShow ', this.customerContentToShow);
          } else {
            this.customerInformationList = response.body.Customers;
            this.numPages();
            this.current_page = 1;
            this.btn_next = false;
            this.btn_prev = true;
            //this.changePage(this.current_page);
            this.paginationAvailable = false;
            for (let i = 0; i < response.body.Customers.length; i++) {
              if (response.body.Customers[i]) {
                this.customerContentToShow.push(response.body.Customers[i]);
              }
            }
            console.log('customerContentToShow ', this.customerContentToShow);
          }

          if (response.body.Customers.length > 0) {
            this.customerInformationIsPresent = true;
            this.displayTable = true;
          } else {
            this.customerInformationIsPresent = false;
            this.displayTable = false;
          }
        });
    }
    // if (contact.event == '_handleAgentRefresh') {
    //   if (
    //     sessionStorage.getItem('screenToDisplay') &&
    //     sessionStorage.getItem('CustomerInfo') &&
    //     sessionStorage.getItem('screenToDisplay') === 'HR'
    //   ) {
    //     this.cticustomapiService
    //       .hrpEmployeeDetails({
    //         action: 'HrpEmployeeDetails',
    //         phoneNumber: sessionStorage.getItem('callerPhoneNumber'),
    //       })
    //       .subscribe((response) => {
    //         if (response && response.body && response.body[0]) {
    //           this.hrDataToDisplayName = response.body[0].name;
    //           this.hrDataToDisplaySaluation =
    //             response.body[0].salutation + ' ' + response.body[0].name;
    //           this.hrDataToDisplayNRIC = response.body[0].nric;
    //           this.hrDataToDisplaySchool = response.body[0].schooldescription;
    //           this.hrDataToDisplayDesignation =
    //             response.body[0].designationcode;
    //           this.hrDataToDisplayEmployeegroup =
    //             response.body[0].employeegroupdescription;
    //         }
    //       });
    //   }
    // }
    if (contact.event == 'handleContactConnected') {
      this.contactID = contact.contactId;
      if (
        sessionStorage.getItem('screenToDisplay') &&
        sessionStorage.getItem('screenToDisplay') === 'HR'
      ) {
        this.cticustomapiService
          .hrpEmployeeDetails({
            action: 'HrpEmployeeDetails',
            phoneNumber: sessionStorage.getItem('callerPhoneNumber'),
          })
          .subscribe((response) => {
            if (response && response.body && response.body[0]) {
              this.hrDataToDisplayName = response.body[0].name;
              this.hrDataToDisplaySaluation =
                response.body[0].salutation + ' ' + response.body[0].name;
              this.hrDataToDisplayNRIC = response.body[0].nric;
              this.hrDataToDisplaySchool = response.body[0].schooldescription;
              this.hrDataToDisplayDesignation =
                response.body[0].designationcode;
              this.hrDataToDisplayEmployeegroup =
                response.body[0].employeegroupdescription;
            }
          });
      }
      this.cticustomapiService
        .getCustomerInformationData({
          action: 'getCustomerInformationTable',
          searchText: sessionStorage
            .getItem('callerPhoneNumber')
            .replace('+65', ''),
          searchBy: 'phoneNumber',
        })
        .subscribe((response) => {
          console.log('Mcare response ', response);
          this.customerContentToShow = [];
          this.customerInformationList = [];
          if (
            response &&
            response.body &&
            response.body.Customers &&
            response.body.Customers.length > this.records_per_page
          ) {
            this.paginationAvailable = true;
            this.customerInformationList = response.body.Customers;
            this.numPages();
            this.current_page = 1;
            this.btn_next = false;
            this.btn_prev = true;
            //this.changePage(this.current_page);
            for (let i = 0; i < this.records_per_page; i++) {
              if (response.body.Customers[i]) {
                this.customerContentToShow.push(response.body.Customers[i]);
              }
            }
            console.log('customerContentToShow ', this.customerContentToShow);
          } else {
            this.customerInformationList = response.body.Customers;
            this.numPages();
            this.current_page = 1;
            this.btn_next = false;
            this.btn_prev = true;
            //this.changePage(this.current_page);
            this.paginationAvailable = false;
            for (let i = 0; i < response.body.Customers.length; i++) {
              if (response.body.Customers[i]) {
                this.customerContentToShow.push(response.body.Customers[i]);
              }
            }
            console.log('customerContentToShow ', this.customerContentToShow);
          }

          if (response.body.Customers.length > 0) {
            this.customerInformationIsPresent = true;
            this.displayTable = true;
          } else {
            this.customerInformationIsPresent = false;
            this.displayTable = false;
          }
        });
    }
    if (contact.event == 'handleContactEnded') {
      this.contactID = contact.contactId;
    }
  }

  showTooltip(row: any) {
    console.log('Row ', row);
    console.log(this.customerContentToShow);
    for (let i = 0; i < this.customerContentToShow.length; i++) {
      if (this.customerContentToShow[i].CustomerName === row) {
        this.tooltipNewCase = this.customerContentToShow[i].CustomerLink;
        this.toolTipDataToDisplay = this.customerContentToShow[i].Cases;
      }
    }

    console.log('toolTipDataToDisplay', this.toolTipDataToDisplay);

    clearTimeout(this.tooltipTimeout);
    this.tooltipTimeout = setTimeout(() => {
      this.tooltipVisible = true;
    }, 500);
  }

  // onlyCapitalLetter = () => {
  //   this.NRICPhoneNumber = this.NRICPhoneNumber;
  // };

  hideTooltip() {
    clearTimeout(this.tooltipTimeout);
    this.tooltipTimeout = setTimeout(() => {
      this.tooltipVisible = false;
      this.toolTipDataToDisplay = [];
    }, 500);
  }

  cancelTooltipHide() {
    clearTimeout(this.tooltipTimeout);
  }

  handleButtonClick = () => {
    console.log('Button clicked');
  };

  ngOnDestroy() {
    clearTimeout(this.tooltipTimeout);
  }
}
