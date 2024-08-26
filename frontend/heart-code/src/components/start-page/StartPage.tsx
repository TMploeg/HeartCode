import logo from "./Logo.jpg";
import { Button } from "react-bootstrap";
import "./StartPage.css";
import { useNavigate } from "react-router-dom";
import { AppRoute } from "../../enums/AppRoute";

export default function StartPage() {
  const navigate = useNavigate();
  return (
    <>
      <img className="logo" src={logo} />
      <div className="buttons">
        <Button
          className="login-register-button"
          onClick={() => navigate(AppRoute.LOGIN)}
        >
          Login
        </Button>
        <p>or</p>
        <Button
          className="login-register-button"
          onClick={() => navigate(AppRoute.REGISTER)}
        >
          Register
        </Button>
      </div>
    </>
  );
}
