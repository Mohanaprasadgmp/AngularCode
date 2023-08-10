import { Component, OnInit } from '@angular/core';
import { CcpService } from '../services/ccp.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AttributesToDisplay } from '../models/attribute-to-display';
import { CticustomapiService } from '../services/cticustomapi.service';
@Component({
  selector: 'app-call-control-panel',
  templateUrl: './call-control-panel.component.html',
  styleUrls: ['./call-control-panel.component.scss'],
})
export class CallControlPanelComponent implements OnInit {
  isConferenceEnabled!: any;
  callControlVisible!: any;
  callStartTime!: string;
  callStatus!: string;
  timerenable: boolean = false;
  onCallRinging: boolean = false;
  public callAnswered: boolean = false;

  callTimer: any;
  contactStatusText1: any;
  sec1: any = '';
  // callOnMute = false;
  contactSubscription: Subscription;
  canSwap: boolean = false;
  canJoin: boolean = false;
  canHoldAll: boolean = false;
  canResumeAll: boolean = false;
  caseID: any = '';
  callClose: boolean = false;
  IsActive: boolean = true;
  languageSelected: any;
  startDateTimeCall: number;
  public selectedQuickConnectList: Array<any> = [];
  quickConnectList = [];
  call_Type: number = 0;
  digitsKeyIn = '';
  seconds: any;
  closeCompleteBtn: boolean = false;
  callVariable: any[];
  contactAttr = [];
  whatScreenToDisplay: any;
  BargeHideButton: boolean = false;
  isBargin: boolean;
  roleSwitchValue: boolean = false;
  customerData: any;
  ngOnInit(): void {
    setInterval(() => {
      if (sessionStorage.getItem('screenToDisplay') === 'CSC') {
        this.contactStatusText1 = sessionStorage.getItem('callerPhoneNumber');
      }
      if (sessionStorage.getItem('screenToDisplay') === 'HR') {
        this.cticustomapiService
          .hrpEmployeeDetails({
            action: 'HrpEmployeeDetails',
            phoneNumber: sessionStorage.getItem('callerPhoneNumber'),
          })
          .subscribe((response) => {
            if (response && response.body && response.body[0]) {
              this.contactStatusText1 = response.body[0].name;
            } else {
              this.contactStatusText1 =
                sessionStorage.getItem('callerPhoneNumber');
            }
          });
      }
      if (sessionStorage.getItem('CustomerInfo')) {
        this.customerData = JSON.parse(sessionStorage.getItem('CustomerInfo'));
        this.callStartTime = this.customerData.cases[0].CaseInfo.startTime;
        this.callStatus = this.customerData.cases[0].CaseInfo.contactStatusText;
        this.callControlVisible = true;
      } else {
        this.callControlVisible = false;
      }
    }, 2000);

    this.contactSubscription = this.ccpService
      .getContactMessage()
      .subscribe((message) => {
        this.contactSubscriptionHandler(message);
      });
    this.GetQuickConnectContactsList();
  }
  constructor(
    public ccpService: CcpService,
    public toastr: ToastrService,
    public cticustomapiService: CticustomapiService
  ) {}

  async endClick(connection) {
    try {
      if (connection.isInitialConnection()) {
      }
      this.timerenable = false;
      this.callAnswered = false;
      this.onCallRinging = false;

      await this.ccpService.disconnectConnection(connection);
    } catch {
      this.toastr.warning('Error on end the connection');
    }
  }

  public getDateTimeDiff(heldTime) {
    let diff = Math.floor((new Date().getTime() - heldTime) / 1000);
    let start: number, len: number;
    if (diff > 3600) {
      start = 11;
      len = 8;
    } else {
      start = 14;
      len = 5;
    }
    return diff > 0
      ? new Date(diff * 1000).toISOString().substr(start, len)
      : '';
  }

  padZero(str) {
    str = str.toString();
    return str.length < 2 ? this.padZero('0' + str) : str;
  }

  msToHMS(ms) {
    this.seconds = ms / 1000;
    var hours = parseInt((this.seconds / 3600).toString());
    this.seconds = this.seconds % 3600;
    var minutes = parseInt((this.seconds / 60).toString());
    this.seconds = this.seconds % 60;
    return (
      this.padZero(hours) +
      ':' +
      this.padZero(minutes) +
      ':' +
      this.padZero(this.seconds.toString().substring(0, 2).replace('.', ''))
    );
  }

