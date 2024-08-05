import { useEffect, useState } from "react";
import { Match } from "../../models/Match";
import MatchListItem from "./MatchListItem";
import "./MatchesPage.css";
import { useApi } from "../../hooks";
import { useNavigate } from "react-router-dom";

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>();
  const { get } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    get<Match[]>("matches").then((response) => {
      setMatches(response.data);
    });
  }, []);

  return (
    <div className="match-list">
      {matches?.map((m) => (
        <MatchListItem
          key={m.email}
          match={m}
          onClick={() => onMatchClicked(m)}
        />
      ))}
    </div>
  );

  function onMatchClicked(match: Match) {
    navigate("/chat", { state: { match } });
  }
}
