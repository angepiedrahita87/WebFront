// src/app/autenticacion-y-cuentas/login.component.ts

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoginDto } from '../../dto/loginDto';
import { LoginService } from '../../services/Login/login-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  errorMessage: string | null = null;
  loginDto: LoginDto = new LoginDto(); // ya tiene email/password vacíos

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}  

  onSubmit() {
    console.log('Correo:', this.loginDto.email);
    console.log('Contraseña:', this.loginDto.password);
    this.loginUser();
  }

  loginUser() {
    this.errorMessage = null;

    this.loginService.loginSolv(this.loginDto).subscribe({
      next: (resp) => {
        // resp: { token, persona, role }

        // Guardar en localStorage
        localStorage.setItem('auth_token', resp.token);
        localStorage.setItem('auth_user', JSON.stringify(resp.persona));
        localStorage.setItem('auth_role', resp.role);

        this.navegarHomeScreen();
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);

        if (error.status === 401) {
          this.errorMessage = 'Credenciales inválidas. Intenta de nuevo.';
        } else {
          this.errorMessage = 'Ocurrió un error al iniciar sesión.';
        }

        alert(this.errorMessage);
      }
    });
  }

  ngOnInit(): void {}

  navegarHomeScreen() {
    this.router.navigate(['/home']);
  }
}