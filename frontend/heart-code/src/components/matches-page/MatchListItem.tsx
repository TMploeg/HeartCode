import { Match } from "../../models/Match";
import "./MatchesPage.css";
import { AiOutlineUser } from "react-icons/ai";

interface Props {
  match: Match;
  onClick?: () => void;
}

export default function MatchListItem({ match, onClick }: Props) {
  return (
    <div onClick={onClick} className="match-list-item">
      <div className="match-image-container">
        <AiOutlineUser size={50} />
      </div>
      <div className="match-alias-display">{match.alias}</div>
    </div>
  );
}
