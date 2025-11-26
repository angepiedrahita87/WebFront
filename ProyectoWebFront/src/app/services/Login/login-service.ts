// src/app/services/Login/login-service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginDto, AuthResponseDto } from '../../dto/loginDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private urlServidor: string = 'http://localhost:8080/api';
  private urlLogin = this.urlServidor + '/auth/login';

  constructor(private httpClient: HttpClient) {
    console.log('Ruta de login! =', this.urlLogin);
  }

  loginSolv(loginDto: LoginDto): Observable<AuthResponseDto> {
    return this.httpClient.post<AuthResponseDto>(this.urlLogin, loginDto);
  }
}
