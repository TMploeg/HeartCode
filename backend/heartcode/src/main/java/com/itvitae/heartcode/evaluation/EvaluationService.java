package com.itvitae.heartcode.evaluation;

import com.itvitae.heartcode.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EvaluationService {
    private final EvaluationRepository evaluationRepository;
    public Evaluation createEvaluation(Evaluation evaluation){
        //if (evaluationRepository.findByEvaluatorAndEvaluateeAndLiked(evaluation.getEvaluator(), evaluation.getEvaluatee(), evaluation.isLiked()).isPresent()) {
        //    return null;
        //}
        //return evaluationRepository.save(new Evaluation(evaluation.getEvaluator(), evaluation.getEvaluatee(), evaluation.isLiked()));
        return null;
    }
}
