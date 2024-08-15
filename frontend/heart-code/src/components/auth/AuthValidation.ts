function isValidEmail(email: string): boolean {
  return new RegExp("^\\S+@\\S+\\.\\S+$").test(email);
}

function isValidPassword(password: string): boolean {
  if (password == null || password.length < 7) {
    return false;
  } else {
    let numOfUppercase = 0;
    let numOfLowercase = 0;
    let numOfDigits = 0;
    let numOfSpecialChars = 0;
    for (let i = 0; i < password.length; i++) {
      let ch = password.charAt(i);
      let format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      if (format.test(ch)) {
        numOfSpecialChars++;
      } else if (/^\d+$/.test(ch)) {
        numOfDigits++;
      } else if (ch === ch.toUpperCase()) {
        numOfUppercase++;
      } else if (ch === ch.toLowerCase()) {
        numOfLowercase++;
      }
    }

    return (
      numOfUppercase >= 1 &&
      numOfLowercase >= 1 &&
      numOfDigits >= 1 &&
      numOfSpecialChars >= 1
    );
  }
}

export { isValidEmail, isValidPassword };
