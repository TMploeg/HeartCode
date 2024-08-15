import { useNavigate } from "react-router-dom";
import "./NavigationBar.css";
import { Button } from "react-bootstrap";
import { ReactNode } from "react";
import { AppRoute } from "../../enums/AppRoute";

interface ButtonProps {
  page: AppRoute;
  icon: ReactNode;
  className?: string;
}

export default function NavigationBarButton({
  page,
  icon,
  className,
}: ButtonProps) {
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
