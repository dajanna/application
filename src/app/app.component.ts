
import { Component } from '@angular/core';
import { RacunService } from './servicess/racun.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'application';
  /**
   *
   */
  constructor(public servis:RacunService) {
  
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Proverava prisustvo tokena
  }
}
