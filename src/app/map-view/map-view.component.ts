// map-view.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent, Incident } from '../map/map.component';
import { MapService, MapLocation } from '../services/map.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule, MapComponent],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.scss'
})
export class MapViewComponent implements OnInit {
  markers: Incident[] = [];
  isLoading: boolean = true; // Add isLoading state

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    console.log("currently in the map view ")
    this.getMapLocations();
  }

  getMapLocations() {
    this.mapService.getMapLocations().subscribe(res => {
      console.log('API Response:', res);
      this.isLoading = false; // Set loading to false once the API responds

      if (res && res.data && Array.isArray(res.data)) {
        const mapped: Incident[] = res.data.map((loc: any) => ({
          id: Math.random().toString(36).slice(2),
          type: loc.type ?? 'Incident',
          location: '',
          location_lat: Number(loc.location_lat),
          location_lon: Number(loc.location_lon),
          status: 'active',
          reportedAt: new Date(),
          photos: [],
          message: ""
        }));
        this.markers = mapped;
        console.log('markers data', this.markers);
      } else {
        this.markers = [];
        console.log('markers data', this.markers);
      }
    });
  }
}
