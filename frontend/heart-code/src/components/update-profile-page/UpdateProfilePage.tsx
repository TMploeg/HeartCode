import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks";
import { useEffect, useState } from "react";
import { User } from "../../models/User";
import { Button, Card, Form, ListGroup } from "react-bootstrap";
import "./UpdateProfilePage.css";
import Spinner from "react-bootstrap/Spinner";
import { genders } from "../../enums/Gender";

interface UpdateValue {
  value: any;
  changed: boolean;
}

export default function UpdateProfilePage() {
  const { get, patch } = useApi();
  const [userInfo, setUserInfo] = useState<User>();
  const navigate = useNavigate();
  useEffect(getUserInfo, []);
  useEffect(loadUserInfo, [userInfo]);

  const [updateValues, setUpdateValues] = useState<{
    [key: string]: UpdateValue;
  }>();

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
                defaultValue={userInfo.gender.name}
                onChange={(event) =>
                  setUpdateValues((values) => ({
                    ...values,
                    gender: {
                      value: event.target.value,
                      changed: userInfo.gender.name !== event.target.value,
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
    if (!updateValues) {
      return;
    }

    const updatedFields = {
      alias: updateValues.alias.changed ? updateValues.alias.value : undefined,
      gender: updateValues.gender.changed
        ? updateValues.gender.value
        : undefined,
    };

    patch("users/account", updatedFields)
      .then(() => navigateBack())
      .catch(() => alert("failed to save changes"));
  }

  function navigateBack(): void {
    navigate("/account");
  }
}
