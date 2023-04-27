import {
  getComments,
  getCommentUserId,
  getUserByUserId,
  getBoard,
  getfavorites,
  getfavoriteCount,
  getCommentCountByBoardId,
} from "../api/getDatabese";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styles from "../../styles/Home.module.css";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Controller } from "react-hook-form";
import axios from "axios";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Stack from "@mui/system/Stack";
import PostAddIcon from "@mui/icons-material/PostAdd";

import useFormValidation from "./../../hooks/useFormValidation";
import PaginationForKeijiban from "../../components/UIs/PaginationForKeijiban";

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
  session,
  status,
}) {
  const { control, handleSubmit, validationRules } = useFormValidation({
    comment: "",
  });

  const router = useRouter();
  const [favCnt, setFavCnt] = useState(favoriteCount);
  const [favState, setFavState] = useState(favorites);

  const { boardId } = router.query;
  const commentLimit = 500;

  const handlePaginationChange = (e, page) => {
    router.push(`/boards/${boardId}?page=${page}`);
  };

  const onCommentSubmit = async (data) => {
    await axios.post("../../api/boards/[boardId]/comments", {
      comment: data.comment,
      userId: session.user.id,
      boardId,
    });
    history.pushState(
      null,
      null,
      `/boards/${boardId}?page=${Math.ceil(
        (commentCount + 1) / take
      )}#comment.${commentCount + 1}`
    );
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
      if (cnt === undefined) {
        next.set(String(commentId), String(1));
      } else {
        next.set(String(commentId), String(Number(cnt) + 1));
      }

      console.log(next);
      return next;
    });
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
      next = next.filter((element) => element.commentId !== commentId);
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
      <PaginationForKeijiban
        totalItemCount={commentCount}
        take={take}
        page={page}
        handlePaginationChange={handlePaginationChange}
      />

      <main className={styles.boardId}>
        {commentCount < commentLimit || (
          <h3 style={{ color: "red", margin: 5 }}>
            ※コメント数が上限に達しました
          </h3>
        )}
        <div style={{ margin: 10 }}>
          <Typography color="text.primary" sx={newLineStyle} variant="h4">
            {board.title}
          </Typography>
        </div>

        <section style={{ margin: 10 }}>
          <Typography color="text.primary" sx={newLineStyle} variant="body1">
            {board.description}
          </Typography>
        </section>
        <List>
          {comments.map((item, key) => {
            console.log(key);
            console.log(`comment.${key + 1 + (page - 1) * take}`);
            return (
              <ListItem
                divider
                alignItems="flex-start"
                id={`comment.${key + 1 + (page - 1) * take}`}
              >
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
                        (page - 1) * take +
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

        {status === "unauthenticated" || commentCount >= commentLimit || (
          <form method="post" onSubmit={handleSubmit(onCommentSubmit)}>
            <Box sx={{ m: 2 }}>
              {/*<TextField
                fullWidth
                required
                id="comment-form"
                label="コメントを投稿"
                multiline
                rows={6}
                {...register("comment")}
        />*/}

              <Controller
                name="comment"
                control={control}
                rules={validationRules.comment}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    id="commentForm"
                    label="コメントを投稿"
                    multiline
                    rows={6}
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                  />
                )}
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
      </main>

      <PaginationForKeijiban
        totalItemCount={commentCount}
        take={take}
        page={page}
        handlePaginationChange={handlePaginationChange}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  const page = +context.query.page || 1;
  const take = 50;
  //console.log(page"page);
  const boardId = +context.params.boardId;
  console.log("serversideprops boradId");
  const session = await getServerSession(context.req, context.res, authOptions);

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
    getCommentCountByBoardId(boardId),
    getfavorites(boardId, userId),
    getfavoriteCount(),
    getCommentUserId(boardId, take, (page - 1) * take),
    getBoard(boardId),
    //getUserByUserId(userId),
  ]);

  //N+1
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
