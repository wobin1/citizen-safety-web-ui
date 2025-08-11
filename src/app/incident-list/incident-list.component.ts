// incident-list.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { IncidentService } from '../services/incident.service';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, FormsModule],
  templateUrl: './incident-list.component.html',
  styleUrl: './incident-list.component.scss'
})
export class IncidentListComponent {
  incidents:any = [];
  search:any = "";
  filter:any = "";
  isLoading: boolean = false; // Added isLoading state

  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  total: number = 0;

  private searchSubject = new Subject<string>();

  // Import the IncidentService and inject it in the constructor
  constructor(private incidentService: IncidentService, private router:Router) {
    // Subscribe to search input changes with debounce
    this.searchSubject.pipe(debounceTime(300)).subscribe((searchTerm) => {
      this.performSearch(searchTerm);
    });
  }

  ngOnInit() {
    this.getIncidents();
  }

  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  performSearch(searchTerm: string) {
    this.getIncidents({ search: searchTerm, status: this.filter, page: this.currentPage, page_size: this.pageSize });
  }

  route(page:string){
    console.log(page)
    this.router.navigate(["app/"+page])
  }

  getIncidents(params?: any) {
    this.isLoading = true; // Set isLoading to true at the start of the request
    params = params || {};
    params.page = params.page || this.currentPage;
    params.page_size = params.page_size || this.pageSize;
    params.search = params.search !== undefined ? params.search : this.search;
    params.status = params.status !== undefined ? params.status : this.filter;
    this.incidentService.getIncidents(params).subscribe({
      next: (data: any) => {
        this.incidents = data;
        this.currentPage = data.data.page || 1;
        this.pageSize = data.data.page_size || 10;
        this.total = data.data.total || 0;
        this.totalPages = Math.ceil(this.total / this.pageSize) || 1;
        this.isLoading = false; // Set isLoading to false on success
      },
      error: (err: any) => {
        console.error('Failed to fetch incidents:', err);
        this.incidents = [];
        this.isLoading = false; // Set isLoading to false on error
      }
    });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.getIncidents({ page: this.currentPage, page_size: this.pageSize, search: this.search, status: this.filter });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  filterIncident(filter:string){
    this.currentPage = 1;
    this.getIncidents({ status: filter, search: this.search, page: this.currentPage, page_size: this.pageSize });
  }
}
