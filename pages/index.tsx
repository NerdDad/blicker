import Head from "next/head";
import styles from "../styles/Index.module.css";
import * as verses from "../data/verses.json";
import { useRef, useState } from "react";
import { Dataset } from "../src/dataset";
import { useInterval } from "../src/hooks";

export default function Main() {
  const [_drops, setDrops] = useState(0);
  const [dataset, _setDataSet] = useState(new Dataset(setDrops));
  const ref = useRef<SVGSVGElement>(null);

  useInterval((duration?: number) => {
    dataset.update(duration!);
  }, 200);

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
      <svg
        viewBox="0 0 500 150"
        style={{ userSelect: "none", fontFamily: "monospace" }}
        ref={ref}
      >
        {dataset.render()}
      </svg>
    </div>
  );
}
