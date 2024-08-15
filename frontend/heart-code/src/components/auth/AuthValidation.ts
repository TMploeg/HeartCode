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
      if (password.includes("!@#$%^&*()-_=+[{]};:'\",<.>/?\\|")) {
        console.log(ch + " is special char");
        numOfSpecialChars++;
      } else if (/^\d+$/.test(ch)) {
        console.log(ch + " is digit");
        numOfDigits++;
      } else if (ch === ch.toUpperCase()) {
        console.log(ch + " is uppercase");
        numOfUppercase++;
      } else if (ch === ch.toLowerCase()) {
        console.log(ch + " is lowercase");
        numOfLowercase++;
      }
    }
    if (
      numOfUppercase >= 1 &&
      numOfLowercase >= 1 &&
      numOfDigits >= 1 &&
      numOfSpecialChars >= 1
    ) {
      console.log("password valid");
      console.log(
        numOfDigits,
        numOfLowercase,
        numOfSpecialChars,
        numOfUppercase
      );
      return true;
    } else {
      console.log("password not valid");
      console.log(
        numOfDigits,
        numOfLowercase,
        numOfSpecialChars,
        numOfUppercase
      );

      return false;
    }
  }
}

export { isValidEmail, isValidPassword };
