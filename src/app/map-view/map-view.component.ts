import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent, MapMarkerData } from '../map/map.component';
import { MapService, MapLocation } from '../services/map.service';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule, MapComponent],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.scss'
})
export class MapViewComponent implements OnInit {
  markers: MapMarkerData[] = [];

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    console.log("currently in the map view ")
    this.getMapLocations()

  }

  getMapLocations() {
    this.mapService.getMapLocations().subscribe(res => {
      console.log('API Response:', res);

    // Map the response data to the MapMarkerData format and assign to this.markers
    if (res && res.data && Array.isArray(res.data)) {
      const mappedMarkers = res.data.map((loc: any) => ({
        id: Math.random().toString(36).substring(2),
        markerType: (loc.type || 'incident').toLowerCase(),
        type: loc.type || 'Incident',
        location: '', // No location name in response
        location_lat: loc.location_lat,
        location_lon: loc.location_lon,
        status: 'active', // Default status
        reportedAt: new Date(), // Default to now
        description: '' // No description in response
      }));
      console.log('Mapped markers:', mappedMarkers);
      this.markers = mappedMarkers;
      console.log('Markers set:', this.markers.length);
    } else {
      this.markers = [];
      console.log('Mapped markers: []');
    }

    });
  }

}
