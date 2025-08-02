import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private apiUrl = environment.apiUrl + 'incidents'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  getIncidents(params?: any): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getIncident(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateIncidentStatus(id: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/status`, { status });
  }

  dispatchAlert(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/dispatch`, {});
  }

  validateIncident(id: string, payload: any): Observable<any> {
    // The backend expects a POST to /incidents/{id}/validate with { status: 'VALIDATED' }
    return this.http.post<any>(`${this.apiUrl}/${id}/validate`, payload);
  }

  rejectIncident(id: string, rejection_reason: string): Observable<any> {
    // The backend expects a POST to /incidents/{id}/reject with { rejection_reason: '...' }
    return this.http.post<any>(`${this.apiUrl}/${id}/reject`, { rejection_reason });
  }



  searchAndFilterIncident(status: string = '', search: string = ''): Observable<any[]> {
    // Build query params
    let params: any = {};
    if (search) params.search = search;
    if (status) params.status = status;

    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getIncidentStats(): Observable<any> {
    // Calls the /incidents/stats/dashboard endpoint to get incident statistics
    return this.http.get<any>(`${this.apiUrl}/stats/dashboard`);
  }

  trigerAlert(payload: any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/trigger-alert`, payload);
  }

}
