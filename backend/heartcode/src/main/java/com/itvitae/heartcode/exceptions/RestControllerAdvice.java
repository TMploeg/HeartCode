package com.itvitae.heartcode.exceptions;

import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;

@org.springframework.web.bind.annotation.RestControllerAdvice
public class RestControllerAdvice {
  @ExceptionHandler(RestException.class)
  public ResponseEntity<ProblemDetail> restExceptionHandler(RestException exception) {
    return ResponseEntity.status(exception.getStatus().value())
        .body(ProblemDetail.forStatusAndDetail(exception.getStatus(), exception.getMessage()));
  }
}
