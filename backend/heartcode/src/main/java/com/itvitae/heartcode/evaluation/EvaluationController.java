package com.itvitae.heartcode.evaluation;

import com.itvitae.heartcode.exceptions.BadRequestException;
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

    if (newEvaluation.evaluateeAddress() == null) {
      throw new BadRequestException("evaluateeAddress is required");
    }
    if (newEvaluation.liked() == null) {
      throw new BadRequestException("liked is required");
    }

    User evaluator = userService.getCurrentUser();
    User evaluatee =
        userService
            .findById(newEvaluation.evaluateeAddress())
            .orElseThrow(
                () ->
                    new BadRequestException(
                        "user '" + newEvaluation.evaluateeAddress() + "' not found"));

    if (evaluator.getEmail().equals(evaluatee.getEmail())) {
      {
        throw new BadRequestException("You cannot evaluate yourself");
      }
    }

    if (evaluationService.getEvaluation(evaluator, evaluatee).isPresent()) {
      throw new BadRequestException("Evaluation for user already exist");
    }

    evaluationService.createEvaluation(evaluator, evaluatee, newEvaluation.liked());

    return ResponseEntity.ok().build();
  }
}
