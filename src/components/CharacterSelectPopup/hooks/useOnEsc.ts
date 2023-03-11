import { useEffect } from "react";

interface Arguments {
  onEsc: () => void;
  isEnabled: boolean;
}

export const useOnEsc = ({ onEsc, isEnabled }: Arguments) => {
  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onEsc();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isEnabled, onEsc]);
};
