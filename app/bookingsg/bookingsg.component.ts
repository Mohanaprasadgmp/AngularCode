import { Component } from '@angular/core';
import { CticustomapiService } from '../services/cticustomapi.service';
import { ToastrService } from 'ngx-toastr';
import { CcpService } from '../services/ccp.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-bookingsg',
  templateUrl: './bookingsg.component.html',
  styleUrls: ['./bookingsg.component.scss'],
})
export class BookingsgComponent {
  callbackDetailToDisplay = [];
  customerName!: string;
  callbackTime!: string;
  contactNumber!: string;
  query!: string;
  topic!: string;
  appointmentType!: string;
  attemptedStatus!: string;
  updateCallbackTime!: string;
  updatedStatus!: string;
  updatedStatusTime!: string;
  tableShow = false;
  agentCanMakeCallback = false;
  CallType: string;
  contactSubscription: Subscription;
  constructor(
    public cticustomapiService: CticustomapiService,
    public toastr: ToastrService,
    public ccpService: CcpService
  ) {}

  ngOnInit(): void {
    this.contactSubscription = this.ccpService
      .getContactMessage()
      .subscribe((message) => {
        this.contactSubscriptionHandler(message);
      });

    this.cticustomapiService
      .checkAgentPresentInCallbackQueue({
        action: 'checkAgentPresentInCallbackQueue',
        agentname: sessionStorage.getItem('awsAgentID'),
      })
      .subscribe((response) => {
        if (response && response.body) {
          this.agentCanMakeCallback = response.body.agentCanDoCallback;
          console.log(this.agentCanMakeCallback);
        }
      });
    this.cticustomapiService
      .getEappointmentCallbackDetail({
        action: 'EappointmentCallbackDetails',
      })
      .subscribe((response) => {
        let serviceType = '';
        console.log(response);
        this.callbackDetailToDisplay = [];
        if (response && response.body && response.body.length > 0) {
          this.tableShow = true;
          for (let i = 0; i < response.body.length; i++) {
            if (response.body[i].serviceid === environment.settings.walkin) {
              serviceType = 'Walkin';
            }
            if (response.body[i].serviceid === environment.settings.callBack) {
              serviceType = 'Callback';
            }
            this.callbackDetailToDisplay.push({
              highlight: false,
              serviceType: serviceType,
              serviceId: response.body[i].serviceid,
              customerName: response.body[i].customername,
              phone: response.body[i].contactnumber,
              callbackTime: response.body[i].callbackstarttimes,
              status: response.body[i].dialstatus,
              topic: response.body[i].topic,
              appointmentType: response.body[i].appointmenttype,
              attemptStatus: response.body[i].retrycount,
              updatedStatus: response.body[i].appointmentstatus,
              updatedStatusTime: response.body[i].updateddates,
              query: response.body[i].query,
              updatedCallbackTime: response.body[i].updatedcallbacktimes,
              uniqueServiceId: response.body[i].uniqueserviceid,
            });
            console.log(
              'callbackDetailToDisplay ',
              this.callbackDetailToDisplay
            );
          }
          console.log(this.callbackDetailToDisplay);
        } else {
          this.tableShow = false;
        }
      });
    setInterval(() => {
      this.cticustomapiService
        .getEappointmentCallbackDetail({
          action: 'EappointmentCallbackDetails',
        })
        .subscribe((response) => {
          let serviceType = '';

          this.callbackDetailToDisplay = [];
          if (response && response.body && response.body.length > 0) {
            this.tableShow = true;
            for (let i = 0; i < response.body.length; i++) {
              if (response.body[i].serviceid === environment.settings.walkin) {
                serviceType = 'Walkin';
              }
              if (
                response.body[i].serviceid === environment.settings.callBack
              ) {
                serviceType = 'Callback';
              }
              this.callbackDetailToDisplay.push({
                highlight: false,
                serviceType: serviceType,
                serviceId: response.body[i].serviceid,
                customerName: response.body[i].customername,
                phone: response.body[i].contactnumber,
                callbackTime: response.body[i].callbackstarttimes,
                status: response.body[i].dialstatus,
                topic: response.body[i].topic,
                appointmentType: response.body[i].appointmenttype,
                attemptStatus: response.body[i].retrycount,
                updatedStatus: response.body[i].appointmentstatus,
                updatedStatusTime: response.body[i].updateddates,
                query: response.body[i].query,
                updatedCallbackTime: response.body[i].updatedcallbacktimes,
                uniqueServiceId: response.body[i].uniqueserviceid,
              });
            }
          } else {
            this.tableShow = false;
          }
        });
    }, 60000);
  }

