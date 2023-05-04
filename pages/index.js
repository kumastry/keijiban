import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { getBoards, getBoardCount } from "./api/boards";
import Link from "next/link";

import { SWRConfig } from "swr";
import useSWR from "swr";
import { useState } from "react";

import { fetcher } from "../utils/fetcher";


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
/*時間計算する */
export default function Home({ status, boards, boardCount, pageForFetch }) {
  const router = useRouter();
  const page = +router.query.page || 1;
  const [newPage, setNewPage] = useState(page);

  console.log(pageForFetch, page);
  const isInit = pageForFetch === page;
  console.log(isInit);
  console.log("HOME render", boards);
  const take = 5;
  return (
    <SWRConfig
      value={{
        refreshInterval: 1000,
        fetcher
      }}
    >
      <HomeContent
        status={status}
        page={newPage}
        take={take}
        setNewPage={setNewPage}
        Initboards={boards}
        InitboardCount={boardCount}
        pageForFetch={pageForFetch}
      />

<div style={{ display: "none" }}>
        <HomeContent
          status={status}
          page={newPage + 1}
          take={take}
          setNewPage={setNewPage}
          pageForFetch={pageForFetch}
        />
      </div>
      <div style={{ display: "none" }}>
        <HomeContent
          status={status}
          page={newPage - 1}
          take={take}
          setNewPage={setNewPage}
          pageForFetch={pageForFetch}
        />
      </div>

    </SWRConfig>
  );
}

//jotaiかrecoilを使う
const HomeContent = ({
  status,
  page,
  take,
  setNewPage,
  Initboards,
  InitboardCount,
  pageForFetch,
}) => {
  console.log("UHOOOOOO", isInit, page);
  const isInit = pageForFetch === page;
  const { data: boards, isLoading } = useSWR(
    `/api/boards?offset=${(page - 1) * take}&limit=${take}`,
    { fallbackData: isInit ? Initboards : [], revalidateOnMount: true }
  );

  const [renderEvent, setRenderEvent] = useState(false);

  console.log("page", page);

  const { data: boardCount } = useSWR("/api/boards/board-count", {
    fallbackData: InitboardCount,
    revalidateOnMount: true,
  });

  console.log("board count: " + boardCount);
  console.log(boards);
  console.log("page", page);
  console.log("take", take);
  if (status === "loading") {
    return <p>loading</p>;
  }

  //const router = useRouter();
  /*
  console.log((boardCount + take - 1) / boardCount);
  console.log((boardCount + take - 1) / take);
  */
  //なんのhandleChange?

  window.addEventListener('popstate', (event) => {

  });


  const handlePaginationChange = (event, page) => {
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    window.history.pushState({}, '', url);
    setNewPage(page);
  };

  //console.log(status);

  return (
    <>

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
            {boards?.map((board, key) => {
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
};

/*export async function getServerSideProps({ params, query }) {
  console.log(query.page);
  const page = +query.page || 1;
  const take = 10;

  const [boards, boardCount] = await Promise.all([
    getBoards(take, (page - 1) * take),
    getBoardCount(),
  ]);

  //console.log(boards);

  return {
    props: {
      page, take,
      fallback: {
        '/api/boards/':boards,
        '/api/boards/board-count':boardCount
      }
    }
  }

}*/

export async function getServerSideProps({ params, query }) {
  const pageForFetch = +query.page || 1;
  const take = 5;

  const [boards, boardCount] = await Promise.all([
    getBoards(take, (pageForFetch - 1) * take),
    getBoardCount(),
  ]);

  return {
    props: {
      boards,
      boardCount,
      pageForFetch,
    },
  };
}
