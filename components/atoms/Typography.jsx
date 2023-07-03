import { Typography as MuiTypography } from "@mui/material";

export default function Typography({ children, variant, align, sx, color }) {
  return (
    <MuiTypography variant={variant} sx={sx} color={color}>
      {children}
    </MuiTypography>
  );
}
