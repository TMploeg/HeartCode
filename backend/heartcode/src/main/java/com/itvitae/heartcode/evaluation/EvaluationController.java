package com.itvitae.heartcode.evaluation;

import com.itvitae.heartcode.exceptions.BadRequestException;
import com.itvitae.heartcode.exceptions.NotFoundException;
import com.itvitae.heartcode.match.MatchService;
import com.itvitae.heartcode.user.User;
import com.itvitae.heartcode.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/evaluations")
@CrossOrigin("http://localhost:5173")
public class EvaluationController {

  private final EvaluationService evaluationService;
  private final MatchService matchService;
  private final UserService userService;

  @PostMapping("create-evaluation-and-check")
  public ResponseEntity<?> createEvaluationAndCheck(@RequestBody NewEvaluationDTO newEvaluation) {

    if (newEvaluation.evaluatorAddress() == null
        || newEvaluation.evaluateeAddress() == null
        || newEvaluation.liked() == null) {
      throw new BadRequestException("Request body does not meet minimum requirements");
    }

    var possibleEvaluator = userService.findById(newEvaluation.evaluatorAddress());
    if (possibleEvaluator.isEmpty()) {
      throw new NotFoundException();
    }
    User evaluator = possibleEvaluator.get();

    var possibleEvaluatee = userService.findById(newEvaluation.evaluateeAddress());
    if (possibleEvaluatee.isEmpty()) {
      throw new NotFoundException();
    }
    User evaluatee = possibleEvaluatee.get();

    if (evaluationService.createEvaluation(evaluator, evaluatee, newEvaluation.liked()) != null) {
      matchService.createMatch(evaluator, evaluatee);
      return ResponseEntity.ok().build();
    }
    throw new BadRequestException("Match already exist");
  }
}
