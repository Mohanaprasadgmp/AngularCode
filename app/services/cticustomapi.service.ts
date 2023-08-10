import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class CticustomapiService {
  apiurl = environment.settings.customCtiApi;
  headers = new HttpHeaders()
    .append('content-type', 'application/json')
    .append('Access-Control-Allow-Origin', '*')
    .append(
      'Access-Control-Allow-Headers',
      'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
    );

  constructor(private http: HttpClient) {}

  updateContactAttributes = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };

  hrpEmployeeDetails = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };

  getRealTimeTranscriptandSentiment = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };

  getEappointmentCallbackDetail = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };

  getAgentStatistics = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };

  getCustomerInformationData = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };

  getEappointmentStatusValue = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };

  getHRWrapupValues = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };

  getLast3Cases = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };

  getBroadCastMessage = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };

  getAllBroadCastMessages = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };

  getAgentSecurityProfileandHierarchy = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };

  getAgentOccupancy = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };

  updateUserPhonetypeConfig = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };

  updateEappointmentAttemptedStatus = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };

  checkAgentPresentInCallbackQueue = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };

  getSingpassAuthenticated = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };

  getPhoneNumberForPhonebook = (data: any): Observable<any> => {
    return this.http.post<any>(this.apiurl, data, { headers: this.headers });
  };
}
