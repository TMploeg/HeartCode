import moment from "moment";

function isValidEmail(email: string): boolean {
  return new RegExp("^\\S+@\\S+\\.\\S+$").test(email);
}

function isValidDateOfBirth(date: string): boolean {
  return new RegExp(
    "^(0?[1-9]|[12][0-9]|3[01])[\\/\\-](0?[1-9]|1[012])[\\/\\-]\\d{4}$"
  ).test(date);
}

function isValidAge(date: Date): boolean {
  return moment(date).isBefore(subtractYears(new Date(), 18));
}

function subtractYears(date: Date, years: number) {
  date.setFullYear(date.getFullYear() - years);
  return date;
}

export { isValidEmail, isValidDateOfBirth, isValidAge };
