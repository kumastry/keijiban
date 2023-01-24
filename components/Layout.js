import Header from "./Header";
import Footer from "./Footer";
import styles from "../styles/Home.module.css";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <div className = {styles.layout}>{children}</div>
      <Footer />
    </>
  );
}
