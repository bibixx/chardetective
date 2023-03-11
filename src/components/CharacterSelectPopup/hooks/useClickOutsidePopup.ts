import { MutableRefObject, useCallback, useEffect } from "react";

interface Props {
  onTriggered: (e: Event) => void;
  popupRef: MutableRefObject<HTMLElement | null>;
  parentRef: MutableRefObject<HTMLElement | null>;
}

export function useClickOutsidePopup({ onTriggered, popupRef, parentRef }: Props) {
  const clickOrTouchListener = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (popupRef.current == null) {
        return;
      }

      const target = e.target as HTMLElement;
      const closesCharacter = target.closest("[data-character]");
      if (parentRef.current?.contains(closesCharacter)) {
        return;
      }

      if (popupRef.current.contains(target)) {
        return;
      }

      onTriggered?.(e);
    },
    [onTriggered, parentRef, popupRef]
  );

  useEffect(() => {
    document.addEventListener("click", clickOrTouchListener);
    document.addEventListener("touchstart", clickOrTouchListener);

    return () => {
      document.removeEventListener("click", clickOrTouchListener);
      document.removeEventListener("touchstart", clickOrTouchListener);
    };
  }, [clickOrTouchListener]);
}
