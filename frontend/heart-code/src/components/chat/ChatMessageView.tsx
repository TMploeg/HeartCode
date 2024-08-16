import ChatMessage from "../../models/ChatMessage";

interface Props {
  chatMessage: ChatMessage;
}

export default function ChatMessageView({ chatMessage }: Props) {
  const dateTime = new Date(chatMessage.dateTime)
  const timestamp = dateTime.toLocaleTimeString('nl-NL')

  return (
    <div className={`chat-message ${chatMessage.owned ? "owned" : ""}`}>
      <div className="message">{chatMessage.text}</div>
      <div className="timestamp">{timestamp.substring(0, timestamp.length - 3)} {dateTime.toLocaleDateString()}</div>
    </div>

  );
}