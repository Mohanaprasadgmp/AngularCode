import { Component, OnInit } from '@angular/core';
import { CcpService } from '../services/ccp.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { CticustomapiService } from '../services/cticustomapi.service';
import { ReportService } from '../services/report.service';
import { LogoutpopupComponent } from './logoutpopup/logoutpopup.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  timer!: any;
  enteredNumber = '';
  loggedInUser!: string;
  stateDuration!: string;
  selectedAgentState: any = 'LoggedIn';
  agentStatusType: string = 'offline';
  signOutRequest: boolean = false;
  contactSubscription: Subscription;
  public agentStates: Array<any> = [{ state: 'Offline' }];
  agentStatus: any = [];
  // CallType = 'Inbound Call';
  showWorkSpace: boolean = false;
  userID: any;
  callClose: boolean = false;
  customMappingList: any;
  CallConnected: boolean = false;
  timerenable: boolean = false;
  agentSubscription: Subscription;
  message: boolean = true;
  deskphone = false;
  agentDepartment!: string;
  agentSecurityProfile!: string;
  phoneType!: string;
  deskPhoneNumber!: string;
  userId!: string;
  agentInterval!: any;
  showdeskphoneSoftphone = environment.settings.deskphoneSoftphone;
  TopStatisticsList = {
    afteR_CONTACT_WORK_TIME: '00:00:00',
    interactioN_TIME: '00:00:00',
    contactS_HANDLED: '00',
    contactS_TRANSFERRED_OUT: 0,
    contactS_MISSED: '0',
    holD_TIME: '00:00:00',
  };
  agentOccupancy!: any;
  quickConnectList = [];
  public selectedQuickConnectList: Array<any> = [];
  constructor(
    public ccpService: CcpService,
    public toastr: ToastrService,
    public cticustomapiService: CticustomapiService,
    public reportService: ReportService,
    public dialog: MatDialog,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.timerCalculation();
    this.stateDuration = '00:00:00';
    this.agentInterval = setInterval(() => {
      this.getAgentDetails();
    }, 1000);
    this.TopStatisticsList = {
      afteR_CONTACT_WORK_TIME: '00:00:00',
      interactioN_TIME: '00:00:00',
      contactS_HANDLED: '00',
      contactS_TRANSFERRED_OUT: 0,
      contactS_MISSED: '0',
      holD_TIME: '00:00:00',
    };

    // subscribing the contact

    this.contactSubscription = this.ccpService
      .getContactMessage()
      .subscribe((message) => {
        this.contactSubscriptionHandler(message);
      });
    this.GetQuickConnectContactsList();

    // subscribing the agent

    this.agentSubscription = this.ccpService
      .getAgentMessage()
      .subscribe((message) => {
        this.agentSubscriptionHandler(message);
      });

    setInterval(() => {
      sessionStorage.setItem('selectedAgentState', this.selectedAgentState);
    }, 2000);

    // this.loadTopStatistics();
    // setInterval(() => {
    //   this.loadTopStatistics();
    // }, 60000);
  }

  //agent statisric api calls

  loadTopStatistics = () => {
    var loginusername = sessionStorage.getItem('awsAgentID');
    console.log(loginusername);
    if (loginusername == null) {
      return false;
    }
    this.cticustomapiService
      .getAgentStatistics({
        action: 'GetAgentStatistics',
        agentname: sessionStorage.getItem('awsAgentID'),
      })
      .subscribe((response) => {
        if (response.body.length > 0) {
          var noOfCall = Number(response.body[0].numberofcalls);
          var aID = Number(response.body[0].agentinteractionduration);
          var avgAID: any;
          if (noOfCall != 0 || aID != 0) {
            avgAID = aID / noOfCall;
            avgAID = Math.round(avgAID);
          }

          var ACWT = Number(response.body[0].aftercontactworkduration);

          var avgACWT: any;
          if (noOfCall != 0 || ACWT != 0) {
            avgACWT = ACWT / noOfCall;
            avgACWT = Math.round(avgACWT);
          }

          this.TopStatisticsList = {
            afteR_CONTACT_WORK_TIME: this.secondsToHms(avgACWT).toString(),
            interactioN_TIME: this.secondsToHms(avgAID),
            contactS_HANDLED: response.body[0].numberofcalls,
            contactS_TRANSFERRED_OUT: response.body[0].contactstransferredout,
            contactS_MISSED: response.body[0].contactsmissed,
            holD_TIME: this.secondsToHms(response.body[0].customerholdduration),
          };
        } else {
          this.TopStatisticsList = {
            afteR_CONTACT_WORK_TIME: '00:00:00',
            interactioN_TIME: '00:00:00',
            contactS_HANDLED: '00',
            contactS_TRANSFERRED_OUT: 0,
            contactS_MISSED: '0',
            holD_TIME: '00:00:00',
          };
        }
      });

    this.cticustomapiService
      .getAgentOccupancy({ action: 'getAgentOccupancy' })
      .subscribe((response) => {
        // // console.log(response);
        if (response.body && response.body.length > 0) {
          this.agentOccupancy = response.body;
        } else {
          this.agentOccupancy = 0;
        }
      });
  };

  // clear the field when click on putbpund icon

  clearOutboundfield = () => {
    this.enteredNumber = '';
  };

  // add the number typed in outbound

  dialpadFunction = (value: string) => {
    if (this.enteredNumber.length <= 7) {
      this.enteredNumber += value;
    }
  };

  // Get Data for agent profile icon

  getAgentDetails() {
    if (this.ccpService.loggedinAgentName == undefined) {
      return;
    }

    this.loggedInUser =
      this.ccpService.loggedinAgentName +
      '(' +
      this.ccpService.AWSAgentName +
      ')';
    this.agentStates = this.ccpService.AgentStates;
    sessionStorage.setItem('awsAgentID', this.ccpService.loggedinAgentName);
    // sessionStorage.setItem('isLoginReload', 'false');
    this.cticustomapiService
      .getAgentSecurityProfileandHierarchy({
        action: 'getAgentSecurityProfileandHierarchy',
        agentname: this.ccpService.loggedinAgentName,
      })
      .subscribe((response) => {
        console.log(response);
        this.agentDepartment = response.body.department;
        this.agentSecurityProfile = response.body.securityProfile;
        // // console.log(this.agentSecurityProfile);
        sessionStorage.setItem(
          'securityProfile',
          JSON.stringify(this.agentSecurityProfile)
        );
        this.phoneType = response.body.phoneType;
        this.deskPhoneNumber = response.body.deskPhoneNumber;
        this.userId = response.body.userId;
        if (this.phoneType === 'DESK_PHONE') {
          this.deskphone = true;
        } else {
          this.deskphone = false;
        }
        sessionStorage.setItem(
          'screenToDisplay',
          response.body.department.toUpperCase()
        );
      });

    clearInterval(this.agentInterval);
  }

  agentSubscriptionHandler = async (agent) => {
    if (this.selectedAgentState != agent.getStatus().name) {
      this.timerCalculation();
    }
    let status = agent.getStatus().name;

    if (!this.signOutRequest && agent.getStatus().name == 'Offline') {
      this.selectedAgentState = environment.settings.StartingState;
      await this.stateChange();
    }

    this.selectedAgentState = status;
  };

  async contactSubscriptionHandler(contact) {
    try {
      if (contact.event == 'handleCallContactConnecting') {
        this.addCustomerInfo(contact);
        this.GetQuickConnectContactsList();
      }

      if (contact.event == 'handleContactIncoming') {
        this.addCustomerInfo(contact);
        this.GetQuickConnectContactsList();
      }

      if (contact.event == '_handleAgentRefresh') {
        this.GetQuickConnectContactsList();
      }

      // once call ended update status to wrapup

      if (contact.event == 'handleContactEnded') {
        console.log('Handle contact ended');
        try {
          this.ccpService.infoLog('handleContactEnded', '', contact);
          this.CallConnected = false;
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
          this.timerenable = false;
        } catch (ex) {
          //  alert(ex);
        }
      }

      if (contact.event == 'handleContactConnected') {
        this.addCustomerInfo(contact);
        this.GetQuickConnectContactsList();
        this.CallConnected = true;
        // try {
        //   this.CallConnected = true;
        //   if (!contact.isInbound()) {
        //     return;
        //   }
        //   this.addCustomerInfo(contact);
        // } catch (ex) {}
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  // insert customer info session value

  async addCustomerInfo(contact) {
    // console.log('Process call inside');
    try {
      var CaseID = '';

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

  // return agent current state

  GetAgentState = () => {
    return this.agentStates;
  };
  IsAgentStateIncluded = (agentState) => {
    let selectedState = this.agentStates.filter(
      (item) => item.name == agentState
    );
    return selectedState && selectedState.length > 0;
  };

  // softphone deskphnoe configuration

  updatePhoneConfig = () => {
    if (this.deskphone) {
      this.cticustomapiService
        .updateUserPhonetypeConfig({
          action: 'updateUserPhonetypeConfig',
          department: this.agentDepartment,
          userId: this.userId,
          phoneType: 'deskphone',
          deskPhoneNumber: this.deskPhoneNumber,
        })
        .subscribe((response) => {
          // console.log(response);
          if (
            response &&
            response.body &&
            response.body.name === 'InvalidParameterException'
          ) {
            this.toastr.warning('DeskPhone Updated Failed');
          } else {
            this.toastr.success('DeskPhone Updated Successfully');
          }
        });
    } else {
      this.cticustomapiService
        .updateUserPhonetypeConfig({
          action: 'updateUserPhonetypeConfig',
          department: this.agentDepartment,
          userId: this.userId,
          phoneType: 'softphone',
        })
        .subscribe((response) => {
          // console.log(response);
          this.toastr.success('Softphone Updated Successfully');
        });
    }
  };

  handleChange = (event: any) => {
    if (event.target.value === 'deskphone') {
      this.deskPhoneNumber = '';
      this.deskphone = true;
    }

    if (event.target.value === 'softphone') {
      this.deskphone = false;
    }
  };

  // when status in the dropdown is changed it will update in ccp

  async stateChange() {
    var selectedagentstate = this.selectedAgentState;
    try {
      var choosenAgentState = this.agentStates.filter(function (d) {
        return d.name == selectedagentstate;
      });
      console.log(choosenAgentState);
      this.agentStatusType = choosenAgentState[0].type;
      await this.ccpService.SetAgentState(choosenAgentState[0]);
      {
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.timerCalculation();
      }
    } catch {}
  }

  // show the timer in header

  timerCalculation = (agentstatetime?: string | number | Date) => {
    let ss: number;

    if (this.timer) {
      clearInterval(this.timer);
    }

    ss = 0;
    if (agentstatetime) {
      let currentDateTime = new Date();
      let statetime = new Date(agentstatetime);
      let timeduration = Math.abs(
        Math.round((currentDateTime.getTime() - statetime.getTime()) / 1000)
      );
      ss = timeduration;
    }

    this.timer = setInterval(() => {
      ss = ss + 1;
      let hours = Math.floor(ss / 60 / 60);
      let minutes = Math.floor(ss / 60) - hours * 60;
      let seconds = ss % 60;

      this.stateDuration = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  };

  secondsToHms(d): any {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);
    return (
      ('0' + h).slice(-2) +
      ':' +
      ('0' + m).slice(-2) +
      ':' +
      ('0' + s).slice(-2)
    );
  }

  // signout customer from cti application

  async signOut() {
    const dialogRef = this.dialog.open(LogoutpopupComponent, {});
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result.event === 'logout') {
        this.reportService
          .addLoginLogoutAudit({
            action: 'addLoginLogoutAudit',
            agentname: this.ccpService.loggedinAgentName,
            logintime: 'NA',
            logouttime: new Date(),
          })
          .subscribe((response) => {
            this.toastr.success('Logout Successful');
          });
        this.signOutRequest = true;
        this.ccpService.isSignOutRequest = true;
        this.selectedAgentState = 'Offline';
        await this.stateChange();
        this.ccpService.isAuthenticated = false;
        this.ccpService.signOut();
        this.router.navigateByUrl('/');
        await this.delay(1000);
        setTimeout(() => {
          sessionStorage.clear();
          localStorage.clear();
        }, 3000);
      }
    });
  }

  //make outbound call

  makeOutboundCall = async () => {
    sessionStorage.setItem('callerPhoneNumber', `+65${this.enteredNumber}`);
    try {
      localStorage.setItem('message', 'false');
      this.message = false;
      if (!this.enteredNumber || this.enteredNumber.trim().length == 0) {
        this.toastr.info('Please select the dial number');
        return;
      }
      if (this.enteredNumber && this.enteredNumber.trim().length > 0) {
        await this.ccpService.makecall(`+65${this.enteredNumber}`);
        $('popover-container').toggle();
      }
    } catch (err: any) {
      if (err && this.isJson(err) && JSON.parse(err).message) {
        this.showErrorWithMessage(JSON.parse(err).message);
      }
    }
  };

  // Generic function

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

  onKeyPress(event: KeyboardEvent) {
    const charCode = event.which || event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  delay(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  padZero(str) {
    str = str.toString();
    return str.length < 2 ? this.padZero('0' + str) : str;
  }

  handleMenuItemClick(event: MouseEvent) {
    // Handle the menu item click here
    event.stopPropagation(); // Prevent event propagation to parent elements
  }

  async GetQuickConnectContactsList() {
    // console.log('Inside GetQuickConnectContactsList', this.quickConnectList);
    try {
      if (this.quickConnectList != null && this.quickConnectList.length == 0) {
        console.log(this.quickConnectList, ' Hi');
        this.quickConnectList =
          await this.ccpService.GetAllQuickConnectQueueContactsOfPhoneNumberType();
        console.log('quickConnectList ', this.quickConnectList);
        // console.log('quickConnectList', this.quickConnectList);
        if (this.quickConnectList != null && this.quickConnectList.length > 0) {
          //this.selectedQuickConnectList = this.quickConnectList[0].endpointARN;
        }
      }
    } catch (ex) {
      console.log(ex);
      this.toastr.error('Error on get the Quick Connect Contacts');
    }
  }

  async onQuickCallClick() {
    console.log('selectedQuickConnectList', this.selectedQuickConnectList);
    let quickConnectId =
      this.selectedQuickConnectList[0].endpointARN.split('/');

    try {
      if (
        this.selectedQuickConnectList &&
        this.selectedQuickConnectList.length > 0
      ) {
        this.cticustomapiService
          .getPhoneNumberForPhonebook({
            action: 'getPhoneNumberForPhonebook',
            quickConnnectId: quickConnectId[3],
          })
          .subscribe(async (response) => {
            if (response && response.body) {
              let phoneNumber = response.body;
              sessionStorage.setItem('callerPhoneNumber', phoneNumber);
              await this.ccpService.makecall(phoneNumber);
            }
          });
      }
    } catch (err: any) {
      console.log('Error on Call Click', err);
    }
  }

  // async addCustomerInfo(contact) {
  //   // console.log('Process call inside');
  //   try {
  //     var CaseID = '';
  //     this.CallType = 'Outbound Call';
  //     CaseID = contact.contactId;
  //     var d = new Date();

  //     if (
  //       sessionStorage.getItem('CustomerInfo') !== null &&
  //       sessionStorage.getItem('CustomerInfo') !== undefined
  //     ) {
  //       sessionStorage.removeItem('CustomerInfo');
  //     }

  //     var startTime = `${this.padZero(d.getHours())}:${this.padZero(
  //       d.getMinutes()
  //     )}:${this.padZero(d.getSeconds())}`;

  //     var newCalller = {
  //       contactStatusText: 'ONGOING',
  //       startTime: startTime,
  //       contactStatus: 'Online',
  //       NewCallID: CaseID,
  //       CaseID: CaseID,
  //     };
  //     var Customer = {
  //       cases: [{ caseID: CaseID, CaseInfo: newCalller }],
  //     };
  //     sessionStorage.setItem('CustomerInfo', JSON.stringify(Customer));

  //     this.ccpService.CallHandler('CallSaved', '');
  //     this.ccpService.CallHandler('LoadCallHandler', CaseID);
  //   } catch (ex) {}
  // }
}
