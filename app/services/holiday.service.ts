import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { GetApiurl } from '../models/parameter';
// import { Buffer } from 'buffer';

@Injectable({
  providedIn: 'root',
})
export class HolidayService {
  constructor(private http: HttpClient) {}
  // getHolidayInfo() {
  //   const url = GetApiurl('api/holidaymanagement/getallholidaydata');
  //   const headers = new HttpHeaders({});
  //   headers.append('Content-Type', 'application/json');
  //   return this.http.get(url, { headers: headers }).pipe(
  //     tap((res) => res),
  //     catchError(this.handleError)
  //   );
  // }

  // getRequest(url: any) {
  //   const finalUrl = GetApiurl('api/holidaymanagement');
  //   const headers = new HttpHeaders({});
  //   headers.append('Content-Type', 'application/json');
  //   return this.http.get(finalUrl, { headers: headers }).pipe(
  //     tap((res) => res),
  //     catchError(this.handleError)
  //   );
  // }
  // CreateHoliday(data: any) {
  //   const finalUrl = GetApiurl('api/holidaymanagement/addholidaydata');
  //   const headers = new HttpHeaders({});
  //   headers.append('Content-Type', 'application/json');
  //   return this.http.post(finalUrl, data, { headers: headers });
  // }

  // UpdateHoliday(data: any) {
  //   const finalUrl = GetApiurl('api/holidaymanagement/updateholidaydata');
  //   const headers = new HttpHeaders({});
  //   headers.append('Content-Type', 'application/json');
  //   return this.http.post(finalUrl, data, { headers: headers });
  // }

  // deleteRequest(data: any) {
  //   const finalUrl = GetApiurl('api/holidaymanagement/deleteholidaydata');
  //   let headers = new HttpHeaders({});
  //   headers.append('Content-Type', 'application/json');

  //   return this.http.post(finalUrl, data, { headers: headers }).pipe(
  //     tap((res) => res),
  //     catchError(this.handleError)
  //   );
  // }

  // public getHolidayList(): Observable<any> {
  //   const url = 'assets/labeldata.json';
  //   return this.http.get(url);
  // }

  // handleError(error: Response | any) {
  //   let errMsg: string;
  //   if (error instanceof Response) {
  //     const body: any = error.json() || '';
  //     const err = body['error'] || JSON.stringify(body);
  //     errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
  //   } else if (error instanceof HttpErrorResponse) {
  //     errMsg = error.error ? error.error : error.toString();
  //   } else {
  //     errMsg = error.message ? error.message : error.toString();
  //   }
  //   // console.error(errMsg);
  //   return throwError(() => new Error(errMsg));
  // }

  // //using lambda API URL
  // apiUrl =
  //   'https://2nji9yuqc6.execute-api.us-east-1.amazonaws.com/default/customadmin';
  // username = 'MOEUser';
  // password = 'MOE@1234';
  // credentials = `${this.username}:${this.password}`;

  // encodedCredentials = Buffer.from(this.credentials).toString('base64');

  // headers = new HttpHeaders()
  //   .set('Authorization', `Basic ${this.encodedCredentials}`)
  //   .set('authorizationToken', 'MOE1234')
  //   .set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  //   .set('Access-Control-Allow-Credentials', 'true')
  //   .set('Access-Control-Allow-Origin','*')
  //   .set('Access-Control-Allow-Headers','Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token')
  // headers = new HttpHeaders()
  //   .set('Authorization', `Basic ${this.encodedCredentials}`)
  //   .set('authorizationToken', 'MOE1234');
  // getHoliday = (data: any): Observable<any> => {
  //   return this.http.post<any>(this.apiUrl, data, { headers: this.headers });
  // };

  // getHoliday=(data:any):Observable<any>=>{
  //   return this.http.post<any>(this.apiUrl,data);
  // }

  // addHoliday = (data: any): Observable<any> => {
  //   return this.http.post<any>(this.apiUrl, data, { headers: this.headers });
  // };

  // updateHoliday = (data: any): Observable<any> => {
  //   return this.http.post<any>(this.apiUrl, data, { headers: this.headers });
  // };

  // deleteHoliday = (data: any): Observable<any> => {
  //   return this.http.post<any>(this.apiUrl, data, { headers: this.headers });
  // };

  //Mohan code
  apiurl = environment.settings.customCtiApi;
  headers = new HttpHeaders()
    .append('content-type', 'application/json')
    .append('Access-Control-Allow-Origin', '*')
    .append('component-name', 'holiday')
    .append(
      'Access-Control-Allow-Headers',
      'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
    );

  getAdminHolidays = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };

  addAdminHolidays = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };

  deleteAdminHolidays = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };

  editAdminHolidays = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };
}
