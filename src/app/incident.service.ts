import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private apiUrl = '/api/incidents'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  getIncidents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
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


}
