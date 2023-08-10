import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BroadcastMessageService {
  constructor(private http: HttpClient) {}

  // PostBroadcastMessage(data: any) {
  //   const url = GetApiurl('api/BroadcastMessage/PostBroadcastMessage');
  //   //const finalUrl = 'https://localhost:44355/api/TuneSetting/AddHolidayData';
  //   const headers = new HttpHeaders({});
  //   headers.append('Content-Type', 'application/json');
  //   return this.http.post(url, data, { headers: headers });
  // }

  //using lambda API URL
  // apiUrl =
  //   'https://2nji9yuqc6.execute-api.us-east-1.amazonaws.com/default/customadmin';

  // username = 'MOEUser';
  // password = 'MOE@1234';
  // credentials = `${this.username}:${this.password}`;

  // encodedCredentials = Buffer.from(this.credentials).toString('base64');
  // headers = new HttpHeaders()
  //   .set('Authorization', `Basic ${this.encodedCredentials}`)
  //   .set('authorizationToken', 'MOE1234')
  //   .set('X-Broadcast-Interceptor', 'true');

  // postBroadcastMessage = (data: any): Observable<any> => {
  //   return this.http.post<any>(this.apiUrl, data, { headers: this.headers });
  // };

  // GetAgentNames = (data: any): Observable<any> => {
  //   return this.http.post<any>(this.apiUrl, data, { headers: this.headers });
  // };

  // GetQueueNames = (data: any): Observable<any> => {
  //   return this.http.post<any>(this.apiUrl, data, { headers: this.headers });
  // };

  //Mohan code

  apiurl = environment.settings.customCtiApi;
  headers = new HttpHeaders()
    .append('content-type', 'application/json')
    .append('Access-Control-Allow-Origin', '*')
    .append('component-name', 'broadcast')
    .append(
      'Access-Control-Allow-Headers',
      'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
    );

  getAgentBroadcast = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };

  getQueueBroadcast = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };

  addBroadcastMessage = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };
}
