import { CSSProperties, ReactNode } from "react";
import "./styles.scss";
const TextComponent = ({
  children,
  type,
  style,
}: {
  children?: ReactNode;
  type?: string;
  style?: CSSProperties;
}) => {
  const handleDefineType = (value?: string) => {
    if (!value) {
      return "";
    }
    const types: { [key: string]: string } = {
      h1: "h1-style-text",
      h1Bold: "h1-style-text-bold",
      h2: "h2-style-text",
      h2Bold: "h2-style-text-bold",
      small: "small-style-text",
      smallBold: "small-style-text-bold",
    };

    return types[value];
  };
  return (
    <p className={`text-default-style ${handleDefineType(type)}`} style={style}>
      {children}
    </p>
  );
};

export default TextComponent;
