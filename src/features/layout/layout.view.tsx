import { A } from "@solidjs/router";
import type { ParentProps } from "solid-js";
import styles from "./layout.module.css";

export function LayoutView(props: ParentProps) {
  return (
    <div class={styles.page}>
      <header class={styles.header}>
        <A href="/" class={styles.brand}>
          Musée MO5
        </A>
      </header>
      <main class={styles.main}>{props.children}</main>
    </div>
  );
}
