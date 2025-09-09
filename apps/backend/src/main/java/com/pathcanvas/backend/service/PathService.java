package com.pathcanvas.backend.service;


import com.pathcanvas.backend.DTO.CellDto;
import com.pathcanvas.backend.DTO.PathRequest;
import com.pathcanvas.backend.DTO.PathResponse;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PathService {
    public PathResponse solve(PathRequest request) {
        int rows = request.getRows();
        int cols = request.getCols();

        boolean[][] walls = new boolean[rows][cols];
        for (CellDto wall : request.getWalls()) {
            walls[wall.getRow()][wall.getCol()] = true;
        }

        CellDto start = request.getStart();
        CellDto end = request.getEnd();

        return runDijkstra(rows, cols, walls, start, end);
    }

    private PathResponse runDijkstra(int rows, int cols, boolean[][] walls,
                                     CellDto start, CellDto end) {

        Map<String, Integer> distance = new HashMap<>();
        Map<String, CellDto> previous = new HashMap<>();
        List<CellDto> visitedOrder = new ArrayList<>();
        PriorityQueue<CellDto> pq = new PriorityQueue<>(Comparator.comparingInt(c -> distance.get(key(c))));

        // init
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                CellDto cell = new CellDto();
                cell.setRow(r);
                cell.setCol(c);
                distance.put(key(cell), Integer.MAX_VALUE);
                previous.put(key(cell), null);
            }
        }

        distance.put(key(start), 0);
        pq.add(start);

        // Dijkstra loop
        while (!pq.isEmpty()) {
            CellDto current = pq.poll();
            visitedOrder.add(current);

            if (current.getRow() == end.getRow() && current.getCol() == end.getCol()) break;

            for (CellDto neighbor : neighbors(current, rows, cols, walls)) {
                int alt = distance.get(key(current)) + 1;
                if (alt < distance.get(key(neighbor))) {
                    distance.put(key(neighbor), alt);
                    previous.put(key(neighbor), current);
                    pq.add(neighbor);
                }
            }
        }
        //todo

        // reconstruct path
        List<CellDto> path = new ArrayList<>();
        CellDto cur = end;
        while (cur != null) {
            path.add(0, cur);
            cur = previous.get(key(cur));
        }

        PathResponse response = new PathResponse();
        response.setVisitedOrder(visitedOrder);
        response.setShortestPath(path);
        return response;
    }

    private List<CellDto> neighbors(CellDto cell, int rows, int cols, boolean[][] walls) {
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        List<CellDto> result = new ArrayList<>();
        for (int[] d : dirs) {
            int nr = cell.getRow() + d[0];
            int nc = cell.getCol() + d[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !walls[nr][nc]) {
                CellDto n = new CellDto();
                n.setRow(nr);
                n.setCol(nc);
                result.add(n);
            }
        }
        return result;
    }

    private String key(CellDto c) {
        return c.getRow() + "-" + c.getCol();
    }
}
