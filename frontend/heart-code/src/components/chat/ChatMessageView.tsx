import ChatMessage from "../../models/ChatMessage";

interface Props {
  chatMessage: ChatMessage;
}

export default function ChatMessageView({ chatMessage }: Props) {
  return (
    <div className={`chat-message ${chatMessage.owned ? "owned" : ""}`}>
      {chatMessage.text}
    </div>
  );
}
