import Head from "next/head";
import Image from "next/image";
import { getComments } from "../api/boards/[boardId]/comments";
import { getLikes } from "../api/boards/[boardId]/comments/[commentId]/like";
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


// prismaはフロントエンドで実行できない;
//api routeを使うかgetserverprops内で使う
// api/boards/boardId/comments
export async function getStaticPaths() {
  const prisma = new PrismaClient();
  const boards = await prisma.board.findMany({
    select: {
      id:true
    },
  });
  //console.log("WOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
  console.log(boards);
  const paths = boards.map((item) => {
    return { params: { boardId: String(item.id) } };
  });
  console.log(paths);
  return {
    paths,
    fallback: false, // can also be true or 'blocking'
  };
}

export default function board({ comments, likes }) {
  const { register, handleSubmit } = useForm();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [likeState, SetLikeState] = useState(() => {
    const st = new Set();
    console.log(comments, likes)
    for(const comment of comments) {
      for(const like of likes) {
        console.log(comment, like)
        if(comment.id === like.commentId) {
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

  const postLike = (commentId) => {
    console.log(session.user.id);
    console.log(boardId);
    console.log(commentId);
    
    axios.post("../api/boards/[boardId]/comments/[commentId]/like", {
      userId:session.user.id,
      commentId,
      boardId,
    });
    
  }

  const deleteLike = (commentId) => {
    axios.delete("../api/boards/[boardId]/comments/[commentId]/like", {data: {
      userId:session.user.id,
      commentId,
    }})
  }

  const isLike = (userId, commentId) => {
    console.log(likes)
    for(const like of likes) {
      if(like.userId === userId && like.commentId === commentId) {
        console.log(like.userId, userId);
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
            console.log(likeState)
            return (
              <ListItem divider>
                <ListItemText primary={item.comment} />
                {likeState.has(item.id) === true && status === "authenticated" && isLike(session.user.id, item.id) === true?
                <FavoriteIcon onClick = {() => deleteLike(item.id)}/>:
                <FavoriteBorderIcon onClick = {() => postLike(item.id)}/>
                }
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

export async function getStaticProps(context) {
  const boardId = context.params.boardId;
  console.log(boardId);
  const comments = await getComments(boardId);
  const likes = await getLikes(boardId);
  console.log("lieks")
  console.log(likes);
  return {
    props: { comments, likes}, // will be passed to the page component as props
  };
}
