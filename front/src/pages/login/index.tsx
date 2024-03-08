import cryptoImage from "../../assets/images/crypto.png";
import { useAuth } from "../../context/auth";
const Login = () => {
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    const { error } = await signIn();
    if (error) {
      return;
    }
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

          <div className="form-floating">
            <input
              type="username"
              className="form-control"
              id="floatingInput"
            />
            <label>username</label>
          </div>

          <button
            className="btn btn-primary w-100 py-2 my-3"
            type="submit"
            onClick={() => handleSignIn()}
          >
            Entrar
          </button>
          <p className="mt-5 mb-3 text-body-secondary">© 2024</p>
        </form>
      </main>
    </div>
  );
};

export default Login;