  GetActiveCallCount() {
    if (!this.ccpService.Connections) {
      return 0;
    }
    this.isConferenceEnabled = this.ccpService.Connections.filter(
      (X) => X.getState().type != 'disconnected'
    ).length;
    sessionStorage.setItem('isConferenceEnabled', this.isConferenceEnabled);
    return this.ccpService.Connections.filter(
      (X) => X.getState().type != 'disconnected'
    ).length;
  }

  mutecontact() {
    console.log(this.ccpService.agentMuteStatus);

    this.ccpService.muteSelf();
    // this.callOnMute = true;
    // sessionStorage.setItem('callOnMute', 'muted');
    console.log(this.ccpService.agentMuteStatus);
  }

  unMuteContact() {
    this.ccpService.unMuteSelf();
    // this.callOnMute = false;
    // sessionStorage.setItem('callOnMute', 'notMuted');
    console.log(this.ccpService.agentMuteStatus);
  }

  async RetrieveConnection(connection: any) {
    try {
      await this.ccpService.resumeConnection(connection);
    } catch (err: any) {
      if (err && this.isJson(err) && JSON.parse(err).message) {
        this.showErrorWithMessage(JSON.parse(err).message);
      } else this.toastr.error('Error on retrieve contact');
    }
  }

  async holdConnection(connection: any) {
    try {
      await this.ccpService.holdConnection(connection);
    } catch (err: any) {
      if (err && this.isJson(err) && JSON.parse(err).message) {
        this.showErrorWithMessage(JSON.parse(err).message);
      } else this.toastr.warning('Error on held the connection');
    }
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

  GetContact(contactId) {
    // console.log('queue callback getcontact', contactId);
    var result = this.ccpService.getcontact(contactId)[0];
    return result;
  }

  async contactSubscriptionHandler(contact) {
    if (contact.event == 'handleContactIncoming') {
      this.callControlVisible = true;
      if (sessionStorage.getItem('screenToDisplay') === 'CSC') {
        this.contactStatusText1 = sessionStorage.getItem('callerPhoneNumber');
        // this.contactStatusText1 = this.contactStatusText1.replace('+1', '+65 ');
      }
      if (sessionStorage.getItem('screenToDisplay') === 'HR') {
        this.cticustomapiService
          .hrpEmployeeDetails({
            action: 'HrpEmployeeDetails',
            phoneNumber: sessionStorage.getItem('callerPhoneNumber'),
          })
          .subscribe((response) => {
            if (response && response.body && response.body[0]) {
              this.contactStatusText1 = response.body[0].name;
            } else {
              this.contactStatusText1 =
                sessionStorage.getItem('callerPhoneNumber');
            }
          });
      }
    }

    if (contact.event == 'handleCallContactConnecting') {
      if (sessionStorage.getItem('screenToDisplay') === 'CSC') {
        this.contactStatusText1 = sessionStorage.getItem('callerPhoneNumber');
        // this.contactStatusText1 = this.contactStatusText1.replace('+1', '+65 ');
      }
      if (sessionStorage.getItem('screenToDisplay') === 'HR') {
        this.cticustomapiService
          .hrpEmployeeDetails({
            action: 'HrpEmployeeDetails',
            phoneNumber: sessionStorage.getItem('callerPhoneNumber'),
          })
          .subscribe((response) => {
            if (response && response.body && response.body[0]) {
              this.contactStatusText1 = response.body[0].name;
            } else {
              this.contactStatusText1 =
                sessionStorage.getItem('callerPhoneNumber');
            }
          });
      }

      try {
        this.callVariable = JSON.parse(JSON.stringify(contact.getAttributes()));
        for (let i = 0; i < AttributesToDisplay.attributes.length; i++) {
          if (
            this.callVariable.hasOwnProperty(AttributesToDisplay.attributes[i])
          ) {
          }
        }

        this.callClose = false;
        this.onCallRinging = true;
      } catch (ex) {
        alert(ex);
      }
    }

    if (contact.event == 'handleContactConnected') {
      if (sessionStorage.getItem('screenToDisplay') === 'CSC') {
        this.contactStatusText1 = sessionStorage.getItem('callerPhoneNumber');
      }
      if (sessionStorage.getItem('screenToDisplay') === 'HR') {
        this.cticustomapiService
          .hrpEmployeeDetails({
            action: 'HrpEmployeeDetails',
            phoneNumber: sessionStorage.getItem('callerPhoneNumber'),
          })
          .subscribe((response) => {
            if (response && response.body && response.body[0]) {
              this.contactStatusText1 = response.body[0].name;
            } else {
              this.contactStatusText1 =
                sessionStorage.getItem('callerPhoneNumber');
            }
          });
      }
      this.onCallRinging = false;
      this.callAnswered = true;
      this.IsActive = true;
    }

    if (contact.event == 'handleContactEnded') {
      try {
        this.IsActive = false;
      } catch (ex) {}
    }

    if (contact.event == '_handleAgentRefresh') {
      if (sessionStorage.getItem('screenToDisplay') === 'CSC') {
        this.contactStatusText1 = sessionStorage.getItem('callerPhoneNumber');
      }
      if (sessionStorage.getItem('screenToDisplay') === 'HR') {
        this.cticustomapiService
          .hrpEmployeeDetails({
            action: 'HrpEmployeeDetails',
            phoneNumber: sessionStorage.getItem('callerPhoneNumber'),
          })
          .subscribe((response) => {
            if (response && response.body && response.body[0]) {
              this.contactStatusText1 = response.body[0].name;
            } else {
              this.contactStatusText1 =
                sessionStorage.getItem('callerPhoneNumber');
            }
          });
      }

      if (
        contact &&
        contact._getData() &&
        contact._getData().snapshot &&
        contact._getData().snapshot.contacts &&
        contact._getData().snapshot.contacts[0] &&
        contact._getData().snapshot.contacts[0].connections &&
        contact._getData().snapshot.contacts[0].connections[0] &&
        contact._getData().snapshot.contacts[0].connections[0]
          .monitorCapabilities &&
        contact._getData().snapshot.contacts[0].connections[0]
          .monitorCapabilities !== null &&
        contact._getData().snapshot.contacts[0].connections[0]
          .monitorCapabilities.length == 2
      ) {
        this.BargeHideButton = true;
      }
      if (
        contact &&
        contact._getData() &&
        contact._getData().snapshot &&
        contact._getData().snapshot.contacts &&
        contact._getData().snapshot.contacts[0] &&
        contact._getData().snapshot.contacts[0].connections &&
        contact._getData().snapshot.contacts[0].connections[0] &&
        contact._getData().snapshot.contacts[0].connections[0].monitorStatus &&
        contact._getData().snapshot.contacts[0].connections[0].monitorStatus ===
          'SILENT_MONITOR'
      ) {
        this.isBargin = false;
      }
      if (
        contact &&
        contact._getData() &&
        contact._getData().snapshot &&
        contact._getData().snapshot.contacts &&
        contact._getData().snapshot.contacts[0] &&
        contact._getData().snapshot.contacts[0].connections &&
        contact._getData().snapshot.contacts[0].connections[0] &&
        contact._getData().snapshot.contacts[0].connections[0].monitorStatus ===
          'BARGE'
      ) {
        this.isBargin = true;
      }
      try {
        if (contact.getStatus().name == 'Busy') {
          this.callAnswered = true;
        }
      } catch (ex) {}
    }

    if (contact.event == 'handleContactConnected') {
    }
  }

  toggleRole() {
    if (this.roleSwitchValue) {
      this.ccpService.makeBargin();
    } else {
      this.ccpService.makeMonitor();
    }
  }

  CanSwap(): boolean {
    if (this.ccpService.CurrentContact) {
      let connections = this.ccpService.CurrentContact.getConnections();
      if (connections && connections.length > 0) {
        let EligibleConnection = connections.filter(
          (item) =>
            item.getState().type != connect.ConnectionStateType.DISCONNECTED
        );

        let ActiveConnection = connections.filter(
          (item) =>
            item.getState().type == connect.ConnectionStateType.CONNECTED
        );
        let HoldConnection = connections.filter(
          (item) => item.getState().type == connect.ConnectionStateType.HOLD
        );

        if (
          ActiveConnection &&
          ActiveConnection.length > 0 &&
          HoldConnection &&
          HoldConnection.length > 0
        )
          return true;
      }
    }
    return false;
  }

  onConsultShown = async () => {
    this.digitsKeyIn = '';
    await this.GetQuickConnectContactsList();
  };

  async dropAgentConnection() {
    await this.ccpService.dropAgentConnection(null);
  }

  async RetrieveContact() {
    try {
      await this.ccpService.resumeContact();
    } catch (err: any) {
      if (err && this.isJson(err) && JSON.parse(err).message) {
        this.showErrorWithMessage(JSON.parse(err).message);
      } else this.toastr.error('Error on Retrieve Connection');
    }
  }

  async HoldContact() {
    try {
      await this.ccpService.holdContact();
    } catch (err: any) {
      if (err && this.isJson(err) && JSON.parse(err).message) {
        this.showErrorWithMessage(JSON.parse(err).message);
      } else this.toastr.error('Error on held the contact');
    }
  }

  CanConsult(): boolean {
    if (this.ccpService.CurrentContact) {
      let connections = this.ccpService.CurrentContact.getConnections();
      if (connections) {
        let EligibleConnection = connections.filter(
          (item) =>
            item.getState().type != connect.ConnectionStateType.DISCONNECTED
        );
        if (EligibleConnection && EligibleConnection.length > 0) {
          let ActiveConnection = connections.filter(
            (item) =>
              item.getState().type == connect.ConnectionStateType.CONNECTED
          );
          let HoldConnection = connections.filter(
            (item) => item.getState().type == connect.ConnectionStateType.HOLD
          );

          if (
            (ActiveConnection && ActiveConnection.length <= 2) ||
            !(ActiveConnection.length >= 2 && HoldConnection.length > 0)
          )
            return true;
        }
      }
    }
    return false;
  }

  CanJoin(): boolean {
    if (this.ccpService.CurrentContact) {
      let connections = this.ccpService.CurrentContact.getConnections();
      if (connections && connections.length > 2) {
        let EligibleConnection = connections.filter(
          (item) =>
            item.getState().type != connect.ConnectionStateType.DISCONNECTED
        );
        let ActiveConnection = connections.filter(
          (item) =>
            item.getState().type == connect.ConnectionStateType.CONNECTED
        );
        let HoldConnection = connections.filter(
          (item) => item.getState().type == connect.ConnectionStateType.HOLD
        );
        if (
          ActiveConnection &&
          ActiveConnection.length > 0 &&
          HoldConnection &&
          HoldConnection.length > 0
        )
          return true;
      }
    }
    return false;
  }

  CanHoldAll(): boolean {
    if (this.ccpService.CurrentContact) {
      let connections = this.ccpService.CurrentContact.getConnections();
      if (connections) {
        let EligibleConnection = connections.filter(
          (item) =>
            item.getState().type != connect.ConnectionStateType.DISCONNECTED
        );
        if (EligibleConnection && EligibleConnection.length > 2) {
          let ActiveConnection = connections.filter(
            (item) =>
              item.getState().type == connect.ConnectionStateType.CONNECTED
          );
          if (
            ActiveConnection &&
            ActiveConnection.length == EligibleConnection.length
          )
            return true;
        }
      }
    }
    return false;
  }

  CanResumeAll(): boolean {
    if (this.ccpService.CurrentContact) {
      let connections = this.ccpService.CurrentContact.getConnections();
      if (connections) {
        let EligibleConnection = connections.filter(
          (item) =>
            item.getState().type != connect.ConnectionStateType.DISCONNECTED
        );
        if (EligibleConnection && EligibleConnection.length > 2) {
          let HoldConnection = connections.filter(
            (item) => item.getState().type == connect.ConnectionStateType.HOLD
          );
          if (
            HoldConnection &&
            HoldConnection.length == EligibleConnection.length
          )
            return true;
        }
      }
    }
    return false;
  }

  ShowKeyPad(call_Type) {
    this.digitsKeyIn = '';
    this.GetQuickConnectContactsList();
    this.call_Type = call_Type;
  }

  dialpadFunction = (value: string) => {
    this.digitsKeyIn = this.digitsKeyIn + value;
  };

  async onQuickCallClick(callType: any) {
    console.log(callType);
    this.callTimer = callType;
    if (this.call_Type == 0) {
      this.onMakeCallClick();
    } else {
      this.onTransferMakeCallClick();
    }
  }

  async onTransferMakeCallClick() {
    try {
      console.log(
        'selectedQuickConnectList',
        this.selectedQuickConnectList[0].endpointARN
      );
      if (
        this.selectedQuickConnectList &&
        this.selectedQuickConnectList.length > 0
      ) {
        console.log('inside If makeQuickConnectCallTransfer ');
        await this.ccpService.makeQuickConnectCallTransfer({
          endpointARN: this.selectedQuickConnectList[0].endpointARN,
          type: 'agent',
        });
      } else {
        if (this.digitsKeyIn && this.digitsKeyIn.trim().length > 0) {
          console.log('inside else makeQuickConnectCallTransfer ');
          await this.ccpService.makecall(this.digitsKeyIn);
        }
      }
    } catch (err: any) {
      console.log('Error on Call Click', err);
      if (err && this.isJson(err) && JSON.parse(err).message) {
        this.showErrorWithMessage(JSON.parse(err).message);
      } else this.showErrorWithMessage('Unable to place call');
    }
  }

  onKeyPress(event: KeyboardEvent) {
    const charCode = event.which || event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  handleMenuItemClick(event: MouseEvent) {
    // Handle the menu item click here
    event.stopPropagation(); // Prevent event propagation to parent elements
  }

  async onMakeCallClick() {
    try {
      if (
        this.selectedQuickConnectList &&
        this.selectedQuickConnectList.length > 0
      ) {
        await this.ccpService.makeQuickConnectCall({
          endpointARN: this.selectedQuickConnectList[0].endpointARN, //endpointARN: this.selectedQuickConnectList,
          type: 'agent',
        });
      } else {
        if (this.digitsKeyIn && this.digitsKeyIn.trim().length > 0) {
          await this.ccpService.makecall(this.digitsKeyIn);
        }
      }
    } catch (err: any) {
      console.log('Error on Call Click', err);
      if (err && this.isJson(err) && JSON.parse(err).message) {
        this.showErrorWithMessage(JSON.parse(err).message);
      } else this.showErrorWithMessage('Unable to place call');
    }
  }
  async GetQuickConnectContactsList() {
    // console.log('Inside GetQuickConnectContactsList', this.quickConnectList);
    try {
      if (this.quickConnectList != null && this.quickConnectList.length == 0) {
        console.log(this.quickConnectList, ' Hi');
        this.quickConnectList =
          await this.ccpService.GetAllQuickConnectQueueContacts();
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

  onCallClick() {
    if (this.call_Type == 0) {
      this.Consultcontact();
    } else {
      this.Directtransfer();
    }
  }

  async Consultcontact() {
    try {
      let dialNumber;

      if (!this.digitsKeyIn || this.digitsKeyIn.trim().length == 0) {
        this.toastr.info('Please select the dial number');
        return;
      }
      if (this.digitsKeyIn == null && this.digitsKeyIn.length > 0) {
        return;
      }

      dialNumber = `+65${this.digitsKeyIn}`;
      await this.ccpService.addConn(dialNumber);
    } catch (err: any) {
      if (err && this.isJson(err) && JSON.parse(err).message) {
        this.showErrorWithMessage(JSON.parse(err).message);
      } else this.showErrorWithMessage('Unable to consult call');
    }
  }
  async Directtransfer() {
    try {
      let dialNumber;

      if (!this.digitsKeyIn || this.digitsKeyIn.trim().length == 0) {
        this.toastr.info('Please select the dial number');
        return;
      }
      if (this.digitsKeyIn == null || this.digitsKeyIn.length == 0) {
        return;
      }
      dialNumber = `+65${this.digitsKeyIn}`;
      await this.ccpService.directTransfer(dialNumber);
    } catch (err: any) {
      if (err && this.isJson(err) && JSON.parse(err).message) {
        this.showErrorWithMessage(JSON.parse(err).message);
      } else this.toastr.error('Error on transfer the call');
    }
  }
}
