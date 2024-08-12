import NavigationBarButton from "./NavigationBarButton";
import "./NavigationBar.css";
import {
  BsFillPersonFill,
  BsChat,
  BsHouseDoorFill,
  BsPersonPlusFill,
  BsFilePersonFill,
} from "react-icons/bs";

export default function NavigationBar() {
  return (
    <div className="nav-bar">
      <NavigationBarButton page="account" icon={<BsFillPersonFill />} />
      <NavigationBarButton page="" icon={<BsHouseDoorFill />} />
      <NavigationBarButton page="matches" icon={<BsChat />} />
      <NavigationBarButton page="register" icon={<BsPersonPlusFill />} />
      <NavigationBarButton page="login" icon={<BsFilePersonFill />} />
    </div>
  );
}
