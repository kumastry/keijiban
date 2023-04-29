import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { getBoards, getBoardCount } from "./api/boards";
import Link from "next/link";

import { SWRConfig} from "swr";
import useSWR from "swr";

//MUIS
import Fab from "@mui/material/Fab";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import PostAddIcon from "@mui/icons-material/PostAdd";
//import { getCommentCountByBoardId } from "./api/getDatabese";

import PaginationForKeijiban from "../components/UIs/PaginationForKeijiban";
import KeijibanCard from "../components/KeijibanCard";
import KeijibanHead from "./../components/KeijibanHead";

//初回表示遅いのでなんとかする
// prismaはフロントエンドで実行できない;
//api routeを使うかgetserverprops内で使う
  //画面がレンダリングされてから認証情報を取得するまでの遅延を解消する処理
  //認証情報を取得するまでloadingする
  //const { status } = useSession();
export default function Home({fallback, status, page, take}) {
  return (
    <SWRConfig value={{ 
        fallback, 
        refreshInterval: 1000,
        fetcher: (...arg) => fetch(...arg).then(res => res.json())
      }}>

      <HomeContent status = {status} page = {page} take = {take} />
    </SWRConfig>
  )
}

//jotaiかrecoilを使う
const HomeContent = ({status, page, take}) => {
  const {data:boards} = useSWR('/api/boards');
  const {data:boardCount} = useSWR('/api/boards/board-count');
  console.log("board count: " + boardCount);
  console.log("page", page);
  console.log("take", take);
  if (status === "loading") {
    return <p>loading</p>;
  }

  const router = useRouter();

  /*
  console.log((boardCount + take - 1) / boardCount);
  console.log((boardCount + take - 1) / take);
  */
  //なんのhandleChange?
  const handlePaginationChange = (event, page) => {
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

      {/*改良の余地あり(位置)*/}
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

  const page = +query.page || 1;
  const take = 10;
  
  const [boards, boardCount] = await Promise.all([
    getBoards(take, (page - 1) * take),
    getBoardCount(),
  ]);

  return {
    props: {
      page, take,
      fallback: {
        '/api/boards':boards,
        '/api/boards/board-count':boardCount
      }
    }
  }

}
