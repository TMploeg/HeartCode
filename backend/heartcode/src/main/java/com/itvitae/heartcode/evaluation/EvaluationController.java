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

    if (newEvaluation.evaluatorAddress().equals(newEvaluation.evaluateeAddress())) {
      return ResponseEntity.badRequest().body("You cannot evaluate yourself");
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

    var possibleEvaluation =
        evaluationService.createEvaluation(evaluator, evaluatee, newEvaluation.liked());

    if (possibleEvaluation == null) {
      throw new BadRequestException("Match already exist");
    } else {
      matchService.createMatch(evaluator, evaluatee, possibleEvaluation.isLiked());
      return ResponseEntity.ok().build();
    }
  }
}
