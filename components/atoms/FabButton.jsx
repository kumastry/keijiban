import { Fab as MuiFab } from "@mui/material";

export default function FabButton({
  Icon,
  text = "",
  varient = "",
  size = "large",
}) {
  return (
    <MuiFab>
      <Icon />
    </MuiFab>
  );
}
