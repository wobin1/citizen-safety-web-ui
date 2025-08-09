import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface MapLocation {
  id?: string;
  type: string;
  location: string;
  location_lat: number;
  location_lon: number;
  status: string;
  reportedAt?: Date;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private apiUrl = environment.apiUrl + 'map';

  constructor(private http: HttpClient) { }

  getMapLocations(): Observable<{ data: MapLocation[] }> {
    return this.http.get<{ data: MapLocation[] }>(this.apiUrl);
  }

  // Optionally, add methods for adding, updating, or deleting map locations
  addMapLocation(location: MapLocation): Observable<any> {
    return this.http.post(this.apiUrl, location);
  }

  updateMapLocation(id: string, location: Partial<MapLocation>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, location);
  }

  deleteMapLocation(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
