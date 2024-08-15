import NavigationBarButton from "./NavigationBarButton";
import "./NavigationBar.css";
import { BsFillPersonFill, BsChat, BsSearch } from "react-icons/bs";

export default function NavigationBar() {
  return (
    <div className="nav-bar">
      <NavigationBarButton page="account" icon={<BsFillPersonFill />} />
      <NavigationBarButton page="" icon={<BsSearch />} />
      <NavigationBarButton page="matches" icon={<BsChat />} />
    </div>
  );
}
