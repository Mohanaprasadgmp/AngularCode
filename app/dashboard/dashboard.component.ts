import { Component, OnInit } from '@angular/core';
import { CcpService } from '../services/ccp.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  securityProfile = [];

  constructor(public ccpService: CcpService) {
    ccpService.ContainerDiv = document.getElementById('containerDiv');
  }

  ngOnInit(): void {
    this.ccpService.ContainerDiv = document.getElementById('containerDiv');
    this.ccpService.initiateConnection();

    setInterval(() => {
      this.securityProfile = JSON.parse(
        sessionStorage.getItem('securityProfile')
      );
      if (
        this.ccpService.isAuthenticated !== true &&
        this.ccpService.isSignOutRequest === false
      ) {
        $('#containerDiv iframe')[0] = $('#containerDiv iframe')[0];
      }
    }, 4000);
  }

  goToCalibrio = () => {
    window.open(
      'https://sgp.calabriocloud.com/api/rest/saml/authorize?idp=11:be7ba36f-d661-4765-aeb0-4297199dd3c5',
      '_blank'
    );
  };
  goToEmite = () => {
    window.open(
      'https://sg-cloud.emite.com/emite/moe-uat/Auth/SamlSSO',
      '_blank'
    );
  };
  goToAWS = () => {
    window.open(
      'https://ap-southeast-1.console.aws.amazon.com/pinpoint/home?region=ap-southeast-1#/apps/6fc4323a1aab4cb793cd2a69d906a72c/direct',
      '_blank'
    );
  };
  goToConnect = () => {
    window.open(
      'https://ocs-np.my.connect.aws/real-time-metrics?reportArn=arn:aws:connect:ap-southeast-1:916702441502:instance/fcdc9e61-c687-4319-afee-7b5ba7b052e2/report/5fb7d620-f3ab-463a-898f-f4c8b94ff045'
    );
  };

  goToConnectAdmin = () => {
    window.open('https://ocs-np.my.connect.aws/home');
  };
}
