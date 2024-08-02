import NavigationBarButton from "./NavigationBarButton";
import "./NavigationBar.css";

export default function NavigationBar() {
  return (
    <div className="nav-bar">
      <NavigationBarButton page="" pageName="Home" />
      <NavigationBarButton page="matches" pageName="Chat" />
    </div>
  );
}
