import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BroadcastMessageComponent } from './broadcast-message/broadcast-message.component';
import { InteractionPanelComponent } from './interaction-panel/interaction-panel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InformationPanelComponent } from './information-panel/information-panel.component';
import { CustomerInformationComponent } from './customer-information/customer-information.component';
import { WrapupComponent } from './wrapup/wrapup.component';
import { CallControlPanelComponent } from './call-control-panel/call-control-panel.component';
import { AttributesComponent } from './attributes/attributes.component';
import { TranscriptsComponent } from './transcripts/transcripts.component';

// Angular material package
import { MatTabsModule } from '@angular/material/tabs';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PopoverModule } from '@coreui/angular';
import { ToastrModule } from 'ngx-toastr';
import { TooltipModule } from '@coreui/angular';

// primeng component
import { OrderListModule } from 'primeng/orderlist';
import { CustomerInformationPopupComponent } from './customer-information/customer-information-popup/customer-information-popup.component';
import { TruncatePipe } from './truncate.pipe';
import { BroadcastComponent } from './admin/broadcast/broadcast.component';
import { CalltranscriptComponent } from './admin/calltranscript/calltranscript.component';
import { WrapupMessageComponent } from './admin/wrapup-message/wrapup-message.component';
import { LandingpageComponent } from './landingpage/landingpage.component';

import { AuditlogComponent } from './admin/auditlog/auditlog.component';
import { HolidayComponent } from './admin/holiday/holiday.component';
import { HolidaypopupComponent } from './admin/holiday/holidaypopup/holidaypopup.component';
import { WrapupMessagePopupComponent } from './admin/wrapup-message/wrapup-message-popup/wrapup-message-popup.component';
import { CalltranscriptpopupComponent } from './admin/calltranscript/calltranscriptpopup/calltranscriptpopup.component';
//primeng

import { PickListModule } from 'primeng/picklist';
import { ButtonModule } from 'primeng/button';
import { LoadingInterceptor } from './interceptor/loading.interceptor';
import { LoadingComponent } from './loading/loading.component';
import { BookingsgComponent } from './bookingsg/bookingsg.component';
import { LogoutpopupComponent } from './header/logoutpopup/logoutpopup.component';
import { BroadcastpopupComponent } from './admin/broadcast/broadcastpopup/broadcastpopup.component';

const routes: Routes = [
  {
    path: '/dashboard',
    component: DashboardComponent,
    pathMatch: 'full',
  },

  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'dashboard',
        component: LandingpageComponent,
      },
      {
        path: 'broadcast',
        component: BroadcastComponent,
      },
      {
        path: 'wrapup',
        component: WrapupMessageComponent,
      },
      {
        path: 'holiday',
        component: HolidayComponent,
      },
      {
        path: 'transcript',
        component: CalltranscriptComponent,
      },
      {
        path: 'auditlog',
        component: AuditlogComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    DashboardComponent,
    BroadcastMessageComponent,
    InteractionPanelComponent,
    InformationPanelComponent,
    CustomerInformationComponent,
    WrapupComponent,
    CallControlPanelComponent,
    AttributesComponent,
    TranscriptsComponent,
    CustomerInformationPopupComponent,
    TruncatePipe,
    BroadcastComponent,
    CalltranscriptComponent,
    LandingpageComponent,
    AuditlogComponent,
    WrapupMessageComponent,
    HolidayComponent,
    HolidaypopupComponent,
    WrapupMessagePopupComponent,
    CalltranscriptpopupComponent,
    LoadingComponent,
    BookingsgComponent,
    LogoutpopupComponent,
    BroadcastpopupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatTabsModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatDialogModule,
    MatSlideToggleModule,
    FormsModule,
    OrderListModule,
    PopoverModule,
    PickListModule,
    ButtonModule,
    TooltipModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  exports: [RouterModule],
})
export class AppModule {}