  async contactSubscriptionHandler(contact) {
    try {
      if (contact.event == 'handleContactIncoming') {
        this.addCustomerInfo(contact);
      }
      if (contact.event == 'handleCallContactConnecting') {
        this.addCustomerInfo(contact);
        this.ccpService.infoLog('handleCallContactConnecting', '', contact);
      }

      // once call ended update status to wrapup

      if (contact.event == 'handleContactEnded') {
        // console.log('Handle contact ended');
        this.customerName = '';
        this.updateCallbackTime = '';
        this.contactNumber = '';
        this.topic = '';
        this.appointmentType = '';
        this.attemptedStatus = '';
        this.updatedStatus = '';
        this.updatedStatusTime = '';
        this.query = '';
        try {
          this.ccpService.infoLog('handleContactEnded', '', contact);

          var callContactId = contact.contactId;
          var allCustomerInfo = sessionStorage.getItem('CustomerInfo');
          if (allCustomerInfo != null) {
            var Customers = JSON.parse(allCustomerInfo);
            var ifcaseExist = false;
            if (Customers.cases) {
              Customers.cases.forEach((element) => {
                if (element.caseID == callContactId) {
                  ifcaseExist = true;
                  element.CaseInfo.contactStatus = 'Offline';
                  element.CaseInfo.contactStatusText = 'WRAPUP';
                  element.CaseInfo.endDateTime = new Date();
                }
              });

              if (ifcaseExist) {
                sessionStorage.setItem(
                  'CustomerInfo',
                  JSON.stringify(Customers)
                );
                // this.ccpService.CallHandler('CallUpdateTab', '');
              }
            }
          }
        } catch (ex) {
          //  alert(ex);
        }
      }

      if (contact.event == 'handleContactConnected') {
        this.addCustomerInfo(contact);
      }
    } catch (ex) {
      console.log(ex);
    }
  }

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
    //const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
    const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
    return formattedDateTime;
  };

  viewProfile = (details: any) => {
    details.highlight = true;
    if (details.serviceType === 'Callback') {
      console.log('Callback ', details);
      this.customerName = details.customerName;
      this.callbackTime = details.callbackTime;
      this.contactNumber = details.phone;
      this.topic = details.topic;
      this.appointmentType = details.appointmentType;
      this.attemptedStatus = details.attemptStatus;
      this.updateCallbackTime =
        details.updatedCallbackTime !== null
          ? this.convertData(details.updatedCallbackTime)
          : '';
      this.updatedStatus = details.updatedStatus;
      this.updatedStatusTime =
        details.updatedStatusTime !== null
          ? this.convertData(details.updatedStatusTime)
          : '';
      this.query = details.query;
    }
    if (details.serviceType === 'Walkin') {
      console.log('details ', details);
      this.customerName = details.customerName;
      this.callbackTime = details.callbackTime;
      this.contactNumber = details.phone;
      this.topic = details.topic;
      this.appointmentType = details.appointmentType;
      this.attemptedStatus = details.attemptStatus;
      this.updateCallbackTime =
        details.updatedCallbackTime !== null
          ? this.convertData(details.updatedCallbackTime)
          : '';
      this.updatedStatus = details.updatedStatus;
      this.updatedStatusTime =
        details.updatedStatusTime !== null
          ? this.convertData(details.updatedStatusTime)
          : '';
      this.query = details.query;
    }
  };

  makeCall = async (phoneNumber: any, details: any) => {
    details.highlight = true;
    sessionStorage.setItem('IsEappointmentCall', 'Yes');
    if (details.serviceType === 'Callback') {
      this.customerName = details.customerName;
      this.callbackTime = details.callbackTime;
      this.contactNumber = details.phone;
      this.topic = details.topic;
      this.appointmentType = details.appointmentType;
      this.attemptedStatus = details.attemptStatus;
      this.updateCallbackTime =
        details.updatedCallbackTime !== null
          ? this.convertData(details.updatedCallbackTime)
          : '';
      this.updatedStatus = details.updatedStatus;
      this.updatedStatusTime =
        details.updatedStatusTime !== null
          ? this.convertData(details.updatedStatusTime)
          : '';
      this.query = details.query;
    }
    if (details.serviceType === 'Walkin') {
      this.customerName = details.customerName;
      this.callbackTime = details.callbackTime;
      this.contactNumber = details.phone;
      this.topic = details.topic;
      this.appointmentType = details.appointmentType;
      this.attemptedStatus = details.attemptStatus;
      this.updateCallbackTime =
        details.updatedCallbackTime !== null
          ? this.convertData(details.updatedCallbackTime)
          : '';
      this.updatedStatus = details.updatedStatus;
      this.updatedStatusTime =
        details.updatedStatusTime !== null
          ? this.convertData(details.updatedStatusTime)
          : '';
      this.query = details.query;
    }
    sessionStorage.setItem('callerPhoneNumber', phoneNumber);
    //console.log('Entered Number ', phoneNumber);
    try {
      sessionStorage.setItem('uniqueServideid', details.uniqueServiceId);
      sessionStorage.setItem('serviceId', details.serviceId);
      await this.ccpService.makecall(phoneNumber);
      sessionStorage.setItem('CustomerInfo', '');

      // this.cticustomapiService
      //   .getEappointmentCallbackDetail({
      //     action: 'eappointmentCallInprogress',
      //     uniqueServideid: details.uniqueServiceId,
      //     serviceId: details.serviceId,
      //   })
      //   .subscribe((response) => {
      //     console.log(response);
      //   });
    } catch (err: any) {
      //console.log('Error on Make Call Click', err);

      if (err && this.isJson(err) && JSON.parse(err).message) {
        this.showErrorWithMessage(JSON.parse(err).message);
      } else {
        //this.showErrorWithMessage('Unable to place call');
      }
    }
  };

  async addCustomerInfo(contact) {
    // console.log('Process call inside');
    try {
      var CaseID = '';
      this.CallType = 'Outbound Call';
      CaseID = contact.contactId;
      var d = new Date();

      if (
        sessionStorage.getItem('CustomerInfo') !== null &&
        sessionStorage.getItem('CustomerInfo') !== undefined
      ) {
        sessionStorage.removeItem('CustomerInfo');
      }

      var startTime = `${this.padZero(d.getHours())}:${this.padZero(
        d.getMinutes()
      )}:${this.padZero(d.getSeconds())}`;

      // var newCalller = {
      //   contactStatusText: 'ONGOING',
      //   startTime: startTime,
      //   contactStatus: 'Online',
      //   NewCallID: CaseID,
      //   CallType: this.CallType,
      //   CaseID: CaseID,
      // };

      var newCalller = {
        contactStatusText: 'ONGOING',
        startTime: startTime,
        contactStatus: 'Online',
        NewCallID: CaseID,
        CaseID: CaseID,
      };
      var Customer = {
        cases: [{ caseID: CaseID, CaseInfo: newCalller }],
      };
      sessionStorage.setItem('CustomerInfo', JSON.stringify(Customer));

      this.ccpService.CallHandler('CallSaved', '');
      this.ccpService.CallHandler('LoadCallHandler', CaseID);
    } catch (ex) {}
  }

  padZero(str) {
    str = str.toString();
    return str.length < 2 ? this.padZero('0' + str) : str;
  }

  showErrorWithMessage(message) {
    this.toastr.error(message, 'Status!', { closeButton: true });
  }
  isJson = (str) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };
}
