import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Layout from "../components/Layout";
import { useSession } from "next-auth/react";
import NProgress from "nprogress";
import Router from "next/router";
import "../styles/nprogress.css";

import {
  RecoilRoot,
} from 'recoil';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  //ローディング
  Router.events.on("routeChangeStart", () => NProgress.start());
  Router.events.on("routeChangeComplete", () => NProgress.done());
  Router.events.on("routeChangeError", () => NProgress.done());

  return (
    <RecoilRoot>
    <SessionProvider session={session}>
      {Component.auth ? (
        /*保護ページ*/
        <RequiredAuth>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RequiredAuth>
      ) : (
        /*not保護ページ*/
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </SessionProvider>
    </RecoilRoot>
  );
}

function RequiredAuth({ children }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return children;
}
