import { Component } from '@angular/core';
import { CticustomapiService } from '../services/cticustomapi.service';
import { CcpService } from '../services/ccp.service';
import { Subscription } from 'rxjs';
import { WrapupService } from '../services/wrapup.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-wrapup',
  templateUrl: './wrapup.component.html',
  styleUrls: ['./wrapup.component.scss'],
})
export class WrapupComponent {
  contactSubscription: Subscription;
  IsEappointmentCall!: string;
  whatScreenToDisplay = '';
  callEnded = false;
  cscCaseID!: string;
  hrCaseID!: string;
  eappointemntCaseId!: string;
  agentSubscription: Subscription;
  applyWrapupClicked = false;
  contactID = '';
  wrapupDropdownChanged = true;
  statusDropdownChanged = true;
  statusEADropdownChanged = true;
  selectedHRWrapup!: string;
  hrWrapUp = [];
  eappointmentCallbackStatus = [];
  eappointmentWalkinStatus = [];
  stausEapointment!: string;
  displayTable = false;
  selectedAgentState: string;
  dialStatus: any;
  agent: any;
  nextAgentCsc: boolean = true;
  nextAgentHr: boolean = true;
  nextAgentEappt: boolean = true;
  selectedAgentStateInWrapup: any;
  public agentStates: Array<any> = [{ state: 'Not Ready' }];
  agentInterval: any;
  callbackDropdown = false;
  walkinDropdown = false;
  constructor(
    public cticustomapiService: CticustomapiService,
    public ccpService: CcpService,
    public wrapupService: WrapupService
  ) {}
  ngOnInit(): void {
    this.agentInterval = setInterval(() => {
      this.getAgentDetails();
    }, 1000);
    setInterval(() => {
      if (
        sessionStorage.getItem('serviceId') != null &&
        sessionStorage.getItem('serviceId') != undefined
      ) {
        if (
          sessionStorage.getItem('serviceId') === environment.settings.callBack
        ) {
          this.callbackDropdown = true;
          this.walkinDropdown = false;
        }
        if (
          sessionStorage.getItem('serviceId') === environment.settings.walkin
        ) {
          this.callbackDropdown = false;
          this.walkinDropdown = true;
        }
      }
    }, 3000);
    console.log(this.agentStates);
    this.cscCaseID = '';
    this.hrCaseID = '';
    this.eappointemntCaseId = '';
    this.wrapupService
      .getAdminWrapup({
        action: 'getAdminWrapup',
        id: 0,
      })
      .subscribe((response) => {
        this.hrWrapUp = [];
        if (response && response.body && response.body.length > 0) {
          for (let i = 0; i < response.body.length; i++) {
            if (response.body[i]) {
              this.hrWrapUp.push(response.body[i].wuP_Code);
            }
          }
        }
      });

    this.cticustomapiService
      .getEappointmentStatusValue({
        action: 'getEappointmentStatusValues',
      })
      .subscribe((response) => {
        this.eappointmentCallbackStatus = response.body[0].callback;
        this.eappointmentWalkinStatus = response.body[0].walkin;
        console.log(
          'eappointmentCallbackStatus ',
          this.eappointmentCallbackStatus
        );
        console.log('eappointmentWalkinStatus ', this.eappointmentWalkinStatus);
      });
    setInterval(() => {
      this.IsEappointmentCall = sessionStorage.getItem('IsEappointmentCall');
      this.whatScreenToDisplay = sessionStorage.getItem('screenToDisplay');
      this.selectedAgentState = sessionStorage.getItem('selectedAgentState');
      if (sessionStorage.getItem('CustomerInfo')) {
        this.displayTable = true;
      } else {
        this.displayTable = false;
      }
    }, 1000);
    this.agentSubscription = this.ccpService
      .getAgentMessage()
      .subscribe((message) => {
        this.agent = message;
      });
    this.contactSubscription = this.ccpService
      .getContactMessage()
      .subscribe((message) => {
        this.contactSubscriptionHandler(message);
      });
  }
  async contactSubscriptionHandler(contact) {
    if (contact.event == 'handleContactIncoming') {
      this.callEnded = false;
    }

    if (contact.event == 'handleContactConnected') {
      this.callEnded = false;
      this.contactID = contact.contactId;
    }

    if (contact.event == 'handleContactConnecting') {
      this.callEnded = false;
      this.contactID = contact.contactId;
    }

    if (contact.event == 'handleContactRefresh') {
      this.callEnded = false;
      this.contactID = contact.contactId;
    }

    if (contact.event == 'handleContactEnded') {
      console.log('Call ended');

      this.callEnded = true;
      this.contactID = contact.contactId;
      this.cscCaseID = '';
      this.hrCaseID = '';
      this.eappointemntCaseId = '';
    }
  }

