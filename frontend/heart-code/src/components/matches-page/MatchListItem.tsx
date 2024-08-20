import { useProfilePicture } from "../../hooks";
import { Match } from "../../models/Match";
import "./MatchesPage.css";
import { AiOutlineUser } from "react-icons/ai";

interface Props {
  match: Match;
  onClick?: () => void;
  lastMessage: string;
}

export default function MatchListItem({ match, onClick, lastMessage }: Props) {
  const getProfilePictureURL = useProfilePicture();

  return (
    <div onClick={onClick} className="match-list-item">
      <img
        src={getProfilePictureURL(match.profilePictureId)}
        className="match-profile-picture"
      />
      <div>
        <div className="match-alias-display">{match.alias}</div>
        <div className="last-message">{lastMessage}</div>
      </div>
    </div>
  );
}
