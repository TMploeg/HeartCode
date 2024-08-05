import ChatMessage from "../../models/ChatMessage";

interface Props {
  chatMessage: ChatMessage;
}

export default function ChatMessageView({ chatMessage }: Props) {
  return <div>{chatMessage.text}</div>;
}
