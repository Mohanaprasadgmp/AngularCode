import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subscription, Subject, async } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
//import { ChatClientInstances } from '../models/user-email';
import { from } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class CcpService {
  private ccpMessage = new Subject<any>();
  private agentMessage = new Subject<any>();
  private contactMessage = new Subject<any>();
  public agentMuteStatus!: boolean;
  ccpUrl!: string;
  that: any;
  loginUrl!: string;
  _connect: any;
  public Logger: any;
  name!: string;
  //chatClient: ChatClientInstances[] = [];
  public ContainerDiv!: HTMLElement;
  public CurrentContact!: any; //connect.Contact;
  public CurrentAgent!: any; //connect.Agent;
  public _CurrentAgent: any; //connect.Agent;
  public Connections: connect.BaseConnection[] = [];
  public AgentConnection!: any; //connect.BaseConnection;
  public isAuthenticated: boolean = false;
  public loginWindowHandler: any;
  public isSignOutRequest: boolean = false;
  public AgentStates: connect.AgentStateDefinition[] = [];
  public Agentqueues: any;
  public AgentStatus: any;
  public eventBus: any;
  selectedAgentState!: connect.AgentStateDefinition;
  public voiceConnection!: connect.VoiceConnection;
  public loggedinAgentName!: string;
  public AWSAgentName!: string;
  absoluteTime!: string;
  // callvarcomp: AttributesTabComponent;
  sleep = (m: any) => new Promise((r) => setTimeout(r, m));
  constructor(private toasterService: ToastrService, public router: Router) {}

  public report(): string {
    return 'a';
  }

  // public AddChatInstance(pToken: any, client: any) {
  //   this.chatClient = this.chatClient.filter((X) => X.clientToken != pToken);
  //   this.chatClient.push({ clientToken: pToken, client: client });
  // }

  // public GetChatInstance(pToken: any) {
  //   const chatClient = this.chatClient.filter((X) => X.clientToken == pToken);
  //   if (chatClient != null && chatClient.length > 0) {
  //     return chatClient[0].client;
  //   } else {
  //     return null;
  //   }
  // }

  getCCPMessage(): Observable<any> {
    return this.ccpMessage.asObservable();
  }
  getAgentMessage(): Observable<any> {
    return this.agentMessage.asObservable();
  }
  getContactMessage(): Observable<any> {
    return this.contactMessage.asObservable();
  }

  setAgentMessage(agentinfo: any) {
    this.agentMessage.next(agentinfo);
  }

  async signOut() {
    await from(
      fetch(`${environment.settings.domainUrl}/connect/logout`, {
        mode: 'no-cors',
        credentials: 'include',
      }).then(() => {
        this.terminate();
        // const logoutEventBus = connect.core.getEventBus();
        // logoutEventBus.trigger(connect.EventType.TERMINATE);
      })
    );
  }

  setContactMessage(contactInfo: any, eventname: any) {
    contactInfo.event = eventname;
    this.contactMessage.next(contactInfo);
  }

  setCCPMessage(ccpInfo: any, eventname: any) {
    try {
      ccpInfo.event = eventname;
      this.ccpMessage.next(ccpInfo);
    } catch (ex) {
      this.ccpMessage.next(ccpInfo);
    }
  }
  public initiateConnection(): void {
    const globalConfig = {
      region: environment.settings.region, // "us-west-2" is the default value.
    };
    this.ccpUrl = environment.settings.ccpUrl;
    this.loginUrl = environment.settings.loginUrl;

    connect.core.initCCP(this.ContainerDiv, {
      ccpUrl: this.ccpUrl,
      region: environment.settings.region,
      loginPopup: environment.settings.loginPopup,
      loginOptions: environment.settings.loginOptions,
      loginPopupAutoClose: environment.settings.loginPopupAutoClose,
      softphone: {
        allowFramedSoftphone: true,
      },
    });
    this.eventBus = connect.core.getEventBus();
    this.Logger = connect.getLog();
    this.Logger.info('Initialize EventBus');
    if (this.eventBus) {
      this.eventBus.subscribe(connect.EventType.ACK_TIMEOUT, this.AckTimeOut);
      this.eventBus.subscribe(connect.EventType.ACKNOWLEDGE, this.AckReceived);
    }
    connect.core.onViewContact(this.subscribeToviewActiveContact);
    connect.core.onAccessDenied(this.subscribeToAccessDenied);
    connect.core.onAuthFail(this.subscribeToAuthFailed);
    connect.onWebsocketInitFailure(this.subscribeSocketResponse);
    // connect.ChatSession.setGlobalConfig(globalConfig);
    connect.contact(this.subscribeToContactEvents);
    connect.agent(this.subscribeToAgentEvents);
  }
  AckTimeOut = (evt: any) => {
    console.debug(evt);
    this.Logger.info('Ack 1 TimeOut');
    console.log('Ack 1 TimeOut');
    this.isAuthenticated = false;
  };

  AckReceived = (evt: any) => {
    console.debug(evt);
    // console.log('Ack 1 Received');
    // this.Logger.info('Ack 1 Received');
    // this.toasterService.success('Connected to the Server', 'Success', {
    //   positionClass: 'toast-top-right',
    // });
    this.isAuthenticated = true;

    // this.toasterService.clear();
    if (this.loginWindowHandler) {
      this.loginWindowHandler.close();
    }
  };
  public subscribeSoftphoneInit(): void {
    console.debug('Softphone Initialize ');
  }
  public subscribeSocketResponse(): void {
    console.debug('WebSocket Error ');
  }
  public subscribeToviewActiveContact(contact: any): void {
    this.setCCPMessage(contact, 'ActiveViewChanged');
  }
  public subscribeToAccessDenied(): void {
    console.debug('Access Denied');
    this.setCCPMessage('AccessDenied', 'AccessDenied');
  }
  public subscribeToAuthFailed(): void {
    console.debug('Auth Failed');
    this.setCCPMessage('AuthFailed', 'AuthFailed');
  }

  public terminate(): void {
    connect.core.terminate();
    this.isAuthenticated = false;

    var containerDiv = document.getElementById('containerDiv');
    var iframe = containerDiv.firstElementChild; // assumes there's nothing else in the container
    containerDiv.removeChild(iframe);
  }

  /**
   * Changes the currently selected contact in the CCP user interface.
   * Useful when an agent handles more than one concurrent chat.
   *
   * @param contactId The contact ID.
   */
  public viewContact(contactId: string): void {
    connect.core.viewContact(contactId);
  }

  subscribeToContactEvents: any = (contact: {
    getAgentConnection: () => {
      (): any;
      new (): any;
      getMediaType: { (): any; new (): any };
      getMediaController: { (): Promise<any>; new (): any };
    };
    onRefresh: (arg0: (contact: any) => Promise<void>) => void;
    onIncoming: (arg0: (contact: any) => void) => void;
    onAccepted: (arg0: (contact: any) => void) => void;
    onConnected: (arg0: (contact: any) => Promise<void>) => void;
    onEnded: (arg0: (contact: any) => void) => void;
    onACW: (arg0: (contact: any) => void) => void;
    onDestroy: (arg0: (contact: any) => void) => void;
    onConnecting: (arg0: (contact: any) => void) => void;
    onMissed: (arg0: (contact: any) => Promise<void>) => void;
    onPending: (arg0: (contact: any) => void) => void;
    getAttributes: () => { (): any; new (): any; ANI: string };
    isInbound: () => string;
  }) => {
    console.debug('New Contact subscribe To ContactEvents');
    this.absoluteTime = '';
    this.CurrentContact = contact;
    this.Connections = this.CurrentContact._getData().connections;
    this.AgentConnection = contact.getAgentConnection();

    contact.onACW(this.handleContactACW);
    contact.onRefresh(this.handleContactRefresh);
    contact.onIncoming(this.handleContactIncoming);
    contact.onAccepted(this.handleContactAccepted);
    contact.onConnected(this.handleContactConnected);
    contact.onEnded(this.handleContactEnded);
    contact.onDestroy(this.handleContactDetroy);
    contact.onConnecting(this.handleContactConnecting);
    contact.onMissed(this.handleContactMissed);
    contact.onPending(this.handleContactPending);

    console.debug(
      'ANI - ' + contact.getAttributes().ANI
        ? contact.getAttributes().ANI
        : 'None'
    );
    console.debug('isInbound - ' + contact.isInbound());
    this.setContactMessage(contact, 'subscribeToContactEvents');

    // if (contact) {
    //   if (
    //     contact.getAgentConnection().getMediaType() === connect.MediaType.CHAT
    //   ) {
    //     contact
    //       .getAgentConnection()
    //       .getMediaController()
    //       .then(
    //         (controller: {
    //           onTyping: (arg0: (data: any) => void) => void;
    //           onMessage: (arg0: (data: any) => void) => void;
    //         }) => {
    //           controller.onTyping((data: any) => {
    //             console.debug('someone is typing! details:', data);
    //           });
    //           controller.onMessage(
    //             (data: { data: { event: string; AbsoluteTime: string } }) => {
    //               data.data.event = 'handleChatMessageRedeived';
    //               if (this.absoluteTime != data.data.AbsoluteTime) {
    //                 this.absoluteTime = data.data.AbsoluteTime;
    //                 this.setContactMessage(
    //                   data.data,
    //                   'handleChatMessageRedeived'
    //                 );
    //               }
    //             }
    //           );
    //         }
    //       );
    //   }
    // }
  };

  chatSession: any;
  handleConnectionToken = (token: any) => {};

  handleContactConnecting = (contact: any) => {
    this.setContactMessage(contact, 'handleCallContactConnecting');
  };

  handleContactDetroy = (contact: any) => {};
  handleContactACW = (contact: any) => {
    console.log(contact);
    if (this.CurrentContact) {
      try {
        contact.disconnectContact();
      } catch (ex) {
        console.log('endcontactexception', ex);
      }
    }
    this.Connections = [];
  };

  handleContactMissed = async (contact: any) => {
    console.debug('handleContactMissed', contact);
  };

  handleContactPending = (contact: any) => {
    console.debug('handleContactPending', contact);
  };

  handleContactRefresh = async (contact: {
    getConnections: () => connect.BaseConnection[];
    getAgentConnection: () => any;
  }) => {
    console.debug('handleContactRefresh', contact);

    if (contact) {
      try {
        this.CurrentContact = contact;
        this.Connections = contact.getConnections();

        this.AgentConnection = contact.getAgentConnection();
        const contactStatus = this.CurrentContact.getStatus();
        console.debug('Contact Status ', contactStatus);
        const state = this.AgentConnection.getState();
        const agentstatus = this.CurrentAgent.getState().name;
      } catch (ex) {
        this.toasterService.error('Error on Handle Refresh');
      }
    } else {
      this.Connections = [];
      this.CurrentContact = null;
      this.AgentConnection = null;
    }
  };

  handleContactIncoming = (contact: any) => {
    console.debug('handleContactIncoming ', contact);
  };

  handleContactAccepted = (contact: any) => {
    console.debug('Contact Accepted ', contact);
  };

  handleContactConnected = async (contact: any) => {
    console.debug('handleContactConnected', contact);
    this.setContactMessage(contact, 'handleContactConnected');
  };

  handleContactEnded = (contact: any) => {
    console.debug('handleContactEnded', contact);
    this.CurrentContact = null;
    this.AgentConnection = null;
    this.setContactMessage(contact, 'handleContactEnded');
  };

  subscribeToAgentEvents: any = (agent: {
    onAfterCallWork: (arg0: (agent: any) => void) => void;
    onStateChange: (arg0: (agent: any) => void) => void;
    getStatus: () => { (): any; new (): any; name: string };
    getRoutingProfile: () => { (): any; new (): any; queues: any };
    getName: () => string;
    getConfiguration: () => { (): any; new (): any; username: string };
    onError: (arg0: (agent: any) => void) => void;
    onWebSocketConnectionLost: (arg0: (agent: any) => void) => void;
    onWebSocketConnectionGained: (arg0: (agent: any) => void) => void;
    onRefresh: (arg0: (agent: any) => void) => void;
    onRoutable: (arg0: (agent: any) => void) => void;
    onNotRoutable: (arg0: (agent: any) => void) => void;
    onOffline: (arg0: (agent: any) => void) => void;
    onSoftphoneError: (arg0: (agent: any) => void) => void;
    onContactPending: (arg0: (contact: any) => void) => void;
    onMuteToggle: (arg0: (muteStatus: any) => void) => void;
  }) => {
    agent.onAfterCallWork(this.handleAfterCallWork);
    agent.onMuteToggle(this.handleMuteToggle);
    agent.onStateChange(this.handleStateChange);

    this.CurrentAgent = agent;
    this._CurrentAgent = agent;
    this.AgentStatus = agent.getStatus();
    this.AgentStates = this.CurrentAgent.getAgentStates();
    this.Agentqueues = agent.getRoutingProfile().queues;
    this.AWSAgentName = agent.getName();
    this.loggedinAgentName = agent.getConfiguration().username;
    this.displayAgentStatus(agent);
    console.debug('Agent Status - ' + agent.getStatus().name);
    agent.onError(this.handleAgentError);
    agent.onWebSocketConnectionLost(this.handleAgentWebSocketLost);
    agent.onWebSocketConnectionGained(this.handleAgentWebSocketGained);
    agent.onRefresh(this.handleAgentRefresh);
    agent.onRoutable(this.handleAgentRoutable);
    agent.onNotRoutable(this.handleAgentNotRoutable);
    agent.onOffline(this.handleAgentOffline);
    agent.onSoftphoneError(this.handleSoftphoneError);
    agent.onContactPending(this.handleContactPending);

    this.setAgentMessage(agent);
  };

  handleAgentWebSocketLost = (agent: any) => {
    this.toasterService.warning(
      'Error on connecting to the server',
      'connection error',
      { tapToDismiss: true, closeButton: true, timeOut: 0 }
    );
    console.debug('WebSocket Lost ', agent);
  };

  handleAgentWebSocketGained = (agent: any) => {
    this.toasterService.clear();
    this.toasterService.success('Connected to the Server');
    console.debug('WebSocket gained', agent);
  };

  handleAgentError = (agent: {
    getErrorMessage: () => string | undefined;
    getErrorType: () => string | undefined;
  }) => {
    console.debug('Agent Error : ', agent);
    try {
      this.toasterService.warning(
        agent ? agent.getErrorMessage() : 'Error on Agent system',
        agent ? agent.getErrorType() : 'Agent Error'
      );
    } catch (ex) {
      console.error(ex);
    }
  };

  handleSoftphoneError = (agent: {
    getErrorMessage: () => string | undefined;
    getErrorType: () => string | undefined;
  }) => {
    console.debug('Softphone Error : ', agent);
    try {
      this.toasterService.warning(
        agent.getErrorMessage(),
        agent.getErrorType()
      );
    } catch (ex) {
      console.error(ex);
    }
  };

  handleAfterCallWork = (agent: any) => {
    this.setContactMessage(agent, '_handleAfterCallWork');
  };

  handleStateChange = (agent: any) => {
    this.setContactMessage(agent, '_handleStateChange');
  };

  handleMuteToggle = (muteStatus: { muted: boolean }) => {
    // alert('1');
    console.log('handleMuteToggle', muteStatus.muted);
    this.agentMuteStatus = muteStatus.muted;
  };

  handleAgentRefresh = (agent: {
    getStatus: () => { (): any; new (): any; name: any; type: any };
  }) => {
    try {
      this.AgentStatus = agent.getStatus();
      this.selectedAgentState = this.AgentStates.filter(
        (agentstate) =>
          agentstate.name === agent.getStatus().name &&
          agentstate.type === agent.getStatus().type
      )[0];
      if (
        this.AgentStatus.type !== 'system' ||
        [
          'AfterCallWork',
          'FailedConnectAgent',
          'FailedConnectCustomer',
        ].includes(this.AgentStatus.name)
      ) {
        this.Connections = [];
      }
      this.displayAgentStatus(agent);
      this.setContactMessage(agent, '_handleAgentRefresh');
    } catch (ex) {}
  };

  handleAgentRoutable = (agent: any) => {
    this.setContactMessage(agent, '_handleAgentRoutable');
  };

  handleAgentNotRoutable = (agent: any) => {
    this.setContactMessage(agent, '_handleAgentNotRoutable');
  };

  handleAgentOffline = (agent: any) => {
    this.setContactMessage(agent, '_handleAgentOffline');
  };

  getcontact = (contactId: any) => {
    return this.CurrentAgent.getContacts().filter(
      (item: { contactId: any }) => item.contactId == contactId
    );
  };
  getVoiceContact = function (this: CcpService) {
    // return (
    //   this.getAgent().getContacts(connect.ContactType.VOICE)[0] ||
    //   this.getQueueCallBackContact()
    // );
  };

  getQueueCallBackContact = function (this: CcpService) {
    // return (
    //   this.getAgent().getContacts(connect.ContactType.QUEUE_CALLBACK)[0] || null
    // );
  };

  displayAgentStatus = (agent: any) => {
    this.setAgentMessage(agent);
  };

  muteSelf = () => {
    this.CurrentAgent.mute();
  };
  unMuteSelf = () => {
    this.CurrentAgent.unmute();
  };

  SetAgentState = (data: { name: any }) => {
    const promise = new Promise((resolve, reject) => {
      this.selectedAgentState = this.AgentStates.filter(
        (agentstate) => agentstate.name === data.name
      )[0];
      this.CurrentAgent.setState(this.selectedAgentState, {
        success: () => {
          resolve(true);
        },
        failure: (err: any) => {
          reject(err);
        },
      });
    });
    return promise;
  };

  holdContact = async () => {
    if (
      this.CurrentContact &&
      this.CurrentContact.getConnections().length > 0
    ) {
      await this.asyncForEach(
        this.CurrentContact.getConnections(),
        async (connection: connect.BaseConnection) => {
          if (connection.getAddress().type != connect.EndpointType.AGENT) {
            await this.holdConnection(connection);
            await this.sleep(100);
          }
        }
      );
    }
  };

  asyncForEach = async (
    array: string | any[],
    callback: {
      (connection: connect.BaseConnection): Promise<void>;
      (connection: connect.BaseConnection): Promise<void>;
      (arg0: any, arg1: number, arg2: any): any;
    }
  ) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  };

  clearContact = () => {
    const promise = new Promise((resolve, reject) => {
      this.CurrentContact.clear({
        success: () => {
          resolve(true);
        },
        failure: (err: any) => {
          console.debug('Error on Clear Contact');
          reject(err);
        },
      });
    });
    return promise;
  };

  dropAgentConnection = (connection: connect.BaseConnection) => {
    const promise = new Promise((resolve, reject) => {
      const contact = this.CurrentAgent.getContacts(
        connect.ContactType.VOICE
      )[0];
      contact.getAgentConnection().destroy({
        success: () => {
          resolve(true);
        },
        failure: (err: any) => {
          console.debug('error on Hold Connection');
          reject(err);
        },
      });
    });
    return promise;
  };

  SendDigits = (connection: connect.BaseConnection, digit: string) => {
    const promise = new Promise((resolve, reject) => {
      connection.sendDigits(digit, {
        success: () => {
          resolve(true);
        },
        failure: (err: any) => {
          console.debug('error on Hold Connection');
          reject(err);
        },
      });
    });
    return promise;
  };

  holdConnection = (connection: connect.BaseConnection) => {
    const promise = new Promise((resolve, reject) => {
      if (connection != null && !connection.isOnHold()) {
        connection.hold({
          success: () => {
            resolve(true);
          },
          failure: (err: any) => {
            console.debug('error on Hold Connection');
            reject(err);
          },
        });
      }
    });
    return promise;
  };

  joinConnection = () => {
    const promise = new Promise((resolve, reject) => {
      this.CurrentContact.conferenceConnections({
        success: () => {
          resolve(true);
        },
        failure: (err: string) => {
          console.error('joinConnection: ' + err);
          reject(err);
        },
      });
    });
    return promise;
  };

  makeBargin = () => {
    //let connection = new connect.VoiceConnection().isBargeEnabled;
    console.log(this.voiceConnection);
    if (this.CurrentContact.getAgentConnection().isBargeEnabled()) {
      console.log('GoInside make bargin');
      this.CurrentContact.updateMonitorParticipantState(
        connect.MonitoringMode.BARGE,
        {
          success: function () {
            console.log(
              'Successfully changed the monitoring status to barge, now you can control the conversation'
            );
          },
          failure: function (err) {
            console.log('Somenting went wrong, here is the error ', err);
          },
        }
      );
    }
  };

  makeMonitor = () => {
    if (this.CurrentContact.getAgentConnection().isSilentMonitorEnabled()) {
      this.CurrentContact.updateMonitorParticipantState(
        connect.MonitoringMode.SILENT_MONITOR,
        {
          success: function () {
            console.log(
              'Successfully changed the monitoring status to silent monitor'
            );
          },
          failure: function (err) {
            console.log('Somenting went wrong, here is the error ', err);
          },
        }
      );
    }
  };

  swapConnection = () => {
    const promise = new Promise((resolve, reject) => {
      this.CurrentContact.toggleActiveConnections({
        success: () => {
          resolve(true);
        },
        failure: (err: string) => {
          console.debug('*********' + err + '*************');
          reject(err);
        },
      });
    });
    return promise;
  };

  resumeContact = async () => {
    let canExist = false;
    if (
      this.CurrentContact &&
      this.CurrentContact.getConnections().length > 0
    ) {
      await this.asyncForEach(
        this.CurrentContact.getConnections(),
        async (connection: connect.BaseConnection) => {
          if (
            connection.getAddress().type != connect.EndpointType.AGENT &&
            !canExist
          ) {
            await this.resumeConnection(connection);
            await this.sleep(800);
            await this.joinConnection();
            canExist = true;
          }
        }
      );
    }
  };

  resumeConnection = (connection: connect.BaseConnection) => {
    const promise = new Promise((resolve, reject) => {
      console.log('Connection is ', connection.isOnHold());
      if (connection != null && connection.isOnHold()) {
        connection.resume({
          success: () => {
            resolve(true);
          },
          failure: (res: any) => {
            reject(res);
          },
        });
      }
    });
    return promise;
  };

  acceptContact = (connection: connect.BaseConnection) => {
    const promise = new Promise((resolve, reject) => {
      this.CurrentContact.accept({
        success: () => {
          resolve(true);
        },
        failure: (err: string) => {
          console.debug('*********' + err + '*************');
          reject(err);
        },
      });
    });
    return promise;
  };

  disconnectContact = () => {
    const promise = new Promise((resolve, reject) => {
      console.log('endcontact current contact', this.CurrentContact);
      console.log(
        'endcontact getagentconnection',
        this.CurrentContact.getAgentConnection()
      );
      if (
        this.CurrentContact != null &&
        this.CurrentContact.getAgentConnection() != null
      ) {
        this.CurrentContact.getAgentConnection().destroy({
          success: () => {
            resolve(true);
          },
          failure: (err: any) => {
            reject(err);
          },
        });
      }
    });
    return promise;
  };

  disconnectConnection = (connection: connect.BaseConnection) => {
    const promise = new Promise((resolve, reject) => {
      connection.destroy({
        success: () => {
          resolve(true);
        },
        failure: (err: any) => {
          reject(err);
        },
      });
    });
    return promise;
  };

  PostMessage(message: string) {
    this.setContactMessage({ callerNo: message, eventData: 'OB' }, 'UserEvent');
  }

  CallHandler(message: string, loadID: string) {
    this.setContactMessage({ loadID: loadID }, message);
  }

  makeQuickConnectCallTransfer(quick: any) {
    console.log('makeQuickConnectCallTransfer inside quick', quick);
    const that = this;
    const promise = new Promise((resolve, reject) => {
      console.log(
        'this._CurrentAgent.getContacts()[0]',
        this._CurrentAgent.getContacts()[0]
      );
      this._CurrentAgent.getContacts()[0].addConnection(quick, {
        success: function (data: any) {
          that._CurrentAgent.toSnapshot();
          that.sleep(800);
          that.dropAgentConnection(null);
          console.log('Consult transfer success');
          resolve(true);
        },
        failure: function (data: any) {
          console.error('Consult transfer failed');
          reject();
        },
      });
    });
    return promise;
  }

  makeQuickConnectCall(quick: any) {
    const that = this;
    const promise = new Promise((resolve, reject) => {
      this._CurrentAgent.getContacts()[0].addConnection(quick, {
        success: function (data: any) {
          that._CurrentAgent.toSnapshot();
          console.debug('Consult transfer success');
          resolve(true);
        },
        failure: function (data: any) {
          console.error('Consult transfer failed');
          reject();
        },
      });
    });
    return promise;
  }

  GetQuickConnectContacts(): any {
    const promise = new Promise((resolve, reject) => {
      var quick: any = [];
      if (this._CurrentAgent == null) {
        return resolve(quick);
      }
      const arns = this._CurrentAgent.getAllQueueARNs();
      this._CurrentAgent.getAddresses(arns, {
        success: function (data: { endpoints: any[] }) {
          data.endpoints.forEach(
            (X: { type: string; name: any; endpointARN: any }) => {
              if (X.type === 'agent') {
                quick.push({ name: X.name, endpointARN: X.endpointARN });
              }
            }
          );
          resolve(quick);
        },
        failure: function (error: any) {
          reject(error);
        },
      });
    });
    return promise;
  }

  GetQuickConnectQueueContacts(): any {
    const promise = new Promise((resolve, reject) => {
      var quick: any = [];
      if (this._CurrentAgent == null) {
        return resolve(quick);
      }
      var arns = this._CurrentAgent.getAllQueueARNs();
      this._CurrentAgent.getAddresses(arns, {
        success: function (data: { endpoints: any[] }) {
          data.endpoints.forEach(
            (X: { type: string; name: any; endpointARN: any }) => {
              if (X.type !== 'agent') {
                quick.push({
                  name: X.name,
                  type: X.type,
                  endpointARN: X.endpointARN,
                });
              }
            }
          );
          resolve(quick);
        },
        failure: function (error: any) {
          reject(error);
        },
      });
    });
    return promise;
  }

  GetAllQuickConnectQueueContactsOfPhoneNumberType(): any {
    const promise = new Promise((resolve, reject) => {
      var quick: any = [];
      console.log(this._CurrentAgent);
      if (this._CurrentAgent == null) {
        return resolve(quick);
      }
      var arns = this._CurrentAgent.getAllQueueARNs();
      console.log('ARN is ', arns);
      this._CurrentAgent.getAddresses(arns, {
        success: function (data: { endpoints: any[] }) {
          console.log('data is ', data);
          data.endpoints.forEach(
            (X: { name: any; type: any; endpointARN: any }) => {
              if (X.type === 'phone_number') {
                quick.push({
                  name: X.name,
                  type: X.type,
                  endpointARN: X.endpointARN,
                });
              }
            }
          );
          resolve(quick);
        },
        failure: function (error: any) {
          reject(error);
        },
      });
    });
    return promise;
  }

  GetAllQuickConnectQueueContacts(): any {
    const promise = new Promise((resolve, reject) => {
      var quick: any = [];
      console.log(this._CurrentAgent);
      if (this._CurrentAgent == null) {
        return resolve(quick);
      }
      var arns = this._CurrentAgent.getAllQueueARNs();
      console.log('ARN is ', arns);
      this._CurrentAgent.getAddresses(arns, {
        success: function (data: { endpoints: any[] }) {
          console.log('data is ', data);
          data.endpoints.forEach(
            (X: { name: any; type: any; endpointARN: any }) => {
              quick.push({
                name: X.name,
                type: X.type,
                endpointARN: X.endpointARN,
              });
            }
          );
          resolve(quick);
        },
        failure: function (error: any) {
          reject(error);
        },
      });
    });
    return promise;
  }

  makecall(num: string) {
    // this.PostMessage(num);
    const promise = new Promise((resolve, reject) => {
      this.CurrentAgent.connect(connect.Endpoint.byPhoneNumber(num), {
        success: () => {
          resolve(true);
        },
        failure: (err: any) => {
          console.debug('Makecall Error:' + JSON.stringify(err));
          reject(err);
        },
      });
    });
    return promise;
  }

  downloadLog() {
    connect.getLog().download();
  }

  infoLog(mes: any, e: any = '', obj: any = '') {
    this.Logger = connect.getLog();
    this.Logger.warn(mes).withException(e).withObject(obj);
  }

  errorLog(mes: any, e: any = '', obj: any = '') {
    this.Logger = connect.getLog();
    this.Logger.error(mes).withException(e).withObject(obj);
  }

  debugLog(mes: any, e: any = '', obj: any = '') {
    this.Logger = connect.getLog();
    this.Logger.warn(mes).withException(e).withObject(obj);
  }

  addConn(num: string): any {
    const promise = new Promise((resolve, reject) => {
      this.CurrentContact.addConnection(connect.Endpoint.byPhoneNumber(num), {
        success: () => {
          resolve(true);
        },
        failure: (err: any) => {
          reject(err);
        },
      });
    });
    return promise;
  }

  addConnUsingEndpoint(endpoint: any): any {
    const that = this;
    const promise = new Promise((resolve, reject) => {
      this._CurrentAgent.getContacts()[0].addConnection(endpoint, {
        success: function (data: any) {
          that._CurrentAgent.toSnapshot();
          console.debug('Consult transfer success');
          resolve(true);
        },
        failure: function (data: any) {
          console.error('Consult transfer failed');
          reject();
        },
      });
    });
    return promise;
  }

  async directTransferUsingEndpoint(endpoint: any) {
    await this.addConnUsingEndpoint(endpoint);
    this.CurrentAgent.toSnapshot();
    await this.dropAgentConnection(null);
  }

  async directTransfer(num: string) {
    await this.addConn(num);
    this.CurrentAgent.toSnapshot();
    await this.sleep(800);
    await this.dropAgentConnection(null);
  }

  async directConference(num: string) {
    await this.addConn(num);
    this.CurrentAgent.toSnapshot();
    await this.sleep(800);
    await this.joinConnection();
  }

  // CreateNewConnection(chatDetails: { ContactId: any }) {
  //   const logger = {
  //     debug: (data: any) => {
  //       console.debug(data);
  //     },
  //     info: (data: any) => {
  //       console.info(data);
  //     },
  //     warn: (data: any) => {
  //       console.warn(data);
  //     },
  //     error: (data: any) => {
  //       console.error(data);
  //     },
  //   };

  //   const globalConfig = {
  //     loggerConfig: {
  //       logger,
  //       level: connect.ChatSession.LogLevel.INFO,
  //     },
  //     //region: "us-west-2"
  //     //following is done to connect to psteam instance
  //     region: environment.settings.region,
  //   };
  //   const socketManager = connect.core.getWebSocketManager();
  //   const promise = new Promise((resolve, reject) => {
  //     const args = {
  //       chatDetails: this.GetChatInstance(chatDetails.ContactId),
  //       type: connect.ChatSession.SessionTypes.AGENT,
  //       websocketManager: socketManager,
  //     };

  //     if (args.chatDetails == null) {
  //       resolve(null);
  //     }
  //     connect.ChatSession.setGlobalConfig(globalConfig);
  //     const chatClient = connect.ChatSession.create(args);
  //     try {
  //       chatClient
  //         .connect()
  //         .then((response: any) => {
  //           console.debug('Chat is connected!');
  //           resolve(chatClient);
  //         })
  //         .catch((error: any) => {
  //           console.debug('Could not connect.');
  //           resolve(null);
  //         });
  //     } catch (e) {
  //       resolve(null);
  //     }
  //   });
  //   return promise;
  // }
}
