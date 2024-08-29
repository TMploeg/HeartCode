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

  const [agePreferenceEnabled, setAgePreferenceEnabled] = useState<boolean>(!!initialValues?.minAge || !!initialValues?.maxAge);

  useEffect(() => {
    if (onChange === undefined) {
      return;
    }

    onChange(parseAgePreferences());
  }, [agePreference]);

  if (changed !== undefined && initialValues !== undefined) {
    changed =
      changed &&
      !(
        !agePreferenceEnabled &&
        !!initialValues.minAge &&
        !!initialValues.maxAge 
      );
  }

  useEffect(() => {
    onChange?.(agePreferenceEnabled ? parseAgePreferences() : {});
  }, [agePreferenceEnabled])

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
        <Form.Check type="switch" checked={agePreferenceEnabled} onChange={(event) => setAgePreferenceEnabled(event.target.checked)}/>
        <InputGroup>
          <Form.Control
            disabled={!agePreferenceEnabled}
            placeholder="Prefered min age"
            type="number"
            value={agePreferenceEnabled ? agePreference.minAge.value : ""}
            onChange={(e) =>
              setAgePreference((data) => ({
                ...data,
                minAge: { ...data.minAge, value: e.target.value },
              }))
            }
            isInvalid={
              touched &&
              agePreferenceEnabled &&
              (!minAgeValid || validationState?.minAgeError !== undefined)
            }
            onBlur={onBlur}
          />
          <Form.Control.Feedback type="invalid">
            {minAgeValid
              ? validationState?.minAgeError
              : INVALID_NUMBER_MESSAGE}
          </Form.Control.Feedback>
        </InputGroup>
        <InputGroup>
          <Form.Control
            disabled={!agePreferenceEnabled}
            placeholder="Prefered max age"
            type="number"
            value={
              agePreferenceEnabled
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
              agePreferenceEnabled &&
              (!maxAgeValid || validationState?.maxAgeError !== undefined)
            }
            onBlur={onBlur}
          />
          <Form.Control.Feedback type="invalid">
            {maxAgeValid
              ? validationState?.maxAgeError
              : INVALID_NUMBER_MESSAGE}
          </Form.Control.Feedback>
        </InputGroup>
      </div>
    </div>
  )

  function parseAgePreferences() : AgePreference {
    const parsedMinAge = parseInt(agePreference.minAge.value);
    const parsedMaxAge = parseInt(agePreference.maxAge.value);

    return {
      minAge: isNaN(parsedMinAge) ? undefined : parsedMinAge,
      maxAge: isNaN(parsedMaxAge) ? undefined : parsedMaxAge,
    };
  }
}
