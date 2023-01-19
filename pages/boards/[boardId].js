import Head from "next/head";
import Image from "next/image";
import { getComments } from "../api/boards/[boardId]/comments";
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
import FormControl from '@mui/material/FormControl';
import { useState } from "react";
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from "axios";
import { useSession, signIn, signOut } from "next-auth/react";
import { border } from "@mui/system";
import getBoards from '../api/boards';
import { PrismaClient } from "@prisma/client";
import Divider from "@mui/material/Divider";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

// prismaはフロントエンドで実行できない;
//api routeを使うかgetserverprops内で使う
// api/boards/boardId/comments
export async function getStaticPaths() {
  const prisma = new PrismaClient();
  const boards = await prisma.board.findMany();
  console.log("WOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
  console.log(boards);
  const paths = boards.map((item, key)=> {
    return {params:{boardId:String(item.id)}}
  });
  console.log(paths);
  return {
    paths,
    fallback: false, // can also be true or 'blocking'
  };
}

export default function board({ comments }) {
  const { register, handleSubmit } = useForm();
  const { data: session, status } = useSession();
  console.log(comments);
  const router = useRouter()
  const { boardId } = router.query;
  console.log(boardId);

  const onSubmit = (data) => {
    console.log(session);
    console.log(boardId);
    axios.post('../../api/boards/[boardId]/comments', {
      comment:data.comment,
      userId:session.user.id,
      boardId
    });
  }


  return (
    <>
      <main className={styles.main}>
        <List>
        {comments.map((item, key) => {
          return (
            <ListItem  divider>
              <ListItemText primary={item.comment} />

              <FavoriteBorderIcon/>

            </ListItem>       
          );
        })}
        
        </List>
        
        {status === "unauthenticated" || 
        <form method = "post" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          id="comment-form"
          label="コメントを投稿"
          multiline
          rows={4}
          {...register('comment')}
        />
        
        <Button type = "submit "color="primary" variant="contained" size="large" >
          投稿
        </Button>
        </form>
        }

        
      </main>
    </>
  );
}

export async function getStaticProps(context) {
  const boardId = context.params.boardId;
  console.log(boardId);
  const comments = await getComments(boardId);
  console.log(comments);
  return {
    props: { comments }, // will be passed to the page component as props
  };
}
