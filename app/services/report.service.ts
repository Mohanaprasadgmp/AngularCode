import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { GetApiurl } from '../models/parameter';
// import { environment } from 'src/environments/environment';
// import { Buffer } from 'buffer';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}

  // //using lambda API URL
  // apiUrl =
  //   'https://2nji9yuqc6.execute-api.us-east-1.amazonaws.com/default/customadmin';

  // username = 'MOEUser';
  // password = 'MOE@1234';
  // credentials = `${this.username}:${this.password}`;

  // encodedCredentials = Buffer.from(this.credentials).toString('base64');
  // headers = new HttpHeaders()
  //   .set('Authorization', `Basic ${this.encodedCredentials}`)
  //   .set('authorizationToken', 'MOE1234');

  // getDataAuditReport = (data: any): Observable<any> => {
  //   return this.http.post<any>(this.apiUrl, data, { headers: this.headers });
  // };

  // getLoginAuditReport = (data: any): Observable<any> => {
  //   return this.http.post<any>(this.apiUrl, data, { headers: this.headers });
  // };

  //Mohan Code

  apiurl = environment.settings.customCtiApi;
  headers = new HttpHeaders()
    .append('content-type', 'application/json')
    .append('Access-Control-Allow-Origin', '*')
    .append('component-name', 'report')
    .append(
      'Access-Control-Allow-Headers',
      'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
    );

  getLoginAudit = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };

  getDataAudit = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };

  addLoginLogoutAudit = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };
}
