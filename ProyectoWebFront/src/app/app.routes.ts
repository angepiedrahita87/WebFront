// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { RegistroUsuario } from './autenticacion-y-cuentas/registro-usuario/registro-usuario';
import { CrearActividad } from './gestion-de-actividades/crear-actividad/crear-actividad';
import { MostrarActividades } from './gestion-de-actividades/mostrar-actividades/mostrar-actividades';
import { HomeScreen } from './home-screen/home-screen/home-screen';
import { ModificarActividad } from './gestion-de-actividades/modificar-actividad/modificar-actividad';
import { RegistroProcesos } from './gestion-de-procesos/registro-procesos/registro-procesos';
import { EditarUsuario } from './autenticacion-y-cuentas/editar-usuario/editar-usuario';
import { MostrarUsuarios } from './autenticacion-y-cuentas/mostrar-usuario/mostrar-usuario';
import { MostrarEmpresa } from './autenticacion-y-cuentas/mostrar-empresa/mostrar-empresa';
import { EditarEmpresa } from './autenticacion-y-cuentas/editar-empresa/editar-empresa';

import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  // ---------- PÚBLICAS ----------
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./autenticacion-y-cuentas/login/login').then((m) => m.Login),
  },
  {
    path: 'registro-de-empresa',
    loadComponent: () =>
      import(
        './autenticacion-y-cuentas/registro-de-empresa/registro-de-empresa'
      ).then((m) => m.RegistroDeEmpresa),
  },

  // ---------- SOLO LOGUEADO (cualquier rol) ----------
  {
    path: 'home',
    component: HomeScreen,
    canActivate: [authGuard],
  },

  // alias viejo, por si lo usas en algún lado
  {
    path: 'mostrar-procesos',
    redirectTo: 'consultar-proceso',
    pathMatch: 'full',
  },

  // ---------- PROCESOS ----------
  {
    path: 'consultar-proceso',
    loadComponent: () =>
      import(
        './gestion-de-procesos/consultar-proceso/consultar-proceso'
      ).then((m) => m.ConsultarProceso),
    canActivate: [authGuard], // ADMIN / EDITOR / VIEWER, todos ven
  },

  {
    path: 'drag-and-drop',
    loadComponent: () =>
        import(
        './gestion-de-procesos/drag-and-drop/drag-and-drop/drag-and-drop'
        ).then((m) => m.DragAndDrop),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'EDITOR'] },
  },
  {
    path: 'crear-proceso',
    component: RegistroProcesos,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'EDITOR'] },
  },
  {
    path: 'editar-proceso',
    loadComponent: () =>
      import('./gestion-de-procesos/editar-proceso/editar-proceso').then(
        (m) => m.EditarProceso
      ),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'EDITOR'] },
  },
  {
    path: 'eliminar-proceso',
    loadComponent: () =>
      import('./gestion-de-procesos/eliminar-proceso/eliminar-proceso').then(
        (m) => m.EliminarProceso
      ),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }, // borrar proceso solo admin
  },

  // ---------- ACTIVIDADES ----------
  {
    path: 'mostrar-actividades',
    component: MostrarActividades,
    canActivate: [authGuard],
  },
  {
    path: 'crear-actividad',
    component: CrearActividad,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'EDITOR'] },
  },
  {
    path: 'modificar-actividad',
    component: ModificarActividad,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'EDITOR'] },
  },
  {
    path: 'eliminar-actividad',
    loadComponent: () =>
      import(
        './gestion-de-actividades/eliminar-actividad/eliminar-actividad'
      ).then((m) => m.EliminarActividad),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'EDITOR'] },
  },

  // ---------- ROLES DE PROCESO (bonus) ----------
  {
    path: 'crear-rol-de-proceso',
    loadComponent: () =>
      import(
        './gestion-de-roles-de-proceso/crear-rol-de-proceso/crear-rol-de-proceso'
      ).then((m) => m.CrearRolDeProceso),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'EDITOR'] },
  },

  // ---------- USUARIOS / EMPRESA (solo ADMIN) ----------
  {
    path: 'crear-usuario',
    component: RegistroUsuario,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'modificar-usuario',
    component: EditarUsuario,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'mostrar-usuario',
    component: MostrarUsuarios,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'editar-empresa',
    component: EditarEmpresa,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'mostrar-empresas',
    component: MostrarEmpresa,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
  },

  // ---------- CATCH-ALL ----------
  { path: '**', redirectTo: '' },
];
