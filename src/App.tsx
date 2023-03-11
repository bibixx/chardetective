import { Intro } from "./views/Intro/Intro";
import { useAppState } from "./hooks/useAppState/useAppState";
import { Layout } from "./components/Layout/Layout";
import { FoundEncoding } from "./views/FoundEncoding/FoundEncoding";
import { useCallback } from "react";
import { Buffer } from "buffer";

function App() {
  const [state, dispatch] = useAppState();

  const goBackToIntro = useCallback(() => {
    dispatch({ type: "resetAction" });
  }, [dispatch]);

  const onSelect = useCallback(
    async (file: File) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Buffer(arrayBuffer);

      dispatch({ type: "fileSelectedAction", file, buffer });
    },
    [dispatch]
  );

  return (
    <Layout onHeaderClick={goBackToIntro}>
      {state.type === "intro" && <Intro onSelect={onSelect} />}
      {state.type === "foundEncoding" && (
        <FoundEncoding file={state.file} buffer={state.buffer} goBackToIntro={goBackToIntro} />
      )}
    </Layout>
  );
}

export default App;
