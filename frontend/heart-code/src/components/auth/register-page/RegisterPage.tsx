import { useState } from "react";
import "../Auth.css";
import { useAuthentication } from "../../../hooks";
import { useNavigate } from "react-router-dom";

interface RegisterData {
  email: string;
  alias: string;
}

export default function RegisterPage() {
  const [registerData, setRegisterData] = useState<RegisterData>({
    email: "",
    alias: "",
  });

  const { register } = useAuthentication();
  const navigate = useNavigate();

  return (
    <div className="auth-form-container">
      <div>
        <div>Email</div>
        <input
          value={registerData.email}
          onChange={(event) =>
            setRegisterData((data) => ({ ...data, email: event.target.value }))
          }
        />
      </div>
      <div>
        <div>Alias</div>
        <input
          value={registerData.alias}
          onChange={(event) =>
            setRegisterData((data) => ({ ...data, alias: event.target.value }))
          }
        />
      </div>
      <button
        disabled={
          registerData.email.length === 0 || registerData.alias.length === 0
        }
        className="submit-button"
        onClick={onSubmit}
      >
        Register
      </button>
    </div>
  );

  function onSubmit() {
    register(registerData)
      .then(() => {
        navigate("/");
      })
      .catch((error) => alert(error.response.data));
  }
}
