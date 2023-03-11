import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as iconv from "iconv-lite";
import { FixedSizeList as List, ListOnScrollProps } from "react-window";
import styles from "./FoundEncoding.module.scss";
import encodingsMap from "iconv-lite/encodings";
import type { Buffer } from "buffer";
import { CharacterSelect } from "../../components/CharacterSelect/CharacterSelect";
import { Button } from "../../components/Button/Button";
import { ChevronDown, Download, File, Trash2 } from "react-feather";
import { formatEncoding } from "../../utils/formatEncoding";
import cn from "classnames";

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

  const [matchingEncodings, setMatchingEncodings] = useState<string[]>([]);
  const { pane1Ref, pane2Ref, onPane1Scroll, onPane2Scroll } = useSyncedScroll();

  useEffect(() => {
    const id = requestIdleCallback(
      () => {
        // Add loading state for async loading
        setMatchingEncodings(findMatchingEncodings(comparisons, decodedPermutations));
      },
      { timeout: 100 }
    );

    return () => cancelIdleCallback(id);
  }, [comparisons, decodedPermutations]);

  useEffect(() => {
    if (matchingEncodings == null || matchingEncodings.length === 0) {
      setSelectedEncoding(null);
      return;
    }

    setSelectedEncoding(matchingEncodings[0]!);
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

  const onCharacterSelected = useCallback((index: number, character: string | null) => {
    if (character === null) {
      setComparisons((c) => {
        const newC = { ...c };

        delete newC[index];

        return newC;
      });

      return;
    }

    setComparisons((c) => ({
      ...c,
      [index]: character,
    }));
  }, []);

  const clearComparisons = () => setComparisons({});

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={cn(styles.buttonsWrapper, styles.left)}>
          <Button disabled={selectedEncoding === null} variant="primary" onClick={onDownload} icon={Download}>
            Download {formatEncoding(selectedEncoding, "short")} as {formatEncoding("utf8", "short")}
          </Button>
        </div>

        <div className={cn(styles.buttonsWrapper, styles.right)}>
          <Button variant="secondary" onClick={clearComparisons} icon={Trash2}>
            Clear Character Selection
          </Button>
          <Button variant="secondary" onClick={goBackToIntro} icon={File}>
            Select Another File
          </Button>
        </div>
      </div>
      <div className={styles.text}>
        <div className={styles.textColumn}>
          <div className={styles.textColumnHeaderWrapper}>
            <h2 className={styles.textColumnHeader}>{formatEncoding("utf8")}</h2>
          </div>
          {rawFileContents && (
            <CharacterSelect
              selectedCharacters={selectedCharacters}
              text={rawFileContents}
              isSelectable
              onCharacterSelected={onCharacterSelected}
              listRef={pane1Ref}
              onListScroll={onPane1Scroll}
              comparisons={comparisons}
            />
          )}
        </div>
        <div className={styles.textColumn}>
          <div className={styles.textColumnHeaderWrapper}>
            {matchingEncodings && (
              <Button
                variant="primary"
                icon={ChevronDown}
                className={styles.selectButton}
                style={{ display: "inline-flex" }}
              >
                {selectedEncoding != null
                  ? `(1/${matchingEncodings.length}) ${formatEncoding(selectedEncoding) ?? ""}`
                  : "No matching encoding found"}
              </Button>
            )}
            {matchingEncodings && (
              <select
                style={{ display: "inline-block" }}
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
                    {formatEncoding(encoding)}
                  </option>
                ))}
              </select>
            )}
          </div>
          {decodedFileContents && (
            <CharacterSelect
              selectedCharacters={selectedCharacters}
              text={decodedFileContents}
              isSelectable
              onCharacterSelected={onCharacterSelected}
              listRef={pane2Ref}
              onListScroll={onPane2Scroll}
              comparisons={comparisons}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const getEncodingsList = () => {
  const BANNED_ENCODINGS = ["base64", "hex", "utf8"];
  return Object.entries(encodingsMap).reduce((acc, [encoding, encodingValue]) => {
    if (typeof encodingValue !== "string" && !encoding.startsWith("_") && !BANNED_ENCODINGS.includes(encoding)) {
      acc.push(encoding);
    }

    return acc;
  }, [] as string[]);
};

const ALL_ENCODINGS = getEncodingsList();

const numberEntries = (obj: Record<number, string>) => Object.entries(obj) as unknown as [number, string][];

const findMatchingEncodings = (comparisons: Record<number, string>, decodedPermutations: Record<string, string>) => {
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

const useSyncedScroll = () => {
  const pane1Ref = useRef<List | null>(null);
  const pane2Ref = useRef<List | null>(null);

  const onPane1Scroll = useCallback((props: ListOnScrollProps) => {
    if (!props.scrollUpdateWasRequested) {
      pane2Ref.current?.scrollTo(props.scrollOffset);
    }
  }, []);

  const onPane2Scroll = useCallback((props: ListOnScrollProps) => {
    if (!props.scrollUpdateWasRequested) {
      pane1Ref.current?.scrollTo(props.scrollOffset);
    }
  }, []);

  return {
    pane1Ref,
    pane2Ref,
    onPane1Scroll,
    onPane2Scroll,
  };
};
