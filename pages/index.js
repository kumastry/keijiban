import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useSession, signIn, signOut } from "next-auth/react";
import { getBoards, getBoardCount } from "./api/boards";
import { getBoard } from "./api/boards/[boardId]";
import { PrismaClient } from "@prisma/client";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Fab from "@mui/material/Fab";
import Stack from "@mui/material/Stack";
// prismaはフロントエンドで実行できない;
//api routeを使うかgetserverprops内で使う
import Header from "../components/Header";
import Pagination from "@mui/material/Pagination";
import { useState } from "react";
import { useRouter } from "next/router";
import { Grid, Box } from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
//import { getCommentCountByBoardId } from "./api/getDatabese";

import PaginationForKeijiban from "../components/UIs/PaginationForKeijiban";
import KeijibanCard from "../components/KeijibanCard";

import KeijibanHead from "./../components/KeijibanHead";

//初回表示遅いのでなんとかする

export default function Home({ boards, boardCount, take, page, status }) {
  //画面がレンダリングされてから認証情報を取得するまでの遅延を解消する処理
  //認証情報を取得するまでloadingする
  //const { status } = useSession();

  if (status === 'loading') {
    return (<p>loading</p>);
  }

  const router = useRouter();

  /*
  console.log((boardCount + take - 1) / boardCount);
  console.log((boardCount + take - 1) / take);
  */
  //なんのhandleChange?
  const handlePaginationChange = (event, page) => {
    console.log("page", page);
    router.push(`/?page=${page}`);
  };

  //console.log(status);

  return (
    <>
      {/*SEOは外部に設置する*/}
      {/*
      <Head>
        <title>kumastry keijiban</title>
        <meta name="description" content="本格的な掲示板　ただそれだけ" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta charset="utf-8" />
        <meta property="og:title" content="kumastry keijiban" />
        <meta property="og:site_name" content="kumastry keijiban" />
        <meta
          property="og:description"
          content="本格的な掲示板　ただそれだけ"
        />
        <meta property="og:url" content="%PUBLIC_URL%" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="%PUBLIC_URL%/images/ogp.png" />
        <meta name="twitter:card" content="summary_large_image" />
  </Head> */}

      <KeijibanHead />
      {/* ページネーション共通化できそう */}
      <PaginationForKeijiban
        totalItemCount={boardCount}
        take={take}
        page={page}
        handlePaginationChange={handlePaginationChange}
      />

      <main className={styles.main}>
        <Box sx={{ minWidth: "70%", maxWidth: "70%", margin: 5 }}>
          <Stack spacing={2}>
            {boards.map((board, key) => {
              return (
                <KeijibanCard
                  number={key + 1 + (page - 1) * take}
                  id={board.id}
                  title={board.title}
                  category={board.category}
                  description={board.description}
                />
              );
            })}
          </Stack>
        </Box>
      </main>

      {/*改良の余地あり*/}
      {console.log(status)}
      {status !== "authenticated" || (
        <Link href={"/post_keijiban"}>
          <Fab
            variant="extended"
            color="primary"
            aria-label="add"
            sx={{
              margin: 10,
              top: "auto",
              right: 0,
              bottom: 0,
              left: "auto",
              position: "fixed",
            }}
          >
            <PostAddIcon />
            掲示板作成
          </Fab>
        </Link>
      )}

      <PaginationForKeijiban
        totalItemCount={boardCount}
        take={take}
        page={page}
        handlePaginationChange={handlePaginationChange}
      />
    </>
  );
}

export async function getServerSideProps({ params, query }) {
  //この数字は定数とする
  const page = +query.page || 1;
  const take = 5;
  //console.log(params);
  //const boardId = +params.boardId;
  //console.log("query", query);
  //console.log(page);
  //並行処理
  //const boards = await getBoards(take, (page - 1) * take);
  //const boardCount = await getBoardCount();
  const [boards, boardCount] = await Promise.all([getBoards(take, (page - 1) * take), getBoardCount()]);
  //const commentCount = await getCommentCount(boardId);
  //console.log(boards);
  //console.log(boardCount);
  //console.log("serversidepros");
  return {
    props: { boards, boardCount, take, page }, // will be passed to the page component as props
  };
}
