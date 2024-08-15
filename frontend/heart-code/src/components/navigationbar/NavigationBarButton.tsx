import { useNavigate } from "react-router-dom";
import "./NavigationBar.css";
import { Button } from "react-bootstrap";
import { ReactNode } from "react";

interface ButtonProps {
  page: string;
  icon: ReactNode;
  className?: string;
}

export default function NavigationBarButton({
  page,
  icon,
  className,
}: ButtonProps) {
  //Moet later nog een icon krijgen ipv pageName

  const navigate = useNavigate();

  return (
    <div>
      <Button
        className={`navbar-button ${className}`}
        onClick={() => navigate(page)}
      >
        {icon}
      </Button>
    </div>
  );
}
