import { Component, OnInit } from '@angular/core';
import { CcpService } from '../services/ccp.service';
import { Subscription } from 'rxjs';
import { CticustomapiService } from '../services/cticustomapi.service';
import * as $ from 'jquery';
//declare const  $: any;
@Component({
  selector: 'app-interaction-panel',
  templateUrl: './interaction-panel.component.html',
  styleUrls: ['./interaction-panel.component.scss'],
})
export class InteractionPanelComponent implements OnInit {
  callerIdentity = 'Customer';
  pendingConnectionId = '';
  callStatus = '';
  callCount = 0;
  activeCallID: string;
  CallType = 'Inbound Call';
  showWorkSpace: boolean = false;
  callClose: boolean = false;
  userID: string;
  CallConnected: boolean = false;
  timerenable: boolean = false;
  timer: any;
  contactSubscription: Subscription;
  agentSubscription: Subscription;
  // callAnswered: boolean = false;
  cschrForAcceptRejectCall: string;
  duplicateCallerIDentity: string;

  constructor(
    private ccpService: CcpService,
    public cticustomapiService: CticustomapiService
  ) {}

  ngOnInit(): void {
    this.contactSubscription = this.ccpService
      .getContactMessage()
      .subscribe((message) => {
        this.contactSubscriptionHandler(message);
      });

    this.agentSubscription = this.ccpService
      .getAgentMessage()
      .subscribe((message) => {
        this.agentSubscriptionHandler(message);
      });

    setInterval(() => {
      // console.log(this.CheckExists());
      this.cschrForAcceptRejectCall = sessionStorage.getItem('screenToDisplay');
      // if (
      //   sessionStorage.getItem('screenToDisplay') === 'HR' &&
      //   sessionStorage.getItem('callerPhoneNumber') !== undefined &&
      //   sessionStorage.getItem('callerPhoneNumber') !== null
      // ) {
      //   // console.log('interaction 1');
      //   this.cticustomapiService
      //     .hrpEmployeeDetails({
      //       action: 'HrpEmployeeDetails',
      //       phoneNumber: sessionStorage.getItem('callerPhoneNumber'),
      //     })
      //     .subscribe((response) => {
      //       if (response && response.body && response.body[0]) {
      //         this.callerIdentity = response.body[0].name;
      //         // console.log(this.callerIdentity);
      //         this.duplicateCallerIDentity = this.callerIdentity;
      //         // console.log(2);
      //       }
      //     });
      // }
      if (sessionStorage.getItem('CallEnded') === '1') {
        sessionStorage.removeItem('CallEnded');
      }
    }, 1000);
  }

  agentSubscriptionHandler = async (agent) => {};

  contactSubscriptionHandler(contact) {
    if (contact && contact.event && contact.event == 'handleContactIncoming') {
      if (
        sessionStorage.getItem('CustomerInfo') !== null &&
        sessionStorage.getItem('CustomerInfo') !== undefined
      ) {
        sessionStorage.removeItem('CustomerInfo');
      }
      if (sessionStorage.getItem('screenToDisplay') === 'CSC') {
        this.callerIdentity = sessionStorage.getItem('callerPhoneNumber');
      }
      if (sessionStorage.getItem('screenToDisplay') === 'HR') {
        this.cticustomapiService
          .hrpEmployeeDetails({
            action: 'HrpEmployeeDetails',
            phoneNumber: sessionStorage.getItem('callerPhoneNumber'),
          })
          .subscribe((response) => {
            if (response && response.body && response.body[0]) {
              this.callerIdentity = response.body[0].name;
            }
          });
      }
    }
    if (
      contact &&
      contact.event &&
      contact.event == 'handleCallContactConnecting'
    ) {
      if (
        sessionStorage.getItem('CustomerInfo') !== null &&
        sessionStorage.getItem('CustomerInfo') !== undefined
      ) {
        sessionStorage.removeItem('CustomerInfo');
      }
      if (sessionStorage.getItem('screenToDisplay') === 'CSC') {
        this.callerIdentity = sessionStorage.getItem('callerPhoneNumber');
      }
      if (sessionStorage.getItem('screenToDisplay') === 'HR') {
        this.cticustomapiService
          .hrpEmployeeDetails({
            action: 'HrpEmployeeDetails',
            phoneNumber: sessionStorage.getItem('callerPhoneNumber'),
          })
          .subscribe((response) => {
            if (response && response.body && response.body[0]) {
              this.callerIdentity = response.body[0].name;
            }
          });
      }
    }
    if (contact && contact.event && contact.event == 'handleContactConnected') {
      $('#snackbar').css('visibility', 'hidden');
      if (sessionStorage.getItem('screenToDisplay') === 'CSC') {
        this.callerIdentity = sessionStorage.getItem('callerPhoneNumber');
      }
      if (sessionStorage.getItem('screenToDisplay') === 'HR') {
        this.cticustomapiService
          .hrpEmployeeDetails({
            action: 'HrpEmployeeDetails',
            phoneNumber: sessionStorage.getItem('callerPhoneNumber'),
          })
          .subscribe((response) => {
            if (response && response.body && response.body[0]) {
              this.callerIdentity = response.body[0].name;
            }
          });
      }
    }
    if (contact && contact.event && contact.event == 'handleContactRefresh') {
      if (sessionStorage.getItem('screenToDisplay') === 'CSC') {
        this.callerIdentity = sessionStorage.getItem('callerPhoneNumber');
      }
      if (sessionStorage.getItem('screenToDisplay') === 'HR') {
        this.cticustomapiService
          .hrpEmployeeDetails({
            action: 'HrpEmployeeDetails',
            phoneNumber: sessionStorage.getItem('callerPhoneNumber'),
          })
          .subscribe((response) => {
            if (response && response.body && response.body[0]) {
              this.callerIdentity = response.body[0].name;
            }
          });
      }
    }

    if (contact && contact.event && contact.event == 'handleContactMissed') {
      this.callStatus = 'REJECTED';
      if (sessionStorage.getItem('screenToDisplay') === 'CSC') {
        this.callerIdentity = sessionStorage.getItem('callerPhoneNumber');
      }
      if (sessionStorage.getItem('screenToDisplay') === 'HR') {
        this.cticustomapiService
          .hrpEmployeeDetails({
            action: 'HrpEmployeeDetails',
            phoneNumber: sessionStorage.getItem('callerPhoneNumber'),
          })
          .subscribe((response) => {
            if (response && response.body && response.body[0]) {
              this.callerIdentity = response.body[0].name;
            }
          });
      }
    }

    if (contact && contact.event && contact.event == 'handleContactEnded') {
      // $('#snackbar').css('visibility', 'hidden');
      //this.callAnswered = false;
    }
  }

