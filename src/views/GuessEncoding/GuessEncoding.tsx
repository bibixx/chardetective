import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FixedSizeList as List, ListOnScrollProps } from "react-window";
import styles from "./GuessEncoding.module.scss";
import { CharacterSelect } from "../../components/CharacterSelect/CharacterSelect";
import { Button } from "../../components/Button/Button";
import { Download, File, Trash2 } from "react-feather";
import { formatEncoding } from "../../utils/formatEncoding";
import cn from "classnames";
import { Dropdown, DropdownListItem } from "../../components/Dropdown/Dropdown";
import { DropZone } from "../../components/DropZone/DropZone";

interface GuessEncodingProps {
  file: File;
  goBackToIntro: () => void;
  onNewFileSelect: (file: File) => void;
  decodedPermutations: Record<string, string>;
}

export const GuessEncoding = ({ file, decodedPermutations, onNewFileSelect }: GuessEncodingProps) => {
  const [selectedEncoding, setSelectedEncoding] = useState<string | null>(null);
  const [comparisons, setComparisons] = useState<{ [key: number]: string }>({});

  const [matchingEncodings, setMatchingEncodings] = useState<string[]>([]);
  const { pane1Ref, pane2Ref, onPane1Scroll, onPane2Scroll } = useSyncedScroll();

  useEffect(
    function calculateMatchingEncodings() {
      setMatchingEncodings(findMatchingEncodings(comparisons, decodedPermutations));
    },
    [comparisons, decodedPermutations]
  );

  useEffect(
    function updateDropdownState() {
      if (matchingEncodings?.[0] == null || matchingEncodings.length === 0) {
        setSelectedEncoding(null);
        return;
      }

      setSelectedEncoding(matchingEncodings[0]);
    },
    [matchingEncodings]
  );

  const rawFileContents = useMemo(() => accessPermutation(decodedPermutations, "utf8"), [decodedPermutations]);
  const decodedFileContents = useMemo(
    () => accessPermutation(decodedPermutations, selectedEncoding),
    [decodedPermutations, selectedEncoding]
  );

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
  const encodingDropdownListItems = useMemo(() => getEncodingListItems(matchingEncodings), [matchingEncodings]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        To begin, select characters that are encoded incorrectly and type in what should be the correct one.
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
            <Dropdown
              items={encodingDropdownListItems}
              setSelectedValue={({ id }) => setSelectedEncoding(id)}
              selectedValueId={selectedEncoding}
              renderTrigger={(selectedValue) =>
                selectedValue != null
                  ? `(1/${matchingEncodings.length}) ${selectedValue.name ?? ""}`
                  : "No matching encoding found"
              }
            />

            <Button disabled={selectedEncoding === null} variant="primary" onClick={onDownload} icon={Download}>
              Download as {formatEncoding("utf8", "short")}
            </Button>
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
      <div className={styles.footer}>
        <div className={cn(styles.buttonsWrapper)}>
          <DropZone onSelect={onNewFileSelect} label="Select, or Drag and Drop Another File" compact />
          {selectedCharacters.length > 0 && (
            <Button variant="secondary" onClick={clearComparisons} icon={Trash2}>
              Clear Character Selection
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

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

const getEncodingListItems = (encodings: string[]): DropdownListItem[] => {
  return encodings.map((encoding): DropdownListItem => ({ id: encoding, name: formatEncoding(encoding) ?? encoding }));
};

const accessPermutation = (decodedPermutations: Record<string, string>, encoding: string | null) => {
  if (encoding == null) {
    return "";
  }

  return decodedPermutations[encoding] ?? "";
};
