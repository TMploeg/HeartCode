package com.itvitae.heartcode.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

public class RestException extends RuntimeException {
  @Getter private HttpStatus status;

  // include all default constructors of RuntimeException
  public RestException(HttpStatus status) {}

  public RestException(HttpStatus status, String message) {
    super(message);
  }

  public RestException(HttpStatus status, String message, Throwable cause) {
    super(message, cause);
  }

  public RestException(HttpStatus status, Throwable cause) {
    super(cause);
  }

  public RestException(
      HttpStatus status,
      String message,
      Throwable cause,
      boolean enableSuppression,
      boolean writableStackTrace) {
    super(message, cause, enableSuppression, writableStackTrace);
  }
}
