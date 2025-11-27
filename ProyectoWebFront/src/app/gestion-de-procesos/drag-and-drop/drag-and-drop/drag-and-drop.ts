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
  uid: string;        // id único en el front
  backendId?: number; // cuando lo enlaces a Actividad/Gateway en BD
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

  // ========= PANEL DERECHO =========
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
        console.log('Procesos para editor:', this.procesos);
      },
      error: (err) => {
        console.error('Error cargando procesos en editor', err);
      },
    });
  }

  onSeleccionarProceso(idStr: string) {
    if (!idStr) {
      this.procesoSeleccionado = null;
      this.nodosCanvas = [];
      this.nodoSeleccionado = null;
      return;
    }

    const id = Number(idStr);
    const found = this.procesos.find((p) => p.id === id) ?? null;
    this.procesoSeleccionado = found;

    console.log('Proceso seleccionado =>', this.procesoSeleccionado);
  }

  // ----------------- DRAG & DROP -----------------
  onDropNodo(event: CdkDragDrop<any>) {
    const template = event.item.data as NodeTemplate | undefined;

    if (!template) {
      console.warn('Drop sin template');
      return;
    }

    const nuevo: EditorNode = {
      uid: crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2),
      type: template.type,
      label: template.label,
    };

    this.nodosCanvas.push(nuevo);

    // 👉 hacer selección automática
    setTimeout(() => {
      this.seleccionarNodo(nuevo);
    }, 10);
  }

  seleccionarNodo(node: EditorNode) {
    this.nodoSeleccionado = node;

    this.panelNombre = node.label || '';
    this.panelDescripcion = '';
    this.panelTipoActividad = '';
    this.panelTipoGateway = '';

    console.log('Nodo seleccionado =>', node);
  }

  // ----------------- PANEL DERECHO -----------------
  guardarDatosNodo() {
    if (!this.nodoSeleccionado) return;

    this.nodoSeleccionado.label =
      this.panelNombre.trim() || this.nodoSeleccionado.label;

    console.log('Nodo actualizado =>', this.nodoSeleccionado);
    alert('Datos guardados (solo front por ahora).');
  }
}
