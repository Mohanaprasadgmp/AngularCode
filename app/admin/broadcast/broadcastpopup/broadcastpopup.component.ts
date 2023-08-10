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
}
