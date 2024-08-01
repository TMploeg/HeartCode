import { Route, Routes } from "react-router-dom";
import "./App.css";
import MatchesPage from "./components/matches-page/MatchesPage";

export default function App() {
  return (
    <Routes>
      <Route path="" element={<div>Hello, HeartCode!</div>} />
      <Route path="matches" element={<MatchesPage />} />
    </Routes>
  );
}
