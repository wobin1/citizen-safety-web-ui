import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'citizen-safety-web';

  constructor(private router:Router){}


  // No, this function is not correct.
  // 1. The correct Angular lifecycle hook is ngOnInit, not ngOnit.
  // 2. To use ngOnInit, you should implement the OnInit interface.
  // Here is the corrected version:

  ngOnInit() {
    console.log("current route", this.getCurrentRoute());
  }

  route(page:string){

    this.router.navigate([page]);
    this.getCurrentRoute()
  }

  getCurrentRoute(): string {

    // The router.url may include query params, so we split at '?' and take the path only
    // Also, if the route is '/', but a redirect is in place, we want the actual active route
    // Use router.urlAfterRedirects if available, else fallback to url
    const url = (this.router as any).urlAfterRedirects || this.router.url;
    console.log('this is the current url', url.split('?')[0])

    return url.split('?')[0];
  }
}
