// emergency-list.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { EmergencyService } from '../services/emergency.service';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-emergency-list',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, FormsModule],
  templateUrl: './emergency-list.component.html',
  styleUrl: './emergency-list.component.scss'
})
export class EmergencyListComponent {
  emergencies: any = [];
  search: any = "";
  filter: any = "";

  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  total: number = 0;
  isLoading: boolean = false; // Added isLoading state

  private searchSubject = new Subject<string>();

  constructor(private emergencyService: EmergencyService, private router: Router) {
    this.searchSubject.pipe(debounceTime(300)).subscribe((searchTerm) => {
      this.performSearch(searchTerm);
    });
  }

  ngOnInit() {
    this.getEmergencies();
  }

  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  performSearch(searchTerm: string) {
    this.getEmergencies({ search: searchTerm, status: this.filter, page: this.currentPage, page_size: this.pageSize });
  }

  route(page: string) {
    console.log(page);
    this.router.navigate(["app/" + page]);
  }

  getEmergencies(params?: any) {
    this.isLoading = true; // Set isLoading to true at the start of the request
    params = params || {};
    params.page = params.page || this.currentPage;
    params.page_size = params.page_size || this.pageSize;
    params.search = params.search !== undefined ? params.search : this.search;
    params.status = params.status !== undefined ? params.status : this.filter;
    this.emergencyService.getEmergencies(params).subscribe({
      next: (data: any) => {
        this.emergencies = data;
        this.currentPage = data.data.page || 1;
        this.pageSize = data.data.page_size || 10;
        this.total = data.data.total || 0;
        this.totalPages = Math.ceil(this.total / this.pageSize) || 1;
        this.isLoading = false; // Set isLoading to false on success
      },
      error: (err: any) => {
        console.error('Failed to fetch emergencies:', err);
        this.emergencies = [];
        this.isLoading = false; // Set isLoading to false on error
      }
    });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.getEmergencies({ page: this.currentPage, page_size: this.pageSize, search: this.search, status: this.filter });
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

  filterEmergency(filter: string) {
    this.currentPage = 1;
    this.getEmergencies({ status: filter, search: this.search, page: this.currentPage, page_size: this.pageSize });
  }
}
