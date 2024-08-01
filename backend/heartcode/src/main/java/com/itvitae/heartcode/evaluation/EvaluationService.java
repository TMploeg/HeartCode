package com.itvitae.heartcode.evaluation;

import com.itvitae.heartcode.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EvaluationService {
    private Evaluation createEvaluation(User evaluator, User evaluatee, boolean liked){
        Evaluation evaluation = new Evaluation(evaluator, evaluatee, liked);
        return evaluation;
    }

    private String checkEvaluation(Evaluation evaluation){
    return "";
    }
}
