import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-information-panel',
  templateUrl: './information-panel.component.html',
  styleUrls: ['./information-panel.component.scss'],
})
export class InformationPanelComponent implements OnInit {
  constructor() {}

  whatScreenToDisplay = '';
  agentStatus = '';
  IsEappointmentCall = '';
  ngOnInit(): void {
    setInterval(() => {
      this.IsEappointmentCall = sessionStorage.getItem('IsEappointmentCall');
      this.whatScreenToDisplay = sessionStorage.getItem('screenToDisplay');
      this.agentStatus = sessionStorage.getItem('selectedAgentState');
    }, 1000);
  }
  createNewCustomer = () => {};

  createNewCase = () => {};

  searchBasedOnGivenTxt = () => {};

  smsStatus = () => {};

  validationStatus = () => {};
}