  acceptContact = () => {
    //need to use storage
    //this.callAnswered = true;
    this.callerIdentity = sessionStorage.getItem('callerPhoneNumber');
    var _contact = this.ccpService.getcontact(this.pendingConnectionId);

    if (_contact != null && _contact.length > 0) {
      _contact[0].accept({
        success: () => {},
        failure: (err: any) => {},
      });
    }
    $('#snackbar').css('visibility', 'hidden');
  };

  rejectContact = () => {
    this.callStatus = 'REJECTED';
    var _contact = this.ccpService.getcontact(this.pendingConnectionId);
    if (_contact != null && _contact.length > 0) {
      var agentConn = _contact[0].getAgentConnection();
      this.ccpService.disconnectConnection(agentConn).then(
        () => {
          this.callStatus = 'REJECTED';
        },
        () => {
          this.callStatus = '';
        }
      );
    }
  };

  missedContact = () => {
    this.callerIdentity = sessionStorage.getItem('callerPhoneNumber');
    var _contact = this.ccpService.getcontact(this.pendingConnectionId);
    if (_contact != null && _contact.length > 0) {
      _contact[0].complete();
      _contact[0].clear({
        success: () => {
          this.callStatus = '';
          this.pendingConnectionId = '';
        },
        failure: (err: any) => {},
      });
    }
  };

  // event code to determine whether it is missed call or incmoing call

  GetContact = () => {
    var isConnecting = -1;
    var interactionType = '';
    if (this.ccpService.CurrentAgent != null) {
      this.ccpService.CurrentAgent.getContacts().forEach((X: any) => {
        if (
          (X.getState().type == 'connecting' ||
            X.getState().type == 'incoming') &&
          isConnecting == -1 &&
          (X.getType().toString() == 'voice' ||
            X.getType().toString() == 'queue_callback') &&
          this.ccpService.Connections.length > 1 &&
          this.ccpService.Connections[1].getType().toString() == 'inbound'
        ) {
          isConnecting = 1;
          interactionType = X.getType().toString();
          this.pendingConnectionId = X.contactId;
          if (this.callStatus != 'REJECTED') {
            this.callStatus = '';
          }
        }
      });

      this.ccpService.CurrentAgent.getContacts().forEach((X: any) => {
        if (
          (X.getState().type.toString() == 'error' ||
            X.getState().type.toString() == 'missed') &&
          isConnecting == -1 &&
          (X.getType().toString() == 'voice' ||
            X.getType().toString() == 'queue_callback')
        ) {
          isConnecting = 0;
          interactionType = X.getType().toString();
          this.pendingConnectionId = X.contactId;
          if (this.callStatus != 'REJECTED') {
            this.callStatus = 'MISSED';
          }
        }
      });
    }
    if (isConnecting == -1) {
      this.pendingConnectionId = '';
    }

    if (
      this.ccpService.CurrentAgent != null &&
      Object.keys(this.ccpService.CurrentAgent).length > 0 &&
      this.ccpService.CurrentAgent.getConfiguration().softphoneAutoAccept ==
        true &&
      interactionType == 'voice'
    ) {
      isConnecting = -1;
    }
    return isConnecting;
  };

  GetContactType = () => {
    var contactType = -1;
    var isExist = false;

    if (this.ccpService.Connections != null) {
      this.ccpService.Connections.forEach((X: any) => {
        if (X.getAddress().phoneNumber != null) {
          contactType = 1;

          this.callerIdentity = X.getAddress().phoneNumber;
          sessionStorage.setItem(
            'callerPhoneNumber',
            X.getAddress().phoneNumber
          );
          return contactType;
        }
        return null;
      });

      this.ccpService.Connections.forEach((X) => {
        this.ccpService.CurrentAgent.getContacts().forEach((Item: any) => {
          if (
            X.contactId == Item.contactId &&
            X.getState().type == 'connecting' &&
            isExist == false
          ) {
            isExist = true;
            if (Item.getAttributes()['customerName'] != null) {
              var attributes = Item.getAttributes()['customerName'];
              this.callerIdentity = attributes.value;
            }
          }
        });
      });

      return contactType;
    }
    return null;
  };

  // Generic function

  formatDatetime(params) {
    if (params.length > 6) {
      return params.substring(0, 8);
    }
    return params;
  }
}
