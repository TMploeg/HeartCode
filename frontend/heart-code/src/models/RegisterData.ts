import Gender from "../enums/Gender";

export default interface RegisterData {
  email: string;
  alias: string;
  password: string;
  passwordConfirmation: string;
  gender: string;
  bio: string;
}
