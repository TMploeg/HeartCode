function isValidEmail(email: string): boolean {
  return new RegExp("^\\S+@\\S+\\.\\S+$").test(email);
}

export { isValidEmail };
