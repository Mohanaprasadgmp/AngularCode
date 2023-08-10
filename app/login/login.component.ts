import { Component, OnInit } from '@angular/core';

import { CcpService } from '../services/ccp.service';

import { environment } from '../../environments/environment';

import { Router } from '@angular/router';

import { ReportService } from '../services/report.service';

@Component({

  selector: 'app-login',

  templateUrl: './login.component.html',

  styleUrls: ['./login.component.scss'],

})

export class LoginComponent implements OnInit {

  isLoginIn: boolean;

  isLoginButtonPressed = false;

  constructor(

    public ccpService: CcpService,

    public router: Router,

    public reportService: ReportService

  ) {}

 

  ngOnInit(): void {

    // if (

    //   sessionStorage.getItem('isLoginReload') &&

    //   sessionStorage.getItem('isLoginReload') === 'true'

    // ) {

    //   setTimeout(() => {

    //     location.reload();

    //   }, 20000);

    // }

 

    // let loginInterval = setInterval(() => {

    {

      if (this.ccpService.isAuthenticated === true) {

        // alert('Hi Alert');

        // sessionStorage.setItem('isLoginReload', 'false');

        this.router.navigateByUrl('/dashboard');

        this.reportService

          .addLoginLogoutAudit({

            action: 'addLoginLogoutAudit',

            agentname: this.ccpService.loggedinAgentName,

            logintime: new Date(),

            logouttime: 'NA',

          })

          .subscribe((response) => {

            // console.log(response);

          });

        // clearInterval(loginInterval);

      }

    }

    // }, 2000);

 

    setInterval(() => {

      if (

        sessionStorage.getItem('awsAgentID') === null ||

        sessionStorage.getItem('awsAgentID') === undefined

      ) {

        //console.log(false);

        this.isLoginIn = false;

      } else {

        //console.log(true);

        this.isLoginIn = true;

      }

    });

  }

 

  login = () => {

    this.isLoginButtonPressed = true;

    this.ccpService.isSignOutRequest = false;

    const url = environment.settings.ccpUrl.replace('ccp-v2#', '');

 

    //const url = environment.settings.ssoUrl;

 

    if (this.ccpService.isAuthenticated === false) {

      //this.ccpService.loginWindowHandler = window.open(url, this.params);

      // this.ccpService.loginWindowHandler = window.open(

      //   url,

      //   'popupWindow',

      //   'width=800,height=600'

      // );

      this.ccpService.loginWindowHandler = window.open(url);

    }

 

    // sessionStorage.setItem('isLoginReload', 'true');

    // setTimeout(() => {

    //   location.reload();

    // }, 5000);

  };

}