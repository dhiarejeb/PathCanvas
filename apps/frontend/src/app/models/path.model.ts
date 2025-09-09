export interface CellDto {
  row: number;
  col: number;
}

export interface PathRequest {
  rows: number;
  cols: number;
  start: CellDto;
  end: CellDto;
  walls: CellDto[];
}

export interface PathResponse {
  visitedOrder: CellDto[];
  shortestPath: CellDto[];
}
