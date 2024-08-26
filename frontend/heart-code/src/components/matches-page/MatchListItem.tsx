import { useProfilePicture } from "../../hooks";
import { useEffect, useState } from "react";
import ChatMessage from "../../models/ChatMessage";
import { Match } from "../../models/Match";
import { useApi } from "../../hooks";
import "./MatchesPage.css";
import { AiOutlineUser } from "react-icons/ai";

interface Props {
  match: Match;
  onClick?: () => void;
}

export default function MatchListItem({ match, onClick }: Props) {
  const getProfilePictureURL = useProfilePicture();
  const { get } = useApi();
  const [lastMessage, setLastmessage] = useState<ChatMessage>();

  useEffect(() => {
    get<ChatMessage>("chat/lastmessage", { matchEmail: match.email }).then(
      (response?) => {
        setLastmessage(response?.data);
      }
    );
  }, []);

  return (
    <div onClick={onClick} className="match-list-item">
      <img
        src={getProfilePictureURL(match.profilePictureId)}
        className="match-profile-picture"
      />
      <div>
        <div className="match-alias-display">{match.alias}</div>
        <div className="last-message">
          {lastMessage !== undefined && lastMessage !== null ? (
            <div>
              {lastMessage.owned ? (
                <p>You: {lastMessage.text}</p>
              ) : (
                <p>
                  {match.alias}: {lastMessage.text}
                </p>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
