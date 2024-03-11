import { useAuth } from "context/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScreenLogin from "./screen";
import { toast } from "react-toastify";

const ControllerLogin = () => {
  const { signIn, initializeSocket } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState("");
  const navigation = useNavigate();

  const handleChangeValue = (value: string) => {
    setValue(value);
  };

  const handleSignIn = async () => {
    setLoading(true);
    const { data, error } = await signIn(value);
    setLoading(false);

    if (error) {
      return toast.error(error);
    }

    const { username, token } = data;
    initializeSocket(`Bearer ${token}`);
    toast.success("Logado com sucesso!");
    return navigation(`/dashboard/${username}`);
  };

  const handlers = {
    loading,
    handleChangeValue,
    handleSignIn,
    value,
  };

  return <ScreenLogin handlers={handlers} />;
};

export default ControllerLogin;
