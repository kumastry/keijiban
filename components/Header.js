import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";

import Link from "next/link";

import {
  useRecoilValue,
} from 'recoil';
import {sessionState} from './states/sessionState';
import { statusState } from "./states/statusState";

export default function Header() {
  //sessionの情報は親要素から

  //console.log(session);
  const status = useRecoilValue(statusState);
  const session = useRecoilValue(sessionState);


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
