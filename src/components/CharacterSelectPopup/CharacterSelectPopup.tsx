import classNames from "classnames";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { usePopper } from "react-popper";
import { useClickOutsidePopup } from "./hooks/useClickOutsidePopup";
import styles from "./CharacterSelectPopup.module.scss";
import { Save, Trash2 } from "react-feather";

interface CharacterSelectPopupProps {
  anchor: HTMLSpanElement | null;
  onClose: () => void;
  onSelect: (character: string | null) => void;
  parentRef: MutableRefObject<HTMLElement | null>;
}

export const CharacterSelectPopup = ({ anchor, onClose, onSelect, parentRef }: CharacterSelectPopupProps) => {
  const [selectedCharacter, setSelectedCharacter] = useState<string>("");

  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const popperElementRef = useRef(popperElement);
  useEffect(() => {
    popperElementRef.current = popperElement;
  }, [popperElement]);

  const isOpen = useMemo(() => anchor != null, [anchor]);
  useEffect(() => {
    if (!isOpen) {
      setSelectedCharacter("");
    }
  }, [isOpen]);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => inputRef.current?.focus(), 10);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useClickOutsidePopup({
    onTriggered: onClose,
    popupRef: popperElementRef,
    parentRef,
  });

  const {
    styles: popperStyles,
    attributes,
    state,
  } = usePopper(anchor, popperElement, {
    placement: "top-start",
    strategy: "fixed",
    modifiers: [],
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCharacter === "") {
      onSelect(null);
      return;
    }

    onSelect(selectedCharacter);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCharacter(e.target.value.slice(0, 1));
  };

  return (
    <>
      <div
        ref={setPopperElement}
        className={classNames(styles.popup, {
          [styles.isOpen]: isOpen,
          [styles.placementTopStart]: state?.placement === "top-start",
          [styles.placementTopEnd]: state?.placement === "top-end",
        })}
        style={popperStyles.popper}
        {...attributes.popper}
      >
        <form onSubmit={onSubmit} className={styles.form}>
          <label htmlFor="character" className={styles.label}>
            Correct Character
          </label>
          <div className={styles.inputRow}>
            <input
              id="character"
              className={styles.input}
              ref={inputRef}
              type="text"
              maxLength={1}
              value={selectedCharacter ?? ""}
              onChange={onChange}
            />
            <button className={styles.button} type="submit">
              <Save width={16} />
            </button>
            <button className={styles.button} onClick={() => onSelect(null)}>
              <Trash2 width={16} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
