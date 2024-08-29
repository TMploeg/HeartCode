import Profile from "../profile-page/Profile";
import { Button, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { User } from "../../models/User";
import { useApi } from "../../hooks";
import { BsHeart, BsXLg, BsBalloonHeartFill } from "react-icons/bs";
import "./Browsing.css";
import AppSpinner from "../general/app-spinner/AppSpinner";

export default function Browsing() {
  const [user, setUser] = useState<User>();
  const [currentUser, setCurrentUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(false);

  const { get, post } = useApi();

  useEffect(() => {
    get<User>("users/account")
      .then((response) => {
        setCurrentUser(response.data);
      })
      .then(getRandomUser);
  }, []);

  async function getRandomUser() {
    setLoading(true);

    const response = await get<User>("users/get-random-user");

    switch (response.status) {
      case 200:
        setUser(response.data);
        break;
      case 204:
        console.warn("There are no more users left to evaluate");
    }

    setLoading(false);
  }

  async function createEvaluation(likedBool: boolean) {
    await post("evaluations/create-evaluation-and-check", {
      evaluatorAddress: currentUser?.email,
      evaluateeAddress: user?.email,
      liked: likedBool,
    }).catch((error) => console.log(error.response.data));

    setUser(undefined);
    await getRandomUser();
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
