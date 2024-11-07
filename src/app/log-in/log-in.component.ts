import { Component, Inject, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RacunService } from '../servicess/racun.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  form: FormGroup;
  hide: boolean = true;


  constructor(private fb: FormBuilder, private servis:RacunService, private snackBar: MatSnackBar, private router:Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

    isSignDivVisible: boolean = true;
  
    signUpObj: SignUpModel = new SignUpModel();
    loginObj: LoginModel = new LoginModel();
  
    onLogin(){
      this.servis.logIn(this.form.value).subscribe({
        next:(response)=>{
          this.snackBar.open(response.message, 'Close', {
            duration:5000,
            horizontalPosition:'center'
          })
          this.router.navigate(['/bills'])
        },
        error:(error)=>{
          this.snackBar.open(error.error.message, 'Close', {
            duration:5000,
            horizontalPosition:'center'
          })
        }
      });

  }
 
}
  export class SignUpModel  {
    name: string;
    email: string;
    password: string;
  
    constructor() {
      this.email = "";
      this.name = "";
      this.password = "";
    }
  }
  
  export class LoginModel  { 
    email: string;
    password: string;
  
    constructor() {
      this.email = ""; 
      this.password = "";
    }
  }
  