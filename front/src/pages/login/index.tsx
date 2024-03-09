import { useState } from "react";
import cryptoImage from "../../assets/images/crypto.png";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState("");
  const navigation = useNavigate();
  const { signIn } = useAuth();

  const handleChangeValue = (value: string) => {
    setValue(value);
  };

  const handleSignIn = async (event: any) => {
    event.preventDefault();

    setLoading(true);
    const { error } = await signIn(value);
    setLoading(false);

    if (error) {
      return;
    }

    return navigation("/dashboard");
  };

  return (
    <div className="min-vw-100 min-vh-100 d-flex justify-content-center align-items-center">
      <main
        className="form-signin w-100 m-auto"
        style={{ maxWidth: 500, padding: 20 }}
      >
        <form>
          <img
            className="mb-4"
            src={cryptoImage}
            alt=""
            width="60"
            height="60"
          />
          <h1 className="h3 mb-3 fw-normal">Login</h1>

          <div className="form-floating mb-3">
            <input
              type="username"
              className="form-control"
              id="floatingInput"
              onChange={(event) => handleChangeValue(event.target.value)}
            />
            <label>username</label>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center">
              <div
                className="spinner-border"
                role="status"
                style={{ width: 30, height: 30 }}
              />
            </div>
          ) : (
            <button
              className="btn btn-primary w-100 py-2 my-3"
              type="submit"
              onClick={(event) => handleSignIn(event)}
            >
              Entrar
            </button>
          )}
          <p className="mt-5 mb-3 text-body-secondary">© 2024</p>
        </form>
      </main>
    </div>
  );
};

export default Login;
