import { Component, OnInit } from '@angular/core';
import { CticustomapiService } from '../services/cticustomapi.service';
import { Subscription } from 'rxjs';
import { CcpService } from '../services/ccp.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from '../interceptor/loading.interceptor';
@Component({
  selector: 'app-transcripts',
  templateUrl: './transcripts.component.html',
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
  styleUrls: ['./transcripts.component.scss'],
})
export class TranscriptsComponent implements OnInit {
  componentName = 'TranscriptsComponent';
  contactSubscription: Subscription;
  callContactID!: string;
  transcriptAndSentiment = [];
  isNextToken = '';
  intervalForTranscript: any;
  transcriptAvailable = false;
  constructor(
    public cticustomapiService: CticustomapiService,
    public ccpService: CcpService
  ) {}
  ngOnInit(): void {
    this.contactSubscription = this.ccpService
      .getContactMessage()
      .subscribe((message) => {
        this.contactSubscriptionHandler(message);
      });
  }

  contactSubscriptionHandler(contact: any) {
    if (contact.event == 'handleContactConnected') {
      this.transcriptAvailable = true;
      this.callContactID = contact.contactId;
      this.intervalForTranscript = setInterval(() => {
        let inputParams: any;
        if (this.isNextToken == '') {
          inputParams = {
            action: 'GetRealTimeTranscript',
            contactID: this.callContactID,
          };
        } else {
          inputParams = {
            action: 'GetRealTimeTranscript',
            contactID: this.callContactID,
            nextToken: this.isNextToken,
          };
        }

        this.cticustomapiService
          .getRealTimeTranscriptandSentiment(inputParams)
          .subscribe((response) => {
            if (response && response !== null) {
              if (response.body && response.body.nextToken) {
                this.isNextToken = response.body.nextToken;
              }
              if (response.body) {
                this.transcriptAndSentiment.push({
                  transcript: response.body.transcript,
                  sentiment: response.body.sentiment,
                  participant: response.body.participant,
                });
              }
            }
          });
      }, 1000);
    }

    if (contact.event == 'handleContactRefresh') {
      this.callContactID = contact.contactId;
    }
    if (contact.event == 'handleContactEnded') {
      clearInterval(this.intervalForTranscript);
      this.transcriptAvailable = false;
    }
  }
}
