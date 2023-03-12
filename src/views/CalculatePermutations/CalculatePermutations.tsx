import { Buffer } from "buffer";
import * as iconv from "iconv-lite";
import encodingsMap from "iconv-lite/encodings";
import { useEffect } from "react";
import styles from "./CalculatePermutations.module.scss";
import { MagnifyingGlass } from "./MagnifyingGlass";

interface CalculatePermutationsProps {
  file: File;
  onLoaded: (permutations: Record<string, string>) => void;
}
export const CalculatePermutations = ({ file, onLoaded }: CalculatePermutationsProps) => {
  useEffect(() => {
    let abort = false;
    async function run() {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Buffer(arrayBuffer);

      const entires: (readonly [string, string])[] = [];

      for (const encoding of ALL_ENCODINGS) {
        entires.push([encoding, await asyncDecode(buffer, encoding)] as const);
      }

      const newDecodedPermutations = Object.fromEntries(entires);

      if (!abort) {
        onLoaded(newDecodedPermutations);
      }
    }

    run();

    return () => {
      abort = true;
    };
  }, [file, onLoaded]);

  return (
    <div className={styles.wrapper}>
      <MagnifyingGlass />
      <div>Loading...</div>
    </div>
  );
};

const asyncDecode = (buffer: Buffer, encoding: string) =>
  new Promise<string>((resolve) => {
    requestIdleCallback(
      () => {
        const result = iconv.decode(buffer, encoding);
        resolve(result);
      },
      { timeout: 100 }
    );
  });

const getEncodingsList = () => {
  const BANNED_ENCODINGS = ["base64", "hex"];
  return Object.entries(encodingsMap)
    .reduce((acc, [encoding, encodingValue]) => {
      if (typeof encodingValue !== "string" && !encoding.startsWith("_") && !BANNED_ENCODINGS.includes(encoding)) {
        acc.push(encoding);
      }

      return acc;
    }, [] as string[])
    .sort((a, b) => {
      if (a === "ascii") {
        return -1;
      }

      if (b === "ascii") {
        return 1;
      }

      return a.localeCompare(b);
    });
};

export const ALL_ENCODINGS = getEncodingsList();
