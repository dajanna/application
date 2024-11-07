import { Component } from '@angular/core';
import { RacunService } from '../../servicess/racun.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(public servis:RacunService, private router:Router, private snackBar: MatSnackBar){
    
  }
  IsLoggedIn(){
    return this.servis.IsLoggedIn();
  }
  logOut() {
    this.servis.logOut(); // Poziva logout servis za uklanjanje tokena iz localStorage
    this.snackBar.open('You logged out', 'Close', {
      duration: 5000,
      horizontalPosition: 'center'
    });
    // Zatim navigira na login stranicu
    this.router.navigate(['/login']);
  }
}
