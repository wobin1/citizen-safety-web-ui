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


}
