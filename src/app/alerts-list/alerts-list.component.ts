import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AlertService } from '../services/alert.service'; // Make sure to create this service
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, FormsModule],
  templateUrl: './alerts-list.component.html',
  styleUrl: './alerts-list.component.scss'
})
export class AlertListComponent {
  alerts:any = [];
  search:any = "";
  filter:any = "";

  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  total: number = 0;

  private searchSubject = new Subject<string>();

  // Inject the new AlertService
  constructor(private alertService: AlertService, private router:Router) {
    this.searchSubject.pipe(debounceTime(300)).subscribe((searchTerm) => {
      this.performSearch(searchTerm);
    });
  }

  ngOnInit() {
    this.getAlerts();
  }

  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  performSearch(searchTerm: string) {
    this.getAlerts({ search: searchTerm, status: this.filter, page: this.currentPage, page_size: this.pageSize });
  }

  route(page:string){
    console.log(page)
    this.router.navigate(["app/"+page])
  }

  getAlerts(params?: any) {
    params = params || {};
    params.page = params.page || this.currentPage;
    params.page_size = params.page_size || this.pageSize;
    params.search = params.search !== undefined ? params.search : this.search;
    params.status = params.status !== undefined ? params.status : this.filter;
    this.alertService.getAlerts(params).subscribe({
      next: (data: any) => {
        console.log(data)
        this.alerts = data;
        this.currentPage = data.data.page || 1;
        this.pageSize = data.data.page_size || 10;
        this.total = data.data.total || 0;
        this.totalPages = Math.ceil(this.total / this.pageSize) || 1;
      },
      error: (err: any) => {
        console.error('Failed to fetch alerts:', err);
        this.alerts = [];
      }
    });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.getAlerts({ page: this.currentPage, page_size: this.pageSize, search: this.search, status: this.filter });
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

  filterAlert(filter: string) {
    this.filter = filter;
    this.currentPage = 1;
    this.getAlerts({ status: filter, search: this.search, page: this.currentPage, page_size: this.pageSize });
  }
}
