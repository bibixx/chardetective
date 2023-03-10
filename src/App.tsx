import * as iconv from "iconv-lite";
import encodingsMap from "iconv-lite/encodings";
import { Buffer } from "buffer";
import "./App.css";
import { useEffect, useMemo, useState } from "react";
import Dropzone from "react-dropzone";

function App() {
  const [fileData, setFileData] = useState<{
    file: File;
    buffer: Buffer;
  } | null>(null);
  const [selectedEncoding, setSelectedEncoding] = useState<string | null>(null);

  const onSelect = async (files: File[]) => {
    const [file] = files;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Buffer(arrayBuffer);

    setFileData({ file, buffer });
  };

  const matchingEncodings = useMemo(() => {
    if (fileData == null) {
      return null;
    }

    const comparisons = {
      155: "ż",
      158: "ó",
      223: "ł",
      283: "Ó",
      293: "Ą",
    };

    return findMatchingEncodings(fileData.buffer, comparisons);
  }, [fileData]);

  useEffect(() => {
    if (matchingEncodings == null) {
      setSelectedEncoding(null);
      return;
    }

    setSelectedEncoding(matchingEncodings[0]);
  }, [matchingEncodings]);

  const rawFileContents = useMemo(() => {
    if (fileData == null || selectedEncoding == null) {
      return null;
    }

    return iconv.decode(fileData.buffer, "utf8");
  }, [fileData, selectedEncoding]);

  const decodedFileContents = useMemo(() => {
    if (fileData == null || selectedEncoding == null) {
      return null;
    }

    return iconv.decode(fileData.buffer, selectedEncoding);
  }, [fileData, selectedEncoding]);

  const onDownload = () => {
    if (decodedFileContents == null || fileData == null) {
      return;
    }

    const blob = new Blob([decodedFileContents], { type: fileData.file.type });
    const elem = window.document.createElement("a");
    elem.href = window.URL.createObjectURL(blob);
    elem.download = fileData.file.name;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  };

  return (
    <div className="App">
      <Dropzone onDrop={onSelect} maxFiles={1}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
          </section>
        )}
      </Dropzone>

      {matchingEncodings && (
        <select
          name="selectedEncoding"
          id="selectedEncoding"
          value={selectedEncoding ?? ""}
          onChange={(e) => {
            setSelectedEncoding(e.target.value);
          }}
        >
          {matchingEncodings.map((encoding) => (
            <option key={encoding} value={encoding}>
              {encoding}
            </option>
          ))}
        </select>
      )}
      {decodedFileContents != null &&
        getNullableLength(matchingEncodings) > 0 && (
          <>
            <button onClick={onDownload}>Download</button>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <pre>{rawFileContents}</pre>
              <pre>{decodedFileContents}</pre>
            </div>
          </>
        )}
    </div>
  );
}

export default App;

const getEncodingsList = () => {
  return Object.entries(encodingsMap).reduce(
    (acc, [encoding, encodingValue]) => {
      if (typeof encodingValue !== "string" && !encoding.startsWith("_")) {
        acc.push(encoding);
      }

      return acc;
    },
    [] as string[]
  );
};

const ALL_ENCODINGS = getEncodingsList();
const numberEntries = (obj: Record<number, string>) =>
  Object.entries(obj) as unknown as [number, string][];

const findMatchingEncodings = (
  buffer: Buffer,
  comparisons: Record<number, string>
) => {
  const comparisonsEntries = numberEntries(comparisons);
  let foundEncodings = [];

  for (const encoding of ALL_ENCODINGS) {
    const decodedString = iconv.decode(buffer, encoding);
    const doAllMatch = comparisonsEntries.every(
      ([index, char]) => decodedString[index] === char
    );

    if (doAllMatch) {
      foundEncodings.push(encoding);
    }
  }

  return foundEncodings;
};

const getNullableLength = (arr: Array<any> | null | undefined) =>
  arr?.length ?? 0;
