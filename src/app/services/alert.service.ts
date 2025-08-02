import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private apiUrl = environment.apiUrl + 'alerts'; // API endpoint for alerts

  constructor(private http: HttpClient) { }

  /**
   * Fetches a list of alerts, optionally filtered by parameters.
   * @param params An object containing query parameters like search, status, etc.
   * @returns An Observable of an array of alerts.
   */
  getAlerts(params?: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`, { params });
  }

  /**
   * Fetches a single alert by its ID.
   * @param id The ID of the alert to fetch.
   * @returns An Observable of a single alert object.
   */
  getAlert(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Updates the status of a specific alert.
   * @param id The ID of the alert to update.
   * @param status The new status for the alert (e.g., 'VALIDATED', 'REJECTED').
   * @returns An Observable of the updated alert.
   */
  updateAlertStatus(id: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/status`, { status });
  }

  /**
   * Dispatches a specific alert.
   * @param id The ID of the alert to dispatch.
   * @returns An Observable of the dispatched alert.
   */
  dispatchAlert(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/dispatch`, {});
  }

  /**
   * Validates a specific alert.
   * @param id The ID of the alert to validate.
   * @param payload An object containing validation details, typically `{ status: 'VALIDATED' }`.
   * @returns An Observable of the validated alert.
   */
  resolveAlert(id: string): Observable<any> {
    // The backend expects a POST to /alerts/{id}/validate with { status: 'VALIDATED' }
    return this.http.post<any>(`${this.apiUrl}/${id}/resolve`, {});
  }

  cooldownAlert(id: string): Observable<any> {
    // The backend expects a POST to /alerts/{id}/validate with { status: 'VALIDATED' }
    return this.http.post<any>(`${this.apiUrl}/${id}/cooldown`, {});
  }

  /**
   * Searches and filters alerts based on status and/or search term.
   * @param status The status to filter by (e.g., 'PENDING', 'VALIDATED').
   * @param search A search term to filter alerts by.
   * @returns An Observable of an array of filtered alerts.
   */
  searchAndFilterAlert(status: string = '', search: string = ''): Observable<any[]> {
    let params: any = {};
    if (search) params.search = search;
    if (status) params.status = status;

    return this.http.get<any[]>(this.apiUrl, { params });
  }

  /**
   * Fetches statistics related to alerts for dashboard display.
   * @returns An Observable of alert statistics.
   */
  getAlertStats(): Observable<any> {
    // Calls the /alerts/stats/dashboard endpoint to get alert statistics
    return this.http.get<any>(`${this.apiUrl}/stats/dashboard`);
  }

  /**
   * Triggers a new alert.
   * @param payload The data payload for the new alert.
   * @returns An Observable of the newly triggered alert.
   */
  triggerAlert(payload: any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/trigger-alert`, payload);
  }
}
