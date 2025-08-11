import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps'; // Import the official GoogleMapsModule


export interface Incident {
  id: string;
  type: string;
  location: string;
  location_lat: number;
  location_lon: number;
  status: string;
  reportedAt: Date;
  description?: string;
  photos?: string[];
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  @Input() incidents: Incident[] = []; // Input property to receive incident data

  // Default map properties
  zoom: number = 10;
  center: google.maps.LatLngLiteral = { lat: 52.3702, lng: 4.8952 }; // Center object
  mapOptions: google.maps.MapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: false, // Keep default UI or set to true to hide
    zoomControl: true,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
    // Optional: Custom map styles for a cleaner look
    styles: [
      {
        "featureType": "poi",
        "stylers": [
          { "visibility": "off" }
        ]
      },
      {
        "featureType": "transit",
        "stylers": [
          { "visibility": "off" }
        ]
      }
    ]
  };

  markerOptions: google.maps.MarkerOptions = { draggable: false }; // Default marker options

  constructor() { }

  ngOnInit(): void {
    if (this.incidents && this.incidents.length > 0) {
      // Calculate average latitude/longitude to center the map
      const totalLat = this.incidents.reduce((sum, inc) => sum + inc.location_lat, 0);
      const totalLng = this.incidents.reduce((sum, inc) => sum + inc.location_lon, 0);
      this.center = {
        lat: totalLat / this.incidents.length,
        lng: totalLng / this.incidents.length
      };
      this.zoom = 12; // Adjust zoom based on number/spread of incidents
    }
  }

  // Method to return a marker icon based on incident status
  getMarkerIcon(status: string): google.maps.Icon | google.maps.Symbol | string {
    // For @angular/google-maps, you can use a string URL or a more complex Icon object
    switch (status) {
      case 'pending':
        return {
          url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new google.maps.Size(32, 32) // Adjust size if needed
        };
      case 'validated':
        return {
          url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
          scaledSize: new google.maps.Size(32, 32)
        };
      case 'dispatched':
        return {
          url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
          scaledSize: new google.maps.Size(32, 32)
        };
      case 'active':
        return {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new google.maps.Size(32, 32)
        };
      case 'rejected':
      case 'false':
        return {
          url: 'http://maps.google.com/mapfiles/ms/icons/grey-dot.png',
          scaledSize: new google.maps.Size(32, 32)
        };
      default:
        return {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new google.maps.Size(32, 32)
        };
    }
  }

  // Method to return a marker icon based on incident type
  getTypeIcon(type: string): google.maps.Icon | google.maps.Symbol | string {
    switch (type.toLowerCase()) {
      case 'emergency':
        return {
          url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new google.maps.Size(32, 32)
        };
      case 'alert':
        return {
          url: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
          scaledSize: new google.maps.Size(32, 32)
        };
      case 'incident':
        return {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new google.maps.Size(32, 32)
        };
      default:
        return {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new google.maps.Size(32, 32)
        };
    }
  }

  // Optional: Handle marker click
  markerClick(event: google.maps.MapMouseEvent | null, incident: Incident) {
    console.log('Marker clicked:', incident.id, incident.location);
    // ...
  }

}
