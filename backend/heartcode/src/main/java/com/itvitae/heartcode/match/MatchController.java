package com.itvitae.heartcode.match;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/matches")
@CrossOrigin("http://localhost:5173")
public class MatchController {
    @PostMapping("create-evaluation-and-check")
    public ResponseEntity<?> createEvaluationAndCheck (@RequestBody Match newMatch) {

        return null;
    }
}
