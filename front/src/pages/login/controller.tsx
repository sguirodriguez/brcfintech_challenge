import { useAuth } from "context/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScreenLogin from "./screen";

const ControllerLogin = () => {
  const { signIn, initializeSocket } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState("");
  const navigation = useNavigate();

  const handleChangeValue = (value: string) => {
    setValue(value);
  };

  const handleSignIn = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    setLoading(true);
    const { data, error } = await signIn(value);
    setLoading(false);

    if (error) {
      return;
    }

    const { username, token } = data;
    initializeSocket(`Bearer ${token}`);
    return navigation(`/dashboard/${username}`);
  };

  const handlers = {
    loading,
    handleChangeValue,
    handleSignIn,
  };

  return <ScreenLogin handlers={handlers} />;
};

export default ControllerLogin;
