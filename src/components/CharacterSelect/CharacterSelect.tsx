import { FixedSizeList as List, ListOnScrollProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import styles from "./CharacterSelect.module.scss";
import { MutableRefObject, useCallback, useMemo, useRef, useState } from "react";
import cn from "classnames";
import { CharacterSelectPopup } from "../CharacterSelectPopup/CharacterSelectPopup";

interface CharacterSelectProps {
  text: string;
  isSelectable?: boolean;
  selectedCharacters: number[];
  onCharacterSelected?: (index: number, character: string | null) => void;
  comparisons: {
    [key: number]: string;
  };

  listRef?: MutableRefObject<List | null>;
  onListScroll?: (props: ListOnScrollProps) => void;
}

interface LineData {
  lines: string[];
  isSelectable: boolean;
  lineLengths: number[];
  onCharacterClicked: (newIndex: number) => void;
  onClearCharacter: (index: number) => void;
  selectedCharacters: number[];
  selectedElementIndex: number | null;
  setSelectedElement: (ref: HTMLSpanElement | null) => void;
}
interface LineProps {
  data: LineData;
  index: number;
  style: React.CSSProperties;
}

export const CharacterSelect = ({
  text,
  isSelectable = false,
  selectedCharacters,
  onCharacterSelected,
  listRef,
  onListScroll,
  comparisons,
}: CharacterSelectProps) => {
  const lines = useMemo(() => text.split("\n"), [text]);
  const lineLengths = useMemo(() => lines.map((l) => l.length + 1), [lines]);
  const wrapperRef = useRef<HTMLPreElement | null>(null);

  const [selectedElementIndex, setSelectedElementIndex] = useState<number | null>(null);
  const [selectedElement, setSelectedElement] = useState<HTMLSpanElement | null>(null);

  const selectedCharacter = useMemo(() => {
    if (selectedElementIndex == null) {
      return "";
    }

    return comparisons[selectedElementIndex] ?? "";
  }, [comparisons, selectedElementIndex]);
  const onCharacterSelectPopupClose = () => {
    setSelectedElement(null);
    setSelectedElementIndex(null);
  };

  const onClearCharacter = useCallback(
    (index: number) => {
      onCharacterSelected?.(index, null);
      onCharacterSelectPopupClose();
    },
    [onCharacterSelected]
  );

  const onCharacterClicked = useCallback(
    (newIndex: number) => {
      if (newIndex !== selectedElementIndex) {
        setSelectedElement(null);
        setSelectedElementIndex(newIndex);
      }
    },
    [selectedElementIndex]
  );

  const onSelect = (character: string | null) => {
    if (selectedElementIndex == null) {
      return;
    }

    onCharacterSelected?.(selectedElementIndex, character);
    onCharacterSelectPopupClose();
  };

  const lineData: LineData = useMemo(
    () => ({
      lines,
      isSelectable,
      lineLengths,
      onCharacterClicked,
      selectedCharacters,
      selectedElementIndex,
      setSelectedElement,
      onClearCharacter,
    }),
    [isSelectable, lineLengths, lines, onCharacterClicked, onClearCharacter, selectedCharacters, selectedElementIndex]
  );

  return (
    <pre className={cn(styles.wrapper, styles.mono)} ref={wrapperRef}>
      <AutoSizer>
        {({ height, width }) => (
          <List<LineData>
            height={height}
            itemCount={lines.length}
            itemSize={21}
            width={width}
            itemData={lineData}
            ref={listRef}
            onScroll={onListScroll}
          >
            {Line}
          </List>
        )}
      </AutoSizer>
      <CharacterSelectPopup
        anchor={selectedElement}
        onClose={onCharacterSelectPopupClose}
        onSelect={onSelect}
        parentRef={wrapperRef}
        selectedCharacter={selectedCharacter}
      />
    </pre>
  );
};

const Line = ({ data, index: lineIndex, style }: LineProps) => {
  const {
    lines,
    isSelectable,
    lineLengths,
    onCharacterClicked,
    onClearCharacter,
    selectedCharacters,
    selectedElementIndex,
    setSelectedElement,
  } = data;
  const line = lines[lineIndex] ?? "";

  return (
    <span style={style}>
      {line.split("").map((character, characterIndex) => {
        const charactersBefore = sum(lineLengths.slice(0, lineIndex));
        const fullTextIndex = charactersBefore + characterIndex;

        const onCharacterClick = (e: React.MouseEvent) => {
          if (e.metaKey) {
            onClearCharacter(fullTextIndex);
          } else {
            onCharacterClicked(fullTextIndex);
          }
        };

        const isSelectedForPopup = selectedElementIndex === fullTextIndex;
        const isSelectedFromOutside = selectedCharacters.includes(fullTextIndex);
        const isSelected = isSelectedForPopup || isSelectedFromOutside;

        return (
          <span
            data-character
            key={`${character}-${characterIndex}`}
            className={cn(styles.character, {
              [styles.isSelectable]: isSelectable,
              [styles.isSelected]: isSelected,
            })}
            onClick={onCharacterClick}
            ref={(ref) => {
              if (isSelectedForPopup) {
                setSelectedElement(ref);
              }
            }}
          >
            {character}
          </span>
        );
      })}
      <br />
    </span>
  );
};

function sum(array: number[]) {
  return array.reduce((acc, curr) => acc + curr, 0);
}
