import { Route, Routes } from "react-router-dom";
import "./App.css";
import MatchesPage from "./components/matches-page/MatchesPage";
import NavigationBar from "./components/navigationbar/NavigationBar";
import RegisterPage from "./components/auth/register-page/RegisterPage";
import ChatPage from "./components/chat/ChatPage";
import LoginPage from "./components/auth/login-page/LoginPage";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="" element={<div>Hello, HeartCode!</div>} />
        <Route path="matches" element={<MatchesPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
      </Routes>
      <NavigationBar />
    </div>
  );
}
