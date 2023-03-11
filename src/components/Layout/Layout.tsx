import { Fragment, ReactNode, useMemo } from "react";
import styles from "./Layout.module.scss";

interface LayoutProps {
  children: ReactNode;
  onHeaderClick?: () => void;
}

export const Layout = ({ children, onHeaderClick }: LayoutProps) => {
  const H1Wrapper = useMemo(() => (onHeaderClick ? "button" : Fragment), [onHeaderClick]);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <H1Wrapper onClick={onHeaderClick} className={styles.headerButton}>
          <h1 className={styles.h1}>CharDetective</h1>
        </H1Wrapper>
      </header>
      <div className={styles.content}>{children}</div>
      <footer className={styles.footer}>
        <div>
          Made by <a href="http://legiec.io/">@bibixx</a>
          &nbsp;&bull;&nbsp;
          <a href="https://github.com/bibixx/encoding-guesser">GitHub</a>
        </div>
      </footer>
    </div>
  );
};
