import { useNavigate } from "react-router-dom";
import "./NavigationBar.css";

interface ButtonProps {
  page: string;
  pageName: string;
}

export default function NavigationBarButton({ page, pageName }: ButtonProps) {
  //Moet later nog een icon krijgen ipv pageName

  const navigate = useNavigate();

  return (
    <button className="button" onClick={() => navigate("/" + page)}>
      {pageName}
    </button>
  );
}
