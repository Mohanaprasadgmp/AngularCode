import { Component } from '@angular/core';
import { CticustomapiService } from '../../../services/cticustomapi.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-broadcastpopup',
  templateUrl: './broadcastpopup.component.html',
  styleUrls: ['./broadcastpopup.component.scss'],
})
export class BroadcastpopupComponent {
  tableData = [];

  constructor(
    public cticustomapiService: CticustomapiService,
    public toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cticustomapiService
      .getAllBroadCastMessages({
        action: 'getAllBroadcastMessage',
        department: sessionStorage.getItem('screenToDisplay'),
      })
      .subscribe((response) => {
        console.log(response);
        this.tableData = response.body;
      });
  }

  deleteBroadcastMessage = (id: any) => {
    this.cticustomapiService
      .getAllBroadCastMessages({
        action: 'deleteBroadcastMessage',
        id: id,
      })
      .subscribe((response) => {
        console.log(response);
        this.tableData = response.body;
        if (response.body === 'Successfully Deleted') {
          this.toastr.success('Broadcast Message deleted Succesfully');
          this.cticustomapiService
            .getAllBroadCastMessages({
              action: 'getAllBroadcastMessage',
              department: sessionStorage.getItem('screenToDisplay'),
            })
            .subscribe((response) => {
              console.log(response);
              this.tableData = response.body;
            });
        } else {
          this.toastr.warning('Message not deleted');
        }
      });
  };
  convertData = (date: any) => {
    const utcTimestamp = new Date(date);

    // Extract date components
    const year = utcTimestamp.getUTCFullYear();
    const month = String(utcTimestamp.getUTCMonth() + 1).padStart(2, '0');
    const day = String(utcTimestamp.getUTCDate()).padStart(2, '0');

    // Extract time components
    const hours = String(utcTimestamp.getUTCHours()).padStart(2, '0');
    const minutes = String(utcTimestamp.getUTCMinutes()).padStart(2, '0');

    // Formatted date-time string
    // const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
    const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
    return formattedDateTime;
  };
}
