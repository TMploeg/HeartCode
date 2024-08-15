import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import MatchesPage from "./components/matches-page/MatchesPage";
import NavigationBar from "./components/navigationbar/NavigationBar";
import RegisterPage from "./components/auth/register-page/RegisterPage";
import ProfilePage from "./components/profile-page/PersonalPage";
import ChatPage from "./components/chat/ChatPage";
import LoginPage from "./components/auth/login-page/LoginPage";
import UpdateProfilePage from "./components/update-profile-page/UpdateProfilePage";
import { useEffect } from "react";

export default function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      <div className="page">
        <Routes>
          <Route path="" element={<div>Hello, HeartCode!</div>} />
          <Route path="matches" element={<MatchesPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="account" element={<ProfilePage />} />
          <Route path="account/update" element={<UpdateProfilePage />} />
        </Routes>
        <div className="nav-bar">
          <NavigationBar currentPage={location.pathname} />
        </div>
      </div>
    </div>
  );
}
