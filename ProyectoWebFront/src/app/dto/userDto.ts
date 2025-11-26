// src/app/dto/userDto.ts

export type Role = 'ADMIN' | 'EDITOR' | 'VIEWER';

export class UsuarioDto {
  constructor(
    public id?: number,
    public name?: string,
    public email?: string,
    public password?: string,
    public organizationId?: number,
    public role?: Role
  ) {}
}
