import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User } from "../../models/User";
import { Button, Card, Form, ListGroup } from "react-bootstrap";
import "./UpdateProfilePage.css";
import Spinner from "react-bootstrap/Spinner";
import { genders } from "../../enums/Gender";
import { AppRoute } from "../../enums/AppRoute";
import ProfilePictureInput, {
  ImageData,
} from "../general/profile-picture-input/ProfilePictureInput";
import { useApi, useProfilePicture } from "../../hooks";
import { genderPreferences } from "../../enums/GenderPreference";
import { relationshipTypes } from "../../enums/RelationshipType";
import AgePreferenceInput from "../general/age-preference-input/AgePreferenceInput";

interface UpdateValue {
  value: any;
  changed: boolean;
}

export default function UpdateProfilePage() {
  const { get, patch } = useApi();
  const [userInfo, setUserInfo] = useState<User>();
  const navigate = useNavigate();
  const getProfilePictureURL = useProfilePicture();

  useEffect(getUserInfo, []);
  useEffect(loadUserInfo, [userInfo]);

  const [updateValues, setUpdateValues] = useState<{
    [key: string]: UpdateValue;
  }>();
  const [profilePictureData, setProfilePictureData] = useState<
    ImageData | undefined
  >(undefined);

  useEffect(() => {
    if (profilePictureData === undefined) {
      return;
    }

    setUpdateValues((values) => ({
      ...values,
      profilePicture: {
        value: profilePictureData.data,
        changed: true,
      },
    }));
  }, [profilePictureData]);

  if (!updateValues || !userInfo) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="update-profile-form-container">
      <Card className="edit-profile-page">
        <Card.Header>Edit Profile</Card.Header>
        <Card.Body>
          <ListGroup>
            <ListGroup.Item>
              <div className="profile-picture-input-container">
                <ProfilePictureInput
                  value={profilePictureData}
                  onChange={setProfilePictureData}
                  initialValueURL={getProfilePictureURL(
                    userInfo.profilePictureId
                  )}
                />
              </div>
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Label
                className={`profile-field-label ${
                  updateValues.alias.changed ? "changed" : ""
                }`}
              >
                Alias{updateValues.alias.changed ? "*" : ""}
              </Form.Label>
              <Form.Control
                value={updateValues.alias.value}
                onChange={(event) =>
                  setUpdateValues((values) => ({
                    ...values,
                    alias: {
                      value: event.target.value,
                      changed: (userInfo.alias ?? "") !== event.target.value,
                    },
                  }))
                }
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Label
                className={`profile-field-label ${
                  updateValues.gender.changed ? "changed" : ""
                }`}
              >
                Gender{updateValues.gender.changed ? "*" : ""}
              </Form.Label>
              <Form.Select
                defaultValue={userInfo.gender}
                onChange={(event) =>
                  setUpdateValues((values) => ({
                    ...values,
                    gender: {
                      value: event.target.value,
                      changed: userInfo.gender !== event.target.value,
                    },
                  }))
                }
              >
                {genders.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender.split("_").join(" ")}
                  </option>
                ))}
              </Form.Select>
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Label
                className={`profile-field-label ${
                  updateValues.genderPreference.changed ? "changed" : ""
                }`}
              >
                Gender Preference
                {updateValues.genderPreference.changed ? "*" : ""}
              </Form.Label>
              <Form.Select
                defaultValue={userInfo.genderPreference}
                onChange={(event) =>
                  setUpdateValues((values) => ({
                    ...values,
                    genderPreference: {
                      value: event.target.value,
                      changed: userInfo.genderPreference !== event.target.value,
                    },
                  }))
                }
              >
                {genderPreferences.map((genderPreference) => (
                  <option key={genderPreference} value={genderPreference}>
                    {genderPreference}
                  </option>
                ))}
              </Form.Select>
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Label
                className={`profile-field-label ${
                  updateValues.relationshipType.changed ? "changed" : ""
                }`}
              >
                Relationship Type
                {updateValues.relationshipType.changed ? "*" : ""}
              </Form.Label>
              <Form.Select
                defaultValue={userInfo.relationshipType}
                onChange={(event) =>
                  setUpdateValues((values) => ({
                    ...values,
                    relationshipType: {
                      value: event.target.value,
                      changed: userInfo.relationshipType !== event.target.value,
                    },
                  }))
                }
              >
                {relationshipTypes.map((relationshipType) => (
                  <option key={relationshipType} value={relationshipType}>
                    {relationshipType}
                  </option>
                ))}
              </Form.Select>
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Label
                className={`profile-field-label ${
                  updateValues.bio.changed ? "changed" : ""
                }`}
              >
                Bio{updateValues.bio.changed ? "*" : ""}
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={updateValues.bio.value}
                onChange={(event) =>
                  setUpdateValues((values) => ({
                    ...values,
                    bio: {
                      value: event.target.value,
                      changed: (userInfo.bio ?? "") !== event.target.value,
                    },
                  }))
                }
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <AgePreferenceInput
                initialValues={userInfo.agePreference}
                onChange={(newValue) => {
                  setUpdateValues((values) => ({
                    ...values,
                    agePreference: {
                      value: newValue,
                      changed:
                        newValue.minAge != userInfo.agePreference.minAge ||
                        newValue.maxAge != userInfo.agePreference.maxAge,
                    },
                  }));
                }}
                changed={updateValues.agePreference.changed}
              />
            </ListGroup.Item>
          </ListGroup>
          <Button
            className="profile-update-save-button"
            variant="primary"
            disabled={!canSave()}
            onClick={save}
          >
            Save
          </Button>
        </Card.Body>
      </Card>
    </div>
  );

  function getUserInfo() {
    get<User>("users/account")
      .then((response) => setUserInfo(response.data))
      .catch(() => navigateBack());
  }

  function loadUserInfo() {
    if (!userInfo) {
      return;
    }

    setUpdateValues({
      alias: { value: userInfo.alias, changed: false },
      gender: { value: userInfo.gender, changed: false },
      bio: { value: userInfo.bio, changed: false },
      genderPreference: { value: userInfo.genderPreference, changed: false },
      relationshipType: { value: userInfo.relationshipType, changed: false },
      agePreference: { value: userInfo.agePreference, changed: false },
    });
  }

  function canSave() {
    return (
      updateValues &&
      Object.values(updateValues).findIndex((value) => value.changed) !== -1
    );
  }

  function save() {
    if (!userInfo || !updateValues || !profilePictureData) {
      console.error("one or more values is undefined");
      return;
    }

    const patchBody: { [key: string]: any } = {};
    for (let key of Object.keys(updateValues)) {
      if (updateValues[key].changed) {
        patchBody[key] = updateValues[key].value;
      }
    }

    patch("users/account", patchBody)
      .then(navigateBack)
      .catch(() => alert("failed to save changes"));
  }

  function navigateBack(): void {
    navigate(AppRoute.ACCOUNT);
  }
}
