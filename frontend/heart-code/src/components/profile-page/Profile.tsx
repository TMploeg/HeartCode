import { User } from "../../models/User";
import { Card, Button } from "react-bootstrap";
import "./Profile.css";
import { Navigate, useNavigate } from "react-router-dom";
import Gender from "../../enums/Gender";
import { AppRoute } from "../../enums/AppRoute";

interface Props {
  user: User;
  isPersonalPage: boolean;
}

export default function Profile({ user, isPersonalPage }: Props) {
  const navigate = useNavigate();

  return (
    <div className="profile-page">
      <Card className="profile-card">
        <Card.Img
          variant="top"
          src="https://optimaldataintelligence.com/wp-content/themes/optimaldataintelligence/images/image-not-found.png"
        />
        <Card.Body className="card-content">
          <Card.Title>{user.alias}</Card.Title>
          <Card.Subtitle className="card-content">
            [age] {convertGender(user.gender)}
          </Card.Subtitle>
          <Card.Subtitle>Relationship type</Card.Subtitle>
          <Card className="bio">
            <Card.Text>{user.bio}</Card.Text>
          </Card>
        </Card.Body>
        {isPersonalPage ? (
          <Button
            className="edit-button"
            onClick={() => navigate(AppRoute.ACCOUNT_UPDATE)}
          >
            Edit
          </Button>
        ) : (
          <></>
        )}
      </Card>
    </div>
  );

  function convertGender(gender: string): string {
    return gender === Gender.PREFER_NOT_TO_SAY
      ? "gender not specified"
      : gender;
  }
}
