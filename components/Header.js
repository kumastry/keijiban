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

export default function Header() {
  const { data: session, status } = useSession();
  console.log(session);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/">kumastry keijiban</Link>
          </Typography>

          <Button color="inherit">
            {status !== "authenticated" ? (
              <Link href="/api/auth/signin">サインイン</Link>
            ) : (
              <Link href="/profile">
                <Image
                  src={session.user.image}
                  alt="icon"
                  width={50}
                  height={50}
                  style={{ borderRadius: "50%" }}
                />
              </Link>
            )}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
