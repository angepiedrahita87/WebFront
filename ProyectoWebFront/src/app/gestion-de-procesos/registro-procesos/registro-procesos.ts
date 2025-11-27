// src/app/gestion-de-procesos/registro-procesos/registro-procesos.ts

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProcesoDto } from '../../dto/procesoDto';
import { ProcesoService } from '../../services/proceso.service';
import { ActividadService } from '../../services/Activity/actividad-service';

type ProcessStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE';

@Component({
  selector: 'app-registro-procesos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro-procesos.html',
  styleUrls: ['./registro-procesos.css'],
})
export class RegistroProcesos implements OnInit {

  statuses: ProcessStatus[] = ['DRAFT', 'ACTIVE', 'INACTIVE'];
  procesoDto: ProcesoDto = new ProcesoDto();

  activitiesCatalogo = [
    { id: 1, name: 'Crear solicitud' },
    { id: 2, name: 'Validar datos' },
  ];

  archsCatalogo = [
    { id: 10, actividadI: 1, actividadD: 2 },
    { id: 11, actividadI: 2, actividadD: 3 },
  ];

  gatewaysCatalogo = [
    { id: 100, type: 'EXCLUSIVE' },
    { id: 101, type: 'PARALLEL' },
  ];

  constructor(
    private router: Router,
    private procesoService: ProcesoService,
    private actividadService: ActividadService
  ) {}

  ngOnInit(): void {
    // catálogo real de actividades
    this.actividadService.list().subscribe({
      next: (r) => (this.activitiesCatalogo = r),
      error: (err) => console.error('Error cargando actividades', err),
    });

    // Cuando tengas endpoints de arcos/gateways, descomenta:
    // this.actividadService.getArches().subscribe(r => this.archsCatalogo = r);
    // this.actividadService.getGateways().subscribe(r => this.gatewaysCatalogo = r);
  }

  // submit del formulario
  onRegistrarProceso() {
    this.crearProceso();
  }

  crearProceso() {
    // Validación mínima como en Postman
    if (!this.procesoDto.name || !this.procesoDto.description || !this.procesoDto.category) {
      alert('Nombre, descripción y categoría son obligatorios.');
      return;
    }

    console.log('DTO que se envía => ', {
      name: this.procesoDto.name,
      description: this.procesoDto.description,
      category: this.procesoDto.category,
    });

    // OJO: ProcesoService.crear ya filtra los campos.
    this.procesoService.crear(this.procesoDto).subscribe({
      next: (resp) => {
        console.log('Proceso creado OK =>', resp);
        alert('Proceso creado correctamente 🎉');
        // ajusta la ruta a la que quieres volver
        this.router.navigate(['/consultar-procesos']);
      },
      error: (err) => {
        console.error('Error creando proceso', err);
        alert('Error creando proceso. Revisa la consola para más detalles.');
      },
    });
  }
}
