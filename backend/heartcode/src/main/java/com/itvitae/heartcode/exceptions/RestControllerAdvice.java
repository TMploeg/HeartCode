package com.itvitae.heartcode.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;

@org.springframework.web.bind.annotation.RestControllerAdvice
public class RestControllerAdvice {
  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<ProblemDetail> badRequestExceptionHandler(BadRequestException exception) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST.value())
        .body(ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, exception.getMessage()));
  }

  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<ProblemDetail> notFoundExceptionHandler(NotFoundException exception) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND.value())
        .body(ProblemDetail.forStatus(HttpStatus.NOT_FOUND));
  }
}
