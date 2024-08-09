import { useNavigate } from "react-router-dom";
import "./NavigationBar.css";
import { Button } from "react-bootstrap";

interface ButtonProps {
  page: string;
  pageName: string;
}

export default function NavigationBarButton({ page, pageName }: ButtonProps) {
  //Moet later nog een icon krijgen ipv pageName

  const navigate = useNavigate();

  return (
    <div>
      <Button className="navbar-button" onClick={() => navigate("/" + page)}>
        {pageName}
      </Button>
    </div>
  );
}
