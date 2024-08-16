import Profile from "../profile-page/Profile";
import { useEffect, useState } from "react";
import { User } from "../../models/User";
import { useApi } from "../../hooks";

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
        <Profile user={user} isPersonalPage={true} />
      ) : (
        "Loading..."
      )}
    </div>
  );
}
