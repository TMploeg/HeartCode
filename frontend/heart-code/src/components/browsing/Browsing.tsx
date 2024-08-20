import Profile from "../profile-page/Profile";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { User } from "../../models/User";
import { useApi } from "../../hooks";
import { BsHandThumbsUpFill } from "react-icons/bs";
import { BsHandThumbsDownFill } from "react-icons/bs";
import "./Browsing.css";

export default function Browsing() {
  const [user, setUser] = useState<User>();
  const [currentUser, setCurrentUser] = useState<User>();
  const { get, post } = useApi();

  useEffect(() => {
    getRandomUser();

    get<User>("users/account").then((response) => {
      setCurrentUser(response.data);
    });
  }, []);

  function getRandomUser() {
    get<User>("users/get-random-user").then((response) => {
      setUser(response.data);
    });
  }

  function createEvaluation(likedBool: boolean) {
    console.log("You pressed the button for " + likedBool);
    console.log("You evaluated " + user?.email);
    console.log("You are currently logged in as: " + currentUser?.email);

    post("evaluations/create-evaluation-and-check", {
      evaluatorAddress: currentUser?.email,
      evaluateeAddress: user?.email,
      liked: likedBool,
    }).catch((error) => console.log(error.response.data));
    getRandomUser();
  }

  return (
    <div className="browse">
      {user !== undefined && user !== null ? (
        <div>
          <Profile user={user} isPersonalPage={false} />
          <Button
            className="evaluationButton"
            onClick={() => createEvaluation(true)}
            variant="success"
          >
            <BsHandThumbsUpFill />
          </Button>
          <Button
            className="evaluationButton"
            onClick={() => createEvaluation(false)}
            variant="danger"
          >
            <BsHandThumbsDownFill />
          </Button>
        </div>
      ) : (
        "No more results available."
      )}
    </div>
  );
}
