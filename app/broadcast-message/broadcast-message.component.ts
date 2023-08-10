import { Component, OnInit } from '@angular/core';
import { CticustomapiService } from '../services/cticustomapi.service';

@Component({
  selector: 'app-broadcast-message',
  templateUrl: './broadcast-message.component.html',
  styleUrls: ['./broadcast-message.component.scss'],
})
export class BroadcastMessageComponent implements OnInit {
  indexOfMessage = -1;
  agentname!: string;
  message = [];
  messageToDisplay!: any;
  fullMessageDetail = '';
  constructor(public cticustomapiService: CticustomapiService) {}

  ngOnInit(): void {
    this.agentname = sessionStorage.getItem('awsAgentID');
    this.fullMessageDetail = '';
    this.cticustomapiService
    .getBroadCastMessage({
      action: 'getBroadcastMessage',
      agentname: sessionStorage.getItem('awsAgentID'),
    })
    .subscribe((response) => {
      // console.log('Broadcast respone ', response);
      if (response && response.body && response.body.length > 0) {
        this.indexOfMessage = 0;
        this.messageToDisplay = response.body[0];
        this.message = response.body;
      } else {
        this.indexOfMessage = -1;
        this.messageToDisplay = null;
        this.message = [];
      }
    });
    // setInterval(() => {
    //   this.cticustomapiService
    //     .getBroadCastMessage({
    //       action: 'getBroadcastMessage',
    //       agentname: sessionStorage.getItem('awsAgentID'),
    //     })
    //     .subscribe((response) => {
    //       // console.log('Broadcast respone ', response);
    //       if (response && response.body && response.body.length > 0) {
    //         this.indexOfMessage = 0;
    //         this.messageToDisplay = response.body[0];
    //         this.message = response.body;
    //       } else {
    //         this.indexOfMessage = -1;
    //         this.messageToDisplay = null;
    //         this.message = [];
    //       }
    //     });
    // }, 20000);
  }

  nextMessage = () => {
    // console.log(this.indexOfMessage);
    // console.log(this.indexOfMessage + 1);
    // console.log(this.message.length);
    if (
      this.indexOfMessage < this.message.length &&
      this.indexOfMessage + 1 < this.message.length
    ) {
      //this.messageToDisplay = this.message[this.indexOfMessage + 1];
      this.messageToDisplay = this.message[this.indexOfMessage + 1];

      this.indexOfMessage += 1;
    }
  };

  previousMessage = () => {
    if (
      this.indexOfMessage < this.message.length &&
      this.indexOfMessage - 1 >= 0
    ) {
      this.messageToDisplay = '';

      this.messageToDisplay = this.message[this.indexOfMessage - 1];
      this.indexOfMessage -= 1;
    }
  };
}
