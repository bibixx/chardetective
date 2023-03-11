import styles from "./Intro.module.scss";
import { DropZone } from "../../components/DropZone/DropZone";

interface IntroProps {
  onSelect: (file: File) => void;
}
export const Intro = ({ onSelect }: IntroProps) => {
  return (
    <div className={styles.wrapper}>
      <DropZone onSelect={onSelect} label="Drag and drop, or click to select a file" />
      <div className={styles.text}>
        Say goodbye to confusing symbols and hello to clean, readable text! If you&apos;re struggling with a file that
        has broken encoding, CharDetective can help. Simply upload your text file, and let our app detect the correct
        encoding and convert it back to UTF-8.
      </div>
    </div>
  );
};
