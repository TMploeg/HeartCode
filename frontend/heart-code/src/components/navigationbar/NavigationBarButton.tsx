import { useNavigate } from "react-router-dom";
import "./NavigationBar.css";
import { Button } from "react-bootstrap";
import { ReactNode } from "react";

interface ButtonProps {
  page: string;
  icon: ReactNode;
}

export default function NavigationBarButton({ page, icon }: ButtonProps) {
  //Moet later nog een icon krijgen ipv pageName

  const navigate = useNavigate();

  return (
    <div>
      <Button className="navbar-button" onClick={() => navigate("/" + page)}>
        {icon}
      </Button>
    </div>
  );
}
