import { User } from "../../models/User";

interface Props {
  user: User;
  isPersonalPage: boolean;
}

export default function Profile({ user, isPersonalPage }: Props) {
  return <p>{user.alias}</p>;
}
