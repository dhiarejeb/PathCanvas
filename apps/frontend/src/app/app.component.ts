import { Component } from '@angular/core';

import {GridComponent} from './components/grid/grid.component';

@Component({
  selector: 'app-root',
  imports: [GridComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
}
