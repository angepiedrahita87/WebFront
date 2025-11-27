// src/app/gestion-de-procesos/registro-procesos/registro-procesos.ts

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProcesoDto } from '../../dto/procesoDto';
import { ProcesoService } from '../../services';
import { ActividadService } from '../../services/Activity/actividad-service';

type ProcessStatus = 'DRAFT' | 'PUBLISHED';

@Component({
  selector: 'app-registro-procesos',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './registro-procesos.html',
  styleUrls: ['./registro-procesos.css'],
})
export class RegistroProcesos implements OnInit {

  constructor(
    private router: Router,
    private procesoService: ProcesoService,
    private actividadService: ActividadService,
  ) {}

  // estados que entiende el back (según lo que ya tienes: DRAFT / PUBLISHED)
  statuses: ProcessStatus[] = ['DRAFT', 'PUBLISHED'];

  // DTO del proceso
  procesoDto: ProcesoDto = new ProcesoDto();

  // catálogos para los <select multiple>
  activitiesCatalogo: { id: number; name: string }[] = [];
  archsCatalogo = [
    { id: 10, actividadI: 1, actividadD: 2 },
    { id: 11, actividadI: 2, actividadD: 3 },
  ];
  gatewaysCatalogo = [
    { id: 100, type: 'EXCLUSIVE' },
    { id: 101, type: 'PARALLEL' },
  ];

  ngOnInit(): void {
    // inicializar arrays del DTO (por si vienen en undefined)
    this.procesoDto.activityIds  = this.procesoDto.activityIds  ?? [];
    this.procesoDto.archIds      = this.procesoDto.archIds      ?? [];
    this.procesoDto.gatewayIds   = this.procesoDto.gatewayIds   ?? [];

    // cargar actividades desde el back
    this.actividadService.list().subscribe({
      next: (r: any[]) => {
        // asumo que r viene con {id, name}; si el nombre es distinto, ajusta aquí
        this.activitiesCatalogo = r.map(a => ({
          id: a.id,
          name: a.name ?? a.nombre ?? `Actividad ${a.id}`,
        }));
      },
      error: (err) => {
        console.error('Error cargando actividades', err);
      },
    });

    // cuando tengas endpoints reales, reemplazas estos mocks:
    // this.actividadService.getArches().subscribe(r => this.archsCatalogo = r);
    // this.actividadService.getGateways().subscribe(r => this.gatewaysCatalogo = r);
  }

  // ----- Acciones del formulario -----
  onRegistrarProceso() {
    // por si acaso, aseguramos que los arrays existen
    this.procesoDto.activityIds = this.procesoDto.activityIds ?? [];
    this.procesoDto.archIds     = this.procesoDto.archIds     ?? [];
    this.procesoDto.gatewayIds  = this.procesoDto.gatewayIds  ?? [];

    console.log('DTO que se va a enviar =>', this.procesoDto);
    this.crearProceso();
  }

  crearProceso() {
    this.procesoService.crear(this.procesoDto).subscribe({
      next: (resp) => {
        console.log('Proceso creado =>', resp);
        alert('Proceso creado correctamente');
        // ajusta la ruta según tu app
        this.router.navigate(['/consultar-procesos']);
      },
      error: (err) => {
        console.error('Error creando proceso', err);
        alert('Error creando proceso. Revisa la consola para más detalles.');
      },
    });
  }
}
