// src/app/gestion-de-procesos/drag-and-drop/drag-and-drop/drag-and-drop.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CdkDrag,
  CdkDropList,
  CdkDragDrop,
  DragDropModule,
} from '@angular/cdk/drag-drop';

import { ProcesoService } from '../../../services/proceso.service';
import { ProcesoDto } from '../../../dto/procesoDto';

type NodeType = 'START' | 'ACTIVITY' | 'GATEWAY' | 'END';

interface NodeTemplate {
  type: NodeType;
  label: string;
}

interface EditorNode extends NodeTemplate {
  uid: string;         // id solo del front
  backendId?: number;  // id de Actividad / Gateway en BD (cuando se guarde)
}

@Component({
  selector: 'app-drag-and-drop',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, CdkDrag, CdkDropList],
  templateUrl: './drag-and-drop.html',
  styleUrls: ['./drag-and-drop.css'],
})
export class DragAndDrop implements OnInit {
  // ========= PROCESOS =========
  procesos: ProcesoDto[] = [];
  procesoSeleccionado: ProcesoDto | null = null;
  procesoSeleccionadoId: number | null = null;

  // ========= PALETA =========
  paleta: NodeTemplate[] = [
    { type: 'START',    label: 'Inicio' },
    { type: 'ACTIVITY', label: 'Actividad' },
    { type: 'GATEWAY',  label: 'Gateway' },
    { type: 'END',      label: 'Fin' },
  ];

  // ========= LIENZO =========
  nodosCanvas: EditorNode[] = [];
  nodoSeleccionado: EditorNode | null = null;

  // ========= FORM DEL PANEL DERECHO =========
  panelNombre = '';
  panelDescripcion = '';
  panelTipoActividad = '';
  panelTipoGateway = '';

  constructor(private readonly procesoService: ProcesoService) {}

  ngOnInit(): void {
    this.cargarProcesos();
  }

  // ----------------- PROCESOS -----------------
  cargarProcesos() {
    this.procesoService.listar().subscribe({
      next: (data) => {
        this.procesos = data ?? [];
        console.log('Procesos para editor =>', this.procesos);
      },
      error: (err) => {
        console.error('Error cargando procesos en drag-and-drop', err);
      },
    });
  }

  onSeleccionarProceso(id: number | null) {
    console.log('onSeleccionarProceso() =>', id);

    if (!id) {
      this.procesoSeleccionado = null;
      this.procesoSeleccionadoId = null;
      this.nodosCanvas = [];
      this.nodoSeleccionado = null;
      return;
    }

    const found = this.procesos.find((p) => p.id === id) ?? null;
    this.procesoSeleccionado = found;
    this.procesoSeleccionadoId = found?.id ?? null;

    console.log('Proceso seleccionado =>', this.procesoSeleccionado);
  }

  // ----------------- DRAG & DROP -----------------
  onDropNodo(event: CdkDragDrop<any>) {
    const template: NodeTemplate = event.item.data as NodeTemplate;

    if (!this.procesoSeleccionado) {
      alert('Primero selecciona un proceso.');
      return;
    }

    const nuevo: EditorNode = {
      uid: crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2),
      type: template.type,
      label: template.label,
    };

    this.nodosCanvas = [...this.nodosCanvas, nuevo];
    console.log('Nodo añadido al lienzo =>', nuevo);

    // opcional: lo seleccionamos de una vez
    this.seleccionarNodo(nuevo);
  }

  // ----------------- CLICK NODO -----------------
  seleccionarNodo(node: EditorNode) {
    console.log('🔥 CLICK EN NODO =>', node);
    this.nodoSeleccionado = node;

    this.panelNombre = node.label;
    this.panelDescripcion = '';
    this.panelTipoActividad = '';
    this.panelTipoGateway = '';
  }

  limpiarSeleccionLienzo() {
    this.nodoSeleccionado = null;
  }

  // ----------------- PANEL DERECHO -----------------
  guardarDatosNodo() {
    if (!this.nodoSeleccionado) return;

    this.nodoSeleccionado.label =
      this.panelNombre || this.nodoSeleccionado.label;

    // TODO: aquí luego conectas ActivityService / GatewayService
    // usando this.procesoSeleccionadoId y this.nodoSeleccionado.type

    console.log('Nodo actualizado (front) =>', this.nodoSeleccionado);
    alert('Datos del nodo guardados (solo front por ahora).');
  }
}
