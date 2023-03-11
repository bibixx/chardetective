import { useCallback, useEffect, useMemo, useState } from "react";
import * as iconv from "iconv-lite";
import styles from "./FoundEncoding.module.scss";
import encodingsMap from "iconv-lite/encodings";
import type { Buffer } from "buffer";
import { CharacterSelect } from "../../components/CharacterSelect/CharacterSelect";
import { Button } from "../../components/Button/Button";

interface FoundEncodingProps {
  file: File;
  buffer: Buffer;
  goBackToIntro: () => void;
}

export const FoundEncoding = ({ file, buffer, goBackToIntro }: FoundEncodingProps) => {
  const [selectedEncoding, setSelectedEncoding] = useState<string | null>(null);

  const [comparisons, setComparisons] = useState<{ [key: number]: string }>({});

  const decodedPermutations = useMemo(() => {
    return Object.fromEntries(ALL_ENCODINGS.map((encoding) => [encoding, iconv.decode(buffer, encoding)] as const));
  }, [buffer]);

  const matchingEncodings = useMemo(() => {
    return findMatchingEncodings(buffer, comparisons, decodedPermutations);
  }, [buffer, comparisons, decodedPermutations]);

  useEffect(() => {
    if (matchingEncodings == null) {
      setSelectedEncoding(null);
      return;
    }

    setSelectedEncoding(matchingEncodings[0]);
  }, [matchingEncodings]);

  const rawFileContents = useMemo(() => {
    return iconv.decode(buffer, "utf8");
  }, [buffer]);

  const decodedFileContents = useMemo(() => {
    if (selectedEncoding == null) {
      return null;
    }

    return iconv.decode(buffer, selectedEncoding);
  }, [buffer, selectedEncoding]);

  const onDownload = () => {
    if (decodedFileContents == null) {
      return;
    }

    const blob = new Blob([decodedFileContents], { type: file.type });
    const elem = window.document.createElement("a");
    elem.href = window.URL.createObjectURL(blob);
    elem.download = file.name;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  };

  const selectedCharacters = useMemo(
    () => Object.keys(comparisons).map((key) => Number.parseInt(key, 10)),
    [comparisons]
  );

  const onCharacterClicked = useCallback((index: number, character: string) => {
    setComparisons((c) => ({
      ...c,
      [index]: character,
    }));
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        {matchingEncodings && (
          <select
            name="selectedEncoding"
            id="selectedEncoding"
            value={selectedEncoding ?? "__empty__"}
            onChange={(e) => {
              setSelectedEncoding(e.target.value);
            }}
          >
            {matchingEncodings.length === 0 && (
              <option value="__empty__" disabled>
                No matching encoding found
              </option>
            )}
            {matchingEncodings.map((encoding) => (
              <option key={encoding} value={encoding}>
                {encoding}
              </option>
            ))}
          </select>
        )}
        <div className={styles.buttonsWrapper}>
          <Button variant="secondary" onClick={goBackToIntro}>
            Select Another File
          </Button>
          <Button variant="primary" onClick={onDownload}>
            Download Converted File
          </Button>
        </div>
      </div>
      <div className={styles.text}>
        <div className={styles.textColumn}>
          {rawFileContents && (
            <CharacterSelect
              selectedCharacters={selectedCharacters}
              text={rawFileContents}
              isSelectable
              onCharacterSelected={onCharacterClicked}
            />
          )}
        </div>
        <div className={styles.textColumn}>
          {decodedFileContents && (
            <CharacterSelect
              selectedCharacters={selectedCharacters}
              text={decodedFileContents}
              isSelectable
              onCharacterSelected={onCharacterClicked}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const getEncodingsList = () => {
  return Object.entries(encodingsMap).reduce((acc, [encoding, encodingValue]) => {
    if (typeof encodingValue !== "string" && !encoding.startsWith("_")) {
      acc.push(encoding);
    }

    return acc;
  }, [] as string[]);
};

const ALL_ENCODINGS = getEncodingsList();

const numberEntries = (obj: Record<number, string>) => Object.entries(obj) as unknown as [number, string][];

const findMatchingEncodings = (
  buffer: Buffer,
  comparisons: Record<number, string>,
  decodedPermutations: Record<string, string>
) => {
  const comparisonsEntries = numberEntries(comparisons);
  const foundEncodings = [];

  for (const [encoding, decodedString] of Object.entries(decodedPermutations)) {
    const doAllMatch = comparisonsEntries.every(([index, char]) => decodedString[index] === char);

    if (doAllMatch) {
      foundEncodings.push(encoding);
    }
  }

  return foundEncodings;
};
