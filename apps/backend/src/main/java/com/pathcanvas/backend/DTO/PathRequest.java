package com.pathcanvas.backend.DTO;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PathRequest {
    private int rows;
    private int cols;
    private CellDto start;
    private CellDto end;
    private List<CellDto> walls;

    // getters & setters
}