import NavigationBarButton from "./NavigationBarButton";
import "./NavigationBar.css";

export default function NavigationBar() {
  return (
    <div className="nav-bar">
      <NavigationBarButton page="account" pageName="User" />
      <NavigationBarButton page="" pageName="Home" />
      <NavigationBarButton page="matches" pageName="Chat" />
      <NavigationBarButton page="register" pageName="Register" />
      <NavigationBarButton page="login" pageName="Login" />
    </div>
  );
}
