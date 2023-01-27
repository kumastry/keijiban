import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Image from "next/image";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from "react";
export default function profile() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <main>
      {status === "authenticated" ? (
        <div>
          <p>{session.user.name}</p>
          <p>{session.user.email}</p>
          <Image
            src={session.user.image}
            alt="Picture of the author"
            width={50}
            height={50}
          />
          <Box>
            <Button
              variant="contained"
              color="error"
              onClick={handleClickOpen}
            >
              サインアウト
            </Button>
          </Box>

          <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"本当にサインアウトしますか？"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => signOut({ callbackUrl: "/" })}>はい</Button>
          <Button onClick={handleClose} autoFocus>
            いいえ
          </Button>
        </DialogActions>
      </Dialog>
        </div>
      ) : (
        <p>nasi</p>
      )}
    </main>
  );
}
