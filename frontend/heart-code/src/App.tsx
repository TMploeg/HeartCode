import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import MatchesPage from "./components/matches-page/MatchesPage";
import NavigationBar from "./components/navigationbar/NavigationBar";
import RegisterPage from "./components/auth/register-page/RegisterPage";
import ProfilePage from "./components/profile-page/PersonalPage";
import ChatPage from "./components/chat/ChatPage";
import LoginPage from "./components/auth/login-page/LoginPage";
import UpdateProfilePage from "./components/update-profile-page/UpdateProfilePage";
import { AppRoute } from "./enums/AppRoute";

export default function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      <div className="page">
        <Routes>
          <Route path={AppRoute.HOME} element={<div>Hello, HeartCode!</div>} />
          <Route path={AppRoute.MATCHES} element={<MatchesPage />} />
          <Route path={AppRoute.CHAT} element={<ChatPage />} />
          <Route path={AppRoute.REGISTER} element={<RegisterPage />} />
          <Route path={AppRoute.LOGIN} element={<LoginPage />} />
          <Route path={AppRoute.ACCOUNT} element={<ProfilePage />} />
          <Route
            path={AppRoute.ACCOUNT_UPDATE}
            element={<UpdateProfilePage />}
          />
        </Routes>
        <div className="nav-bar">
          <NavigationBar currentPage={location.pathname} />
        </div>
      </div>
    </div>
  );
}
