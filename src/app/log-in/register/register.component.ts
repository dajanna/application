import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RacunService } from '../../servicess/racun.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  form: FormGroup;
  hide = true; // Za prikazivanje/sklanjanje passworda
  hideConfirm = true; // Za potvrdu passworda

  constructor(
    private fb: FormBuilder,
    private authService: RacunService,  // Tvoj servis za registraciju
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Kreiramo formu sa potrebnim validacijama
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  // Validacija da li se password i confirmPassword podudaraju
  passwordMatchValidator(group: FormGroup): any {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { mismatch: true };
  }

  // Funkcija koja se poziva kada korisnik klikne na Register dugme
  onRegister(): void {
    if (this.form.invalid) {
      this.snackBar.open('Please fill all fields correctly.', 'Close', {
        duration: 5000,
        horizontalPosition: 'center'
      });
      return;
    }

    const registerData = {
      email: this.form.value.email,
      fullName: this.form.value.fullName,
      password: this.form.value.password
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.snackBar.open('Account successfully created!', 'Close', {
          duration: 5000,
          horizontalPosition: 'center'
        });
        this.router.navigate(['/login']); // Preusmeravanje na login nakon uspešne registracije
      },
      error: (error) => {
        this.snackBar.open('Error during registration: ' + error.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center'
        });
      }
    }); 
  }

  // Getter za form kontrolu
  get f() {
    return this.form.controls;
  }
}

