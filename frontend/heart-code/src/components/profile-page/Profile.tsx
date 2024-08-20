import { User } from "../../models/User";
import { Card, Button } from "react-bootstrap";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import Gender from "../../enums/Gender";
import { AppRoute } from "../../enums/AppRoute";
import { useAuthentication, useProfilePicture } from "../../hooks";
import { BsBoxArrowRight, BsFillGearFill } from "react-icons/bs";

interface Props {
  user: User;
  isPersonalPage: boolean;
}

export default function Profile({ user, isPersonalPage }: Props) {
  const navigate = useNavigate();
  const getProfilePictureURL = useProfilePicture();
  const { logout } = useAuthentication();

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
            {convertGender(user.gender)}, {user.age}
          </Card.Subtitle>
          <Card.Subtitle>{user.relationshipType}</Card.Subtitle>
          <Card className="bio">
            <Card.Text>{user.bio}</Card.Text>
          </Card>
        </Card.Body>
        {isPersonalPage && (
          <div className="profile-page-bottom-buttons">
            <Button
              className="profile-page-bottom-button"
              onClick={() => navigate(AppRoute.ACCOUNT_UPDATE)}
            >
              <BsFillGearFill />
            </Button>
            <Button
              className="profile-page-bottom-button"
              onClick={() => logout()}
            >
              <BsBoxArrowRight />
            </Button>
          </div>
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
