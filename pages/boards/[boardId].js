import Head from "next/head";
import Image from "next/image";
import {
  getComments,
  getCommentCount,
  getCommentUserId,
  getUserByUserId,
  getBoard,
  getfavorites,
  getfavoriteCount,
} from "../api/getDatabese";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import styles from "../../styles/Home.module.css";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useSession, signIn, signOut } from "next-auth/react";
import { border } from "@mui/system";
import getBoards from "../api/boards";
import { PrismaClient } from "@prisma/client";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import Pagination from "@mui/material/Pagination";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { MenuItem } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { Fragment } from "react";
import Stack from "@mui/system/Stack";
import dayjs from "dayjs";
import PostAddIcon from "@mui/icons-material/PostAdd";

// prismaはフロントエンドで実行できない;
//api routeを使うかgetserverprops内で使う
// api/boards/boardId/comments
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const newLineStyle = {
  whiteSpace: "pre-wrap",
  wordWrap: "break-word",
};

export default function board({
  comments,
  favorites,
  favoriteCount,
  commentCount,
  take,
  page,
  commentUsers,
  board,
}) {
  const { register, handleSubmit } = useForm();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favCnt, setFavCnt] = useState(favoriteCount);
  const [favState, setFavState] = useState(favorites);
  const [openReportModal, setOpenReportModal] = useState(false);
  const { boardId } = router.query;
  console.log(router);
  console.log(commentUsers);

  const handleChange = (e, page) => {
    router.push(`/boards/${boardId}?page=${page}`);
  };

  /*
  const [favoriteState, SetfavoriteState] = useState(() => {
    const st = new Set();
    console.log(comments, favorites)
    for(const comment of comments) {
      for(const favorite of favorites) {
        console.log(comment, favorite)
        if(comment.id === favorite.commentId) {
          console.log("puttar");
          st.add(comment.id);
        }
      }
    }
    console.log(st);
    return st;
  });*/

  const onSubmit = async (data) => {
    console.log(session);
    console.log(boardId);
    await axios.post("../../api/boards/[boardId]/comments", {
      comment: data.comment,
      userId: session.user.id,
      boardId,
    });

    router.reload();
  };

  const postfavorite = (commentId) => {
    axios.post("../api/boards/[boardId]/comments/[commentId]/favorite", {
      userId: session.user.id,
      commentId,
      boardId,
    });

    setFavState((prev) => {
      const next = [...prev];
      console.log(prev, next);
      next.push({ commentId });
      console.log("next", next);
      return next;
    });

    setFavCnt((prev) => {
      const next = new Map(prev);
      const cnt = favCnt.get(String(commentId));
      console.log(prev);
      console.log(next);
      if (cnt === undefined) {
        next.set(String(commentId), String(1));
      } else {
        next.set(String(commentId), String(Number(cnt) + 1));
      }

      console.log(next);
      return next;
    });
    //favを
  };

  const deletefavorite = (commentId) => {
    axios.delete("../api/boards/[boardId]/comments/[commentId]/favorite", {
      data: {
        userId: session.user.id,
        commentId,
      },
    });

    setFavState((prev) => {
      let next = [...prev];
      console.log(commentId);
      console.log(prev, next);
      next = next.filter((element) => element.commentId !== commentId);
      console.log(prev, next);
      return next;
    });

    setFavCnt((prev) => {
      const next = new Map(prev);
      const cnt = favCnt.get(String(commentId));
      console.log(prev);
      console.log(next);
      if (cnt === undefined) {
        next.set(String(commentId), String(1));
      } else {
        next.set(String(commentId), String(Number(cnt) - 1));
      }

      console.log(next);
      return next;
    });
  };

  const isfavorite = (commentId, useId) => {
    console.log(favState);
    for (const fav of favState) {
      if (commentId === fav.commentId) {
        return true;
      }
    }

    return false;
  };

  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <Box component="pagination" sx={{}}>
          <Pagination
            count={Math.floor((commentCount + take - 1) / take)}
            onChange={handleChange}
            shape="rounded"
            color="primary"
            page={page}
          />
        </Box>
      </Grid>

      <main className={styles.boardId}>
        <header style={{ margin: 10 }}>
          <Typography color="text.primary" sx={newLineStyle} variant="h4">
            {board.title}
          </Typography>
        </header>

        <article style={{ margin: 10 }}>
          <Typography color="text.primary" sx={newLineStyle} variant="body1">
            {board.description}
          </Typography>
        </article>
        <List>
          {comments.map((item, key) => {
            console.log(key);
            return (
              <ListItem divider alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar src={commentUsers[key].image} alt={"icon"} />
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Typography
                      sx={{ display: "inline" }}
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      {key +
                        1 +
                        ". " +
                        commentUsers[key].name +
                        " ID:" +
                        item.userId +
                        " "}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      sx={newLineStyle}
                      variant="body1"
                      color="text.primary"
                    >
                      {item.comment}
                    </Typography>
                  }
                />
                {status !== "authenticated" || (
                  <Stack alignItems="center" gap={0}>
                    <IconButton>
                      {isfavorite(item.id, session.user.id) === true ? (
                        <FavoriteIcon onClick={() => deletefavorite(item.id)} />
                      ) : (
                        <FavoriteBorderIcon
                          onClick={() => postfavorite(item.id)}
                        />
                      )}
                    </IconButton>

                    <Typography color="text.primary">
                    {favCnt.get(String(item.id)) === undefined
                      ? 0
                      : favCnt.get(String(item.id))}
                    </Typography>
                  </Stack>
                )}

                {/*<Button onClick={() => setOpenReportModal(true)}>
                  通報
              </Button>*/}
              </ListItem>
            );
          })}
        </List>

        {status === "unauthenticated" || (
          <form method="post" onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ m: 2 }}>
              <TextField
                fullWidth
                required
                id="comment-form"
                label="コメントを投稿"
                multiline
                rows={6}
                {...register("comment")}
              />

              <Button
                type="submit "
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 1 }}
                endIcon={<PostAddIcon />}
              >
                投稿
              </Button>
            </Box>
          </form>
        )}

        <Modal
          open={openReportModal}
          onClose={() => setOpenReportModal}
          aria-labelledby="report modal"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              通報フォーム
            </Typography>

            <form>
              <TextField
                id="standard-select-currency"
                select
                label="カテゴリー"
                helperText="カテゴリーを選択"
                variant="standard"
                style={{ width: "30%" }}
              >
                <MenuItem value="aaa">あああ</MenuItem>
                <MenuItem value="aaa">あああ</MenuItem>
                <MenuItem value="aaa">あああ</MenuItem>
                <MenuItem value="aaa">あああ</MenuItem>
              </TextField>
            </form>
          </Box>
        </Modal>
      </main>

      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <Box component="pagination" sx={{ m: 2 }}>
          <Pagination
            count={Math.floor((commentCount + take - 1) / take)}
            onChange={handleChange}
            shape="rounded"
            color="primary"
            page={page}
          />
        </Box>
      </Grid>
    </>
  );
}

