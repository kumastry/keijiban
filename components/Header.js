import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import Link from "next/link";
import { useSession } from "next-auth/react";
import Avatar from "@mui/material/Avatar";

export default function Header({session, status}) {
  //sessionの情報は親要素から
  
  //console.log(session);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }}>
            <Link href="/">
              <Button color="inherit">kumastry keijiban</Button>
            </Link>
          </Typography>

          {status !== "authenticated" ? (
            <Link href="/api/auth/signin">サインイン</Link>
          ) : (
            <Link href="/profile">
              <IconButton color="inherit">
                <Avatar src={session.user.image} alt="icon" />
              </IconButton>
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
