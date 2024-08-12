import { User } from "../../models/User";
import { Card, Button } from "react-bootstrap";
import "./Profile.css";
import { Navigate, useNavigate } from "react-router-dom";

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
          <Card.Subtitle className="">Gender, age</Card.Subtitle>
          <Card.Subtitle>Relationship type</Card.Subtitle>
          <Card className="bio">
            <Card.Text>Bio text goes here</Card.Text>
          </Card>
        </Card.Body>
        {/* Needs to navigate to edit profile page later*/}
        {isPersonalPage ? (
          <Button className="edit-button" onClick={() => navigate("update")}>
            Edit
          </Button>
        ) : (
          <></>
        )}
      </Card>
    </div>
  );
}
