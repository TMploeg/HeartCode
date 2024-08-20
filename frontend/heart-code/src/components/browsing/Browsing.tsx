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
  const { get } = useApi();

  useEffect(() => {
    get<User>("users/get-random-user").then((response) => {
      setUser(response.data);
    });
  }, []);

  return (
    <div className="browse">
      {user !== undefined && user !== null ? (
        <div>
          <Profile user={user} isPersonalPage={false} />
          <Button className="evaluationButton" variant="success">
            <BsHandThumbsUpFill />
          </Button>
          <Button className="evaluationButton" variant="danger">
            <BsHandThumbsDownFill />
          </Button>
        </div>
      ) : (
        "Loading..."
      )}
    </div>
  );
}
