import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Layout from "../components/Layout";
import { useSession } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
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
  )
}

function RequiredAuth({ children }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true });
  
  if (status === "loading") {
    return <div>Loading...</div>
  }

  return children;
}

