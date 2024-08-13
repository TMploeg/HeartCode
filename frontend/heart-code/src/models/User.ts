export interface User {
  email: string;
  alias: string;
  gender: Gender;
}

export interface Gender {
  name: string;
  abbreviation: string;
}
