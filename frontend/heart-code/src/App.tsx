import { Route, Routes } from "react-router-dom";
import "./App.css";
import MatchesPage from "./components/matches-page/MatchesPage";
import RegisterPage from "./components/auth/register-page/RegisterPage";

export default function App() {
  return (
    <Routes>
      <Route path="" element={<div>Hello, HeartCode!</div>} />
      <Route path="matches" element={<MatchesPage />} />
      <Route path="register" element={<RegisterPage />} />
    </Routes>
  );
}
