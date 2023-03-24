import { ReactNode } from "react";
import styles from "./Layout.module.scss";
import { Logo } from "./Logo";

interface LayoutProps {
  children: ReactNode;
  onHeaderClick?: () => void;
}

export const Layout = ({ children, onHeaderClick }: LayoutProps) => {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <button onClick={onHeaderClick} className={styles.headerButton}>
          <Logo />
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
          <a href="https://github.com/bibixx/char-detective" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
};
