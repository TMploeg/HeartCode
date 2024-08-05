import { useLocation, useNavigate } from "react-router-dom";
import { Match } from "../../models/Match";
import ChatMessage from "../../models/ChatMessage";
import { useEffect, useState } from "react";
import ChatMessageView from "./ChatMessageView";
import { useApi } from "../../hooks";

const FETCH_MESSAGES_INTERVAL_DELAY = 5000;

export default function ChatPage() {
  const { state } = useLocation();
  const { get } = useApi();

  const [messages, setMessages] = useState<ChatMessage[] | null>(null);

  useEffect(() => {
    getMessages();
    setInterval(getMessages, FETCH_MESSAGES_INTERVAL_DELAY);
  }, []);

  const match: Match = state.match;

  return (
    <div>
      <div>{match.alias}</div>
      <div>
        {messages === null
          ? "loading..."
          : messages.map((m) => <ChatMessageView chatMessage={m} />)}
      </div>
    </div>
  );

  function getMessages() {
    console.log("test");
    get<ChatMessage[]>("chat", { matchEmail: match.email }).then((response) =>
      setMessages(response.data)
    );
  }
}
