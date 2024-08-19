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
    if (profilePictureData != undefined) {
      setUpdateValues((values) => ({
        ...values,
        profilePicture: {
          value: profilePictureData.data,
          changed: true,
        },
      }));
    }
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
      <Card border="primary">
        <Card.Header>Edit</Card.Header>
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

    const updatedFields = {
      alias: updateValues.alias.changed ? updateValues.alias.value : undefined,
      gender: updateValues.gender.changed
        ? updateValues.gender.value
        : undefined,
      profilePicture: updateValues.profilePicture.changed
        ? updateValues.profilePicture.value
        : undefined,
    };

    patch("users/account", updatedFields)
      .then(navigateBack)
      .catch(() => alert("failed to save changes"));
  }

  function navigateBack(): void {
    navigate(AppRoute.ACCOUNT);
  }
}
