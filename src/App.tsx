import { Intro } from "./views/Intro/Intro";
import { useAppState } from "./hooks/useAppState/useAppState";
import { Layout } from "./components/Layout/Layout";
import { GuessEncoding } from "./views/GuessEncoding/GuessEncoding";
import { useCallback } from "react";
import { CalculatePermutations } from "./views/CalculatePermutations/CalculatePermutations";

function App() {
  const [state, dispatch] = useAppState();

  const goBackToIntro = useCallback(() => {
    dispatch({ type: "resetAction" });
  }, [dispatch]);

  const onFileSelect = useCallback(
    async (file: File) => {
      dispatch({ type: "fileSelectedAction", file });
    },
    [dispatch]
  );

  const onPermutationsLoaded = useCallback(
    (permutations: Record<string, string>) => {
      dispatch({
        type: "permutationsCalculatedAction",
        permutations,
      });
    },
    [dispatch]
  );

  return (
    <Layout onHeaderClick={state.type !== "intro" ? goBackToIntro : undefined}>
      {state.type === "intro" && <Intro onSelect={onFileSelect} />}
      {state.type === "loadingPermutations" && (
        <CalculatePermutations file={state.file} onLoaded={onPermutationsLoaded} />
      )}
      {state.type === "guessEncoding" && (
        <GuessEncoding
          file={state.file}
          decodedPermutations={state.permutations}
          goBackToIntro={goBackToIntro}
          onNewFileSelect={onFileSelect}
        />
      )}
    </Layout>
  );
}

export default App;
