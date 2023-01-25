import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Avatar from "@mui/material/Avatar";

export default function Header() {
  const { data: session, status } = useSession();
  console.log(session);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }}>
            <Button color="inherit">
              <Link href="/">kumastry keijiban</Link>
            </Button>
          </Typography>

          <IconButton color="inherit">
            {status !== "authenticated" ? (
              <Link href="/api/auth/signin">サインイン</Link>
            ) : (
              <Link href="/profile">
                <Avatar src={session.user.image} alt="icon" />
              </Link>
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
