import ChatMessage from "../../models/ChatMessage";

interface Props {
  chatMessage: ChatMessage;
  lastDate: Date;
  setLastDate: Function;
}

export default function ChatMessageView({ chatMessage, lastDate, setLastDate}: Props) {
  const dateTime = new Date(chatMessage.dateTime)
  const timestamp = dateTime.toLocaleTimeString('nl-NL')

  if (dateTime.getFullYear != lastDate.getFullYear ||
    dateTime.getMonth != lastDate.getMonth ||
    dateTime.getDay != lastDate.getDay) {
      setLastDate(dateTime);
      
    }
  return (
    <>
      <div className="date-devider">{dateTime.toLocaleDateString()}</div>
      <div className={`chat-message ${chatMessage.owned ? "owned" : ""}`}>
        <div className="message">{chatMessage.text}</div>
        <div className="timestamp">{timestamp.substring(0, timestamp.length - 3)}</div>
      </div>
    </>
  );
}
