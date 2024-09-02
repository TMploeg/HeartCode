import { useEffect, useState } from "react";
import Browsing from "./Browsing.tsx";
import { User } from "../../models/User.ts";
import useApi from "../../hooks/useApi.ts";

export default function BrowsingPage() {
  useEffect(() => {
    const handleGetRandomUserEvent = async () => {
      await getRandomUser();
    };

    window.addEventListener("onGetRandomUserEvent", handleGetRandomUserEvent);

    return () =>
      removeEventListener("onGetRandomUserEvent", handleGetRandomUserEvent);
  }, []);

  const [user, setUser] = useState<User>();
  const { get } = useApi();
  const [loading, setLoading] = useState<boolean>(false);

  async function getRandomUser() {
    setLoading(true);
    setUser(undefined);

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

  return <Browsing user={user} loading={loading}></Browsing>;
}
