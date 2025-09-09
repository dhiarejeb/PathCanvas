package com.pathcanvas.backend.controller;


import com.pathcanvas.backend.DTO.PathRequest;
import com.pathcanvas.backend.DTO.PathResponse;
import com.pathcanvas.backend.service.PathService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/path")
public class PathController {
    private final PathService pathService;

    public PathController(PathService pathService) {
        this.pathService = pathService;
    }

    @PostMapping("/solve")
    public ResponseEntity<PathResponse> solve(@RequestBody PathRequest request) {
        PathResponse response = pathService.solve(request);
        return ResponseEntity.ok(response);
    }
}
