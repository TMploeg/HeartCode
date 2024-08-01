package com.itvitae.heartcode.evaluation;

import com.itvitae.heartcode.match.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/evaluations")
@CrossOrigin("http://localhost:5173")
public class EvaluationController {

    //private final EvaluationService evaluationService;
    //private final MatchService matchService;

    @PostMapping("create-evaluation-and-check")
    public ResponseEntity<?> createEvaluationAndCheck (@RequestBody Evaluation newEvaluation) {

        //if (evaluationService.createEvaluation(newEvaluation) != null) {
            //matchService.createMatch(newEvaluation);
        //};
        return ResponseEntity.badRequest().build();
    }
}