import { Route, Routes } from "react-router-dom";
import "./App.css";
import MatchesPage from "./components/matches-page/MatchesPage";
import NavigationBar from "./components/navigationbar/NavigationBar";
import RegisterPage from "./components/auth/register-page/RegisterPage";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="" element={<div>Hello, HeartCode!</div>} />
        <Route path="matches" element={<MatchesPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Routes>
      <NavigationBar />
    </div>
  );
}
