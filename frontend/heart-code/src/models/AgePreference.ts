export default interface AgePreference {
  minAge?: number;
  maxAge?: number;
}

export interface PreferedAgeInputData {
  minAge: InputData;
  maxAge: InputData;
}

interface InputData {
  value: string;
  enabled: boolean;
}
