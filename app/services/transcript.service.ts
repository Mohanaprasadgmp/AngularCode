import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Buffer } from 'buffer';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TranscriptService {
  // apiUrl =
  //   'https://2nji9yuqc6.execute-api.us-east-1.amazonaws.com/default/customadmin';

  // headers=new HttpHeaders()
  // .set('content-type','application/json')
  // .set('Access-Control-Allow-Origin','*')
  username = 'MOEUser';
  password = 'MOE@1234';
  credentials = `${this.username}:${this.password}`;

  encodedCredentials = Buffer.from(this.credentials).toString('base64');
  adminHeader = new HttpHeaders()
    .set('Authorization', `Basic ${this.encodedCredentials}`)
    .set('authorizationToken', 'MOE1234');

  constructor(private http: HttpClient) {}

  // downloadTranscript = (data: any): Observable<any> => {
  //   return this.http.post<any>(this.apiUrl, data, {
  //     headers: this.adminHeader,
  //   });
  // };

  // getTranscriptBetweenDates = (data: any): Observable<any> => {
  //   return this.http.post<any>(this.apiUrl, data, {
  //     headers: this.adminHeader,
  //   });
  // };

  // startStream = (data: any): Observable<any> => {
  //   return this.http.post<any>(this.apiUrl, data, {
  //     headers: this.adminHeader,
  //   });
  // };

  // stopSTream = (data: any): Observable<any> => {
  //   return this.http.post<any>(this.apiUrl, data, {
  //     headers: this.adminHeader,
  //   });
  // };

  // updatemCareCaseId = (data: any): Observable<any> => {
  //   return this.http.post<any>(this.apiUrl, data, {
  //     headers: this.adminHeader,
  //   });
  // };

  apiUrl = environment.settings.customCtiApi;
  headers = new HttpHeaders()
    .append('content-type', 'application/json')
    .append('Access-Control-Allow-Origin', '*')
    .append('component-name', 'ttranscript')
    .append(
      'Access-Control-Allow-Headers',
      'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
    );
  getTranscript = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiUrl, data, { headers: this.headers });
  };

  updatemCareCaseId = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiUrl, data, { headers: this.headers });
  };

  downloadTranscript = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiUrl, data, { headers: this.headers });
  };

  startStream = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiUrl, data, { headers: this.headers });
  };

  stopSTream = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiUrl, data, { headers: this.headers });
  };
}
