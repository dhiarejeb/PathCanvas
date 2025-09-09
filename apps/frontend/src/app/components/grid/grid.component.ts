import { Component } from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';
import {PathResponse ,  PathRequest, CellDto} from '../../models/path.model';
import {HttpClient} from '@angular/common/http';


type CellType = 'empty' | 'start' | 'end' | 'wall';

interface Cell {
  row: number;
  col: number;
  type: CellType;
  visited?: boolean;
  path?: boolean;
}

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [
    NgClass,
    NgForOf
  ],
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent {
  rows = 20;
  cols = 40;
  grid: Cell[][] = [];

  isMouseDown = false;

  startPlaced = false;
  endPlaced = false;

  constructor(private http: HttpClient) {
    this.resetGrid();
  }

  resetGrid() {
    this.grid = Array.from({ length: this.rows }, (_, row) =>
      Array.from({ length: this.cols }, (_, col) => ({
        row,
        col,
        type: 'empty' as CellType
      }))
    );
    this.startPlaced = false;
    this.endPlaced = false;
  }

  handleClick(cell: Cell) {
    if (!this.startPlaced) {
      // Place the start point
      cell.type = 'start';
      this.startPlaced = true;
    } else if (!this.endPlaced && cell.type === 'empty') {
      // Place the end point
      cell.type = 'end';
      this.endPlaced = true;
    } else {
      // Toggle walls only after start and end are placed
      if (cell.type === 'empty') {
        cell.type = 'wall';
      } else if (cell.type === 'wall') {
        cell.type = 'empty';
      }
    }
  }

  handleMouseDown(cell: Cell) {
    this.isMouseDown = true;

    // Only draw walls on empty cells, never overwrite start/end
    if (this.startPlaced && this.endPlaced && cell.type === 'empty') {
      cell.type = 'wall';
    }
  }

  handleMouseEnter(cell: Cell) {
    // Only draw walls when mouse is down
    if (!this.isMouseDown) return;

    // Only draw walls on empty cells, never overwrite start/end
    if (this.startPlaced && this.endPlaced && cell.type === 'empty') {
      cell.type = 'wall';
    }
  }

  handleMouseUp() {
    this.isMouseDown = false;
  }



  solve() {
    const request: PathRequest = {
      rows: this.rows,
      cols: this.cols,
      start: this.findCell('start')!,
      end: this.findCell('end')!,
      walls: this.getWalls()
    };

    this.http.post<PathResponse>("http://localhost:8080/api/path/solve", request)
      .subscribe((response: PathResponse) => {
        console.log("Visited:", response.visitedOrder);
        console.log("Path:", response.shortestPath);
        this.animateVisited(response.visitedOrder, response.shortestPath);
      });
  }


  getWalls(): CellDto[] {
    const walls: CellDto[] = [];
    for (let row of this.grid) {
      for (let cell of row) {
        if (cell.type === 'wall') {
          walls.push(this.toDto(cell));
        }
      }
    }
    return walls;
  }

  private toDto(cell: Cell): CellDto {
    return { row: cell.row, col: cell.col };
  }
  findCell(type: 'start' | 'end'): CellDto | null {
    for (let row of this.grid) {
      for (let cell of row) {
        if (cell.type === type) {
          return this.toDto(cell);
        }
      }
    }
    return null;
  }

  animateVisited(visited: CellDto[], path: CellDto[]) {
    visited.forEach((cell, i) => {
      setTimeout(() => {
        const gridCell = this.grid[cell.row][cell.col];
        if (gridCell.type === 'empty') {
          gridCell.visited = true;
        }

        // when finished exploring, animate path
        if (i === visited.length - 1) {
          this.animatePath(path);
        }
      }, 15 * i); // adjust speed
    });
  }

  animatePath(path: CellDto[]) {
    path.forEach((cell, i) => {
      setTimeout(() => {
        const gridCell = this.grid[cell.row][cell.col];
        if (gridCell.type !== 'start' && gridCell.type !== 'end') {
          gridCell.path = true;
        }
      }, 50 * i); // slower for visibility
    });
  }



}
