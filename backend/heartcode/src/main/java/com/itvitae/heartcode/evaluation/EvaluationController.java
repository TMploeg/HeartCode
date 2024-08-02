package com.itvitae.heartcode.evaluation;

import com.itvitae.heartcode.match.MatchService;
import com.itvitae.heartcode.user.User;
import com.itvitae.heartcode.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/evaluations")
@CrossOrigin("${app.cors-allowed-origins}")
public class EvaluationController {

    private final EvaluationService evaluationService;
    private final MatchService matchService;
    private final UserService userService;

    @PostMapping("create-evaluation-and-check")
    public ResponseEntity<?> createEvaluationAndCheck (@RequestBody NewEvaluationDTO newEvaluation) {

        User evaluator = userService.findById(newEvaluation.evaluatorAddress()).get();
        User evaluatee = userService.findById(newEvaluation.evaluateeAddress()).get();

    if (evaluationService.createEvaluation(evaluator, evaluatee, newEvaluation.liked()) != null) {
            matchService.createMatch(evaluator, evaluatee);
            return ResponseEntity.ok().build();
        };
        return ResponseEntity.badRequest().build();
    }
}