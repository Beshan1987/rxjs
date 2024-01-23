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
  map,
  of,
  reduce,
} from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  search$ = new Observable<string>((Subscriber) => {
    const search = document.getElementById('search');

    if (!search) {
      Subscriber.error();
    }
    search?.addEventListener('input', (event) => {
      Subscriber.next((event.target as HTMLInputElement).value);
    });
  });

  constructor() {}

  input() {
    this.search$
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((e) => console.log(e));
  }
}
