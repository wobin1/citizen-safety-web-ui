// emergency.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EmergencyService {
  private apiUrl = environment.apiUrl + 'emergency'; // API endpoint for emergencies

  constructor(private http: HttpClient) { }

  /**
   * Fetches a list of emergencies, optionally filtered by parameters.
   * @param params An object containing query parameters like search, status, etc.
   * @returns An Observable of an array of emergencies.
   */
  getEmergencies(params?: any): Observable<any[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<any[]>(this.apiUrl, { params: httpParams });
  }

  /**
   * Fetches a single emergency by its ID.
   * @param id The ID of the emergency to fetch.
   * @returns An Observable of a single emergency object.
   */
  getEmergency(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Updates the status of a specific emergency.
   * @param id The ID of the emergency to update.
   * @param status The new status for the emergency (e.g., 'VALIDATED', 'REJECTED', 'ACTION_TAKEN').
   * @returns An Observable of the updated emergency.
   */
  updateEmergencyStatus(id: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/status`, { status });
  }

  /**
   * Validates a specific emergency.
   * @param id The ID of the emergency to validate.
   * @param payload An object containing validation details, typically `{ status: 'VALIDATED' }`.
   * @returns An Observable of the validated emergency.
   */
  validateEmergency(id: string, payload: any): Observable<any> {
    // The backend expects a POST to /emergencies/{id}/validate with { status: 'VALIDATED' }
    return this.http.post<any>(`${this.apiUrl}/${id}/validate`, payload);
  }

  /**
   * Rejects a specific emergency with a given reason.
   * @param id The ID of the emergency to reject.
   * @param rejection_reason The reason for rejecting the emergency.
   * @returns An Observable of the rejected emergency.
   */
  rejectEmergency(id: string, rejection_reason: string): Observable<any> {
    // The backend expects a POST to /emergencies/{id}/reject with { rejection_reason: '...' }
    return this.http.post<any>(`${this.apiUrl}/${id}/reject`, { rejection_reason });
  }

  /**
   * Searches and filters emergencies based on status and/or search term.
   * @param status The status to filter by (e.g., 'PENDING', 'VALIDATED').
   * @param search A search term to filter emergencies by.
   * @returns An Observable of an array of filtered emergencies.
   */
  searchAndFilterEmergency(status: string = '', search: string = ''): Observable<any[]> {
    let params: any = {};
    if (search) params.search = search;
    if (status) params.status = status;

    return this.http.get<any[]>(this.apiUrl, { params });
  }

  /**
   * Fetches statistics related to emergencies for dashboard display.
   * @returns An Observable of emergency statistics.
   */
  getEmergencyStats(): Observable<any> {
    // Calls the /emergencies/stats/dashboard endpoint to get emergency statistics
    return this.http.get<any>(`${this.apiUrl}/stats/dashboard`);
  }

  /**
   * Triggers a new emergency (if applicable, similar to how an incident might trigger an alert).
   * This method might need adjustment based on your specific "trigger emergency" logic.
   * @param payload The data payload for the new emergency.
   * @returns An Observable of the newly triggered emergency.
   */
  triggerEmergency(payload: any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/trigger-emergency`, payload);
  }
}
