import { useLocation } from "react-router-dom";
import { Match } from "../../models/Match";
import ChatMessage from "../../models/ChatMessage";
import { useEffect, useState } from "react";
import ChatMessageView from "./ChatMessageView";
import { useApi } from "../../hooks";
import "./Chat.css";

const FETCH_MESSAGES_INTERVAL_DELAY = 5000;
let lastDate: String;

export default function ChatPage() {
  const { state } = useLocation();
  const { get, post } = useApi();

  const [messages, setMessages] = useState<ChatMessage[] | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");


  useEffect(() => {
    getMessages();
    const interval = setInterval(getMessages, FETCH_MESSAGES_INTERVAL_DELAY);

    return () => clearInterval(interval);
  }, []);

  const match: Match = state.match;

  return (
    <div className="chat-page">
      <div className="chat-page-header">{match.alias}</div>
      <div className="chat-page-messages">
        {messages === null
          ? "loading..."
          : messages.map((message, index) => (
            <ChatMessageView key={index} chatMessage={message} />
          ))}
      </div>
      <div className="chat-message-input-container">
        <input
          className="chat-message-input"
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
        />
        <div className="submit-message-button-container">
          <button className="submit-message-button" onClick={submitNewMessage}>
            {">"}
          </button>
        </div>
      </div>
    </div>
  );

  function getMessages() {
    get<ChatMessage[]>("chat", { matchEmail: match.email }).then((response) =>
      setMessages(response.data)
    );
  }

  function submitNewMessage() {
    post("chat", { text: newMessage, receiverEmail: match.email })
      .then(() => {
        getMessages();
        setNewMessage("");
      })
      .catch((error) => console.log(error.response.data));
  }
}
