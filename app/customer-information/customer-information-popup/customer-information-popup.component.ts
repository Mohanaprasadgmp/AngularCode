import { Component, Inject, Optional } from '@angular/core';
import { CticustomapiService } from '../../services/cticustomapi.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-customer-information-popup',
  templateUrl: './customer-information-popup.component.html',
  styleUrls: ['./customer-information-popup.component.scss'],
})
export class CustomerInformationPopupComponent {
  tableData: any = [];
  action!: string;
  local_data: any;
  constructor(
    public cticustomapiService: CticustomapiService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.local_data = { ...data };
  }
  ngOnInit(): void {
    console.log(this.data);
    this.tableData = this.data.data;
  }
  Redirect = () => {
    window.open(this.data.CustomerLink, '_blank');
    let url = environment.settings.newCaseMCareUrl.replace(
      '**customerguid**',
      this.data.CustomerGUID
    );
    url = url.replace('**customername**', this.data.CustomerName);
    console.log('newCaseUrl', url);
    window.open(url, '_blank');
  };
  openCaseLink = (url) => {
    window.open(url, '_blank');
  };
}
