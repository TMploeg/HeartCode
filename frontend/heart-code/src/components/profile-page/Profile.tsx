import { User } from "../../models/User";
import { Card, Button } from "react-bootstrap";
import "./Profile.css";

interface Props {
  user: User;
  isPersonalPage: boolean;
}

export default function Profile({ user, isPersonalPage }: Props) {
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
            Gender {user.dateOfBirth}
          </Card.Subtitle>
          <Card.Subtitle>Relationship type</Card.Subtitle>
          <Card className="bio">
            <Card.Text>Bio text goes here</Card.Text>
          </Card>
        </Card.Body>
        {/* Needs to navigate to edit profile page later*/}
        {isPersonalPage ? <Button className="edit-button">Edit</Button> : <></>}
      </Card>
    </div>
  );
}
