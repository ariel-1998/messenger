import { ComponentProps } from "react";

type CustomSearchInputProps = ComponentProps<"input">;
const CustomSearchInput: React.FC<CustomSearchInputProps> = ({ ...rest }) => {
  return <input className="custom-input" {...rest} />;
};

export default CustomSearchInput;
