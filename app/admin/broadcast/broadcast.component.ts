import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BroadcastMessageService } from '../../services/broadcast-message.service';
import { MatDialog } from '@angular/material/dialog';
import { BroadcastpopupComponent } from './broadcastpopup/broadcastpopup.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',

  styleUrls: ['./broadcast.component.scss'],
})
export class BroadcastComponent {
  agentQueue;
  isAgentSelected = false;
  departmentChanged = false;
  agentorqueue!: string;
  isCscSelected = false;
  isHrSelected = false;
  isAllSelected = false;
  isQueueSelected = false;
  public rightsObject = [];
  public selectedRights = [];
  fromDate!: string;
  toDate!: string;
  broadcastMsge!: string;
  currentDateObj!: any;
  currentDate: any;
  minfromDate: any;
  mintoDate: any;
  cschr: boolean;
  currentScreen: string;
  ngOnInit(): void {
    this.currentDateObj = new Date();
    this.minfromDate = this.currentDateObj.toISOString().slice(0, 16);
    this.mintoDate = this.currentDateObj.toISOString().slice(0, 16);
    this.currentScreen = sessionStorage.getItem('screenToDisplay');
    if (this.currentScreen === 'CSC') {
      this.isCscSelected = true;
      this.isHrSelected = false;
    }
    if (this.currentScreen === 'HR') {
      this.isHrSelected = true;
      this.isCscSelected = false;
    }
  }

  constructor(
    public broadcastService: BroadcastMessageService,
    private datePipe: DatePipe,
    public toastr: ToastrService,
    public dialog: MatDialog
  ) {}

  getAgentList = () => {
    this.rightsObject = [];
    this.selectedRights = [];
    if (this.isHrSelected) {
      this.broadcastService
        .getAgentBroadcast({ action: 'getAgentBroadcast' })
        .subscribe((response) => {
          this.rightsObject = response.body.hr;
        });
      return;
    } else if (this.isCscSelected) {
      this.broadcastService
        .getAgentBroadcast({ action: 'getAgentBroadcast' })
        .subscribe((response) => {
          this.rightsObject = response.body.csc;
        });
      return;
    }
  };

  getQueueList = () => {
    this.rightsObject = [];
    this.selectedRights = [];
    if (this.isHrSelected) {
      this.broadcastService
        .getQueueBroadcast({ action: 'getQueueBroadcast' })
        .subscribe((response) => {
          this.rightsObject = response.body.hr;
        });
    } else if (this.isCscSelected) {
      this.broadcastService
        .getAgentBroadcast({ action: 'getQueueBroadcast' })
        .subscribe((response) => {
          this.rightsObject = response.body.csc;
        });
    }
  };

  getAllAgentList = () => {
    this.rightsObject = [];
    this.selectedRights = [];
    if (this.isAllSelected && this.isCscSelected) {
      this.broadcastService
        .getAgentBroadcast({ action: 'getAgentBroadcast' })
        .subscribe((response) => {
          this.selectedRights = response.body.csc;
        });
    }
    if (this.isAllSelected && this.isHrSelected) {
      this.broadcastService
        .getAgentBroadcast({ action: 'getAgentBroadcast' })
        .subscribe((response) => {
          this.selectedRights = response.body.hr;
        });
    }
  };

  isAnyRadioButtonSelected(): boolean {
    return !this.agentQueue;
  }

  onChange = (event: any) => {
    this.fromDate = '';
    this.toDate = '';
    this.broadcastMsge = '';
    if (event.target.value === 'Agent') {
      this.agentorqueue = 'agent';
      this.isAgentSelected = true;
      this.isQueueSelected = false;
      this.isAllSelected = false;
      this.getAgentList();
    }
    if (event.target.value === 'Queue') {
      this.agentorqueue = 'queue';
      this.isAgentSelected = false;
      this.isQueueSelected = true;
      this.isAllSelected = false;
      this.getQueueList();
    }
    if (event.target.value === 'All') {
      this.isAllSelected = true;
      this.agentorqueue = 'agent';
      this.isAgentSelected = false;
      this.isQueueSelected = false;
      this.getAllAgentList();
    }
  };

  createBroadcastMessage = () => {
    let fromDate;
    let toDate;

    if (this.fromDate === '' && this.toDate === '') {
      fromDate = null;
      toDate = null;
    }
    if (this.fromDate === '') {
      fromDate = null;
    }
    if (this.toDate === '') {
      toDate = null;
    }
    if (this.fromDate !== '' && this.toDate !== '') {
      fromDate = new Date(this.fromDate);
      toDate = new Date(this.toDate);
      if (fromDate > toDate) {
        this.toastr.warning('From Date is greater than To Date!');
        return;
      }
    }

    let params;

    if (this.isAllSelected) {
      params = {
        action: 'addBroadcastMessage',
        createdAt: Date.now(),
        createdBy: sessionStorage.getItem('awsAgentID'),
        message: this.broadcastMsge,
        modifiedAt: this.datePipe.transform(
          Date.now(),
          "yyyy-MM-dd'T'hh:mm:ss"
        ),
        modifiedBy: sessionStorage.getItem('awsAgentID'),
        fromDate: this.fromDate,
        toDate: this.toDate,
        selectedOption: 'all',
        AssignedNames: this.selectedRights,
        csc: this.isCscSelected,
        hr: this.isHrSelected,
        agentorqueue: 'agent',
        department: sessionStorage.getItem('screenToDisplay'),
      };
    } else if (!this.isAllSelected) {
      params = {
        action: 'addBroadcastMessage',
        createdAt: Date.now(),
        createdBy: sessionStorage.getItem('awsAgentID'),
        message: this.broadcastMsge,
        modifiedAt: this.datePipe.transform(
          Date.now(),
          "yyyy-MM-dd'T'hh:mm:ss"
        ),
        modifiedBy: sessionStorage.getItem('awsAgentID'),
        fromDate: this.fromDate,
        toDate: this.toDate,
        selectedOption: this.agentorqueue,
        AssignedNames: this.selectedRights,
        csc: this.isCscSelected,
        hr: this.isHrSelected,
        agentorqueue: '',
        department: sessionStorage.getItem('screenToDisplay'),
      };
    }

    this.broadcastService.addBroadcastMessage(params).subscribe((response) => {
      if (response.body === 'Successfully Inserted') {
        this.toastr.success('Broadcast Message posted successfully');
        this.fromDate = '';
        this.toDate = '';
        this.broadcastMsge = '';
        this.selectedRights = [];
        this.rightsObject = [];
        this.agentQueue = false;
        this.cschr = false;
      }
    });
  };

  resetField = () => {
    this.fromDate = '';
    this.toDate = '';
    this.broadcastMsge = '';
    this.selectedRights = [];
    this.rightsObject = [];
    this.agentQueue = false;
    this.cschr = false;
  };

  deleteBroadcastMessage = () => {
    const dialogRef = this.dialog.open(BroadcastpopupComponent, {});
    dialogRef.afterClosed().subscribe((result) => {});
  };
}
