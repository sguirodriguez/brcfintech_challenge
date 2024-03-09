import { useAuth } from "context/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScreenLogin from "./screen";

const ControllerLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState("");
  const navigation = useNavigate();
  const { signIn } = useAuth();

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

    return navigation(`/dashboard/${data?.username}/${data?.token}`);
  };

  const handlers = {
    loading,
    handleChangeValue,
    handleSignIn,
  };

  return <ScreenLogin handlers={handlers} />;
};

export default ControllerLogin;
