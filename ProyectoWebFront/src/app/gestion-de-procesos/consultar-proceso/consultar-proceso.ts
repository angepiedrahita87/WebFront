// src/app/gestion-de-procesos/consultar-proceso/consultar-proceso.ts

import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ProcesoService } from '../../services/proceso.service';
import { ProcesoDto } from '../../dto/procesoDto';

@Component({
  selector: 'app-mostrar-procesos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consultar-proceso.html',
  styleUrls: ['./consultar-proceso.css'],
})
export class ConsultarProceso implements OnInit {

  procesos: ProcesoDto[] = [];
  loading = false;
  errorMessage = '';
  role: string | null = null;

  constructor(
    private procesoService: ProcesoService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // solo leer localStorage en browser
    if (isPlatformBrowser(this.platformId)) {
      this.role = localStorage.getItem('auth_role'); // ADMIN / EDITOR / VIEWER
    }

    this.cargarProcesos();
  }

  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  cargarProcesos(): void {
    this.loading = true;
    this.errorMessage = '';
    this.procesos = [];

    this.procesoService.listar().subscribe({
      next: (data) => {
        console.log('Procesos desde el backend =>', data);
        this.procesos = data ?? [];
        console.log('Procesos visibles =>', this.procesos);
        this.loading = false;              // 👈 IMPORTANTE
      },
      error: (err) => {
        console.error('Error al listar procesos', err);
        this.errorMessage = 'No se pudieron cargar los procesos.';
        this.loading = false;              // 👈 IMPORTANTE
      },
    });
  }

  eliminarProceso(id?: number): void {
    if (!id) return;

    const confirmacion = confirm(
      '¿Estás seguro de que deseas eliminar este proceso?'
    );
    if (!confirmacion) return;

    this.loading = true;
    this.procesoService.eliminar(id).subscribe({
      next: () => {
        alert('Proceso eliminado con éxito.');
        this.procesos = this.procesos.filter((p) => p.id !== id);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al eliminar proceso:', err);
        alert('No se pudo eliminar el proceso. Intenta nuevamente.');
        this.loading = false;
      },
    });
  }

  volver(): void {
    this.router.navigate(['/home']);
  }
}
