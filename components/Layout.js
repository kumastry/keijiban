import Header from "./Header";
import Footer from "./Footer";
import styles from "../styles/Home.module.css";
import { useSession} from "next-auth/react";
import { cloneElement } from 'react';

export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const childrenWithProps = cloneElement(children, {
    session, status
  });

  if(status === "loading") {
    return (<p>loading...</p>);
  }

  return (
    <>
      <Header session = {session} status = {status}/>
        <div className={styles.layout}>{childrenWithProps}</div>
      <Footer />
    </>
  );
}