  ApplyWrapUp = async (department) => {
    this.applyWrapupClicked = true;
    if (department === 'CSC') {
      let params = {
        action: 'UpdateContactAttributes',
        department: 'CSC',
        contactID: this.contactID,
        caseID: this.cscCaseID,
      };
      this.cticustomapiService
        .updateContactAttributes(params)
        .subscribe((response) => {
          console.log(response);
        });

      let state = this.agent.getAgentStates()[0];
      console.log('State is ', state);
      if (
        this.applyWrapupClicked &&
        this.agent.getState().name === 'AfterCallWork' &&
        this.nextAgentCsc === true
      ) {
        sessionStorage.setItem('CallEnded', '1');
        this.agent.setState(state, {
          success: function () {
            console.log(' Agent is now Available');
          },
          failure: function (err: any) {
            console.log(
              "Couldn't change Agent status to Available. Maybe already in another call?",
              err
            );
          },
        });
      } else {
        try {
          var choosenAgentState = this.agentStates.filter((d) => {
            return d.name == this.selectedAgentStateInWrapup;
          });
          await this.ccpService.SetAgentState(choosenAgentState[0]);
        } catch {}
      }
    }
    if (department === 'HR') {
      let params = {
        action: 'UpdateContactAttributes',
        department: 'HR',
        contactID: this.contactID,
        caseID: this.hrCaseID,
        wrapup: this.selectedHRWrapup,
      };
      this.cticustomapiService
        .updateContactAttributes(params)
        .subscribe((response) => {
          console.log(response);
        });
      let state = this.agent.getAgentStates()[0];
      console.log('State is ', state);
      if (
        this.applyWrapupClicked &&
        this.agent.getState().name === 'AfterCallWork' &&
        this.nextAgentHr === true
      ) {
        sessionStorage.setItem('CallEnded', '1');
        this.agent.setState(state, {
          success: function () {
            console.log(' Agent is now Available');
          },
          failure: function (err: any) {
            console.log(
              "Couldn't change Agent status to Available. Maybe already in another call?",
              err
            );
          },
        });
      } else {
        try {
          var choosenAgentState = this.agentStates.filter((d) => {
            return d.name == this.selectedAgentStateInWrapup;
          });
          await this.ccpService.SetAgentState(choosenAgentState[0]);
        } catch {}
      }
    }
    if (department === 'Eappointment') {
      console.log('IsEappointmentCall');
      console.log(this.stausEapointment);
      sessionStorage.setItem('IsEappointmentCall', 'No');
      if (this.stausEapointment === '1st attempt made, no pick up') {
        this.dialStatus = 'Retry';
      }
      if (this.stausEapointment === '2nd attempt made, no pick up') {
        this.dialStatus = 'Retry';
      }
      if (this.stausEapointment === '3rd attempt made, no pick up') {
        this.dialStatus = 'Cancelled';
      }
      if (this.stausEapointment === 'Called: customer busy, timing postponed') {
        this.dialStatus = 'Retry';
      }
      if (this.stausEapointment === 'Customer visited CSC instead, resolved') {
        this.dialStatus = 'Completed';
      }
      if (this.stausEapointment === 'Done: Customer contacted MOE') {
        this.dialStatus = 'Completed';
      }
      if (this.stausEapointment === 'Done: Spoke to customer') {
        this.dialStatus = 'Completed';
      }
      if (this.stausEapointment === 'Incorrect number provided') {
        this.dialStatus = 'Cancelled';
      }
      if (this.stausEapointment === 'No show') {
        this.dialStatus = 'Cancelled';
      }
      if (
        this.stausEapointment === 'Pre: Called, but customer still coming down'
      ) {
        this.dialStatus = 'In-progress';
      }
      if (this.stausEapointment === 'Pre: Called, Case Resolved') {
        this.dialStatus = 'Completed';
      }
      if (this.stausEapointment === 'Pre: Called, unable to reach') {
        this.dialStatus = 'Retry';
      }
      if (
        this.stausEapointment === 'Pre: Customer called back, case resolved'
      ) {
        this.dialStatus = 'Completed';
      }
      if (this.stausEapointment === 'Visited: Customer visited CSC') {
        this.dialStatus = 'Completed';
      }

      let uniqueServiceId;
      let serviceId;
      if (
        sessionStorage.getItem('uniqueServideid') !== null &&
        sessionStorage.getItem('uniqueServideid') !== undefined
      ) {
        uniqueServiceId = sessionStorage.getItem('uniqueServideid');
      }
      if (
        sessionStorage.getItem('serviceId') !== null &&
        sessionStorage.getItem('serviceId') !== undefined
      ) {
        serviceId = sessionStorage.getItem('serviceId');
      }
      let params = {
        action: 'UpdateContactAttributes',
        department: 'Eappointment',
        contactID: this.contactID,
        caseID: this.eappointemntCaseId,
      };
      this.cticustomapiService
        .updateContactAttributes(params)
        .subscribe((response) => {
          console.log(response);
        });
      this.cticustomapiService
        .getEappointmentCallbackDetail({
          action: 'updateEappointmentDetails',
          appointmentStatus: this.stausEapointment,
          dialStatus: this.dialStatus,
          updateddate: new Date(),
          uniqueServiceId,
          serviceId,
        })
        .subscribe((response) => {
          console.log(response);
        });
      let state = this.agent.getAgentStates()[10];

      console.log('State is ', state);
      if (
        this.applyWrapupClicked &&
        this.agent.getState().name === 'AfterCallWork' &&
        this.nextAgentEappt === true
      ) {
        sessionStorage.setItem('CallEnded', '1');
        this.agent.setState(state, {
          success: function () {
            console.log(' Agent is now Available');
          },
          failure: function (err: any) {
            console.log(
              "Couldn't change Agent status to Available. Maybe already in another call?",
              err
            );
          },
        });
      } else {
        try {
          var choosenAgentState = this.agentStates.filter((d) => {
            return d.name == this.selectedAgentStateInWrapup;
          });
          await this.ccpService.SetAgentState(choosenAgentState[0]);
        } catch {}
      }

      sessionStorage.removeItem('uniqueServideid');
      sessionStorage.removeItem('uniqueServideid');
    }

    let awsAgentID = sessionStorage.getItem('awsAgentID');
    let screenToRemember = sessionStorage.getItem('screenToDisplay');
    //let CustomerInfo = sessionStorage.getItem('CustomerInfo');
    let securityProfile = sessionStorage.getItem('securityProfile');
    sessionStorage.clear();
    sessionStorage.setItem('clearAllFields', 'true');
    sessionStorage.setItem('screenToDisplay', screenToRemember.toUpperCase());
    sessionStorage.setItem('securityProfile', securityProfile);
    sessionStorage.setItem('awsAgentID', awsAgentID);
  };

  changedWrapup = (event: any) => {
    this.selectedHRWrapup = event.target.value;
    this.wrapupDropdownChanged = false;
  };

  // changedStatus = (event : any) => {
  //   this.statusDropdownChanged = false;
  //   this.selectedeappointmentStatus = event.target.value
  // };

  changedEAStatus = (event: any) => {
    this.statusEADropdownChanged = false;
    this.stausEapointment = event.target.value;
    console.log(this.stausEapointment);
  };

  async stateChange(department: any) {
    if (department === 'CSC') {
      this.nextAgentCsc = false;
    }
    if (department === 'HR') {
      this.nextAgentHr = false;
    }
    if (department === 'Eappt') {
      this.nextAgentEappt = false;
    }
    var selectedagentstate = this.selectedAgentStateInWrapup;
    console.log(selectedagentstate);
  }

  GetAgentState = () => {
    return this.agentStates;
  };
  IsAgentStateIncluded = (agentState) => {
    let selectedState = this.agentStates.filter(
      (item) => item.name == agentState
    );
    return selectedState && selectedState.length > 0;
  };

  getAgentDetails() {
    this.agentStates = this.ccpService.AgentStates;
    console.log(this.agentStates);
    clearInterval(this.agentInterval);
  }
}
