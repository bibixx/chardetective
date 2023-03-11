import { ReactNode } from "react";
import styles from "./Layout.module.scss";

interface LayoutProps {
  children: ReactNode;
  onHeaderClick?: () => void;
}

export const Layout = ({ children, onHeaderClick }: LayoutProps) => {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <button onClick={onHeaderClick} className={styles.headerButton}>
          <h1 className={styles.h1}>CharDetective</h1>
        </button>
      </header>
      <div className={styles.content}>{children}</div>
      <footer className={styles.footer}>
        <div>
          Made&nbsp;by&nbsp;
          <a href="http://legiec.io/" target="_blank" rel="noreferrer">
            @bibixx
          </a>
          &nbsp;&bull;&nbsp;
          <a href="https://github.com/bibixx/encoding-guesser" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
};
