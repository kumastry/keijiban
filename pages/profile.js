import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Image from "next/image";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from "react";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import {getBoardCountByUserId, getCommentCountByUserId, getFavoriteCountByUserId} from './api/getDatabese';

export default function profile({boardCountByUserId, commentCountByUserId, favoriteCountByUserId}) {
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
          <Image
            src={session.user.image}
            alt="Picture of the author"
            width={50}
            height={50}
          />
          <p>ユーザー名:{session.user.name}</p>
          <p>ID:{session.user.id}</p>
          <p>掲示板投稿数:{boardCountByUserId}</p>
          <p>コメント投稿数:{commentCountByUserId}</p>
          <p>いいね数:{favoriteCountByUserId}</p>
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
        <p>Loading...</p>
      )}
    </main>
  );
}

export async function getServerSideProps(context) {
 //userIdのユーザーの掲示板投稿数，コメント投稿数，いいね数を表示する
 const session = await unstable_getServerSession(
  context.req,
  context.res,
  authOptions
);

const userId = session.user.id || "";

const [boardCountByUserId, commentCountByUserId, favoriteCountByUserId] = await Promise.all([
  getBoardCountByUserId(userId), getCommentCountByUserId(userId), getFavoriteCountByUserId(userId)
]);

  return {
    props: {boardCountByUserId, commentCountByUserId, favoriteCountByUserId}, // will be passed to the page component as props
  };
}
