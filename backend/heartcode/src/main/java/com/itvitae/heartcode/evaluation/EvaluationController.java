package com.itvitae.heartcode.evaluation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/evaluations")
@CrossOrigin("http://localhost:5173")
public class EvaluationController {
    @PostMapping("create-evaluation-and-check")
    public ResponseEntity<?> createEvaluationAndCheck (@RequestBody Evaluation newEvaluation) {

        return null;
    }
}