import cn from "classnames";
import { ReactNode, useEffect, useRef, useState } from "react";
import ReactDropzone from "react-dropzone";
import styles from "./DropZone.module.scss";

interface DropZoneProps {
  onSelect: (file: File) => void;
  compact?: boolean;
  label: ReactNode;
}

const MEGABYTE = 1_000_000;

export const DropZone = ({ onSelect, compact = false, label }: DropZoneProps) => {
  const isDragging = useIsDragging();

  const onInternalSelect = async (files: File[]) => {
    if (files.length !== 1) {
      return;
    }

    const [file] = files;
    onSelect(file);
  };

  const validator = (file: File) => {
    const ALLOWED_TYPES = ["text/"];
    const isAllowedFile = file.type === "" || ALLOWED_TYPES.some((type) => file.type.startsWith(type));

    if (isAllowedFile) {
      return null;
    }

    return {
      code: "type-not-supported",
      message: `"${file.type}" not supported`,
    };
  };

  // TODO: Error handling
  return (
    <ReactDropzone
      onDrop={onInternalSelect}
      onError={console.log}
      maxFiles={1}
      maxSize={2 * MEGABYTE}
      validator={validator}
    >
      {({ getRootProps, getInputProps, isDragActive, isDragReject }) => {
        return (
          <>
            <button
              {...getRootProps()}
              className={cn(styles.dropZone, {
                [styles.isDragActive]: isDragActive,
                [styles.isDragReject]: isDragReject,
                [styles.isCompact]: compact,
              })}
            >
              <input {...getInputProps()} />
              <div>{label}</div>
            </button>
            <div {...getRootProps()} className={cn(styles.fullScreen, { [styles.isVisible]: isDragging })}></div>
          </>
        );
      }}
    </ReactDropzone>
  );
};

const useIsDragging = () => {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  useEffect(() => {
    const handleDrag = (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const handleDragIn = (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      dragCounter.current++;

      if (event.dataTransfer && event.dataTransfer.items && event.dataTransfer.items.length > 0) {
        setIsDragging(true);
      }
    };

    const handleDragOut = (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      dragCounter.current--;
      if (dragCounter.current > 0) return;
      setIsDragging(false);
    };

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
    };

    window.addEventListener("dragenter", handleDragIn);
    window.addEventListener("dragleave", handleDragOut);
    window.addEventListener("dragover", handleDrag);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragIn);
      window.removeEventListener("dragleave", handleDragOut);
      window.removeEventListener("dragover", handleDrag);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  return isDragging;
};
