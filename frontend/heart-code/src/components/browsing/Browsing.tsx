import Profile from "../profile-page/Profile";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { User } from "../../models/User";
import { useApi } from "../../hooks";
import {
  BsHandThumbsUpFill,
  BsHandThumbsDownFill,
  BsArrowThroughHeartFill,
  BsBalloonHeartFill,
} from "react-icons/bs";
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

  async function getRandomUser() {
    try {
      const response = await get<User>("users/get-random-user");
      setUser(response.data);
    } catch {
      console.warn("There are no more users left to evaluate");
      return;
    }
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

  return (
    <div className="browse">
      {user !== undefined && user !== null ? (
        <div>
          <Profile user={user} isPersonalPage={false} />
          <div className="buttonContainer">
            <Button
              className="evaluationButton"
              onClick={() => createEvaluation(false)}
              variant="danger"
            >
              <BsHandThumbsDownFill />
            </Button>
            <Button
              className="evaluationButton"
              onClick={() => createEvaluation(true)}
              variant="success"
            >
              <BsHandThumbsUpFill />
            </Button>
          </div>
        </div>
      ) : (
        <div className="noMoreUsersError">
          <BsBalloonHeartFill className="errorImage" />
          <div className="errorText">There are no more users available.</div>
        </div>
      )}
    </div>
  );
}
