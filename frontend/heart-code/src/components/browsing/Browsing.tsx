import Profile from "../profile-page/Profile";
import { Button, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { User } from "../../models/User";
import { useApi } from "../../hooks";
import { BsHeart, BsXLg, BsBalloonHeartFill } from "react-icons/bs";
import "./Browsing.css";
import AppSpinner from "../general/app-spinner/AppSpinner";

interface BrowsingProps {
  user?: User;
  loading: boolean;
}

export default function Browsing({ user, loading }: BrowsingProps) {
  const [currentUser, setCurrentUser] = useState<User>();
  const event = new CustomEvent("onGetRandomUserEvent");

  const { get, post } = useApi();

  useEffect(() => {
    get<User>("users/account")
      .then((response) => {
        setCurrentUser(response.data);
      })
      .then(getRandomUser);
  }, []);

  async function getRandomUser() {
    window.dispatchEvent(event);
  }

  async function createEvaluation(likedBool: boolean) {
    await post("evaluations/create-evaluation-and-check", {
      evaluatorAddress: currentUser?.email,
      evaluateeAddress: user?.email,
      liked: likedBool,
    }).catch((error) => console.log(error.response.data));

    window.dispatchEvent(event);
  }

  const pageContent = loading ? (
    <AppSpinner />
  ) : user !== undefined && user !== null ? (
    <UserDisplay
      user={user}
      onLike={() => createEvaluation(true)}
      onDislike={() => createEvaluation(false)}
    />
  ) : (
    <NoMoreUsersDisplay />
  );
  return <div className="browse">{pageContent}</div>;
}

interface UserDisplayProps {
  user: User;
  onLike: () => void;
  onDislike: () => void;
}

function UserDisplay({ user, onLike, onDislike }: UserDisplayProps) {
  return (
    <div className="profile">
      <Profile user={user} isPersonalPage={false} />
      <div className="buttonContainer">
        <Button
          className="evaluationButton"
          variant="outline-secondary"
          onClick={onDislike}
        >
          <BsXLg />
        </Button>
        <Button
          className="evaluationButton"
          variant="outline-secondary"
          onClick={onLike}
        >
          <BsHeart />
        </Button>
      </div>
    </div>
  );
}

function NoMoreUsersDisplay() {
  return (
    <div className="noMoreUsersError">
      <BsBalloonHeartFill className="errorImage" />
      <div className="errorText">There are no more users available.</div>
    </div>
  );
}
