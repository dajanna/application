import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RacunService } from '../servicess/racun.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: RacunService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.IsLoggedIn()) { // Provera prijavljenog stanja
      return true;
    } else {
      this.router.navigate(['/login']); // Preusmeravanje na login ako korisnik nije prijavljen
      return false;
    }
  }
}