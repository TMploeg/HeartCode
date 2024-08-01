import { useEffect, useState } from "react";
import { Match } from "../../models/Match";
import MatchListItem from "./MatchListItem";
import "./MatchesPage.css";
import { useApi } from "../../hooks";

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>();
  const { get } = useApi();

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
    console.log(`match '${match.alias}' clicked`);
  }
}
