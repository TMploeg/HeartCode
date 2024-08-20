import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import MatchesPage from "./components/matches-page/MatchesPage";
import NavigationBar from "./components/navigationbar/NavigationBar";
import RegisterPage from "./components/auth/register-page/RegisterPage";
import ProfilePage from "./components/profile-page/PersonalPage";
import ChatPage from "./components/chat/ChatPage";
import LoginPage from "./components/auth/login-page/LoginPage";
import UpdateProfilePage from "./components/update-profile-page/UpdateProfilePage";
import BrowsingPage from "./components/browsing/BrowsingPage";
import { useAuthentication } from "./hooks";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { AppRoute } from "./enums/AppRoute";

export default function App() {
  const { isLoggedIn, addLogoutListener } = useAuthentication();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    setInterval(() => {
      checkLoggedIn();
    }, 1000);
  }, []);
  useEffect(() => addLogoutListener(() => setLoggedIn(false)), []);
  useEffect(() => {
    if (loggedIn === false) {
      navigate("/");
    }
  }, [loggedIn]);

  return (
    <div className="app-container">
      {loggedIn === null ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <>
          <div className="page">
            <Routes>
              {getRoutes()}
              <Route
                path={AppRoute.ANY}
                element={<Navigate to={AppRoute.HOME} />}
              />
            </Routes>
          </div>
          {loggedIn && <NavigationBar currentPage={location.pathname} />}
        </>
      )}
    </div>
  );

  function getRoutes() {
    return loggedIn ? (
      <>
        <Route path={AppRoute.HOME} element={<div>Hello, HeartCode!</div>} />
        <Route path={AppRoute.MATCHES} element={<MatchesPage />} />
        <Route path={AppRoute.CHAT} element={<ChatPage />} />
        <Route path={AppRoute.ACCOUNT} element={<ProfilePage />} />
        <Route path={AppRoute.ACCOUNT_UPDATE} element={<UpdateProfilePage />} />
        <Route path={AppRoute.BROWSE} element={<BrowsingPage />} />
      </>
    ) : (
      <>
        <Route path={AppRoute.HOME} element={<Navigate to="login" />} />
        <Route
          path={AppRoute.LOGIN}
          element={<LoginPage onLogin={handleAuthenticated} />}
        />
        <Route
          path={AppRoute.REGISTER}
          element={<RegisterPage onRegister={handleAuthenticated} />}
        />
      </>
    );
  }

  async function checkLoggedIn(): Promise<boolean> {
    const loggedIn: boolean = (await isLoggedIn()) ?? false;

    setLoggedIn(loggedIn);

    return loggedIn;
  }

  function handleAuthenticated() {
    checkLoggedIn().then((loggedIn) => {
      if (loggedIn) {
        navigate(AppRoute.HOME);
      }
    });
  }
}
