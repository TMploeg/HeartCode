import { User } from "../../models/User";
import { Card, Button } from "react-bootstrap";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import Gender from "../../enums/Gender";
import { AppRoute } from "../../enums/AppRoute";
import { useProfilePicture } from "../../hooks";

interface Props {
  user: User;
  isPersonalPage: boolean;
}

export default function Profile({ user, isPersonalPage }: Props) {
  const navigate = useNavigate();
  const getProfilePictureURL = useProfilePicture();

  return (
    <div className="profile-page">
      <Card className="profile-card">
        <Card.Img
          variant="top"
          src={getProfilePictureURL(user.profilePictureId)}
        />
        <Card.Body className="card-content">
          <Card.Title>{user.alias}</Card.Title>
          <Card.Subtitle className="card-content">
            [age] {convertGender(user.gender)}
          </Card.Subtitle>
          <Card.Subtitle>Relationship type</Card.Subtitle>
          <Card className="bio">
            <Card.Text>Bio text goes here</Card.Text>
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
