import { useEffect, useState } from "react";
import { User } from "../../models/User";
import { useApi } from "../../hooks";
import Profile from "./Profile";

export default function PersonalPage() {
  const [user, setUser] = useState<User>();
  const { get } = useApi();

  useEffect(() => {
    get<User>("users/account").then((response) => {
      setUser(response.data);
      console.log(user);
    });
  }, []);

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
