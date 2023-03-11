import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import styles from "./CharacterSelect.module.scss";
import { useCallback, useMemo, useState } from "react";
import cn from "classnames";

interface CharacterSelectProps {
  text: string;
  isSelectable?: boolean;
  selectedCharacters: number[];
  onCharacterSelected?: (index: number, character: string) => void;
}

interface LineProps {
  data: string[];
  index: number;
  style: React.CSSProperties;
}

export const CharacterSelect = ({
  text,
  isSelectable = false,
  selectedCharacters,
  onCharacterSelected,
}: CharacterSelectProps) => {
  const lines = useMemo(() => text.split("\n"), [text]);
  const lineLengths = useMemo(() => lines.map((l) => l.length + 1), [lines]);
  const lineHeight = useMemo(() => getCharacterHeight(), []);

  const [selectedElement, setSelectedElement] = useState<HTMLSpanElement | null>(null);
  const onCharacterClicked = useCallback(
    (element: HTMLSpanElement, index: number) => {
      if (onCharacterSelected == null) {
        return;
      }

      const expected = prompt("Expected?");
      if (expected == null) {
        return;
      }

      onCharacterSelected(index, expected.charAt(0));
    },
    [onCharacterSelected]
  );

  const Line = useCallback(
    ({ data, index: lineIndex, style }: LineProps) => {
      const line = data[lineIndex];
      return (
        <span style={style}>
          {line.split("").map((character, characterIndex) => {
            const charactersBefore = sum(lineLengths.slice(0, lineIndex));
            const fullTextIndex = charactersBefore + characterIndex;

            const onCharacterClick = (e: React.MouseEvent) => {
              onCharacterClicked(e.currentTarget as HTMLSpanElement, fullTextIndex);
            };

            return (
              <span
                key={`${character}-${characterIndex}`}
                className={cn(styles.character, {
                  [styles.isSelectable]: isSelectable,
                  [styles.isSelected]: selectedCharacters.includes(fullTextIndex),
                })}
                onClick={onCharacterClick}
              >
                {character}
              </span>
            );
          })}
          <br />
        </span>
      );
    },
    [isSelectable, lineLengths, onCharacterClicked, selectedCharacters]
  );

  return (
    <pre className={cn(styles.wrapper, styles.mono)}>
      <AutoSizer>
        {({ height, width }) => (
          <List height={height} itemCount={lines.length} itemSize={lineHeight} width={width} itemData={lines}>
            {Line}
          </List>
        )}
      </AutoSizer>
    </pre>
  );
};

const getCharacterHeight = () => {
  const $wrapper = document.createElement("div");
  $wrapper.classList.add(styles.mono);
  $wrapper.textContent = "a";
  document.body.appendChild($wrapper);

  const height = $wrapper.clientHeight;
  $wrapper.remove();

  return height;
};

function sum(array: number[]) {
  return array.reduce((acc, curr) => acc + curr, 0);
}
