package com.itvitae.heartcode.evaluation;

import com.itvitae.heartcode.user.User;
import jakarta.persistence.Embeddable;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationId {
    @ManyToOne
    User evaluator;
    @ManyToOne
    User evaluatee;
}
