import { useEffect, useState } from "react";
import { User } from "../../models/User";
import { useApi } from "../../hooks";
import Profile from "./Profile";
// import { useParams } from "react-router-dom";

export default function AccountPage() {
  const [user, setUser] = useState<User>();
  const { get } = useApi();

  useEffect(() => {
    get<User>("users/account").then((response) => {
      setUser(response.data);
    });
  }, []);

  //_______________________________________________________
  //   const { userID } = useParams();
  //   const [user, setUser] = useState<User>();
  //   useEffect(() => {
  //     get<User>(`users/${userID}`).then((response) => {
  //       setUser(response.data);
  //     });
  //   }, []);
  //_______________________________________________________

  return (
    <div className="personal-page">
      {user !== undefined && user !== null ? (
        <Profile user={user} isPersonalPage={true} />
      ) : (
        "Loading..."
      )}
    </div>
  );
}
