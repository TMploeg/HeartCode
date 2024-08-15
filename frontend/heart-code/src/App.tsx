import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import MatchesPage from "./components/matches-page/MatchesPage";
import NavigationBar from "./components/navigationbar/NavigationBar";
import RegisterPage from "./components/auth/register-page/RegisterPage";
import ProfilePage from "./components/profile-page/PersonalPage";
import ChatPage from "./components/chat/ChatPage";
import LoginPage from "./components/auth/login-page/LoginPage";
import UpdateProfilePage from "./components/update-profile-page/UpdateProfilePage";
import { useAuthentication } from "./hooks";
import { useEffect, useState } from "react";

export default function App() {
  const { isLoggedIn } = useAuthentication();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  useEffect(() => {
    setInterval(checkLoggedIn, 60000);
  }, []);

  return (
    <div className="app-container">
      <div className="page">
        <Routes>
          {getRoutes()}
          {/* <Route path="*" element={<Navigate to="/" />} /> */}
        </Routes>
        {loggedIn && (
          <div className="nav-bar">
            <NavigationBar />
          </div>
        )}
      </div>
    </div>
  );

  function getRoutes() {
    return loggedIn ? (
      <>
        <Route path="/" element={<div>Hello, HeartCode!</div>} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/account" element={<ProfilePage />} />
        <Route path="/account/update" element={<UpdateProfilePage />} />
      </>
    ) : (
      <>
        <Route path="/" element={<Navigate to="login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </>
    );
  }

  function checkLoggedIn() {
    isLoggedIn().then((isLoggedIn) => setLoggedIn(isLoggedIn));
  }
}
