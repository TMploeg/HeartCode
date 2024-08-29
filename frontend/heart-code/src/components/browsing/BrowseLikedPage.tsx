import { useEffect, useState } from "react";
import Browsing from "./Browsing.tsx";
import { User } from "../../models/User.ts";
import useApi from "../../hooks/useApi.ts";

export default function BrowseLikedPage() {
  useEffect(() => {
    getRandomUser();

    const handleGetRandomUserEvent = async () => {
      setUser(undefined);
      console.log("BrowseLikedPage: event received from child");
      await getRandomUser();
    };

    window.addEventListener("onGetRandomUserEvent", handleGetRandomUserEvent);

    return () =>
      removeEventListener("onGetRandomUserEvent", handleGetRandomUserEvent);
  }, []);

  const [user, setUser] = useState<User>();
  const { get } = useApi();

  async function getRandomUser() {
    const response = await get<User>("users/get-random-liked-user");
    switch (response.status) {
      case 200:
        setUser(response.data);
        break;
      case 204:
        console.warn("There are no more users left to evaluate");
    }
  }

  return <Browsing user={user}></Browsing>;
}
