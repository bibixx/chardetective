import styles from "./Intro.module.scss";
import { DropZone } from "../../components/DropZone/DropZone";

interface IntroProps {
  onSelect: (file: File) => void;
}
export const Intro = ({ onSelect }: IntroProps) => {
  return (
    <div className={styles.wrapper}>
      <DropZone onSelect={onSelect} label="Drag and Drop, or Click to Select a File" />
      <div className={styles.text}>
        Say goodbye to confusing symbols and hello to working encoding! If you&rsquo;re struggling with a file that has
        broken encoding, CharDetective can help. Simply upload your text file, and — in a few simple steps — we&rsquo;ll
        guide you with finding the correct encoding.
      </div>
    </div>
  );
};
