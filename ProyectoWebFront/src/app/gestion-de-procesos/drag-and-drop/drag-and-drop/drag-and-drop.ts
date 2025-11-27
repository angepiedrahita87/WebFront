import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ProcesoDto } from '../../../dto/procesoDto';
import { ProcesoService } from '../../../services';


@Component({
  selector: 'app-drag-and-drop',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './drag-and-drop.html',
  styleUrl: './drag-and-drop.css',
})
export class DragAndDrop implements OnInit {
  procesos: ProcesoDto[] = [];
  loading = false;
  errorMessage = '';

  authRole: string | null = null;
  readonly isBrowser = typeof window !== 'undefined';

  private readonly procesoService = inject(ProcesoService);

  ngOnInit(): void {
    if (this.isBrowser) {
      this.authRole = localStorage.getItem('auth_role');
    }
    this.cargarProcesos();
  }

  cargarProcesos(): void {
    if (!this.isBrowser) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.procesoService.listar().subscribe({
      next: (data) => {
        console.log('Procesos para drag & drop:', data);
        this.procesos = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al listar procesos', err);
        this.errorMessage = 'Error al cargar los procesos.';
        this.loading = false;
      },
    });
  }

  puedeEliminar(): boolean {
    return this.authRole === 'ADMIN';
  }

  onDrop(event: CdkDragDrop<ProcesoDto[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    // 1. mover en memoria
    moveItemInArray(this.procesos, event.previousIndex, event.currentIndex);

    // 2. recalcular orden local
    this.procesos.forEach((p, index) => (p.orden = index));

    // 3. mandar sólo el que se movió
    const moved = this.procesos[event.currentIndex];
    if (!moved || moved.id == null) return;

    this.procesoService
      .actualizarOrden(moved.id, moved.orden ?? event.currentIndex)
      .subscribe({
        error: (err) => {
          console.error('Error al actualizar orden', err);
          // rollback simple
          this.cargarProcesos();
        },
      });
  }

  onDelete(proc: ProcesoDto): void {
    if (proc.id == null) return;
    if (!this.puedeEliminar()) return;

    if (this.isBrowser) {
      const ok = confirm(`¿Eliminar el proceso "${proc.name}"?`);
      if (!ok) return;
    }

    this.procesoService.eliminar(proc.id, false).subscribe({
      next: () => this.cargarProcesos(),
      error: (err) => {
        console.error('Error al eliminar proceso', err);
        this.errorMessage = 'Error al eliminar el proceso.';
      },
    });
  }
}
