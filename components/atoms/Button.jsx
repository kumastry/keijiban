import { Button as MuiButton } from "@mui/material";

export default function Button({
  text,
  variant,
  startIcon,
  endIcon,
  disabled = false,
  onClick,
  color,
}) {
  return (
    <MuiButton
      variant={variant}
      startIcon={startIcon}
      endIcon={endIcon}
      disabled={disabled}
      onClick={onClick}
      color={color}
    >
      {text}
    </MuiButton>
  );
}
