import { useLocation } from "react-router-dom";
import { Match } from "../../models/Match";
import ChatMessage from "../../models/ChatMessage";
import { useEffect, useState } from "react";
import ChatMessageView from "./ChatMessageView";
import { useApi, useProfilePicture } from "../../hooks";
import "./Chat.css";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { BsSendFill } from "react-icons/bs";
import Profile from "../profile-page/Profile";
import { User } from "../../models/User";

const FETCH_MESSAGES_INTERVAL_DELAY = 5000;

export default function ChatPage() {
  const { state } = useLocation();
  const { get, post } = useApi();
  const getProfilePictureURL = useProfilePicture();

  const [messages, setMessages] = useState<ChatMessage[] | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");

  const [matchProfile, setMatchProfile] = useState<User>();
  const [show, setShow] = useState(false);

  function handleShowProfile() {
    setShow(true);
  }

  useEffect(() => {
    getMessages();
    getMatchProfile();
    const interval = setInterval(getMessages, FETCH_MESSAGES_INTERVAL_DELAY);

    return () => clearInterval(interval);
  }, []);

  const match: Match = state.match;

  return (
    <div className="chat-page">
      <button className="header-button " onClick={() => handleShowProfile()}>
        <div className="chat-page-header">
          <img
            className="match-img"
            src={
              matchProfile !== undefined
                ? getProfilePictureURL(matchProfile.profilePictureId)
                : "https://optimaldataintelligence.com/wp-content/themes/optimaldataintelligence/images/image-not-found.png"
            }
          />
          {match.alias}
        </div>
      </button>
      <Modal show={show} fullscreen={true} onHide={() => setShow(false)}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="profile-popup">
          {matchProfile !== undefined && matchProfile !== null ? (
            <Profile user={matchProfile} isPersonalPage={false} />
          ) : (
            "Loading..."
          )}
        </Modal.Body>
      </Modal>
      <div className="chat-page-messages">
        {messages === null
          ? "loading..."
          : messages.map((message, index) => (
              <ChatMessageView key={index} chatMessage={message} />
            ))}
      </div>

      <div className="chat-message-input-container">
        <InputGroup>
          <Form.Control
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
          />
          <Button
            variant="outline-secondary"
            className="send-button"
            disabled={newMessage.length === 0}
            onClick={() => submitNewMessage()}
          >
            <BsSendFill />
          </Button>
        </InputGroup>
      </div>
    </div>
  );

  function getMatchProfile() {
    get<User>(`users/${match.email}`).then((response) => {
      setMatchProfile(response.data);
    });
  }

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
