import { CustomSearchInputProps } from "../CustomSearchInput";
const CustomSearchInput: React.FC<CustomSearchInputProps> = ({
  isIcon,
  disableRipple,
  disableFocusRipple,
  ...rest
}) => {
  return (
    <>
      {isIcon && <span>icon</span>}
      {disableFocusRipple && <span>Disable Focus Ripple</span>}
      <input className="custom-input" {...rest} disabled={disableRipple} />
    </>
  );
};

export default CustomSearchInput;
