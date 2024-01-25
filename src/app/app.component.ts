import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  Observable,
  Subscriber,
  debounce,
  debounceTime,
  distinctUntilChanged,
  from,
  fromEvent,
  map,
  of,
  pairwise,
  reduce,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import { CanvasComponent } from './canvas/canvas.component';
import { Canvas } from './canvas';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CanvasComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  search$ = fromEvent(document, 'input');

  canvas: HTMLCanvasElement;
  cx: any;
  mousemove$: any;
  mousedown$: any;
  mouseup$: any;
  mouseout$: any;
  draw: any;

  points$: any;

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.cx = this.canvas.getContext('2d');
    this.cx.LineWidth = 4;
    this.draw = ([prev, next]: Canvas[]) => {
      this.cx?.beginPath();
      this.cx?.moveTo(prev.x, prev.y);
      this.cx?.lineTo(next.x, next.y);
      this.cx?.stroke();
    };
    this.mousemove$ = fromEvent<MouseEvent>(this.canvas, 'mousemove');
    this.mousedown$ = fromEvent<MouseEvent>(this.canvas, 'mousedown');
    this.mouseup$ = fromEvent<MouseEvent>(this.canvas, 'mouseup');
    this.mouseout$ = fromEvent<MouseEvent>(this.canvas, 'mouseout');
    this.points$ = this.mousemove$.pipe(
      map<MouseEvent, Canvas>(({ clientX, clientY }) => {
        return {
          x: clientX,
          y: clientY,
        };
      }),
      pairwise<Canvas>()
    );
    this.mousedown$
      .pipe(
        switchMap(() =>
          this.points$.pipe(takeUntil(this.mouseup$), takeUntil(this.mouseout$))
        )
      )
      .subscribe(this.draw);
  }

  input() {
    this.search$
      .pipe(
        map((e) =>
          (e.target as HTMLInputElement).value.length > 3
            ? (e.target as HTMLInputElement).value
            : ''
        ),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((e) => console.log(e));
  }
}
