import Header from "./Header";
import Footer from "./Footer";
import styles from "../styles/Home.module.css";
import { useSession } from "next-auth/react";
import { cloneElement } from "react";

import {useSetRecoilState } from "recoil";
import {sessionState} from './states/sessionState';
import { statusState } from "./states/statusState";

export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const childrenWithProps = cloneElement(children, {
    session,
    status,
  });
  const setStatusState = useSetRecoilState(statusState);
  const setSessionState = useSetRecoilState(sessionState);
  setStatusState(status);
  setSessionState(session);

  return (
    <>
      <Header />
      <div className={styles.layout}>{childrenWithProps}</div>
      <Footer />
    </>
  );
}
