package com.pathcanvas.backend.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PathResponse {
    private List<CellDto> visitedOrder;
    private List<CellDto> shortestPath;
}
