import Head from "next/head";
import Image from "next/image";
import { getComments } from "../api/boards/[boardId]/comments";
import { getfavorites, getfavoriteCount } from "../api/boards/[boardId]/comments/[commentId]/favorite";
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

// prismaはフロントエンドで実行できない;
//api routeを使うかgetserverprops内で使う
// api/boards/boardId/comments

export default function board({ comments, favorites, favoriteCount }) {
  const { register, handleSubmit } = useForm();
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log(favoriteCount);
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
  });

  const { boardId } = router.query;
  
  const onSubmit = (data) => {
    console.log(session);
    console.log(boardId);
    axios.post("../../api/boards/[boardId]/comments", {
      comment: data.comment,
      userId: session.user.id,
      boardId,
    });
  };

  const postfavorite = (commentId) => {
    console.log(session.user.id);
    console.log(boardId);
    console.log(commentId);
    
    axios.post("../api/boards/[boardId]/comments/[commentId]/favorite", {
      userId:session.user.id,
      commentId,
      boardId,
    });
    
  }

  const deletefavorite = (commentId) => {
    axios.delete("../api/boards/[boardId]/comments/[commentId]/favorite", {data: {
      userId:session.user.id,
      commentId,
    }})
  }

  const isfavorite = (userId, commentId) => {
    console.log(favorites)
    for(const favorite of favorites) {
      if(favorite.userId === userId && favorite.commentId === commentId) {
        console.log(favorite.userId, userId);
        return true;
      }
    };

    
    return false;
  }

  return (
    <>
      <main className={styles.main}>

        <List>
          {comments.map((item, key) => {
            console.log(favoriteState)
            return (
              <ListItem divider>
                
                <ListItemText primary={item.comment} />

                <IconButton>
                {favoriteState.has(item.id) === true && status === "authenticated" && isfavorite(session.user.id, item.id) === true?
                <> <FavoriteIcon onClick = {() => deletefavorite(item.id)}/> {favoriteCount.get(String(item.id))}</>:
                <><FavoriteBorderIcon onClick = {() => postfavorite(item.id)}/> {favoriteCount.get(String(item.id)) === undefined?0:favoriteCount.get(String(item.id))}</>
                }
                </IconButton>

              </ListItem>
            );
          })}
        </List>

        {status === "unauthenticated" || (
          <form method="post" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              id="comment-form"
              label="コメントを投稿"
              multiline
              rows={4}
              {...register("comment")}
            />

            <Button
              type="submit "
              color="primary"
              variant="contained"
              size="large"
            >
              投稿
            </Button>
          </form>
        )}
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const boardId = context.params.boardId;
  //console.log(boardId);
  const comments = await getComments(boardId);
  const favorites = await getfavorites(boardId);
  const fav = await getfavoriteCount();
  const favoriteCount = new Map();
  for(const element of fav) {
    favoriteCount.set(String(element.commentid), String(element.count));
  }
  console.log("lieks")
  console.log(favoriteCount);
  return {
    props: { comments, favorites, favoriteCount } // will be passed to the page component as props
  };
}
