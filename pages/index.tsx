import Head from "next/head";
import styles from "../styles/Index.module.css";

export default function Main() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Bible Clicker</title>
        <meta
          name="description"
          content="An incremental game with Bible verses"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      Hello World
    </div>
  );
}
