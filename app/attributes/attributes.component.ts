import { Component, OnDestroy, OnInit } from '@angular/core';
import { CcpService } from '../services/ccp.service';
import { AttributesToDisplay } from '../models/attribute-to-display';
@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss'],
})
export class AttributesComponent implements OnInit, OnDestroy {
  contactSubscription: any;
  attributesAvailable = false;
  agentSubscription: any;
  callVariable: any[];
  contactAttr = [];
  whatScreenToDisplay: any;
  constructor(public ccpService: CcpService) {}
  ngOnInit(): void {
    this.contactSubscription = this.ccpService
      .getContactMessage()
      .subscribe((message) => {
        this.contactSubscriptionHandler(message);
      });
  }
  ngOnDestroy(): void {
    this.contactSubscription.unsubscribe();
    // this.agentSubscription.unsubscribe();
  }
  contactSubscriptionHandler(contact: any) {
    if (contact.event == 'handleContactConnected') {
      this.contactAttr = [];
      this.attributesAvailable = true;
      this.callVariable = contact.getAttributes();
      for (let i = 0; i < AttributesToDisplay.attributes.length; i++) {
        if (
          this.callVariable.hasOwnProperty(AttributesToDisplay.attributes[i])
        ) {
          if (
            this.callVariable[AttributesToDisplay.attributes[i]].name !==
            'Flowname'
          ) {
            this.contactAttr.push({
              name: this.callVariable[AttributesToDisplay.attributes[i]].name,
              value: this.callVariable[AttributesToDisplay.attributes[i]].value,
            });
          }
        }
      }
      console.log('contactAttr ', this.contactAttr);
    }

    if (contact.event == 'handleContactRefresh') {
      this.callVariable = contact.getAttributes();
    }
    if (contact.event == 'handleContactEnded') {
      this.attributesAvailable = false;
    }
  }
}