export async function getServerSideProps(context) {
  const page = +context.query.page || 1;
  const take = 50;

  const boardId = +context.params.boardId;
  console.log("serversideprops boradId");
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  console.log("sesson", session);

  const userId = session !== null ? session.user.id : undefined;

  //commentテーブルからあるboardIdのレコード抽出
  //const comments = await getComments(boardId, take, (page-1)*take);
  //const commentCount = await getCommentCount();

  //favoriteテーブルからあるboardIdのレコードを抽出
  //const favorites = await getfavorites(boardId,session);

  //あるcommentIdのレコード数をカウント
  //const fav = await getfavoriteCount();

  //概要を作成
  //const description = await getDes

  const [
    comments,
    commentCount,
    favorites,
    fav,
    commentUserIds,
    board,
    //boardUser,
  ] = await Promise.all([
    getComments(boardId, take, (page - 1) * take),
    getCommentCount(),
    getfavorites(boardId, userId),
    getfavoriteCount(),
    getCommentUserId(boardId, take, (page - 1) * take),
    getBoard(boardId),
    //getUserByUserId(userId),
  ]);

  const commentUsers = await Promise.all(
    commentUserIds.map((element) => getUserByUserId(element.userId))
  );
  //promise.allで高速化可能

  //???
  const favoriteCount = new Map();
  for (const element of fav) {
    favoriteCount.set(String(element.commentid), String(element.count));
  }
  //console.log("lieks");
  //console.log(commentUsers);
  //console.log(comments);
  //console.log(favoriteCount);
  //console.log(session.user.id);
  //console.log(favorites);

  return {
    props: {
      comments,
      favorites,
      favoriteCount,
      commentCount,
      take,
      page,
      commentUsers,
      board,
      //boardUser,
    }, // will be passed to the page component as props
  };
}
