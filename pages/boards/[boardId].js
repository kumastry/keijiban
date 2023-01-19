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
  const [commentform, useCommentform] = useState("");
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
        
        {comments.map((item, key) => {
          return (
            <Card>
              <CardContent>{item.comment}</CardContent>
            </Card>
          );
        })}
        
        <form method = "post" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          id="outlined-multiline-static"
          label="Multiline"
          multiline
          rows={4}
          {...register('comment')}
        />
        
        <Button type = "submit "color="primary" variant="contained" size="large" >
          投稿
        </Button>
        </form>

        
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
