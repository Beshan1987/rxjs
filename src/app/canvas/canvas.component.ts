import { Component } from '@angular/core';
import { Canvas } from '../canvas';
import { fromEvent, map, pairwise, switchMap } from 'rxjs';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss',
})
export class CanvasComponent {}
