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

const newLineStyle = {
  whiteSpace: "pre-wrap",
  wordWrap: "break-word",
};

export default function Home({ boards, boardCount, take, page }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log((boardCount + take - 1) / boardCount);
  console.log((boardCount + take - 1) / take);
  const handleChange = (e, page) => {
    router.push(`/?page=${page}`);
  };

  console.log(status);

  return (
    <>
      <Head>
        <title>kumastry keijiban</title>
        <meta name="description" content="本格的な掲示板　ただそれだけ" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <Box component="pagination" sx={{}}>
          <Pagination
            count={Math.floor((boardCount + take - 1) / take)}
            onChange={handleChange}
            shape="rounded"
            color="primary"
            page={page}
          />
        </Box>
      </Grid>

      <main className={styles.main}>
        <Box sx={{ minWidth: "70%", maxWidth: "70%", margin: 5 }}>
          <Stack spacing={2}>
            {boards.map((board, key) => {
              return (
                <Card>
                  <CardContent>
                    <Typography variant="h5" sx={newLineStyle}>
                      {key + 1 + (page-1)*take}.{board.title}
                    </Typography>

                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {board.category}
                    </Typography>

                    <Typography variant="body1" sx={newLineStyle}>
                      {board.description}
                    </Typography>
                  </CardContent>

                  <CardActions
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      margin: 1,
                    }}
                  >
                    <Link href={`/boards/${board.id}`}>
                      <Button size="large">掲示板を見る</Button>
                    </Link>
                  </CardActions>
                </Card>
              );
            })}
          </Stack>
        </Box>
      </main>
      {status !== "authenticated" || (
        <Link href={"/post_keijiban"}>
        <Fab
          variant="extended"
          color="primary"
          aria-label="add"
          sx={{
            margin: 5,
            top: "auto",
            right: 0,
            bottom: 0,
            left: "auto",
            position: "fixed",
          }}
        >
          <PostAddIcon/>
          
            
            掲示板作成
          
        </Fab>
        </Link>
      )}
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <Box component="pagination" sx={{}}>
          <Pagination
            count={Math.floor((boardCount + take - 1) / take)}
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

export async function getServerSideProps({ params, query }) {
  const page = +query.page || 1;
  const take = 5;
  console.log(params);
  //const boardId = +params.boardId;
  console.log("query", query);
  console.log(page);
  const boards = await getBoards(take, (page - 1) * take);
  const boardCount = await getBoardCount();
  //const commentCount = await getCommentCount(boardId);
  console.log(boards);
  console.log(boardCount);
  console.log("serversidepros");
  return {
    props: { boards, boardCount, take, page }, // will be passed to the page component as props
  };
}
