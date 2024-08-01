package com.itvitae.heartcode.match;

import com.itvitae.heartcode.evaluation.Evaluation;
import com.itvitae.heartcode.evaluation.EvaluationRepository;
import com.itvitae.heartcode.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MatchService {
    private  final MatchRepository matchRepository;
    private final EvaluationRepository evaluationRepository;

    public Match createMatch (Evaluation evaluation) {
        if(evaluationRepository.findByEvaluationIdEvaluatorAndEvaluationIdEvaluateeAndLiked(evaluation.getEvaluator(), evaluation.getEvaluatee(), evaluation.isLiked()).isPresent()){
             return matchRepository.save(new Match(evaluation.getEvaluator(), evaluation.getEvaluatee()));
        }
        return null;
    }
}
