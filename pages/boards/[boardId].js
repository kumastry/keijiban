import Head from "next/head";
import Image from "next/image";
import { getComments, getCommentCount } from "../api/boards/[boardId]/comments";
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
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from '../api/auth/[...nextauth]';
import  Pagination from "@mui/material/Pagination";

// prismaはフロントエンドで実行できない;
//api routeを使うかgetserverprops内で使う
// api/boards/boardId/comments

export default function board({ comments, favorites, favoriteCount, commentCount,take, page }) {
  const { register, handleSubmit } = useForm();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favCnt, setFavCnt] = useState(favoriteCount);
  const { boardId } = router.query;
  console.log(router);
  
  const handleChange = (e, page) => {
    router.push(`/boards/${boardId}?page=${page}`);
  }

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
    /*
    console.log(session.user.id);
    console.log(boardId);
    console.log(commentId);
    const cnt = favCnt.get(String(commentId));
    console.log(favCnt)
    console.log(cnt);
    setFavCnt((prev) => {
      const next = new Map(prev);
      console.log(prev);
      console.log(next);
      if(cnt === undefined) {
        next.set(String(commentId), String(1));
      } else {
        next.set(String(commentId), String(Number(cnt)+1));
      }

      console.log(next)
      return next;
    });*/
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

  const isfavorite = (commentId) => {
    for(const fav of favorites) {
      if(commentId === fav.commentId) {
        return true;
      }
    }

    return false;
  }

  return (
    <>
      <main className={styles.main}>
        
      <Pagination 
          count={Math.floor((commentCount + take -1) / take)} 
          onChange={handleChange}
          shape="rounded" 
          color="primary"
          page={page} 
      />

<Pagination 
          count={Math.floor((commentCount + take -1) / take)} 
          onChange={handleChange}
          shape="rounded" 
          color="primary"
          page={page} 
          />


        <List>
          {comments.map((item, key) => {
            return (
              <ListItem divider>
                <ListItemText primary={item.comment} />
                <IconButton>
                {status === "authenticated" && isfavorite(session.user.id, item.id) === true?
                <> <FavoriteIcon onClick = {() => deletefavorite(item.id)}/>    {favCnt.get(String(item.id)) === undefined?0:favCnt.get(String(item.id))}</>:
                <> <FavoriteBorderIcon onClick = {() => postfavorite(item.id)}/> {favCnt.get(String(item.id)) === undefined?0:favCnt.get(String(item.id))}</>
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
  const page = +context.query.page || 1;
  const take = 2;

  const boardId = +context.params.boardId;
  console.log("serversideprops boradId");
  const session = await unstable_getServerSession(context.req, context.res, authOptions);
  
  //commentテーブルからあるboardIdのレコード抽出
  const comments = await getComments(boardId, take, (page-1)*take);
  const commentCount = await getCommentCount();


  //favoriteテーブルからあるboardIdのレコードを抽出
  const favorites = await getfavorites(boardId,session);

  //あるcommentIdのレコード数をカウント
  const fav = await getfavoriteCount();

  //promise.allで高速化可能

  //???
  const favoriteCount = new Map();
  for(const element of fav) {
    favoriteCount.set(String(element.commentid), String(element.count));
  }
  console.log("lieks")
  console.log(favoriteCount);
  console.log(favorites);

  return {
    props: { comments, favorites, favoriteCount, commentCount, take, page } // will be passed to the page component as props
  };
}
