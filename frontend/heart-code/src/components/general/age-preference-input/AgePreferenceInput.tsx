import { Form, InputGroup } from "react-bootstrap";
import AgePreference, {
  PreferedAgeInputData,
} from "../../../models/AgePreference";
import { useEffect, useState } from "react";
import "./AgePreferenceInput.css";
import { AgePreferenceErrors } from "../../auth/AuthValidation";

interface Props {
  initialValues?: AgePreference;
  onChange?: (values: AgePreference) => void;
  changed?: boolean;
  validationState?: AgePreferenceErrors;
  onBlur: () => void;
  touched: boolean;
}

const INVALID_NUMBER_MESSAGE = "Please enter a valid number";

export default function AgePreferenceInput({
  initialValues,
  onChange,
  changed,
  validationState,
  onBlur,
  touched,
}: Props) {
  const [agePreference, setAgePreference] = useState<PreferedAgeInputData>({
    minAge: {
      value: initialValues?.minAge?.toString() ?? "",
      enabled: !!initialValues?.minAge,
    },
    maxAge: {
      value: initialValues?.maxAge?.toString() ?? "",
      enabled: !!initialValues?.maxAge,
    },
  });

  useEffect(() => {
    if (onChange === undefined) {
      return;
    }
    const parsedMinAge = parseInt(agePreference.minAge.value);
    const parsedMaxAge = parseInt(agePreference.maxAge.value);

    onChange({
      minAge: isNaN(parsedMinAge) ? undefined : parsedMinAge,
      maxAge: isNaN(parsedMaxAge) ? undefined : parsedMaxAge,
    });
  }, [agePreference]);

  if (changed !== undefined && initialValues !== undefined) {
    changed =
      changed &&
      !(
        !!initialValues.minAge &&
        !agePreference.minAge.enabled &&
        !!initialValues.maxAge &&
        !agePreference.maxAge.enabled
      );
  }

  const minAgeValid = !isNaN(parseInt(agePreference.minAge.value));
  const maxAgeValid = !isNaN(parseInt(agePreference.maxAge.value));

  return (
    <div>
      {changed !== undefined && (
        <Form.Label
          className={`profile-field-label ${changed ? "changed" : ""}`}
        >
          Age preference{changed && "*"}
        </Form.Label>
      )}
      <div className="age-preference-fields-container">
        <InputGroup>
          <InputGroup.Checkbox
            checked={agePreference.minAge.enabled}
            onChange={(e) =>
              setAgePreference((data) => ({
                ...data,
                minAge: { ...data.minAge, enabled: e.target.checked },
              }))
            }
          />
          <Form.Control
            disabled={!agePreference.minAge.enabled}
            placeholder="Prefered min age"
            type="number"
            value={
              agePreference.minAge.enabled ? agePreference.minAge.value : ""
            }
            onChange={(e) =>
              setAgePreference((data) => ({
                ...data,
                minAge: { ...data.minAge, value: e.target.value },
              }))
            }
            isInvalid={
              touched &&
              (!minAgeValid || validationState?.minAgeError !== undefined)
            }
            onBlur={onBlur}
          />
          <Form.Control.Feedback>
            {minAgeValid
              ? validationState!.minAgeError
              : INVALID_NUMBER_MESSAGE}
          </Form.Control.Feedback>
        </InputGroup>
        <InputGroup>
          <InputGroup.Checkbox
            disabled={!agePreference.minAge.enabled}
            checked={
              agePreference.minAge.enabled && agePreference.maxAge.enabled
            }
            onChange={(e) =>
              setAgePreference((data) => ({
                ...data,
                maxAge: { ...data.maxAge, enabled: e.target.checked },
              }))
            }
          />
          <Form.Control
            disabled={
              !agePreference.maxAge.enabled || !agePreference.minAge.enabled
            }
            placeholder="Prefered max age"
            type="number"
            value={
              agePreference.maxAge.enabled && agePreference.minAge.enabled
                ? agePreference.maxAge.value
                : ""
            }
            onChange={(e) =>
              setAgePreference((data) => ({
                ...data,
                maxAge: {
                  ...data.maxAge,
                  value: e.target.value,
                },
              }))
            }
            isInvalid={
              touched &&
              (!maxAgeValid || validationState?.maxAgeError !== undefined)
            }
            onBlur={onBlur}
          />
          <Form.Control.Feedback>
            {maxAgeValid
              ? validationState!.maxAgeError
              : INVALID_NUMBER_MESSAGE}
          </Form.Control.Feedback>
        </InputGroup>
      </div>
    </div>
  );
}
