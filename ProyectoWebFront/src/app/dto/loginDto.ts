// src/app/dto/loginDto.ts
import { UsuarioDto, Role } from './userDto';

export class LoginDto {
  constructor(
    public email: string = '',
    public password: string = ''
  ) {}
}

export class AuthResponseDto {
  constructor(
    public token: string,
    public persona: UsuarioDto,
    public role: Role
  ) {}
}
